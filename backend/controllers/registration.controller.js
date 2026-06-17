const Registration = require('../models/Registration');
const Event = require('../models/Event');
const User = require('../models/User');

// @desc    Submit new registration manifest
// @route   POST /api/register
// @access  Private (Protected, restricted to 5 attempts/min via limiter)
const createRegistration = async (req, res, next) => {
  try {
    const { name, email, phone, college, city, eventsSelected } = req.body;
    const userId = req.user._id;

    if (!name || !email || !phone || !college || !city || !eventsSelected || eventsSelected.length === 0) {
      return res.status(400).json({ success: false, message: 'Please provide all details and select at least one event' });
    }

    // Validate capacity for each selected event
    for (const eventId of eventsSelected) {
      const event = await Event.findById(eventId);
      if (!event) {
        return res.status(404).json({ success: false, message: `Voyage not found in logs for ID: ${eventId}` });
      }

      // Check maxParticipants limit
      if (event.maxParticipants) {
        // Count how many registrations have selected this event
        // TODO: For high-concurrency environments, implement atomic transactions or lock managers
        // to prevent race conditions where double bookings occur simultaneously.
        const currentRegistrants = await Registration.countDocuments({
          eventsSelected: eventId,
        });

        if (currentRegistrants >= event.maxParticipants) {
          return res.status(400).json({
            success: false,
            message: `Selected voyage "${event.title}" is already fully booked! Capacity is ${event.maxParticipants}.`,
          });
        }
      }
    }

    // Submit registration
    const registration = new Registration({
      user: userId,
      name,
      email,
      phone,
      college,
      city,
      eventsSelected,
    });

    await registration.save();

    // Associate registered events to user model
    await User.findByIdAndUpdate(userId, {
      $addToSet: { registeredEvents: { $each: eventsSelected } },
    });

    res.status(201).json({
      success: true,
      data: registration,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user's registrations
// @route   GET /api/register/my
// @access  Private
const getMyRegistrations = async (req, res, next) => {
  try {
    const registrations = await Registration.find({ user: req.user._id })
      .populate('eventsSelected');
    
    res.json({
      success: true,
      data: registrations,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createRegistration,
  getMyRegistrations,
};
