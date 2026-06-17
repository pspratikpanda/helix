const Notification = require('../models/Notification');
const Registration = require('../models/Registration');

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
        const registeredUserIds = await Registration.distinct('user');
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

module.exports = {
  createAndEmitNotification,
};
