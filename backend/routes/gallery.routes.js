const express = require('express');
const router = express.Router();

// @desc    Fetch gallery logbook images metadata
// @route   GET /api/gallery
// @access  Public
router.get('/', (req, res) => {
  // Returns gallery images representing deep ocean, tridents, and ship expeditions
  const galleryImages = [
    {
      id: 'gal-1',
      title: 'The Trident Ascent',
      description: 'Opening ceremony performance depicting the birth of Poseidon.',
      url: 'https://images.unsplash.com/photo-1513553404607-988bf2703777?auto=format&fit=crop&w=800&q=80',
      category: 'cultural',
    },
    {
      id: 'gal-2',
      title: 'Poseidon Arena',
      description: 'Students competing in the sports arena.',
      url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
      category: 'sports',
    },
    {
      id: 'gal-3',
      title: 'Anchors Aweigh',
      description: 'The marine art exhibition showcase.',
      url: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=800&q=80',
      category: 'arts',
    },
    {
      id: 'gal-4',
      title: 'The Kraken Quiz',
      description: 'Teams battle it out in the high-stakes trivia tournament.',
      url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
      category: 'literary',
    },
    {
      id: 'gal-5',
      title: 'Helm Hackathon',
      description: 'Developers charting technological waters late into the night.',
      url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
      category: 'technical',
    },
    {
      id: 'gal-6',
      title: 'Siren Serenades',
      description: 'Vocalists enchant the audience under ship deck lighting.',
      url: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=800&q=80',
      category: 'cultural',
    },
  ];

  res.json({
    success: true,
    data: galleryImages,
  });
});

module.exports = router;
