const cloudinary = require('cloudinary').v2;
const QRCode = require('qrcode');
const PDFDocument = require('pdfkit');
const DelegatePass = require('../models/DelegatePass');
const User = require('../models/User');

// Configure Cloudinary using process environment config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '',
  api_key: process.env.CLOUDINARY_API_KEY || '',
  api_secret: process.env.CLOUDINARY_API_SECRET || '',
});

// @desc    Apply for or Update a Delegate Pass (Multipart/form-data upload)
// @route   POST /api/delegate-pass/apply
// @access  Private
const applyPass = async (req, res, next) => {
  try {
    const { utr } = req.body;
    const userId = req.user._id;

    if (!utr) {
      return res.status(400).json({ success: false, message: 'UTR number is required' });
    }

    // 1. Check if user already has verified pass
    const dbUser = await User.findById(userId);
    if (dbUser && dbUser.delegatePassStatus === 'VERIFIED') {
      return res.status(400).json({ success: false, message: 'You already have a verified Delegate Pass.' });
    }

    // 2. Fetch upload file from request
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Payment receipt screenshot file is required' });
    }

    // 3. Upload screenshot to Cloudinary
    let screenshotUrl = '';
    const isCloudinaryConfigured = process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET;

    if (isCloudinaryConfigured) {
      try {
        // Upload direct from buffer using base64 stream wrapper
        const base64File = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
        const uploadResponse = await cloudinary.uploader.upload(base64File, {
          folder: 'helix_delegate_passes',
        });
        screenshotUrl = uploadResponse.secure_url;
      } catch (uploadError) {
        console.error('Cloudinary upload error:', uploadError.message);
        return res.status(500).json({ success: false, message: 'Failed to upload payment screenshot to Cloudinary' });
      }
    } else {
      console.warn('Cloudinary is not configured. Steering ahead in mock upload mode.');
      screenshotUrl = 'https://images.unsplash.com/photo-1579621970795-87facc2f976d?auto=format&fit=crop&w=800&q=80';
    }

    // 4. Create or update Delegate Pass
    let pass = await DelegatePass.findOne({ user: userId });
    if (!pass) {
      pass = new DelegatePass({ user: userId });
    }

    // Update fields and reset approval states
    pass.utr = utr.trim();
    pass.paymentScreenshot = screenshotUrl;
    pass.paymentStatus = 'PENDING';
    pass.adminRemark = undefined; // Clear previous rejection comments
    pass.verifiedBy = undefined;
    pass.verifiedAt = undefined;
    pass.registrationId = undefined; // Clear previous ID if any
    pass.qrToken = undefined;
    
    await pass.save();

    // 5. Update User status
    await User.findByIdAndUpdate(userId, {
      delegatePassStatus: 'PENDING',
    });

    res.status(201).json({
      success: true,
      message: 'Delegate Pass application submitted successfully. Verification is pending.',
      data: {
        _id: pass._id,
        utr: pass.utr,
        paymentStatus: pass.paymentStatus,
        paymentScreenshot: pass.paymentScreenshot,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current student's Delegate Pass details (securing qrToken)
// @route   GET /api/delegate-pass/status
// @access  Private
const getPassStatus = async (req, res, next) => {
  try {
    // Strictly exclude qrToken from the response
    const pass = await DelegatePass.findOne({ user: req.user._id }).select('-qrToken');
    res.json({
      success: true,
      data: pass,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Download Delegate Pass PDF (generating pass PDF + in-memory QR code)
// @route   GET /api/delegate-pass/download
// @access  Private
const downloadPass = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // 1. Check if user is verified
    const dbUser = await User.findById(userId);
    if (!dbUser || dbUser.delegatePassStatus !== 'VERIFIED') {
      return res.status(400).json({ success: false, message: 'Your Delegate Pass is not verified yet.' });
    }

    // 2. Fetch pass details including qrToken
    const pass = await DelegatePass.findOne({ user: userId }).populate('user', 'name college email');
    if (!pass || pass.paymentStatus !== 'VERIFIED') {
      return res.status(404).json({ success: false, message: 'Verified Delegate Pass records not found.' });
    }

    // 3. Generate QR code buffer in-memory
    let qrBuffer;
    try {
      // The QR should encode ONLY the secure qrToken
      qrBuffer = await QRCode.toBuffer(pass.qrToken, {
        width: 140,
        margin: 1,
        color: {
          dark: '#1e293b', // Dark slate
          white: '#ffffff',
        },
      });
    } catch (qrErr) {
      console.error('Failed to generate QR buffer:', qrErr.message);
      return res.status(500).json({ success: false, message: 'QR Code generation failed' });
    }

    // 4. Create and design styled PDF
    const doc = new PDFDocument({ size: 'A4', margin: 40 });

    // Set headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=DelegatePass-${pass.registrationId}.pdf`);

    doc.pipe(res);

    // Styling Tokens
    const navyColor = '#0f172a';
    const goldColor = '#c5a880';
    const lightBg = '#f8fafc';
    const borderDark = '#cbd5e1';

    // Outer framing border
    doc.rect(20, 20, 555, 802).lineWidth(2).stroke(goldColor);
    doc.rect(25, 25, 545, 792).lineWidth(0.5).stroke(borderDark);

    // Decorative Header Banner
    doc.rect(30, 30, 535, 110).fill(navyColor);

    // Stylized Logo Icon (vector shield)
    doc.circle(85, 85, 25).fill(goldColor);
    doc.circle(85, 85, 22).fill(navyColor);
    doc.fillColor(goldColor)
       .font('Helvetica-Bold')
       .fontSize(22)
       .text('H', 77, 77, { width: 20, align: 'center' });

    // Header Titles
    doc.fillColor(goldColor)
       .font('Helvetica-Bold')
       .fontSize(28)
       .text('HELIX 2026', 130, 50, { characterSpacing: 2 });

    doc.fillColor('#e2e8f0')
       .font('Helvetica')
       .fontSize(10)
       .text('AIIMS DEOGHAR ANNUAL FESTIVAL', 130, 85, { characterSpacing: 1.5 });

    doc.fillColor('#94a3b8')
       .font('Helvetica-Oblique')
       .fontSize(9)
       .text('Navigate the Oceans of Knowledge and Culture', 130, 105);

    // Pass Label Banner
    doc.rect(30, 160, 535, 35).fill(goldColor);
    doc.fillColor(navyColor)
       .font('Helvetica-Bold')
       .fontSize(14)
       .text('OFFICIAL DELEGATE PASS', 30, 171, { align: 'center', characterSpacing: 1 });

    // Inner details section bg card
    doc.rect(30, 215, 350, 220).fill(lightBg);
    doc.rect(30, 215, 350, 220).lineWidth(1).stroke(borderDark);

    // Populate Pass Details
    doc.fillColor(navyColor);

    doc.font('Helvetica-Bold').fontSize(10).text('PARTICIPANT NAME', 50, 240);
    doc.font('Helvetica').fontSize(14).text(pass.user?.name || 'N/A', 50, 255);

    doc.font('Helvetica-Bold').fontSize(10).text('ACADEMY / COLLEGE', 50, 290);
    doc.font('Helvetica').fontSize(12).text(pass.user?.college || 'N/A', 50, 305, { width: 310 });

    doc.font('Helvetica-Bold').fontSize(10).text('REGISTRATION ID', 50, 350);
    doc.font('Helvetica-Bold').fontSize(16).fillColor('#1e3a8a').text(pass.registrationId, 50, 365);

    doc.fillColor(navyColor);
    doc.font('Helvetica-Bold').fontSize(10).text('STATUS', 240, 350);
    doc.font('Helvetica-Bold').fontSize(14).fillColor('#15803d').text('VERIFIED', 240, 365);

    // Embed dynamic QR Code image on the right card
    doc.rect(400, 215, 165, 220).fill(lightBg);
    doc.rect(400, 215, 165, 220).lineWidth(1).stroke(borderDark);
    
    // Position QR buffer
    doc.image(qrBuffer, 412, 235, { width: 140, height: 140 });
    doc.fillColor(navyColor)
       .font('Helvetica-Bold')
       .fontSize(8)
       .text('SCAN FOR VERIFICATION', 400, 395, { align: 'center', characterSpacing: 0.5 });

    // Issue Details Row
    doc.fillColor(navyColor);
    doc.rect(30, 455, 535, 35).fill(lightBg);
    doc.rect(30, 455, 535, 35).lineWidth(0.5).stroke(borderDark);
    doc.font('Helvetica-Bold').fontSize(9).text('ISSUE DATE:', 50, 468);
    doc.font('Helvetica').fontSize(9).text(formatDate(pass.verifiedAt || pass.createdAt), 125, 468);
    doc.font('Helvetica-Bold').fontSize(9).text('PASS CATEGORY:', 330, 468);
    doc.font('Helvetica').fontSize(9).text('All-Event Entry & Fest Access', 430, 468);

    // Important Instructions Section
    doc.font('Helvetica-Bold').fontSize(12).text('Important Instructions', 30, 520);
    doc.rect(30, 535, 535, 185).fill('#fafafa');
    doc.rect(30, 535, 535, 185).lineWidth(0.5).stroke(borderDark);

    const instructions = [
      '1. This Delegate Pass is mandatory for entry to AIIMS Deoghar Campus and all HELIX 2026 events.',
      '2. Present either this printed PDF pass or the digital copy at the main gate for security check-in.',
      '3. The QR Code is unique and secure. Do not share or duplicate this pass to avoid check-in denial.',
      '4. Delegate Pass holders can register for all listed fest events free of charge on their user dashboard.',
      '5. Please carry a valid college/government ID card alongside this pass for physical identity checks.',
      '6. Security captains reserve the right to verify credentials and refuse admission for mismatched records.'
    ];

    let yOffset = 555;
    doc.fillColor('#334155').font('Helvetica').fontSize(9);
    instructions.forEach(ins => {
      doc.text(ins, 45, yOffset, { width: 505, lineGap: 3 });
      yOffset += 24;
    });

    // Contact Details & Footer
    doc.fillColor(navyColor)
       .font('Helvetica-Bold')
       .fontSize(10)
       .text('Contact & Support', 30, 745);

    doc.fillColor('#64748b')
       .font('Helvetica')
       .fontSize(8.5)
       .text('Email: helix2026@aiimsdeoghar.edu.in   |   Phone: +91 98765 43210 / +91 88888 77777', 30, 760);

    doc.rect(30, 785, 535, 25).fill(navyColor);
    doc.fillColor('#94a3b8')
       .font('Helvetica-Bold')
       .fontSize(8)
       .text('HELIX 2026 • ANNUAL FESTIVAL OF AIIMS DEOGHAR • ALL RIGHTS RESERVED', 30, 794, { align: 'center', characterSpacing: 1 });

    doc.end();
  } catch (error) {
    next(error);
  }
};

// Helper date formatter
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

module.exports = {
  applyPass,
  getPassStatus,
  downloadPass,
};
