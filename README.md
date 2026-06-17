# HELIX 2026 — College Annual Socio-Cultural Fest Portal

A full-stack (MERN) skeleton portal for **HELIX 2026**, the annual socio-cultural fest of **AIIMS Deoghar**. The theme is **Odyssey / Sea Adventure** (deep ocean exploration meets ancient maritime mythology).

## Folder Structure

```
/root
├── /frontend                  # React Vite Client (Tailwind CSS)
│   ├── src/
│   │   ├── api/               # Axios client with JWT interceptors
│   │   ├── assets/            # Theme assets (HelixLogo.png)
│   │   ├── components/        # Reusable nautical UI components
│   │   ├── context/           # React Context (Auth, Notifications)
│   │   ├── hooks/             # WebSocket notification connection
│   │   ├── pages/             # Layout components (Home, Events, Dashboard, etc.)
│   │   ├── App.jsx            # App routes and client settings
│   │   └── index.css          # Visual theme variables, Google Fonts
│   ├── tailwind.config.js     # Custom visual color palette configuration
│   └── package.json           # Client dependency configurations
│
└── /backend                   # Node.js Express Server
    ├── config/db.js           # Mongoose pool setup
    ├── controllers/           # API business logic routing stubs
    ├── middleware/            # JWT validation, Admin authorization, rate limits
    ├── models/                # MongoDB Schema models (User, Event, Registration, etc.)
    ├── routes/                # Endpoint routing files (Auth, Events, Sponsors)
    ├── scripts/seed.js        # DB initial seeder script
    ├── server.js              # Entry point attaching Socket.io & HTTP layers
    └── package.json           # Server dependency configuration
```

## Prerequisites

- **Node.js**: v18+ recommended
- **MongoDB**: A running local instance or MongoDB Atlas URI connection
- **npm** or **yarn**

## Installation & Setup

### 1. Backend

1. Navigate to `/backend`:
   ```bash
   cd backend
   ```
2. Create your `.env` file from the example:
   ```bash
   cp .env.example .env
   ```
3. Set your configuration keys inside `.env` (`MONGO_URI`, `JWT_SECRET`, etc.).
4. Install dependencies:
   ```bash
   npm install
   ```
5. Seed the database with sample nautically-themed events:
   ```bash
   npm run seed
   ```
6. Start the server in development mode:
   ```bash
   npm run dev
   ```

### 2. Frontend

1. Navigate to `/frontend`:
   ```bash
   cd ../frontend
   ```
2. Create your `.env` file from the example:
   ```bash
   cp .env.example .env
   ```
3. Set `VITE_API_URL` and `VITE_SOCKET_URL` to point to the backend server location.
4. Install dependencies:
   ```bash
   npm install
   ```
5. Start the Vite React development server:
   ```bash
   npm run dev
   ```

## Key Technologies & Libraries

- **Frontend**: React (Vite), React Router v6, Axios, Tailwind CSS v3, Socket.io-client, react-hot-toast, Lucide React (icons)
- **Backend**: Node.js, Express.js, MongoDB via Mongoose, Socket.io, jsonwebtoken, bcryptjs, express-rate-limit

## Deployment Notes

- **Frontend (React)**: Optimized for simple build triggers. Recommended host: **Vercel** or **Netlify**. Ensure environment variables are mapped in dashboard configurations.
- **Backend (Node/Express)**: Can be deployed to services like **Render**, **Railway**, or **Heroku**. Set the production database connection string, client CORS parameters, and environment settings.
