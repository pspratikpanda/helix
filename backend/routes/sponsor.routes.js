const express = require('express');
const router = express.Router();
const Sponsor = require('../models/Sponsor');

// @desc    Fetch all sponsors grouped by tier
// @route   GET /api/sponsors
// @access  Public
router.get('/', async (req, res, next) => {
  try {
    const sponsors = await Sponsor.find({});
    
    // Group sponsors by their designated nautical tier
    const groupedSponsors = {
      title: sponsors.filter((s) => s.tier === 'title'),
      gold: sponsors.filter((s) => s.tier === 'gold'),
      silver: sponsors.filter((s) => s.tier === 'silver'),
      bronze: sponsors.filter((s) => s.tier === 'bronze'),
    };

    res.json({
      success: true,
      data: groupedSponsors,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
