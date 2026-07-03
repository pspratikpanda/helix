import React, { useState, useEffect } from 'react';
import { Compass, Map, Filter, Plus } from 'lucide-react';
import apiClient from '../api/apiClient';
import EventCard from '../components/EventCard';
import WaveDivider from '../components/WaveDivider';
import { useAuth } from '../context/AuthContext';
import EventModal from '../components/EventModal';

const Events = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const categories = [
    { key: 'all', label: 'All Voyages' },
    { key: 'cultural', label: 'Cultural' },
    { key: 'literary', label: 'Literary' },
    { key: 'sports', label: 'Sports' },
    { key: 'arts', label: 'Arts' },
    { key: 'medical', label: 'Medical' },
    { key: 'technical', label: 'Technical' },
  ];

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/events');
      if (res.data && res.data.success) {
        setEvents(res.data.data);
        setFilteredEvents(res.data.data);
      }
    } catch (err) {
      console.error('Failed to navigate events:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    console.log('Current logged-in user in Events page:', user);
  }, [user]);

  // Filter events when active tab changes
  useEffect(() => {
    if (activeTab === 'all') {
      setFilteredEvents(events);
    } else {
      setFilteredEvents(events.filter((evt) => evt.category === activeTab));
    }
  }, [activeTab, events]);

  return (
    <div className="w-full min-h-screen bg-navy text-white pt-28 pb-16 font-body">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Title Section with wave decoration */}
        <div className="text-center space-y-4">
          <h1 className="font-heading text-3xl md:text-5xl font-black text-gold tracking-widest flex items-center justify-center gap-2">
            <Compass className="w-7 h-7 text-gold animate-spin-slow" /> Navigate the Events
          </h1>
          {/* Custom SVG Wave Underline Decoration */}
          <div className="w-64 h-3 mx-auto overflow-hidden opacity-80">
            <svg viewBox="0 0 100 10" preserveAspectRatio="none" className="w-full h-full stroke-gold fill-none" strokeWidth="2">
              <path d="M 0 5 Q 25 0, 50 5 T 100 5" />
            </svg>
          </div>
          <p className="text-xs md:text-sm text-seafoam uppercase tracking-widest font-semibold">
            Choose your category and chart your course
          </p>
          {user?.role === 'admin' && (
            <div className="flex justify-center pt-2">
              <button
                onClick={() => {
                  setSelectedEvent(null);
                  setIsModalOpen(true);
                }}
                className="flex items-center gap-1.5 px-6 py-2.5 bg-gradient-to-r from-baltic to-bronze border border-gold/45 text-white rounded-lg text-xs font-bold uppercase tracking-widest hover:scale-[1.02] transform transition-transform min-h-[44px]"
              >
                <Plus className="w-4 h-4 text-gold" /> Add Voyage
              </button>
            </div>
          )}
        </div>

        {/* --- CATEGORY TABS (Mobile Scrollable) --- */}
        <div className="w-full border-b border-ocean/40 pb-2">
          {/* Mobile: overflow-x-auto, scrollbar hidden; Desktop: flex-wrap */}
          <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-none md:flex-wrap md:justify-center md:pb-0">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveTab(cat.key)}
                className={`px-5 py-2.5 rounded-full text-xs font-heading font-bold uppercase tracking-widest transition-all duration-300 min-h-[44px] flex-shrink-0 flex items-center gap-1.5 border ${
                  activeTab === cat.key
                    ? 'bg-gold border-gold text-navy shadow-md shadow-gold/20'
                    : 'bg-ocean/20 border-ocean/60 text-seafoam hover:border-gold hover:text-gold'
                }`}
              >
                {activeTab === cat.key && <Filter className="w-3.5 h-3.5" />}
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs text-seafoam font-semibold tracking-wider uppercase">
          <span>Current Coordinates</span>
          <span>{filteredEvents.length} Voyages Catalogued</span>
        </div>

        {/* Grid display */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {loading ? (
            // Render 6 skeleton cards
            Array.from({ length: 6 }).map((_, idx) => (
              <EventCard key={idx} loading={true} />
            ))
          ) : filteredEvents.length === 0 ? (
            <div className="col-span-full py-24 text-center">
              <Map className="w-12 h-12 text-gold/30 mx-auto mb-4 animate-pulse" />
              <h3 className="font-heading text-lg font-bold text-gold mb-1">Voyages Uncharted</h3>
              <p className="text-xs text-white/50">No events found in the selected category of the manifest.</p>
            </div>
          ) : (
            filteredEvents.map((evt) => <EventCard key={evt._id} event={evt} />)
          )}
        </div>

      </div>
      <EventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchEvents}
        event={selectedEvent}
      />
    </div>
  );
};

export default Events;
