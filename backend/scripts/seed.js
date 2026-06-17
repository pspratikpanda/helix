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
      password: adminPassword,
      college: 'AIIMS Deoghar',
      phone: '9876543210',
      role: 'admin',
    });

    const user1 = await User.create({
      name: 'Captain Jack Sparrow',
      email: 'jack@blackpearl.com',
      password: userPassword,
      college: 'Tortuga Academy of Navigation',
      phone: '9876543211',
      role: 'user',
    });

    const user2 = await User.create({
      name: 'Nemo',
      email: 'nemo@coralreef.com',
      password: userPassword,
      college: 'Great Barrier Reef School',
      phone: '9876543212',
      role: 'user',
    });

    const user3 = await User.create({
      name: 'Ariel Triton',
      email: 'ariel@atlantica.com',
      password: userPassword,
      college: 'Atlantis University of Arts',
      phone: '9876543213',
      role: 'user',
    });

    console.log('Seeded Users: 1 Admin, 3 Regular.');

    // 2. Seed 8 Events (Dates: Sept 12 - Sept 16, 2026)
    const events = await Event.insertMany([
      {
        title: 'Deep Dive Debate',
        slug: 'deep-dive-debate',
        category: 'literary',
        description: 'Argue the depths of ancient maritime law and future exploration in this parliamentary debate event.',
        date: new Date('2026-09-12T10:00:00.000Z'),
        venue: 'Neptune Auditorium',
        registrationFee: 150,
        maxParticipants: 50,
        posterImage: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=800&q=80',
        coordinators: [
          { name: 'Dr. Coral Shore', phone: '9999988888' },
        ],
      },
      {
        title: 'The Kraken Quiz',
        slug: 'the-kraken-quiz',
        category: 'literary',
        description: 'Encounter general trivia and oceanology questions that will test even the most experienced navigators.',
        date: new Date('2026-09-13T14:00:00.000Z'),
        venue: 'The Coral Reef Hall',
        registrationFee: 100,
        maxParticipants: 100,
        posterImage: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=800&q=80',
        coordinators: [
          { name: 'Prof. Marine Trench', phone: '9999988887' },
        ],
      },
      {
        title: 'Sirens of Song',
        slug: 'sirens-of-song',
        category: 'cultural',
        description: 'Enchant the judges and audience with your melodies in our flagship solo and group singing competition.',
        date: new Date('2026-09-14T18:00:00.000Z'),
        venue: 'The Siren Deck (Open Stage)',
        registrationFee: 200,
        maxParticipants: 30,
        posterImage: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=800&q=80',
        coordinators: [
          { name: 'Siren Melody', phone: '9999988886' },
        ],
      },
      {
        title: "Poseidon's Arena",
        slug: 'poseidons-arena',
        category: 'sports',
        description: 'Unleash your strength in athletics, swimming, and outdoor sports tournament.',
        date: new Date('2026-09-12T08:00:00.000Z'),
        venue: 'AIIMS Deoghar Sports Complex',
        registrationFee: 300,
        maxParticipants: 80,
        posterImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
        coordinators: [
          { name: 'Coach Anchor', phone: '9999988885' },
        ],
      },
      {
        title: 'Anchors Aweigh Art',
        slug: 'anchors-aweigh-art',
        category: 'arts',
        description: 'Paint, sketch, or craft beautiful masterpieces highlighting ancient mythology combined with biological structures.',
        date: new Date('2026-09-15T10:00:00.000Z'),
        venue: 'The Art Bay',
        registrationFee: 50,
        maxParticipants: 40,
        posterImage: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=800&q=80',
        coordinators: [
          { name: 'Hazel Driftwood', phone: '9999988884' },
        ],
      },
      {
        title: 'The Helm Hackathon',
        slug: 'the-helm-hackathon',
        category: 'technical',
        description: 'Navigate uncharted digital waters in our 36-hour hackathon. Build tools to improve ocean health or medical navigation.',
        date: new Date('2026-09-15T09:00:00.000Z'),
        venue: 'Vasco da Gama IT lab',
        registrationFee: 0,
        maxParticipants: 60,
        posterImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
        coordinators: [
          { name: 'Alan Compass', phone: '9999988883' },
        ],
      },
      {
        title: 'Tide Turners Dance',
        slug: 'tide-turners-dance',
        category: 'cultural',
        description: 'Make waves on the dance floor in this street and classical dance battle.',
        date: new Date('2026-09-13T19:00:00.000Z'),
        venue: 'The Amphitheatre',
        registrationFee: 250,
        maxParticipants: 25,
        posterImage: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=800&q=80',
        coordinators: [
          { name: 'Pearl Ocean', phone: '9999988882' },
        ],
      },
      {
        title: 'Voyage of Verse',
        slug: 'voyage-of-verse',
        category: 'literary',
        description: 'Let your words flow like the tides in our poetry and slam verse competition.',
        date: new Date('2026-09-16T11:00:00.000Z'),
        venue: 'The Captain Cabin Room',
        registrationFee: 80,
        maxParticipants: 35,
        posterImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
        coordinators: [
          { name: 'Shell Verse', phone: '9999988881' },
        ],
      },
    ]);

    console.log('Seeded 8 themed events.');

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
