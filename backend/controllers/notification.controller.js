const Notification = require('../models/Notification');
const Registration = require('../models/Registration');

// @desc    Get notifications relevant to the current user
// @route   GET /api/notifications
// @access  Private
const getNotifications = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Check if the user is registered for any event
    const registrationCount = await Registration.countDocuments({ user: userId });
    
    // Build query conditions
    const audienceFilters = ['all'];
    if (registrationCount > 0) {
      audienceFilters.push('registered');
    }

    const query = {
      $or: [
        { targetAudience: { $in: audienceFilters } },
        { targetAudience: 'specific', targetUsers: userId },
      ],
    };

    const notifications = await Notification.find(query)
      .populate('eventRef')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: notifications,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getNotifications,
};
