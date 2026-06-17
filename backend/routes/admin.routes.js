const express = require('express');
const router = express.Router();
const { createAndEmitNotification } = require('../controllers/admin.controller');
const { protect } = require('../middleware/auth.middleware');
const { adminOnly } = require('../middleware/admin.middleware');

router.post('/notify', protect, adminOnly, createAndEmitNotification);

module.exports = router;
