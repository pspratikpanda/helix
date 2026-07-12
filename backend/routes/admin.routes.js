const express = require('express');
const router = express.Router();
const {
  createAndEmitNotification,
  getDelegatePasses,
  verifyDelegatePass,
  checkInParticipant,
  getCheckInStats
} = require('../controllers/admin.controller');
const { protect } = require('../middleware/auth.middleware');
const { adminOnly } = require('../middleware/admin.middleware');

router.post('/notify', protect, adminOnly, createAndEmitNotification);
router.get('/delegate-passes', protect, adminOnly, getDelegatePasses);
router.post('/delegate-passes/:id/verify', protect, adminOnly, verifyDelegatePass);

// Check-in endpoints
router.post('/check-in', protect, checkInParticipant); // Protected for admins/volunteers
router.get('/check-in/stats', protect, adminOnly, getCheckInStats);

module.exports = router;
