import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Anchor, Compass, Calendar, ArrowRight, ShieldAlert, Award } from 'lucide-react';
import apiClient from '../api/apiClient';
import EventCard from '../components/EventCard';
import CountdownTimer from '../components/CountdownTimer';
import WaveDivider from '../components/WaveDivider';
import SponsorCard from '../components/SponsorCard';

import logoImg from '../assets/HelixLogo.png';

const Home = () => {
  const [events, setEvents] = useState([]);
  const [sponsors, setSponsors] = useState({ title: [], gold: [], silver: [], bronze: [] });
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [loadingSponsors, setLoadingSponsors] = useState(true);

  // Dynamic particle/bubble details
  const [bubbleList, setBubbleList] = useState([]);

  useEffect(() => {
    // Determine bubble count based on screen size (max 25 on mobile for performance, 65 on desktop)
    const isMobile = window.innerWidth < 768;
    const bubbleCount = isMobile ? 25 : 65;
    const list = Array.from({ length: bubbleCount }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      size: `${Math.random() * 25 + 6}px`,
      delay: `${Math.random() * 8}s`,
      duration: `${Math.random() * 8 + 6}s`,
      opacity: Math.random() * 0.4 + 0.1,
      blur: `${Math.random() * 2}px`,
    }));
    setBubbleList(list);

    // Fetch Events from API
    const fetchEvents = async () => {
      try {
        const res = await apiClient.get('/events');
        if (res.data && res.data.success) {
          // Keep only first 6 as "Featured"
          setEvents(res.data.data.slice(0, 6));
        }
      } catch (err) {
        console.error('Failed to load featured events:', err.message);
      } finally {
        setLoadingEvents(false);
      }
    };

    // Fetch Sponsors from API
    const fetchSponsors = async () => {
      try {
        const res = await apiClient.get('/sponsors');
        if (res.data && res.data.success) {
          setSponsors(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load patrons list:', err.message);
      } finally {
        setLoadingSponsors(false);
      }
    };

    fetchEvents();
    fetchSponsors();
  }, []);

  const highlights = [
    {
      title: 'Bollywood Night',
      image: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=800&q=80',
      tag: 'Sept 14',
    },
    {
      title: 'Stand-Up Comedy',
      image: 'https://images.unsplash.com/photo-1516280440614-37939bbacd6a?auto=format&fit=crop&w=800&q=80',
      tag: 'Sept 13',
    },
    {
      title: 'EDM Night',
      image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=800&q=80',
      tag: 'Sept 15',
    },
    {
      title: 'Band Night',
      image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80',
      tag: 'Sept 16',
    },
  ];

  const galleryPreview = [
    'https://images.unsplash.com/photo-1513553404607-988bf2703777?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80',
  ];

  return (
    <div className="w-full relative min-h-screen">
      
      {/* ============================================================
          SECTION 1: HERO
          ============================================================ */}
      <section className="relative min-h-screen flex flex-col justify-center items-center bg-navy pt-24 pb-36 px-4 overflow-hidden z-10">
        
        {/* Animated Particles / Bubbles */}
        {bubbleList.map((b) => (
          <span
            key={b.id}
            className="bubble"
            style={{
              left: b.left,
              width: b.size,
              height: b.size,
              animationDelay: b.delay,
              animationDuration: b.duration,
              opacity: b.opacity,
              filter: `blur(${b.blur})`,
            }}
          />
        ))}

        <div className="text-center flex flex-col items-center max-w-4xl mx-auto z-10 space-y-6">
          {/* Logo centered */}
          <img
            src={logoImg}
            alt="HELIX Logo"
            className="w-[180px] md:w-[220px] lg:w-[280px] aspect-square object-contain animate-spin-slow filter drop-shadow-[0_0_15px_rgba(231,192,125,0.4)]"
          />

          {/* Heading */}
          <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl font-black text-gold tracking-widest leading-none">
            HELIX 2026
          </h1>

          {/* Subheading */}
          <p className="font-body text-base md:text-xl text-seafoam font-medium tracking-wide uppercase">
            AIIMS Deoghar • An Odyssey Awaits
          </p>

          {/* Countdown timer */}
          <div className="w-full max-w-2xl py-4">
            <CountdownTimer />
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto pt-4">
            <Link
              to="/register"
              className="flex items-center justify-center gap-2 w-full sm:w-56 min-h-[48px] bg-gradient-to-r from-baltic to-bronze text-white font-heading font-bold text-sm tracking-widest rounded-lg shadow-lg hover:shadow-baltic/30 hover:scale-105 transform transition-all duration-300 uppercase"
            >
              <Anchor className="w-4 h-4" />
              Set Sail
            </Link>
            <Link
              to="/events"
              className="flex items-center justify-center gap-2 w-full sm:w-56 min-h-[48px] border-2 border-gold text-gold hover:text-navy hover:bg-gold font-heading font-bold text-sm tracking-widest rounded-lg transition-all duration-300 uppercase"
            >
              <Compass className="w-4 h-4" />
              The Map
            </Link>
          </div>
        </div>

        {/* Wave Divider to About (#2b5e75) */}
        <div className="absolute bottom-0 left-0 right-0 w-full z-20">
          <WaveDivider fill="#2b5e75" />
        </div>
      </section>

      {/* ============================================================
          SECTION 2: ABOUT
          ============================================================ */}
      <section className="bg-ocean py-12 px-4 md:py-16 md:px-8 lg:py-24 relative z-10 overflow-hidden">
        <div className="max-w-7xl mx-auto container relative z-10 space-y-12">
          
          <div className="text-center space-y-3">
            <h2 className="font-heading text-3xl md:text-5xl font-black text-gold tracking-wider flex items-center justify-center gap-3">
              <Anchor className="w-8 h-8 text-gold animate-bounce" /> What is HELIX?
            </h2>
            <div className="w-24 h-1 bg-bronze mx-auto rounded-full" />
          </div>

          <div className="max-w-3xl mx-auto text-center font-body text-sm md:text-base text-white/90 leading-relaxed space-y-6">
            <p>
              HELIX is the premier annual socio-cultural fest of **AIIMS Deoghar**. In 2026, we embark on an epic **Odyssey** across deep ocean currents, combining ancient maritime mythology with the scientific beauty of biological spirals.
            </p>
            <p>
              Chart your course through five days of high-stakes cultural battles, scientific challenges, and mesmerizing musical performances. A platform where future doctors meet ancient legends under the banner of the trident.
            </p>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 pt-6">
            {[
              { number: '20+ Voyages', label: 'Events Scheduled' },
              { number: '5 Days', label: 'Fest Duration' },
              { number: '1000+ Crew', label: 'Participants' },
              { number: '4 Arenas', label: 'Stages & Halls' },
            ].map((stat, i) => (
              <div
                key={i}
                className="reveal-on-scroll bg-navy border border-gold/20 rounded-xl p-5 text-center shadow-lg hover:border-gold/60 transition-colors"
              >
                <div className="font-heading text-xl md:text-3xl font-extrabold text-gold tracking-wide">
                  {stat.number}
                </div>
                <div className="font-body text-xs text-seafoam tracking-wider mt-1 uppercase font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Wave Divider to Featured Events (#16273f) */}
        <div className="absolute bottom-0 left-0 right-0 w-full z-20">
          <WaveDivider fill="#16273f" />
        </div>
      </section>

      {/* ============================================================
          SECTION 3: FEATURED EVENTS ("Chart Your Course")
          ============================================================ */}
      <section className="bg-navy py-12 px-4 md:py-16 md:px-8 lg:py-24 relative z-10 overflow-hidden">
        <div className="max-w-7xl mx-auto container relative z-10 space-y-12">
          
          <div className="text-center space-y-3">
            <h2 className="font-heading text-3xl md:text-5xl font-black text-gold tracking-wider">
              Chart Your Course
            </h2>
            <p className="font-body text-xs md:text-sm text-seafoam uppercase tracking-widest font-semibold">
              Explore Featured Voyages
            </p>
            <div className="w-24 h-1 bg-bronze mx-auto rounded-full" />
          </div>

          {/* Event cards grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {loadingEvents ? (
              // 3 Skeleton placeholders
              Array.from({ length: 3 }).map((_, idx) => (
                <EventCard key={idx} loading={true} />
              ))
            ) : events.length === 0 ? (
              <div className="col-span-full py-12 text-center text-white/50 text-sm">
                No events currently on the charts. Check back soon!
              </div>
            ) : (
              events.map((evt) => <EventCard key={evt._id} event={evt} />)
            )}
          </div>

          <div className="text-center pt-6">
            <Link
              to="/events"
              className="inline-flex items-center gap-2 text-gold hover:text-white font-heading font-bold text-sm tracking-wider uppercase group border-b border-gold/30 hover:border-white pb-1 transition-all duration-300"
            >
              See All Voyages <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

        </div>

        {/* Wave Divider to Highlights (#2b5e75) */}
        <div className="absolute bottom-0 left-0 right-0 w-full z-20">
          <WaveDivider fill="#2b5e75" />
        </div>
      </section>

      {/* ============================================================
          SECTION 4: HIGHLIGHTS ("The Grand Voyage")
          ============================================================ */}
      <section className="bg-ocean py-12 px-4 md:py-16 md:px-8 lg:py-24 relative z-10 overflow-hidden">
        <div className="max-w-7xl mx-auto container relative z-10 space-y-12">
          
          <div className="text-center space-y-3">
            <h2 className="font-heading text-3xl md:text-5xl font-black text-gold tracking-wider">
              The Grand Voyage
            </h2>
            <p className="font-body text-xs md:text-sm text-seafoam uppercase tracking-widest font-semibold">
              Star-Studded Highlights
            </p>
            <div className="w-24 h-1 bg-bronze mx-auto rounded-full" />
          </div>

          {/* Highlights grids */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {highlights.map((h, idx) => (
              <div
                key={idx}
                className="reveal-on-scroll group relative rounded-xl overflow-hidden shadow-xl aspect-[3/4] border-2 border-driftwood hover:border-gold transition-all duration-500 cursor-pointer"
                style={{
                  boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                }}
              >
                {/* Image background */}
                <img
                  src={h.image}
                  alt={h.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />

                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/50 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />

                {/* Content */}
                <div className="absolute bottom-6 left-6 right-6 flex flex-col justify-end h-full">
                  <span className="text-[10px] font-heading font-bold uppercase tracking-wider text-seafoam mb-1">
                    {h.tag}
                  </span>
                  <h3 className="font-heading text-xl font-bold text-gold tracking-wider group-hover:text-white transition-colors">
                    {h.title}
                  </h3>
                  <div className="w-10 h-0.5 bg-bronze mt-2 group-hover:w-full transition-all duration-500" />
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Wave Divider to Sponsors (#16273f) */}
        <div className="absolute bottom-0 left-0 right-0 w-full z-20">
          <WaveDivider fill="#16273f" />
        </div>
      </section>

      {/* ============================================================
          SECTION 5: SPONSORS
          ============================================================ */}
      <section className="bg-navy py-12 px-4 md:py-16 md:px-8 lg:py-24 relative z-10 overflow-hidden">
        <div className="max-w-7xl mx-auto container relative z-10 space-y-12">
          
          <div className="text-center space-y-3">
            <h2 className="font-heading text-3xl md:text-5xl font-black text-gold tracking-wider">
              Our Patrons
            </h2>
            <p className="font-body text-xs md:text-sm text-seafoam uppercase tracking-widest font-semibold">
              Powering the Expedition
            </p>
            <div className="w-24 h-1 bg-bronze mx-auto rounded-full" />
          </div>

          {loadingSponsors ? (
            <div className="text-center text-white/50 text-xs py-10 animate-pulse">
              Mapping sponsors list...
            </div>
          ) : (
            <div className="space-y-10">
              {/* Title Sponsors */}
              {sponsors.title && sponsors.title.length > 0 && (
                <div className="space-y-4">
                  <h3 className="font-heading text-xs font-bold uppercase tracking-widest text-gold text-center">
                    🏆 Title Sponsor
                  </h3>
                  <div className="flex flex-wrap justify-center gap-6 max-w-sm mx-auto">
                    {sponsors.title.map((sp) => (
                      <SponsorCard key={sp._id} sponsor={sp} />
                    ))}
                  </div>
                </div>
              )}

              {/* Gold Sponsors */}
              {sponsors.gold && sponsors.gold.length > 0 && (
                <div className="space-y-4">
                  <h3 className="font-heading text-xs font-bold uppercase tracking-widest text-gold/85 text-center">
                    ⚓ Gold Patrons
                  </h3>
                  <div className="flex flex-wrap justify-center gap-6 max-w-2xl mx-auto">
                    {sponsors.gold.map((sp) => (
                      <div key={sp._id} className="w-48">
                        <SponsorCard sponsor={sp} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Silver & Bronze Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {sponsors.silver && sponsors.silver.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="font-heading text-xs font-bold uppercase tracking-widest text-seafoam text-center">
                      🧭 Silver Sponsors
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      {sponsors.silver.map((sp) => (
                        <SponsorCard key={sp._id} sponsor={sp} />
                      ))}
                    </div>
                  </div>
                )}
                {sponsors.bronze && sponsors.bronze.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="font-heading text-xs font-bold uppercase tracking-widest text-bronze text-center">
                      🐚 Bronze Crew
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      {sponsors.bronze.map((sp) => (
                        <SponsorCard key={sp._id} sponsor={sp} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

        {/* Wave Divider to Gallery Preview (#2b5e75) */}
        <div className="absolute bottom-0 left-0 right-0 w-full z-20">
          <WaveDivider fill="#2b5e75" />
        </div>
      </section>

      {/* ============================================================
          SECTION 6: GALLERY PREVIEW
          ============================================================ */}
      <section className="bg-ocean py-12 px-4 md:py-16 md:px-8 lg:py-24 relative z-10 overflow-hidden">
        <div className="max-w-7xl mx-auto container relative z-10 space-y-12">
          
          <div className="text-center space-y-3">
            <h2 className="font-heading text-3xl md:text-5xl font-black text-gold tracking-wider">
              Logbook Preview
            </h2>
            <p className="font-body text-xs md:text-sm text-seafoam uppercase tracking-widest font-semibold">
              Visual Archives from previous voyages
            </p>
            <div className="w-24 h-1 bg-bronze mx-auto rounded-full" />
          </div>

          {/* Responsive Gallery grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3 lg:gap-4">
            {galleryPreview.map((url, idx) => (
              <div
                key={idx}
                className="reveal-on-scroll overflow-hidden rounded-lg aspect-square border border-navy/40 shadow-lg"
              >
                <img
                  src={url}
                  alt={`Gallery preview item ${idx + 1}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 cursor-pointer"
                />
              </div>
            ))}
          </div>

          <div className="text-center pt-4">
            <Link
              to="/gallery"
              className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-navy border border-gold hover:border-white text-gold hover:text-white rounded-lg font-heading text-xs font-bold tracking-widest uppercase min-h-[48px] hover:scale-105 transition-all duration-300"
            >
              View Full Gallery
            </Link>
          </div>

        </div>

        {/* Wave Divider back to navy for global footer context alignment */}
        <div className="absolute bottom-0 left-0 right-0 w-full z-20">
          <WaveDivider fill="#16273f" />
        </div>
      </section>

    </div>
  );
};

export default Home;
