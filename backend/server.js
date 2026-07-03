const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load configurations
dotenv.config({ path: path.join(__dirname, '../.env') });

const connectDB = require('./config/db');
const { generalLimiter } = require('./middleware/rateLimiter');
const { socketAuth } = require('./middleware/socket.middleware');

// Routes
const authRoutes = require('./routes/auth.routes');
const eventRoutes = require('./routes/event.routes');
const registrationRoutes = require('./routes/registration.routes');
const notificationRoutes = require('./routes/notification.routes');
const galleryRoutes = require('./routes/gallery.routes');
const sponsorRoutes = require('./routes/sponsor.routes');
const adminRoutes = require('./routes/admin.routes');

// Connect to Database
connectDB();

const app = express();
const server = http.createServer(app);

// Configure CORS origin
const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
const allowedOrigins = [
  clientUrl,
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://localhost:5176',
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin) || origin.startsWith('http://localhost:')) {
        return callback(null, true);
      }
      return callback(new Error('CORS policy mismatch'), false);
    },
    credentials: true,
  })
);

// Global Middlewares
app.use(express.json());
app.use(generalLimiter); // Apply general rate limiter globally

// Setup Socket.io
const io = new Server(server, {
  cors: {
    origin: clientUrl,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Authenticate Socket connection via JWT
io.use(socketAuth);

// Socket.io connection handlers
io.on('connection', (socket) => {
  console.log(`Navigator connected to WebSocket: Socket ID ${socket.id}, User ID ${socket.userId}`);

  // Join personal room and broadcast room
  socket.join(socket.userId.toString());
  socket.join('all-users');

  socket.on('disconnect', () => {
    console.log(`Navigator disconnected from WebSocket: Socket ID ${socket.id}`);
  });
});

// Set Socket.io instance on app context for controllers to access
app.set('io', io);

// Mount API routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/register', registrationRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/sponsors', sponsorRoutes);
app.use('/api/admin', adminRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to the HELIX 2026 Odyssey API. Set sail!',
  });
});

// Global Error Handling Middleware (catch-all at the bottom of server.js)
app.use((err, req, res, next) => {
  console.error('API Error:', err);
  
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error on the High Seas';
  
  res.status(statusCode).json({
    success: false,
    message,
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server steering on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});
