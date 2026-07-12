import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, ShieldAlert, LogOut, Compass, Map, BookOpen, HeartHandshake, Mail, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import NotificationBell from './NotificationBell';

import logoImg from '../assets/HelixLogo.png';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isAvatarOpen, setIsAvatarOpen] = useState(false);
  const avatarDropdownRef = useRef(null);

  // Monitor scroll height to adjust header opacity
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close avatar menu on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (avatarDropdownRef.current && !avatarDropdownRef.current.contains(e.target)) {
        setIsAvatarOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setIsAvatarOpen(false);
    setIsMobileOpen(false);
    navigate('/');
  };

  const navLinks = [
    { name: 'The Map', path: '/events', icon: Map },
    { name: 'The Logbook', path: '/gallery', icon: BookOpen },
    { name: 'Our Patrons', path: '/sponsors', icon: HeartHandshake },
    { name: 'Message in a Bottle', path: '/contact', icon: Mail },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 w-full z-40 transition-all duration-300 ${
        isScrolled || isMobileOpen ? 'bg-navy border-b border-ocean shadow-xl' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo on Left */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center gap-2">
              <img src={logoImg} alt="HELIX Logo" className="h-10 w-10 object-contain" />
              <span className="font-heading font-extrabold text-lg md:text-xl tracking-widest bg-gradient-to-r from-gold via-white to-seafoam bg-clip-text text-transparent">
                HELIX
              </span>
            </Link>
          </div>

          {/* Desktop Nav Links in Center */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `relative py-2 text-sm font-medium transition-colors duration-300 ${
                    isActive ? 'text-gold' : 'text-seafoam hover:text-gold'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span>{link.name}</span>
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-gold rounded-full" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>

          {/* Desktop Auth / Notifications on Right */}
          <div className="hidden lg:flex items-center gap-4">
            {user ? (
              <>
                <NotificationBell />
                
                {/* User Profile Dropdown */}
                <div className="relative" ref={avatarDropdownRef}>
                  <button
                    onClick={() => setIsAvatarOpen(!isAvatarOpen)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-ocean/30 border border-gold/30 hover:border-gold/60 text-gold transition-all duration-300 focus:outline-none"
                  >
                    <Compass className="w-5 h-5 animate-spin-slow" />
                    <span className="text-xs font-semibold font-body tracking-wider">{user.name.split(' ')[0]}</span>
                  </button>

                  {isAvatarOpen && (
                    <div className="absolute right-0 mt-3 w-48 bg-navy border border-gold/30 rounded-lg shadow-2xl overflow-hidden py-1">
                      <Link
                        to="/dashboard"
                        onClick={() => setIsAvatarOpen(false)}
                        className="flex items-center gap-2 px-4 py-3 text-xs text-white hover:bg-ocean/40 font-body transition-colors"
                      >
                        <User className="w-4 h-4 text-gold" />
                        Captain's Quarters
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 w-full text-left px-4 py-3 text-xs text-rose-400 hover:bg-ocean/40 font-body transition-colors"
                      >
                        <LogOut className="w-4 h-4 text-rose-400" />
                        Abandon Ship
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold border border-gold/30 hover:border-gold text-gold rounded hover:bg-gold/10 transition-all duration-300 min-h-[44px] flex items-center"
                >
                  Board the Ship
                </Link>
                <Link
                  to="/signup"
                  className="px-5 py-2 text-sm font-semibold bg-gradient-to-r from-baltic to-bronze text-white rounded shadow-md hover:shadow-lg hover:shadow-baltic/20 transition-all duration-300 min-h-[44px] flex items-center"
                >
                  Set Sail
                </Link>
              </div>
            )}
          </div>

          {/* Hamburger Menu icon for Mobile/Tablet */}
          <div className="flex lg:hidden items-center gap-4">
            {user && <NotificationBell />}
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="w-10 h-10 flex items-center justify-center text-gold bg-ocean/20 border border-gold/20 rounded-lg focus:outline-none"
            >
              {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* --- MOBILE DRAWER LAYOUT --- */}
      {isMobileOpen && (
        <>
          {/* Dim Overlay */}
          <div className="lg:hidden fixed inset-0 top-20 bg-black/60 backdrop-blur-sm z-30" onClick={() => setIsMobileOpen(false)} />
          
          {/* Drawer Panel */}
          <div className="lg:hidden fixed top-20 right-0 bottom-0 w-4/5 max-w-sm bg-navy border-l border-ocean z-40 p-6 flex flex-col justify-between shadow-2xl transition-transform duration-300 transform translate-x-0">
            <div className="flex flex-col gap-6">
              {navLinks.map((link) => {
                const IconComponent = link.icon;
                return (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMobileOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-lg text-base font-semibold min-h-[48px] transition-all duration-300 ${
                        isActive
                          ? 'bg-ocean/60 border-l-4 border-gold text-gold'
                          : 'text-white/80 hover:bg-ocean/20 text-white hover:text-gold'
                      }`
                    }
                  >
                    <IconComponent className="w-5 h-5 text-gold" />
                    {link.name}
                  </NavLink>
                );
              })}
            </div>

            {/* Auth controls at drawer bottom */}
            <div className="border-t border-ocean/50 pt-6 flex flex-col gap-4">
              {user ? (
                <>
                  <div className="px-4 py-2 bg-ocean/30 rounded border border-gold/10 flex items-center gap-2">
                    <Compass className="w-5 h-5 text-gold animate-spin-slow" />
                    <div>
                      <p className="text-[10px] text-seafoam">Logged in as</p>
                      <p className="text-xs font-bold text-white font-body">{user.name}</p>
                    </div>
                  </div>
                  <Link
                    to="/dashboard"
                    onClick={() => setIsMobileOpen(false)}
                    className="flex items-center justify-center gap-2 w-full py-3 bg-ocean/50 hover:bg-ocean text-white rounded text-sm font-semibold min-h-[48px] transition-colors"
                  >
                    <User className="w-4 h-4 text-gold" />
                    Captain's Quarters
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-2 w-full py-3 bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/30 text-rose-300 rounded text-sm font-semibold min-h-[48px] transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Abandon Ship
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setIsMobileOpen(false)}
                    className="flex items-center justify-center w-full py-3 border border-gold text-gold hover:bg-gold/15 rounded text-sm font-semibold min-h-[48px] transition-all duration-300"
                  >
                    Board the Ship
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setIsMobileOpen(false)}
                    className="flex items-center justify-center w-full py-3 bg-gradient-to-r from-baltic to-bronze text-white rounded text-sm font-semibold min-h-[48px] transition-all duration-300"
                  >
                    Set Sail
                  </Link>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </nav>
  );
};

export default Navbar;
