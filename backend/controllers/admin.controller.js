const crypto = require('crypto');
const Notification = require('../models/Notification');
const EventRegistration = require('../models/EventRegistration');
const DelegatePass = require('../models/DelegatePass');
const User = require('../models/User');
const Counter = require('../models/Counter');
const regController = require('./registration.controller');

// @desc    Create and emit notification
// @route   POST /api/admin/notify
// @access  Private (Admin Only)
const createAndEmitNotification = async (req, res, next) => {
  try {
    const { title, message, targetAudience, targetUsers, eventRef } = req.body;

    if (!title || !message || !targetAudience) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, message, and targetAudience',
      });
    }

    // Save notification document to DB
    const notification = await Notification.create({
      title,
      message,
      targetAudience,
      targetUsers: targetAudience === 'specific' ? targetUsers : [],
      eventRef: eventRef || undefined,
    });

    // Populate event details if referenced
    if (eventRef) {
      await notification.populate('eventRef');
    }

    // Retrieve Socket.io instance from Express App context
    const io = req.app.get('io');
    
    if (io) {
      if (targetAudience === 'all') {
        // Broadcast to all connected clients
        io.to('all-users').emit('new-notification', notification);
      } else if (targetAudience === 'specific' && targetUsers && targetUsers.length > 0) {
        // Emit to each targeted user's personal room
        targetUsers.forEach((userId) => {
          io.to(userId.toString()).emit('new-notification', notification);
        });
      } else if (targetAudience === 'registered') {
        // Find users who have at least one registration in the system
        const registeredUserIds = await EventRegistration.distinct('user');
        registeredUserIds.forEach((userId) => {
          io.to(userId.toString()).emit('new-notification', notification);
        });
      }
    } else {
      console.warn('Socket.io instance is not available on request context');
    }

    res.status(201).json({
      success: true,
      data: notification,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all delegate passes for verification (Admin Only - securing qrToken)
// @route   GET /api/admin/delegate-passes
// @access  Private (Admin Only)
const getDelegatePasses = async (req, res, next) => {
  try {
    const passes = await DelegatePass.find({})
      .select('-qrToken') // Omit qrToken from response
      .populate('user', 'name email phone college')
      .populate('verifiedBy', 'name')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: passes,
    });
  } catch (dbError) {
    console.warn('DB offline: returning mock delegate passes list.');
    const mockUsers = {
      'fallback-jack-id': { name: 'Captain Jack Sparrow', email: 'jack@blackpearl.com', phone: '9876543211', college: 'Tortuga Academy' },
      'fallback-nemo-id': { name: 'Nemo', email: 'nemo@coralreef.com', phone: '9876543212', college: 'Great Barrier Reef' },
    };

    const passes = regController.fallbackPasses.map((pass) => {
      const passCopy = { ...pass };
      delete passCopy.qrToken; // Strip qrToken securely
      return {
        ...passCopy,
        user: mockUsers[pass.user] || { name: 'Mock Student', email: 'student@helix.com', phone: '9999988888', college: 'Mock College' },
        verifiedBy: pass.verifiedBy ? { name: 'Admiral Admin' } : null,
      };
    });

    res.json({
      success: true,
      data: passes,
    });
  }
};

// @desc    Verify (Approve/Reject) a Delegate Pass
// @route   POST /api/admin/delegate-passes/:id/verify
// @access  Private (Admin Only)
const verifyDelegatePass = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, adminRemark } = req.body; // status: 'VERIFIED' | 'REJECTED'

    if (!status || !['VERIFIED', 'REJECTED'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status. Must be VERIFIED or REJECTED' });
    }

    try {
      const pass = await DelegatePass.findById(id);
      if (!pass) {
        return res.status(404).json({ success: false, message: 'Delegate Pass not found' });
      }

      if (status === 'VERIFIED') {
        const counter = await Counter.findOneAndUpdate(
          { id: 'delegatePassSeq' },
          { $inc: { seq: 1 } },
          { new: true, upsert: true }
        );
        const seqStr = String(counter.seq).padStart(4, '0');
        const registrationId = `FEST26-${seqStr}`;
        const qrToken = crypto.randomBytes(16).toString('hex');

        pass.paymentStatus = 'VERIFIED';
        pass.registrationId = registrationId;
        pass.qrToken = qrToken;
        pass.verifiedBy = req.user._id;
        pass.verifiedAt = new Date();
        pass.adminRemark = adminRemark || undefined;
        await pass.save();

        await User.findByIdAndUpdate(pass.user, {
          delegatePassStatus: 'VERIFIED',
        });
      } else {
        // Rejected
        pass.paymentStatus = 'REJECTED';
        pass.adminRemark = adminRemark || 'Payment screenshot or details verification failed';
        pass.verifiedBy = req.user._id;
        pass.verifiedAt = new Date();
        pass.registrationId = undefined;
        pass.qrToken = undefined;
        await pass.save();

        await User.findByIdAndUpdate(pass.user, {
          delegatePassStatus: 'REJECTED',
        });
      }

      const passCopy = pass.toObject();
      delete passCopy.qrToken; // secure response

      res.json({
        success: true,
        message: `Delegate Pass successfully ${status.toLowerCase()}ed`,
        data: passCopy,
      });
    } catch (dbError) {
      console.warn('DB offline: verifying in-memory fallback pass.');
      const passIndex = regController.fallbackPasses.findIndex((p) => p._id === id);
      if (passIndex === -1) {
        return res.status(404).json({ success: false, message: 'Delegate Pass not found in-memory' });
      }

      const pass = regController.fallbackPasses[passIndex];
      pass.paymentStatus = status;
      pass.adminRemark = status === 'REJECTED' ? (adminRemark || 'Payment screenshot or details verification failed') : undefined;
      pass.verifiedBy = req.user._id;
      pass.verifiedAt = new Date();

      if (status === 'VERIFIED') {
        const seqNum = regController.fallbackPasses.filter(p => p.paymentStatus === 'VERIFIED').length + 1;
        pass.registrationId = `FEST26-${String(seqNum).padStart(4, '0')}`;
        pass.qrToken = crypto.randomBytes(16).toString('hex');
      } else {
        pass.registrationId = undefined;
        pass.qrToken = undefined;
      }

      const passCopy = { ...pass };
      delete passCopy.qrToken; // secure response

      res.json({
        success: true,
        message: `Delegate Pass successfully ${status.toLowerCase()}ed (In-Memory)`,
        data: passCopy,
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Verify/Check-In participant via QR (qrToken) or Manual registration ID search
// @route   POST /api/admin/check-in
// @access  Private (Admin/Volunteer Only)
const checkInParticipant = async (req, res, next) => {
  try {
    const { qrToken, registrationId } = req.body;

    if (!qrToken && !registrationId) {
      return res.status(400).json({ success: false, message: 'Please scan QR or enter Registration ID' });
    }

    try {
      let query = {};
      if (qrToken) {
        query = { qrToken };
      } else {
        query = { registrationId: registrationId.trim().toUpperCase() };
      }

      const pass = await DelegatePass.findOne(query).populate('user', 'name college email phone');

      if (!pass) {
        return res.status(404).json({ success: false, message: '❌ Invalid Delegate Pass' });
      }

      if (pass.paymentStatus !== 'VERIFIED') {
        return res.status(400).json({ success: false, message: '❌ Delegate Pass Not Verified' });
      }

      if (pass.checkedIn === true) {
        return res.status(400).json({
          success: false,
          message: '❌ Already Checked In',
          checkedInAt: pass.checkedInAt,
        });
      }

      // Update Check-In state
      pass.checkedIn = true;
      pass.checkedInAt = new Date();
      pass.checkedInBy = req.user._id;
      await pass.save();

      res.json({
        success: true,
        message: '✅ Check-In Successful',
        data: {
          name: pass.user?.name || 'N/A',
          college: pass.user?.college || 'N/A',
          registrationId: pass.registrationId,
          checkedInAt: pass.checkedInAt,
        },
      });
    } catch (dbError) {
      console.warn('DB offline: checking in in-memory.');
      // Offline fallback search
      let pass;
      if (qrToken) {
        pass = regController.fallbackPasses.find((p) => p.qrToken === qrToken);
      } else {
        pass = regController.fallbackPasses.find((p) => p.registrationId === registrationId.trim().toUpperCase());
      }

      if (!pass) {
        return res.status(404).json({ success: false, message: '❌ Invalid Delegate Pass' });
      }

      if (pass.paymentStatus !== 'VERIFIED') {
        return res.status(400).json({ success: false, message: '❌ Delegate Pass Not Verified' });
      }

      if (pass.checkedIn === true) {
        return res.status(400).json({
          success: false,
          message: '❌ Already Checked In',
          checkedInAt: pass.checkedInAt,
        });
      }

      const mockUsers = {
        'fallback-jack-id': { name: 'Captain Jack Sparrow', college: 'Tortuga Academy' },
        'fallback-nemo-id': { name: 'Nemo', college: 'Great Barrier Reef' },
      };

      // Perform check-in
      pass.checkedIn = true;
      pass.checkedInAt = new Date();
      pass.checkedInBy = req.user._id;

      res.json({
        success: true,
        message: '✅ Check-In Successful (In-Memory)',
        data: {
          name: mockUsers[pass.user]?.name || 'Mock Student',
          college: mockUsers[pass.user]?.college || 'Mock College',
          registrationId: pass.registrationId,
          checkedInAt: pass.checkedInAt,
        },
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get check-in metrics and participant logs (securing qrToken)
// @route   GET /api/admin/check-in/stats
// @access  Private (Admin Only)
const getCheckInStats = async (req, res, next) => {
  try {
    const { search } = req.query;

    try {
      // 1. Calculate General Metrics
      const totalVerified = await DelegatePass.countDocuments({ paymentStatus: 'VERIFIED' });
      const checkedInCount = await DelegatePass.countDocuments({ paymentStatus: 'VERIFIED', checkedIn: true });
      const notCheckedInCount = await DelegatePass.countDocuments({ paymentStatus: 'VERIFIED', checkedIn: false });

      // 2. Fetch log with search filter
      let query = { paymentStatus: 'VERIFIED' };
      
      if (search && search.trim()) {
        const keyword = search.trim();
        // find matching users
        const matchingUserIds = await User.find({
          $or: [
            { name: { $regex: keyword, $options: 'i' } },
            { college: { $regex: keyword, $options: 'i' } },
          ],
        }).distinct('_id');

        query.$or = [
          { registrationId: { $regex: keyword, $options: 'i' } },
          { user: { $in: matchingUserIds } },
        ];
      }

      const passes = await DelegatePass.find(query)
        .select('-qrToken') // Omit secure qrToken
        .populate('user', 'name college email phone')
        .populate('checkedInBy', 'name')
        .sort({ checkedInAt: -1, createdAt: -1 });

      res.json({
        success: true,
        data: {
          totalVerified,
          checkedInCount,
          notCheckedInCount,
          passes,
        },
      });
    } catch (dbError) {
      console.warn('DB offline: querying check-in stats in-memory.');
      const verifiedPasses = regController.fallbackPasses.filter((p) => p.paymentStatus === 'VERIFIED');
      const totalVerified = verifiedPasses.length;
      const checkedInCount = verifiedPasses.filter((p) => p.checkedIn === true).length;
      const notCheckedInCount = verifiedPasses.filter((p) => !p.checkedIn).length;

      const mockUsers = {
        'fallback-jack-id': { name: 'Captain Jack Sparrow', college: 'Tortuga Academy', email: 'jack@blackpearl.com', phone: '9876543211' },
        'fallback-nemo-id': { name: 'Nemo', college: 'Great Barrier Reef', email: 'nemo@coralreef.com', phone: '9876543212' },
      };

      let filtered = verifiedPasses.map((pass) => {
        const passCopy = { ...pass };
        delete passCopy.qrToken; // Strip qrToken
        return {
          ...passCopy,
          user: mockUsers[pass.user] || { name: 'Mock Student', college: 'Mock College', email: 'student@helix.com', phone: '9999988888' },
          checkedInBy: pass.checkedInBy ? { name: 'Admiral Admin' } : null,
        };
      });

      if (search && search.trim()) {
        const queryStr = search.trim().toLowerCase();
        filtered = filtered.filter(
          (p) =>
            p.registrationId?.toLowerCase().includes(queryStr) ||
            p.user?.name?.toLowerCase().includes(queryStr) ||
            p.user?.college?.toLowerCase().includes(queryStr)
        );
      }

      res.json({
        success: true,
        data: {
          totalVerified,
          checkedInCount,
          notCheckedInCount,
          passes: filtered,
        },
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createAndEmitNotification,
  getDelegatePasses,
  verifyDelegatePass,
  checkInParticipant,
  getCheckInStats,
};
