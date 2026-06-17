import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Github, Twitter, Instagram, Mail } from 'lucide-react';
import logoImg from '../assets/HelixLogo.png';

const Footer = () => {
  return (
    <footer className="relative bg-navy border-t-2 border-bronze pt-16 pb-12 overflow-hidden z-10">
      
      {/* --- WATERMARK LOGO: Compass Rose (Opacity 5%) --- */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] z-0 select-none">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 100 100"
          className="w-96 h-96 text-gold fill-none stroke-current"
          strokeWidth="1"
        >
          <circle cx="50" cy="50" r="45" />
          <circle cx="50" cy="50" r="40" strokeDasharray="3 3" />
          <line x1="50" y1="2" x2="50" y2="98" />
          <line x1="2" y1="50" x2="98" y2="50" />
          <line x1="16" y1="16" x2="84" y2="84" />
          <line x1="16" y1="84" x2="84" y2="16" />
          {/* North indicator */}
          <polygon points="50,10 46,25 50,50" className="fill-gold" />
          <polygon points="50,10 54,25 50,50" className="fill-transparent" />
          {/* South indicator */}
          <polygon points="50,90 46,75 50,50" className="fill-transparent" />
          <polygon points="50,90 54,75 50,50" className="fill-gold" />
          {/* East indicator */}
          <polygon points="90,50 75,46 50,50" className="fill-gold" />
          <polygon points="90,50 75,54 50,50" className="fill-transparent" />
          {/* West indicator */}
          <polygon points="10,50 25,46 50,50" className="fill-transparent" />
          <polygon points="10,50 25,54 50,50" className="fill-gold" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Responsive grid layouts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center text-center md:text-left mb-10">
          
          {/* Column 1: Logo & Info */}
          <div className="flex flex-col items-center md:items-start gap-3">
            <Link to="/" className="flex items-center gap-2">
              <img src={logoImg} alt="HELIX Logo" className="h-10 object-contain" />
              <span className="font-heading font-bold text-gold tracking-widest">HELIX 2026</span>
            </Link>
            <p className="text-xs text-seafoam font-body leading-relaxed max-w-xs">
              Annual Socio-Cultural Fest of AIIMS Deoghar. Charting medical futures and artistic horizons under the waves of odyssey.
            </p>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="flex flex-col items-center gap-4">
            <span className="text-sm font-heading font-semibold text-gold tracking-widest uppercase">
              Quick Links
            </span>
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs font-body font-medium">
              <Link to="/events" className="text-seafoam hover:text-gold transition-colors duration-200">
                Voyages
              </Link>
              <Link to="/gallery" className="text-seafoam hover:text-gold transition-colors duration-200">
                Logbook
              </Link>
              <Link to="/sponsors" className="text-seafoam hover:text-gold transition-colors duration-200">
                Patrons
              </Link>
              <Link to="/contact" className="text-seafoam hover:text-gold transition-colors duration-200">
                Bottle Mail
              </Link>
            </div>
          </div>

          {/* Column 3: Social & Coordinates */}
          <div className="flex flex-col items-center md:items-end gap-4">
            <span className="text-sm font-heading font-semibold text-gold tracking-widest uppercase">
              Follow the Course
            </span>
            <div className="flex gap-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-ocean/30 border border-gold/20 hover:border-gold/60 text-gold hover:text-white hover:bg-ocean/60 transition-all duration-300"
              >
                <Instagram className="w-4.5 h-4.5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-ocean/30 border border-gold/20 hover:border-gold/60 text-gold hover:text-white hover:bg-ocean/60 transition-all duration-300"
              >
                <Twitter className="w-4.5 h-4.5" />
              </a>
              <a
                href="mailto:helix@aiimsdeoghar.edu.in"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-ocean/30 border border-gold/20 hover:border-gold/60 text-gold hover:text-white hover:bg-ocean/60 transition-all duration-300"
              >
                <Mail className="w-4.5 h-4.5" />
              </a>
            </div>
          </div>

        </div>

        {/* Rope Style Border Line */}
        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-gold/40 to-transparent my-6" />

        {/* Copyright Section */}
        <div className="text-center">
          <p className="text-xs font-body text-seafoam/70 flex flex-col md:flex-row items-center justify-center gap-1.5 md:gap-3">
            <span>&copy; 2026 HELIX • AIIMS Deoghar. All rights reserved.</span>
            <span className="hidden md:inline text-gold">|</span>
            <span className="flex items-center gap-1 font-heading text-[10px] text-gold tracking-wider uppercase">
              <Compass className="w-3.5 h-3.5 text-gold animate-spin-slow" /> Designed for the Deep Sea Voyage
            </span>
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
