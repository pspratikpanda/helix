const Event = require('../models/Event');

const slugify = (text) => {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
};

let fallbackEvents = [
  {
    _id: 'mock-evt-1',
    title: 'Deep Dive Debate',
    slug: 'deep-dive-debate',
    category: 'literary',
    description: 'Argue the depths of ancient maritime law and future exploration in this parliamentary debate event.',
    date: new Date('2026-09-12T10:00:00.000Z'),
    venue: 'Neptune Auditorium',
    registrationFee: 150,
    maxParticipants: 50,
    coordinators: [{ name: 'Dr. Coral Shore', phone: '9999988888' }],
  },
  {
    _id: 'mock-evt-2',
    title: 'The Kraken Quiz',
    slug: 'the-kraken-quiz',
    category: 'literary',
    description: 'Encounter general trivia and oceanology questions that will test even the most experienced navigators.',
    date: new Date('2026-09-13T14:00:00.000Z'),
    venue: 'The Coral Reef Hall',
    registrationFee: 100,
    maxParticipants: 100,
    coordinators: [{ name: 'Prof. Marine Trench', phone: '9999988887' }],
  },
  {
    _id: 'mock-evt-3',
    title: 'Sirens of Song',
    slug: 'sirens-of-song',
    category: 'cultural',
    description: 'Enchant the judges and audience with your melodies in our solo and group singing competition.',
    date: new Date('2026-09-14T18:00:00.000Z'),
    venue: 'The Siren Deck (Open Stage)',
    registrationFee: 200,
    maxParticipants: 30,
    coordinators: [{ name: 'Siren Melody', phone: '9999988886' }],
  },
  {
    _id: 'mock-evt-4',
    title: "Poseidon's Arena",
    slug: 'poseidons-arena',
    category: 'sports',
    description: 'Unleash your strength in athletics, swimming, and outdoor sports tournament.',
    date: new Date('2026-09-12T08:00:00.000Z'),
    venue: 'AIIMS Deoghar Sports Complex',
    registrationFee: 300,
    maxParticipants: 80,
    coordinators: [{ name: 'Coach Anchor', phone: '9999988885' }],
  },
  {
    _id: 'mock-evt-5',
    title: 'Anchors Aweigh Art',
    slug: 'anchors-aweigh-art',
    category: 'arts',
    description: 'Paint, sketch, or craft beautiful masterpieces highlighting ancient mythology combined with biological structures.',
    date: new Date('2026-09-15T10:00:00.000Z'),
    venue: 'The Art Bay',
    registrationFee: 50,
    maxParticipants: 40,
    coordinators: [{ name: 'Hazel Driftwood', phone: '9999988884' }],
  },
  {
    _id: 'mock-evt-6',
    title: 'The Helm Hackathon',
    slug: 'the-helm-hackathon',
    category: 'technical',
    description: 'Navigate uncharted digital waters in our 36-hour hackathon. Build tools to improve ocean health or medical navigation.',
    date: new Date('2026-09-15T09:00:00.000Z'),
    venue: 'Vasco da Gama IT lab',
    registrationFee: 0,
    maxParticipants: 60,
    coordinators: [{ name: 'Alan Compass', phone: '9999988883' }],
  },
  {
    _id: 'mock-evt-7',
    title: 'Tide Turners Dance',
    slug: 'tide-turners-dance',
    category: 'cultural',
    description: 'Make waves on the dance floor in this street and classical dance battle.',
    date: new Date('2026-09-13T19:00:00.000Z'),
    venue: 'The Amphitheatre',
    registrationFee: 250,
    maxParticipants: 25,
    coordinators: [{ name: 'Pearl Ocean', phone: '9999988882' }],
  },
  {
    _id: 'mock-evt-8',
    title: 'Voyage of Verse',
    slug: 'voyage-of-verse',
    category: 'literary',
    description: 'Let your words flow like the tides in our poetry and slam verse competition.',
    date: new Date('2026-09-16T11:00:00.000Z'),
    venue: 'The Captain Cabin Room',
    registrationFee: 80,
    maxParticipants: 35,
    coordinators: [{ name: 'Shell Verse', phone: '9999988881' }],
  }
];

// @desc    Fetch all events
// @route   GET /api/events
// @access  Public
const getEvents = async (req, res, next) => {
  try {
    const events = await Event.find({});
    res.json({
      success: true,
      data: events.length > 0 ? events : fallbackEvents,
    });
  } catch (error) {
    console.warn('Serving fallback events because database is offline');
    res.json({
      success: true,
      data: fallbackEvents,
    });
  }
};

// @desc    Fetch single event by slug
// @route   GET /api/events/:slug
// @access  Public
const getEventBySlug = async (req, res, next) => {
  try {
    const event = await Event.findOne({ slug: req.params.slug.toLowerCase() });
    
    if (!event) {
      const fallback = fallbackEvents.find((e) => e.slug === req.params.slug.toLowerCase());
      if (fallback) {
        return res.json({
          success: true,
          data: fallback,
        });
      }
      return res.status(404).json({
        success: false,
        message: 'Voyage not found in current charts',
      });
    }

    res.json({
      success: true,
      data: event,
    });
  } catch (error) {
    console.warn('Searching fallback events because database is offline');
    const fallback = fallbackEvents.find((e) => e.slug === req.params.slug.toLowerCase());
    if (fallback) {
      return res.json({
        success: true,
        data: fallback,
      });
    }
    res.status(404).json({
      success: false,
      message: 'Voyage not found in current charts (DB Offline)',
    });
  }
};

// @desc    Create event
// @route   POST /api/events
// @access  Private (Admin Only)
const createEvent = async (req, res, next) => {
  try {
    if (!req.body.slug && req.body.title) {
      req.body.slug = slugify(req.body.title);
    } else if (req.body.slug) {
      req.body.slug = slugify(req.body.slug);
    }
    const event = await Event.create(req.body);
    
    res.status(201).json({
      success: true,
      data: event,
    });
  } catch (error) {
    console.warn('Creating event in-memory because database is offline');
    const newEvent = {
      _id: `mock-evt-${Date.now()}`,
      title: req.body.title,
      slug: req.body.slug || slugify(req.body.title),
      category: req.body.category || 'cultural',
      description: req.body.description,
      date: req.body.date,
      venue: req.body.venue,
      registrationFee: Number(req.body.registrationFee || 0),
      maxParticipants: req.body.maxParticipants ? Number(req.body.maxParticipants) : undefined,
      posterImage: req.body.posterImage,
      coordinators: req.body.coordinators || [],
    };
    fallbackEvents.push(newEvent);
    res.status(201).json({
      success: true,
      data: newEvent,
    });
  }
};

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private (Admin Only)
const updateEvent = async (req, res, next) => {
  try {
    if (req.body.title && !req.body.slug) {
      req.body.slug = slugify(req.body.title);
    } else if (req.body.slug) {
      req.body.slug = slugify(req.body.slug);
    }
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Voyage not found to upgrade',
      });
    }

    res.json({
      success: true,
      data: event,
    });
  } catch (error) {
    console.warn('Updating event in-memory because database is offline');
    const index = fallbackEvents.findIndex((e) => e._id === req.params.id);
    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: 'Voyage not found to upgrade (DB Offline)',
      });
    }
    const updatedEvent = {
      ...fallbackEvents[index],
      ...req.body,
      slug: req.body.title && !req.body.slug ? slugify(req.body.title) : (req.body.slug ? slugify(req.body.slug) : fallbackEvents[index].slug),
    };
    fallbackEvents[index] = updatedEvent;
    res.json({
      success: true,
      data: updatedEvent,
    });
  }
};

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private (Admin Only)
const deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Voyage not found to delete',
      });
    }

    res.json({
      success: true,
      data: { id: req.params.id },
    });
  } catch (error) {
    console.warn('Deleting event in-memory because database is offline');
    const index = fallbackEvents.findIndex((e) => e._id === req.params.id);
    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: 'Voyage not found to delete (DB Offline)',
      });
    }
    fallbackEvents = fallbackEvents.filter((e) => e._id !== req.params.id);
    res.json({
      success: true,
      data: { id: req.params.id },
    });
  }
};

module.exports = {
  getEvents,
  getEventBySlug,
  createEvent,
  updateEvent,
  deleteEvent,
};
