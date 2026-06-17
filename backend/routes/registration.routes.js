const express = require('express');
const router = express.Router();
const {
  createRegistration,
  getMyRegistrations,
  createOrder,
} = require('../controllers/registration.controller');
const { protect } = require('../middleware/auth.middleware');
const { registrationLimiter } = require('../middleware/rateLimiter');

router.post('/', protect, registrationLimiter, createRegistration);
router.post('/order', protect, registrationLimiter, createOrder);
router.get('/my', protect, getMyRegistrations);

module.exports = router;

