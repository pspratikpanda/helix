const DelegatePass = require('../models/DelegatePass');
const EventRegistration = require('../models/EventRegistration');
const Event = require('../models/Event');
const User = require('../models/User');

// ==========================================
// In-Memory Database Fallbacks (Offline Mode)
// ==========================================
let fallbackPasses = [
  {
    _id: 'mock-pass-1',
    user: 'fallback-jack-id',
    registrationId: 'FEST26-0001',
    paymentStatus: 'VERIFIED',
    paymentMethod: 'UPI',
    utr: 'seed_utr_1',
    verifiedAt: new Date(),
    createdAt: new Date(),
  }
];

let fallbackEventRegistrations = [
  {
    _id: 'mock-reg-1',
    user: 'fallback-jack-id',
    event: 'mock-evt-1',
    registeredAt: new Date(),
  },
  {
    _id: 'mock-reg-2',
    user: 'fallback-jack-id',
    event: 'mock-evt-2',
    registeredAt: new Date(),
  }
];

// Helper to get fallback event list
const getFallbackEvents = () => {
  try {
    const { fallbackEvents } = require('./event.controller');
    if (fallbackEvents && fallbackEvents.length > 0) {
      return fallbackEvents;
    }
  } catch (e) {
    // ignore
  }
  return [
    { _id: 'mock-evt-1', title: 'Deep Dive Debate', category: 'literary', date: new Date(), venue: 'Neptune Auditorium' },
    { _id: 'mock-evt-2', title: 'The Kraken Quiz', category: 'literary', date: new Date(), venue: 'The Coral Reef Hall' },
    { _id: 'mock-evt-3', title: 'Sirens of Song', category: 'cultural', date: new Date(), venue: 'The Siren Deck' },
    { _id: 'mock-evt-4', title: "Poseidon's Arena", category: 'sports', date: new Date(), venue: 'Sports Complex' },
    { _id: 'mock-evt-5', title: 'Anchors Aweigh Art', category: 'arts', date: new Date(), venue: 'The Art Bay' },
    { _id: 'mock-evt-6', title: 'The Helm Hackathon', category: 'technical', date: new Date(), venue: 'IT Lab' },
    { _id: 'mock-evt-7', title: 'Tide Turners Dance', category: 'cultural', date: new Date(), venue: 'Amphitheatre' },
    { _id: 'mock-evt-8', title: 'Voyage of Verse', category: 'literary', date: new Date(), venue: 'Captain Cabin' }
  ];
};

// @desc    Register for events (Free for Verified Delegate Pass Holders)
// @route   POST /api/register
// @access  Private
const createRegistration = async (req, res, next) => {
  try {
    const { eventsSelected } = req.body;
    const userId = req.user._id;

    if (!eventsSelected || eventsSelected.length === 0) {
      return res.status(400).json({ success: false, message: 'Please select at least one event' });
    }

    // 1. Verify User has verified Delegate Pass
    let isVerified = req.user.delegatePassStatus === 'VERIFIED';
    if (!isVerified) {
      try {
        const dbUser = await User.findById(userId);
        if (dbUser && dbUser.delegatePassStatus === 'VERIFIED') {
          isVerified = true;
        }
      } catch (dbErr) {
        // DB offline fallback pass status check
        const pass = fallbackPasses.find((p) => p.user === userId.toString());
        if (pass && pass.paymentStatus === 'VERIFIED') {
          isVerified = true;
        }
      }
    }

    if (!isVerified) {
      return res.status(400).json({
        success: false,
        message: 'Please purchase and verify your Delegate Pass first.',
      });
    }

    // 2. Validate eventsSelected for capacity & duplicates
    const registeredEventIds = [];
    const duplicatedEvents = [];
    const fullyBookedEvents = [];

    for (const eventId of eventsSelected) {
      let isDuplicate = false;
      let isFullyBooked = false;
      let eventTitle = eventId;

      try {
        const event = await Event.findById(eventId);
        if (event) {
          eventTitle = event.title;
          // Duplicate check
          const alreadyReg = await EventRegistration.findOne({ user: userId, event: eventId });
          if (alreadyReg) {
            isDuplicate = true;
          }

          // Capacity check
          if (event.maxParticipants) {
            const currentRegistrants = await EventRegistration.countDocuments({ event: eventId });
            if (currentRegistrants >= event.maxParticipants) {
              isFullyBooked = true;
            }
          }
        }
      } catch (dbErr) {
        // DB offline fallback validation
        const fallbackEventsList = getFallbackEvents();
        const event = fallbackEventsList.find((e) => e._id === eventId);
        if (event) {
          eventTitle = event.title;
          const alreadyReg = fallbackEventRegistrations.some(
            (r) => r.user === userId.toString() && r.event === eventId
          );
          if (alreadyReg) {
            isDuplicate = true;
          }

          if (event.maxParticipants) {
            const currentCount = fallbackEventRegistrations.filter((r) => r.event === eventId).length;
            if (currentCount >= event.maxParticipants) {
              isFullyBooked = true;
            }
          }
        }
      }

      if (isDuplicate) {
        duplicatedEvents.push(eventTitle);
      } else if (isFullyBooked) {
        fullyBookedEvents.push(eventTitle);
      } else {
        registeredEventIds.push(eventId);
      }
    }

    if (duplicatedEvents.length > 0) {
      return res.status(400).json({
        success: false,
        message: `You are already registered for: ${duplicatedEvents.join(', ')}`,
      });
    }

    if (fullyBookedEvents.length > 0) {
      return res.status(400).json({
        success: false,
        message: `The following events are fully booked: ${fullyBookedEvents.join(', ')}`,
      });
    }

    // 3. Register for events
    for (const eventId of registeredEventIds) {
      try {
        await EventRegistration.create({
          user: userId,
          event: eventId,
        });
      } catch (dbErr) {
        // DB offline fallback save
        fallbackEventRegistrations.push({
          _id: `mock-reg-${Date.now()}-${Math.random()}`,
          user: userId.toString(),
          event: eventId,
          registeredAt: new Date(),
        });
      }
    }

    // Associate registered events to user model
    try {
      await User.findByIdAndUpdate(userId, {
        $addToSet: { registeredEvents: { $each: registeredEventIds } },
      });
    } catch (dbErr) {
      // ignore
    }

    // Fetch details of final registered events to return
    let populatedEvents = [];
    try {
      populatedEvents = await Event.find({ _id: { $in: eventsSelected } });
    } catch (dbErr) {
      const fallbackEventsList = getFallbackEvents();
      populatedEvents = fallbackEventsList.filter((e) => eventsSelected.includes(e._id));
    }

    res.status(201).json({
      success: true,
      message: 'Successfully registered for events!',
      data: populatedEvents,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current student's registered events list
// @route   GET /api/register/my
// @access  Private
const getMyRegistrations = async (req, res, next) => {
  try {
    const eventRegs = await EventRegistration.find({ user: req.user._id }).populate('event');
    const populatedEvents = eventRegs.map((reg) => reg.event).filter(Boolean);

    res.json({
      success: true,
      data: populatedEvents,
    });
  } catch (dbError) {
    console.warn('Serving mock registered events because database is offline');
    const myRegs = fallbackEventRegistrations.filter((r) => r.user === req.user._id.toString());
    const fallbackEventsList = getFallbackEvents();
    const populatedEvents = myRegs
      .map((r) => fallbackEventsList.find((e) => e._id === r.event))
      .filter(Boolean);

    res.json({
      success: true,
      data: populatedEvents,
    });
  }
};

// Placeholder createOrder for backwards compatibility in code symbols if checked elsewhere
const createOrder = async (req, res) => {
  res.status(410).json({ success: false, message: 'Razorpay order API is deprecated. Payments are verified manually.' });
};

module.exports = {
  createRegistration,
  getMyRegistrations,
  createOrder,
  fallbackPasses,
  fallbackEventRegistrations,
};
