const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');

// Load env variables
dotenv.config({ path: path.join(__dirname, '../../.env') });

const User = require('../models/User');
const Event = require('../models/Event');
const Registration = require('../models/Registration');
const Notification = require('../models/Notification');
const Sponsor = require('../models/Sponsor');

const seedDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/helix2026';
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing collections
    await User.deleteMany({});
    await Event.deleteMany({});
    await Registration.deleteMany({});
    await Notification.deleteMany({});
    await Sponsor.deleteMany({});
    console.log('Cleared existing collections.');

    // 1. Seed Users (Hashed passwords)
    const salt = bcrypt.genSaltSync(10);
    const adminPassword = bcrypt.hashSync('admin123', salt);
    const userPassword = bcrypt.hashSync('user123', salt);

    const adminUser = await User.create({
      name: 'Admiral Admin',
      email: 'admin@helix.com',
      username: 'admin',
      password: adminPassword,
      college: 'AIIMS Deoghar',
      phone: '9876543210',
      role: 'admin',
    });

    const user1 = await User.create({
      name: 'Captain Jack Sparrow',
      email: 'jack@blackpearl.com',
      username: 'jack',
      password: userPassword,
      college: 'Tortuga Academy of Navigation',
      phone: '9876543211',
      role: 'user',
    });

    const user2 = await User.create({
      name: 'Nemo',
      email: 'nemo@coralreef.com',
      username: 'nemo',
      password: userPassword,
      college: 'Great Barrier Reef School',
      phone: '9876543212',
      role: 'user',
    });

    const user3 = await User.create({
      name: 'Ariel Triton',
      email: 'ariel@atlantica.com',
      username: 'ariel',
      password: userPassword,
      college: 'Atlantis University of Arts',
      phone: '9876543213',
      role: 'user',
    });

    console.log('Seeded Users: 1 Admin, 3 Regular.');

    // 2. Seed 25 Events (Date: June 24, 2026 at 1:00 PM)
    const events = await Event.insertMany([
      {
        title: 'E-nchant',
        slug: 'e-nchant',
        category: 'technical',
        description: 'E poster competition',
        date: new Date('2026-06-24T13:00:00.000Z'),
        venue: 'Online',
        registrationFee: 0,
        maxParticipants: 100,
        posterImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
        coordinators: [{ name: 'ABC XYZ', phone: '9999999999' }],
      },
      {
        title: 'Oasis',
        slug: 'oasis',
        category: 'arts',
        description: 'Online photography competition',
        date: new Date('2026-06-24T13:00:00.000Z'),
        venue: 'Online',
        registrationFee: 0,
        maxParticipants: 100,
        posterImage: 'https://images.unsplash.com/photo-1513553404607-988bf2703777?auto=format&fit=crop&w=800&q=80',
        coordinators: [{ name: 'XYZ ABC', phone: '9999999999' }],
      },
      {
        title: 'Voices in Verse',
        slug: 'voices-in-verse',
        category: 'literary',
        description: 'Online poetry event',
        date: new Date('2026-06-24T13:00:00.000Z'),
        venue: 'Online',
        registrationFee: 0,
        maxParticipants: 100,
        posterImage: 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&w=800&q=80',
        coordinators: [{ name: 'XYZ', phone: '9999999999' }],
      },
      {
        title: 'Canvas Chronicles',
        slug: 'canvas-chronicles',
        category: 'arts',
        description: 'Online painting competition',
        date: new Date('2026-06-24T13:00:00.000Z'),
        venue: 'Online',
        registrationFee: 0,
        maxParticipants: 100,
        posterImage: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=800&q=80',
        coordinators: [{ name: 'XYZ', phone: '9999999999' }],
      },
      {
        title: 'Mirage of Mandates',
        slug: 'mirage-of-mandates',
        category: 'literary',
        description: 'Youth parliament debate',
        date: new Date('2026-06-24T13:00:00.000Z'),
        venue: 'Online',
        registrationFee: 0,
        maxParticipants: 100,
        posterImage: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=800&q=80',
        coordinators: [{ name: 'XYZ', phone: '9999999999' }],
      },
      {
        title: 'Mystiq Quiz',
        slug: 'mystiq-quiz',
        category: 'literary',
        description: 'Online general and thematic trivia quiz',
        date: new Date('2026-06-24T13:00:00.000Z'),
        venue: 'Online',
        registrationFee: 0,
        maxParticipants: 100,
        posterImage: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=800&q=80',
        coordinators: [{ name: 'XYZ', phone: '9999999999' }],
      },
      {
        title: 'The Cursed Escape',
        slug: 'the-cursed-escape',
        category: 'sports',
        description: 'Parachute drop and navigation event',
        date: new Date('2026-06-24T13:00:00.000Z'),
        venue: 'Online',
        registrationFee: 0,
        maxParticipants: 100,
        posterImage: 'https://images.unsplash.com/photo-1522163182402-834f871fd851?auto=format&fit=crop&w=800&q=80',
        coordinators: [{ name: 'XYZ', phone: '9999999999' }],
      },
      {
        title: 'Desert Fold',
        slug: 'desert-fold',
        category: 'arts',
        description: 'Origami paper crafting competition',
        date: new Date('2026-06-24T13:00:00.000Z'),
        venue: 'Online',
        registrationFee: 0,
        maxParticipants: 100,
        posterImage: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=800&q=80',
        coordinators: [{ name: 'XYZ', phone: '9999999999' }],
      },
      {
        title: 'Alladins Wardrobe',
        slug: 'alladins-wardrobe',
        category: 'arts',
        description: 'T-shirt painting competition',
        date: new Date('2026-06-24T13:00:00.000Z'),
        venue: 'Online',
        registrationFee: 0,
        maxParticipants: 100,
        posterImage: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=800&q=80',
        coordinators: [{ name: 'XYZ', phone: '9999999999' }],
      },
      {
        title: 'Mehfil E Rang',
        slug: 'mehfil-e-rang',
        category: 'arts',
        description: 'Rangoli competition',
        date: new Date('2026-06-24T13:00:00.000Z'),
        venue: 'Online',
        registrationFee: 0,
        maxParticipants: 100,
        posterImage: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=800&q=80',
        coordinators: [{ name: 'XYZ', phone: '9999999999' }],
      },
      {
        title: 'Moonlight Move',
        slug: 'moonlight-move',
        category: 'cultural',
        description: 'Solo dance performance',
        date: new Date('2026-06-24T13:00:00.000Z'),
        venue: 'Online',
        registrationFee: 0,
        maxParticipants: 100,
        posterImage: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=800&q=80',
        coordinators: [{ name: 'XYZ', phone: '9999999999' }],
      },
      {
        title: 'Twilight Ties',
        slug: 'twilight-ties',
        category: 'cultural',
        description: 'Duet dance performance',
        date: new Date('2026-06-24T13:00:00.000Z'),
        venue: 'Online',
        registrationFee: 0,
        maxParticipants: 100,
        posterImage: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=800&q=80',
        coordinators: [{ name: 'XYZ', phone: '9999999999' }],
      },
      {
        title: 'Starlight Sync',
        slug: 'starlight-sync',
        category: 'cultural',
        description: 'Group dance performance',
        date: new Date('2026-06-24T13:00:00.000Z'),
        venue: 'Online',
        registrationFee: 0,
        maxParticipants: 100,
        posterImage: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=800&q=80',
        coordinators: [{ name: 'XYZ', phone: '9999999999' }],
      },
      {
        title: 'Echoes of Oasis',
        slug: 'echoes-of-oasis',
        category: 'cultural',
        description: 'Solo song performance',
        date: new Date('2026-06-24T13:00:00.000Z'),
        venue: 'Online',
        registrationFee: 0,
        maxParticipants: 100,
        posterImage: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=800&q=80',
        coordinators: [{ name: 'XYZ', phone: '9999999999' }],
      },
      {
        title: 'Duet of the Dunes',
        slug: 'duet-of-the-dunes',
        category: 'cultural',
        description: 'Duet song performance',
        date: new Date('2026-06-24T13:00:00.000Z'),
        venue: 'Online',
        registrationFee: 0,
        maxParticipants: 100,
        posterImage: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=800&q=80',
        coordinators: [{ name: 'XYZ', phone: '9999999999' }],
      },
      {
        title: 'Mystic Melodies',
        slug: 'mystic-melodies',
        category: 'cultural',
        description: 'Group song performance',
        date: new Date('2026-06-24T13:00:00.000Z'),
        venue: 'Online',
        registrationFee: 0,
        maxParticipants: 100,
        posterImage: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=800&q=80',
        coordinators: [{ name: 'XYZ', phone: '9999999999' }],
      },
      {
        title: 'Zivanza',
        slug: 'zivanza',
        category: 'cultural',
        description: 'Fashion show event',
        date: new Date('2026-06-24T13:00:00.000Z'),
        venue: 'Online',
        registrationFee: 0,
        maxParticipants: 100,
        posterImage: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=800&q=80',
        coordinators: [{ name: 'XYZ', phone: '9999999999' }],
      },
      {
        title: 'Laugistan',
        slug: 'laugistan',
        category: 'cultural',
        description: 'Standup comedy show',
        date: new Date('2026-06-24T13:00:00.000Z'),
        venue: 'Online',
        registrationFee: 0,
        maxParticipants: 100,
        posterImage: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80',
        coordinators: [{ name: 'XYZ', phone: '9999999999' }],
      },
      {
        title: 'Geniouss Guesses',
        slug: 'geniouss-guesses',
        category: 'cultural',
        description: 'Dumb charades game',
        date: new Date('2026-06-24T13:00:00.000Z'),
        venue: 'Online',
        registrationFee: 0,
        maxParticipants: 100,
        posterImage: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80',
        coordinators: [{ name: 'XYZ', phone: '9999999999' }],
      },
      {
        title: 'Aroma of Dunes',
        slug: 'aroma-of-dunes',
        category: 'cultural',
        description: 'Fireless cooking competition',
        date: new Date('2026-06-24T13:00:00.000Z'),
        venue: 'Online',
        registrationFee: 0,
        maxParticipants: 100,
        posterImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
        coordinators: [{ name: 'XYZ', phone: '9999999999' }],
      },
      {
        title: 'The Oracles Curse',
        slug: 'the-oracles-curse',
        category: 'sports',
        description: 'Online treasure hunt',
        date: new Date('2026-06-24T13:00:00.000Z'),
        venue: 'Online',
        registrationFee: 0,
        maxParticipants: 100,
        posterImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
        coordinators: [{ name: 'XYZ', phone: '9999999999' }],
      },
      {
        title: 'Star Night',
        slug: 'star-night',
        category: 'cultural',
        description: 'Bollywood night celebrations',
        date: new Date('2026-06-24T13:00:00.000Z'),
        venue: 'Online',
        registrationFee: 0,
        maxParticipants: 100,
        posterImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80',
        coordinators: [{ name: 'XYZ', phone: '9999999999' }],
      },
      {
        title: 'Comedy Night',
        slug: 'comedy-night',
        category: 'cultural',
        description: 'Stand up comedy performances',
        date: new Date('2026-06-24T13:00:00.000Z'),
        venue: 'Online',
        registrationFee: 0,
        maxParticipants: 100,
        posterImage: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80',
        coordinators: [{ name: 'XYZ', phone: '9999999999' }],
      },
      {
        title: 'DJ Night',
        slug: 'dj-night',
        category: 'cultural',
        description: 'DJ DJ DJ dance event',
        date: new Date('2026-06-24T13:00:00.000Z'),
        venue: 'Online',
        registrationFee: 0,
        maxParticipants: 100,
        posterImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80',
        coordinators: [{ name: 'XYZ', phone: '9999999999' }],
      },
      {
        title: 'Band Night',
        slug: 'band-night',
        category: 'cultural',
        description: 'Rock music live band performances',
        date: new Date('2026-06-24T13:00:00.000Z'),
        venue: 'Online',
        registrationFee: 0,
        maxParticipants: 100,
        posterImage: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=800&q=80',
        coordinators: [{ name: 'XYZ', phone: '9999999999' }],
      }
    ]);

    console.log('Seeded 25 themed events.');

    // 3. Seed 5 Sponsors (tiers: title, gold, silver, bronze)
    await Sponsor.insertMany([
      {
        name: 'DeepSea Oceanographics',
        logoUrl: 'https://images.unsplash.com/photo-1551244072-5d12893278ab?auto=format&fit=crop&w=300&q=80',
        tier: 'title',
        website: 'https://deepseaoceanographics.example.com',
      },
      {
        name: 'Neptune Energy Drink',
        logoUrl: 'https://images.unsplash.com/photo-1542241647-9cbb2225278b?auto=format&fit=crop&w=300&q=80',
        tier: 'gold',
        website: 'https://neptunebeverages.example.com',
      },
      {
        name: 'Coral Health Insurance',
        logoUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=300&q=80',
        tier: 'gold',
        website: 'https://coralhealth.example.com',
      },
      {
        name: 'Sailing Logistics Co.',
        logoUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=300&q=80',
        tier: 'silver',
        website: 'https://sailinglogisticsco.example.com',
      },
      {
        name: 'Anchor Craft Brewery',
        logoUrl: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?auto=format&fit=crop&w=300&q=80',
        tier: 'bronze',
        website: 'https://anchorcraftbrewery.example.com',
      },
    ]);

    console.log('Seeded 5 Sponsors across tiers.');

    // 4. Seed Registrations
    const reg1 = new Registration({
      user: user1._id,
      name: user1.name,
      email: user1.email,
      phone: user1.phone,
      college: user1.college,
      city: 'Tortuga',
      eventsSelected: [events[0]._id, events[1]._id],
      registrationId: 'HLX-0001',
      paymentStatus: 'paid',
    });
    await reg1.save();

    const reg2 = new Registration({
      user: user2._id,
      name: user2.name,
      email: user2.email,
      phone: user2.phone,
      college: user2.college,
      city: 'Sydney Harbour',
      eventsSelected: [events[1]._id, events[5]._id],
      registrationId: 'HLX-0002',
      paymentStatus: 'pending',
    });
    await reg2.save();

    // Update user registered events lists
    await User.findByIdAndUpdate(user1._id, { $set: { registeredEvents: [events[0]._id, events[1]._id] } });
    await User.findByIdAndUpdate(user2._id, { $set: { registeredEvents: [events[1]._id, events[5]._id] } });

    console.log('Seeded 2 Registrations (HLX-0001, HLX-0002).');

    // 5. Seed 2 Notifications
    await Notification.create({
      title: 'Voyage Schedule Alert',
      message: 'The Kraken Quiz coordinates have changed to The Coral Reef Hall on Sept 13 at 14:00.',
      targetAudience: 'all',
    });

    await Notification.create({
      title: 'Welcome Aboard!',
      message: 'Greetings Navigator, your initial ship credentials have been logged in tortoise charts. Set sail for events!',
      targetAudience: 'specific',
      targetUsers: [user1._id],
    });

    console.log('Seeded 2 Notifications.');

    console.log('Database seeding successfully finished.');
    mongoose.connection.close();
  } catch (error) {
    console.error('Seeding Error:', error);
    process.exit(1);
  }
};

seedDB();
