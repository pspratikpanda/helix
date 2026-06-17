import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Providers
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';

// Custom Notification Socket Connection Hook
import useNotifications from './hooks/useNotifications';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PrivateRoute from './components/PrivateRoute';

// Pages
import Home from './pages/Home';
import Events from './pages/Events';
import EventDetail from './pages/EventDetail';
import Register from './pages/Register';
import Gallery from './pages/Gallery';
import Sponsors from './pages/Sponsors';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';

// Catch-All 404
import { Compass, ShieldAlert } from 'lucide-react';
const LostAtSea = () => (
  <div className="min-h-screen bg-navy text-white flex flex-col items-center justify-center font-body px-4 text-center">
    <ShieldAlert className="w-16 h-16 text-rose-500 mb-4 animate-bounce" />
    <h1 className="font-heading text-4xl font-black text-gold tracking-widest uppercase">
      Lost at Sea
    </h1>
    <p className="text-sm text-seafoam mt-2 max-w-sm leading-relaxed">
      You have wandered into unmapped oceanic currents. This route does not exist.
    </p>
    <a
      href="/"
      className="mt-6 px-6 py-2.5 bg-gradient-to-r from-baltic to-bronze text-white font-heading text-xs font-bold tracking-widest rounded uppercase hover:scale-105 transition-transform min-h-[44px] flex items-center"
    >
      ⚓ Return to Safe Port
    </a>
  </div>
);

// Inner App component to activate socket.io notifications hook
const AppContent = () => {
  useNotifications(); // Listens for real-time announcements when token is present
  const location = useLocation();

  // Global Water Ripple + Scroll Reveal observer hooks
  React.useEffect(() => {
    // 1. Water Ripple Click Effect
    const handleGlobalClick = (e) => {
      const ripple = document.createElement('div');
      ripple.className = 'water-ripple';
      ripple.style.left = `${e.clientX}px`;
      ripple.style.top = `${e.clientY}px`;
      document.body.appendChild(ripple);
      
      setTimeout(() => {
        ripple.remove();
      }, 800);
    };

    window.addEventListener('click', handleGlobalClick);
    return () => {
      window.removeEventListener('click', handleGlobalClick);
    };
  }, []);

  React.useEffect(() => {
    // 2. Scroll reveal Intersection Observer
    const timeoutId = setTimeout(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('revealed');
            }
          });
        },
        { threshold: 0.05 }
      );

      const elements = document.querySelectorAll('.reveal-on-scroll');
      elements.forEach((el) => observer.observe(el));

      return () => {
        elements.forEach((el) => observer.unobserve(el));
      };
    }, 250);

    return () => clearTimeout(timeoutId);
  }, [location.pathname]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Global Navbar */}
      <Navbar />

      {/* Main Page Area */}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:slug" element={<EventDetail />} />
          <Route path="/register" element={<Register />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/sponsors" element={<Sponsors />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Protected Captain's Quarters Route */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />

          {/* Catch-all 404 */}
          <Route path="*" element={<LostAtSea />} />
        </Routes>
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <NotificationProvider>
          {/* Toast notifications renderer */}
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: '#16273f',
                color: '#fff',
                border: '1px solid #2b5e75',
              },
            }}
          />
          <AppContent />
        </NotificationProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
