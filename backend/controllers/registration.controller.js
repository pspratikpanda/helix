const crypto = require('crypto');
const Razorpay = require('razorpay');
const Registration = require('../models/Registration');
const Event = require('../models/Event');
const User = require('../models/User');

// Helper to initialize Razorpay
const getRazorpayInstance = () => {
  const keyId = process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder';
  const keySecret = process.env.RAZORPAY_KEY_SECRET || 'placeholder_secret';
  
  if (keyId === 'rzp_test_placeholder') {
    return null;
  }
  
  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });
};

// @desc    Create a Razorpay order
// @route   POST /api/register/order
// @access  Private
const createOrder = async (req, res, next) => {
  try {
    const { eventsSelected } = req.body;

    if (!eventsSelected || eventsSelected.length === 0) {
      return res.status(400).json({ success: false, message: 'Please select at least one event' });
    }

    let totalAmount = 0;
    
    // Validate capacity and calculate total amount
    for (const eventId of eventsSelected) {
      const event = await Event.findById(eventId);
      if (!event) {
        return res.status(404).json({ success: false, message: `Event not found for ID: ${eventId}` });
      }

      // Check maxParticipants limit
      if (event.maxParticipants) {
        const currentRegistrants = await Registration.countDocuments({
          eventsSelected: eventId,
        });

        if (currentRegistrants >= event.maxParticipants) {
          return res.status(400).json({
            success: false,
            message: `Selected event "${event.title}" is already fully booked! Capacity is ${event.maxParticipants}.`,
          });
        }
      }
      
      totalAmount += event.registrationFee || 0;
    }

    // If total amount is 0, no payment order needs to be created
    if (totalAmount === 0) {
      return res.json({
        success: true,
        amount: 0,
        free: true,
      });
    }

    const razorpayInstance = getRazorpayInstance();

    if (!razorpayInstance) {
      // Simulation/Sandbox mode
      console.log('Razorpay placeholder keys detected. Simulating order creation.');
      const mockOrderId = `order_mock_${Math.random().toString(36).substring(2, 11)}`;
      return res.json({
        success: true,
        orderId: mockOrderId,
        amount: totalAmount * 100, // in paisa
        currency: 'INR',
        mock: true,
      });
    }

    // Real Razorpay order creation
    const options = {
      amount: totalAmount * 100, // amount in paisa
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpayInstance.orders.create(options);
    
    res.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit new registration manifest (verifying payment if paid)
// @route   POST /api/register
// @access  Private (Protected, restricted to 5 attempts/min via limiter)
const createRegistration = async (req, res, next) => {
  try {
    const { name, email, phone, college, city, eventsSelected } = req.body;
    const userId = req.user._id;

    if (!name || !email || !phone || !college || !city || !eventsSelected || eventsSelected.length === 0) {
      return res.status(400).json({ success: false, message: 'Please provide all details and select at least one event' });
    }

    let totalAmount = 0;

    // Validate capacity and calculate total amount
    for (const eventId of eventsSelected) {
      const event = await Event.findById(eventId);
      if (!event) {
        return res.status(404).json({ success: false, message: `Event not found for ID: ${eventId}` });
      }

      // Check maxParticipants limit
      if (event.maxParticipants) {
        const currentRegistrants = await Registration.countDocuments({
          eventsSelected: eventId,
        });

        if (currentRegistrants >= event.maxParticipants) {
          return res.status(400).json({
            success: false,
            message: `Selected event "${event.title}" is already fully booked! Capacity is ${event.maxParticipants}.`,
          });
        }
      }
      totalAmount += event.registrationFee || 0;
    }

    // Verify payment details if the events are not free
    if (totalAmount > 0) {
      const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

      if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
        return res.status(400).json({
          success: false,
          message: 'Payment verification details (payment ID, order ID, and signature) are required for paid events',
        });
      }

      const isMockOrder = razorpay_order_id.startsWith('order_mock_');
      const isPlaceholderKey = (process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder') === 'rzp_test_placeholder';

      if (isMockOrder || isPlaceholderKey) {
        console.log('Simulated payment verification successful.');
      } else {
        // Real signature verification
        const keySecret = process.env.RAZORPAY_KEY_SECRET;
        const generated_signature = crypto
          .createHmac('sha256', keySecret)
          .update(razorpay_order_id + '|' + razorpay_payment_id)
          .digest('hex');

        if (generated_signature !== razorpay_signature) {
          return res.status(400).json({
            success: false,
            message: 'Razorpay payment signature verification failed',
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
      paymentStatus: 'paid', // Verified or free, so we mark it as paid
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
  createOrder,
};

