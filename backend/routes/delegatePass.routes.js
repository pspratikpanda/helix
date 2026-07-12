const express = require('express');
const router = express.Router();
const multer = require('multer');
const { applyPass, getPassStatus, downloadPass } = require('../controllers/delegatePass.controller');
const { protect } = require('../middleware/auth.middleware');

// Configure Multer to parse multipart/form-data images in memory
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
});

router.post('/apply', protect, upload.single('paymentScreenshot'), applyPass);
router.get('/status', protect, getPassStatus);
router.get('/download', protect, downloadPass);

module.exports = router;
