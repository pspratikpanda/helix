const express = require('express');
const router = express.Router();
const {
  getEvents,
  getEventBySlug,
  createEvent,
  updateEvent,
  deleteEvent,
} = require('../controllers/event.controller');
const { protect } = require('../middleware/auth.middleware');
const { adminOnly } = require('../middleware/admin.middleware');

router.get('/', getEvents);
router.get('/:slug', getEventBySlug);
router.post('/', protect, adminOnly, createEvent);
router.put('/:id', protect, adminOnly, updateEvent);
router.delete('/:id', protect, adminOnly, deleteEvent);

module.exports = router;
