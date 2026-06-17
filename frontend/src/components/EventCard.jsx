import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Compass } from 'lucide-react';

const EventCard = ({ event, loading = false }) => {
  if (loading) {
    // Pulse Skeleton Loader Card structure
    return (
      <div className="bg-ocean/30 border border-ocean/60 rounded-xl overflow-hidden shadow-lg animate-pulse flex flex-col justify-between h-[360px]">
        <div>
          <div className="w-full aspect-video bg-navy/40" />
          <div className="p-5 flex flex-col gap-3">
            <div className="h-4 bg-navy/40 rounded w-1/4" />
            <div className="h-6 bg-navy/40 rounded w-3/4" />
            <div className="h-4 bg-navy/40 rounded w-full" />
            <div className="h-4 bg-navy/40 rounded w-5/6" />
          </div>
        </div>
        <div className="px-5 pb-5">
          <div className="h-10 bg-navy/40 rounded w-full" />
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Date TBA';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="reveal-on-scroll group bg-ocean border border-gold/20 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-baltic/20 hover:-translate-y-2 transform transition-all duration-300 flex flex-col justify-between h-[380px]">
      
      <div>
        {/* Cover image with ratio 16/9 */}
        <div className="relative w-full aspect-video overflow-hidden">
          <img
            src={event.posterImage || 'https://images.unsplash.com/photo-1513553404607-988bf2703777?auto=format&fit=crop&w=800&q=80'}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {/* Absolute Top-Left Category Badge */}
          <span className="absolute top-3 left-3 bg-baltic border border-gold/30 text-white text-[10px] font-body uppercase font-bold tracking-widest px-2.5 py-1 rounded shadow-md">
            {event.category}
          </span>
        </div>

        {/* Card Body */}
        <div className="p-5">
          <h3 className="font-heading text-lg font-bold text-gold tracking-wide mb-2 line-clamp-1">
            {event.title}
          </h3>
          <p className="text-xs text-white/80 font-body line-clamp-2 mb-4 leading-relaxed">
            {event.description}
          </p>

          {/* Quick details */}
          <div className="flex flex-col gap-1 text-[11px] font-body text-seafoam">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-gold" />
              <span>{formatDate(event.date)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-gold" />
              <span className="truncate">{event.venue || 'TBA'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Explore Button - full width at card bottom */}
      <div className="px-5 pb-5">
        <Link
          to={`/events/${event.slug}`}
          className="flex items-center justify-center gap-2 w-full min-h-[44px] bg-navy border border-gold/30 hover:border-gold hover:bg-ocean/20 text-gold hover:text-white rounded font-body text-sm font-semibold tracking-wider transition-all duration-300 uppercase"
        >
          <Compass className="w-4 h-4 text-gold group-hover:rotate-45 transition-transform" />
          Explore Course
        </Link>
      </div>

    </div>
  );
};

export default EventCard;
