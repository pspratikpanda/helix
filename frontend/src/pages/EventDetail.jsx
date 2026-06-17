import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, MapPin, Phone, User, Compass, ArrowLeft, Anchor, CircleDollarSign, ShieldAlert } from 'lucide-react';
import apiClient from '../api/apiClient';

const EventDetail = () => {
  const { slug } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const res = await apiClient.get(`/events/${slug}`);
        if (res.data && res.data.success) {
          setEvent(res.data.data);
        }
      } catch (err) {
        console.error('Failed to view voyage coordinates:', err.message);
        setError(err.message || 'Voyage not found in charts');
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-navy flex flex-col items-center justify-center font-body">
        <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 font-heading text-gold tracking-widest animate-pulse">
          Charting the waters...
        </p>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-navy flex flex-col items-center justify-center font-body px-4 text-center">
        <ShieldAlert className="w-16 h-16 text-rose-500 mb-4 animate-bounce" />
        <h2 className="font-heading text-2xl font-bold text-gold mb-2">Voyage Lost at Sea</h2>
        <p className="text-sm text-white/70 max-w-sm mb-6">
          The requested coordinate slug is missing or coordinates are outside our mapped charts.
        </p>
        <Link
          to="/events"
          className="flex items-center gap-2 px-6 py-2.5 bg-ocean border border-gold text-gold rounded hover:text-white transition-colors min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Map
        </Link>
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Date TBA';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="w-full min-h-screen bg-navy text-white pb-24 font-body">
      
      {/* Hero Header with Poster background */}
      <div className="relative w-full h-[300px] md:h-[45vh] overflow-hidden">
        {/* Blurred backing image */}
        <img
          src={event.posterImage || 'https://images.unsplash.com/photo-1513553404607-988bf2703777?auto=format&fit=crop&w=1200&q=80'}
          alt={event.title}
          className="w-full h-full object-cover filter blur-[2px] brightness-50 scale-105"
        />
        {/* Dark overlay gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/60 to-transparent" />
        
        {/* Inner header content */}
        <div className="absolute bottom-6 left-0 right-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3">
            <Link
              to="/events"
              className="inline-flex items-center gap-1.5 text-xs text-seafoam hover:text-gold uppercase tracking-wider font-semibold border border-seafoam/30 hover:border-gold px-3 py-1 rounded w-max bg-navy/40 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Map
            </Link>
            
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="bg-baltic text-white text-[10px] font-body uppercase font-bold tracking-wider px-2.5 py-0.5 rounded border border-gold/30">
                ⚓ {event.category}
              </span>
              {event.maxParticipants && (
                <span className="bg-ocean/85 text-mint text-[10px] font-body uppercase font-semibold tracking-wider px-2.5 py-0.5 rounded border border-ocean">
                  Capacity: {event.maxParticipants} Crew
                </span>
              )}
            </div>

            <h1 className="font-heading text-2xl md:text-4xl lg:text-5xl font-black text-gold tracking-wide leading-tight">
              {event.title}
            </h1>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Left Columns: Description & Coordinators */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Description card */}
            <div className="bg-ocean/30 border border-gold/15 rounded-xl p-6 md:p-8 space-y-6">
              <h2 className="font-heading text-lg md:text-xl font-bold text-gold tracking-wider flex items-center gap-2 border-b border-ocean/50 pb-3">
                <Compass className="w-5 h-5 text-gold animate-spin-slow" /> Voyage Briefing
              </h2>
              <p className="text-sm md:text-base text-white/90 leading-relaxed font-body whitespace-pre-line">
                {event.description}
              </p>
            </div>

            {/* Coordinator Contact Cards */}
            <div className="space-y-4">
              <h2 className="font-heading text-lg md:text-xl font-bold text-gold tracking-wider flex items-center gap-2">
                ⚓ Deck Officers (Coordinators)
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {event.coordinators && event.coordinators.length > 0 ? (
                  event.coordinators.map((c, i) => (
                    <div
                      key={i}
                      className="bg-ocean/20 border border-ocean/50 rounded-lg p-4 flex items-center gap-3.5 hover:border-gold/30 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-full bg-ocean/60 flex items-center justify-center text-gold border border-gold/20 flex-shrink-0">
                        <User className="w-5 h-5" />
                      </div>
                      <div className="font-body text-xs min-w-0">
                        <p className="font-semibold text-white truncate">{c.name}</p>
                        <a
                          href={`tel:${c.phone}`}
                          className="flex items-center gap-1 text-seafoam hover:text-gold transition-colors mt-1 font-medium"
                        >
                          <Phone className="w-3.5 h-3.5" /> {c.phone}
                        </a>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-xs text-white/50">
                    Deck officers coordinates TBA.
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Right Column: Sidebar settings */}
          <div className="space-y-6">
            
            {/* Cruise manifest card */}
            <div className="bg-ocean border border-gold/30 rounded-xl p-6 space-y-6 shadow-2xl">
              <h3 className="font-heading text-base font-bold text-gold tracking-wider border-b border-gold/20 pb-3">
                Ship's Schedule
              </h3>
              
              <div className="space-y-4 font-body text-xs">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-gold flex-shrink-0" />
                  <div>
                    <span className="text-[10px] uppercase text-seafoam font-semibold block">Date & Hour</span>
                    <span className="text-white mt-0.5 block leading-relaxed">{formatDate(event.date)}</span>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gold flex-shrink-0" />
                  <div>
                    <span className="text-[10px] uppercase text-seafoam font-semibold block">Sailing Port (Venue)</span>
                    <span className="text-white mt-0.5 block leading-relaxed">{event.venue || 'TBA'}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CircleDollarSign className="w-5 h-5 text-gold flex-shrink-0" />
                  <div>
                    <span className="text-[10px] uppercase text-seafoam font-semibold block">Voyage Fee</span>
                    <span className="text-white mt-0.5 block font-bold text-sm">
                      {event.registrationFee > 0 ? `₹${event.registrationFee}` : 'Free Boarding'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Set Sail CTA Button */}
              <div className="pt-2">
                <Link
                  to="/register"
                  className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-baltic to-bronze hover:from-baltic hover:to-gold text-white font-heading font-bold text-sm tracking-widest rounded-lg transition-all duration-300 min-h-[48px] uppercase hover:scale-[1.02] shadow-lg shadow-baltic/10"
                >
                  <Anchor className="w-4 h-4" />
                  Set Sail for this Event
                </Link>
              </div>

            </div>

          </div>

        </div>
      </div>

    </div>
  );
};

export default EventDetail;
