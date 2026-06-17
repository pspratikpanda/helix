const express = require('express');
const router = express.Router();
const Sponsor = require('../models/Sponsor');

// @desc    Fetch all sponsors grouped by tier
// @route   GET /api/sponsors
// @access  Public
const fallbackSponsors = {
  title: [
    {
      _id: 'mock-sp-1',
      name: 'DeepSea Oceanographics',
      logoUrl: 'https://images.unsplash.com/photo-1551244072-5d12893278ab?auto=format&fit=crop&w=300&q=80',
      tier: 'title',
      website: 'https://deepseaoceanographics.example.com',
    }
  ],
  gold: [
    {
      _id: 'mock-sp-2',
      name: 'Neptune Energy Drink',
      logoUrl: 'https://images.unsplash.com/photo-1542241647-9cbb2225278b?auto=format&fit=crop&w=300&q=80',
      tier: 'gold',
      website: 'https://neptunebeverages.example.com',
    },
    {
      _id: 'mock-sp-3',
      name: 'Coral Health Insurance',
      logoUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=300&q=80',
      tier: 'gold',
      website: 'https://coralhealth.example.com',
    }
  ],
  silver: [
    {
      _id: 'mock-sp-4',
      name: 'Sailing Logistics Co.',
      logoUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=300&q=80',
      tier: 'silver',
      website: 'https://sailinglogisticsco.example.com',
    }
  ],
  bronze: [
    {
      _id: 'mock-sp-5',
      name: 'Anchor Craft Brewery',
      logoUrl: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?auto=format&fit=crop&w=300&q=80',
      tier: 'bronze',
      website: 'https://anchorcraftbrewery.example.com',
    }
  ]
};

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

    const hasData = groupedSponsors.title.length > 0 || groupedSponsors.gold.length > 0;
    
    res.json({
      success: true,
      data: hasData ? groupedSponsors : fallbackSponsors,
    });
  } catch (error) {
    console.warn('Serving fallback sponsors because database is offline');
    res.json({
      success: true,
      data: fallbackSponsors,
    });
  }
});

module.exports = router;
