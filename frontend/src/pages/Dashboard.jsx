import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotificationsContext } from '../context/NotificationContext';
import { Compass, Ship, Anchor, Bell, User, Phone, MapPin, Calendar, CheckCircle, Clock, ShieldAlert } from 'lucide-react';
import apiClient from '../api/apiClient';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useAuth();
  const { notifications, unreadCount, markAllRead } = useNotificationsContext();
  const [registrations, setRegistrations] = useState([]);
  const [loadingRegistrations, setLoadingRegistrations] = useState(true);

  // Profile Stub Form fields
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    college: user?.college || '',
    phone: user?.phone || '',
  });

  useEffect(() => {
    const fetchMyRegistrations = async () => {
      try {
        const res = await apiClient.get('/register/my');
        if (res.data && res.data.success) {
          setRegistrations(res.data.data);
        }
      } catch (err) {
        console.error('Failed to query registered voyages:', err.message);
        toast.error('Stormy waters blocked loading registrations.');
      } finally {
        setLoadingRegistrations(false);
      }
    };

    fetchMyRegistrations();
  }, []);

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    // TODO: implement profile update API integration layer
    toast.success("Navigator's log update request submitted! (Profile update TODO stub)");
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Date TBA';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="w-full min-h-screen bg-navy text-white pt-28 pb-16 font-body">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header Greeting */}
        <div className="bg-ocean/30 border border-gold/20 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <h1 className="font-heading text-2xl md:text-4xl font-black text-gold tracking-widest uppercase">
              Welcome back, {user?.name || 'Navigator'}
            </h1>
            <p className="text-xs text-seafoam">
              Current Rank: {user?.role === 'admin' ? 'Fleet Admiral (Admin)' : 'Navigator (User)'} • Port coordinates set
            </p>
          </div>
          
          <div className="flex items-center gap-3 bg-navy/60 px-4 py-2 border border-gold/30 rounded-xl">
            <Anchor className="w-5 h-5 text-gold animate-bounce" />
            <div className="text-left">
              <span className="text-[10px] text-seafoam block uppercase tracking-wider font-semibold">Active Voyages</span>
              <span className="text-sm font-bold text-white font-heading">
                {registrations.reduce((acc, r) => acc + (r.eventsSelected?.length || 0), 0)} Scheduled
              </span>
            </div>
          </div>
        </div>

        {/* Responsive Grid: Mobile: 1 col, Desktop: 3 cols (2 col Left, 1 col Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT 2/3 COLUMN: My Voyages & Navigator's Log (Profile) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* 1. My Voyages */}
            <div className="bg-ocean/30 border border-gold/15 rounded-xl p-6 space-y-6">
              <h2 className="font-heading text-lg font-bold text-gold tracking-wider flex items-center gap-2 border-b border-ocean/50 pb-3">
                <Ship className="w-5 h-5 text-gold" /> My Registered Voyages
              </h2>

              {loadingRegistrations ? (
                <div className="py-12 text-center text-white/50 text-xs animate-pulse">
                  Unrolling ship manifests...
                </div>
              ) : registrations.length === 0 ? (
                <div className="py-12 text-center text-white/50 text-xs">
                  ⛵ You have not registered for any voyages yet.{' '}
                  <a href="/events" className="text-gold underline hover:text-white transition-colors ml-1 font-semibold">
                    Chart Your Course
                  </a>
                </div>
              ) : (
                <div className="space-y-4">
                  {registrations.map((reg) => (
                    <div
                      key={reg._id}
                      className="bg-navy/55 border border-ocean/60 rounded-xl p-5 hover:border-gold/30 transition-colors space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-ocean/30 pb-2">
                        <div>
                          <span className="text-[10px] text-seafoam uppercase tracking-wider font-semibold">
                            Registration ID
                          </span>
                          <p className="text-sm font-heading font-black text-gold tracking-wider">
                            {reg.registrationId}
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-1.5">
                          {reg.paymentStatus === 'paid' ? (
                            <span className="flex items-center gap-1 text-[10px] uppercase font-bold text-mint bg-mint/15 px-2.5 py-1 rounded-full border border-mint/20">
                              <CheckCircle className="w-3 h-3" /> Boarding Confirmed
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-[10px] uppercase font-bold text-gold bg-gold/10 px-2.5 py-1 rounded-full border border-gold/25">
                              <Clock className="w-3 h-3" /> Verification Pending
                            </span>
                          )}
                        </div>
                      </div>

                      {/* List selected events in this registration */}
                      <div className="space-y-2.5 pt-1">
                        {reg.eventsSelected?.map((event) => (
                          <div
                            key={event._id}
                            className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 p-2.5 rounded bg-ocean/20 hover:bg-ocean/40 transition-colors"
                          >
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-lg bg-navy/60 flex items-center justify-center text-gold border border-gold/15 flex-shrink-0">
                                <Compass className="w-4.5 h-4.5" />
                              </div>
                              <div>
                                <h4 className="text-xs font-bold text-white">{event.title}</h4>
                                <span className="text-[9px] uppercase tracking-wider text-seafoam font-semibold">
                                  ⚓ {event.category}
                                </span>
                              </div>
                            </div>

                            <div className="flex flex-col sm:items-end text-[10px] text-white/80 font-body gap-0.5">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3 text-gold" /> {formatDate(event.date)}
                              </span>
                              <span className="flex items-center gap-1 sm:justify-end">
                                <MapPin className="w-3 h-3 text-gold" /> {event.venue || 'TBA'}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>

                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 2. Navigator's Log (Profile Update Stub) */}
            <div className="bg-ocean/30 border border-gold/15 rounded-xl p-6 space-y-6">
              <h2 className="font-heading text-lg font-bold text-gold tracking-wider flex items-center gap-2 border-b border-ocean/50 pb-3">
                <User className="w-5 h-5 text-gold" /> Navigator's Log (Profile Settings)
              </h2>

              <form onSubmit={handleProfileUpdate} className="space-y-4 font-body text-xs">
                {/* TODO: Update profile coordinates stub */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="uppercase text-gold font-semibold tracking-wider">Full Name</label>
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      className="bg-navy border border-ocean/70 focus:border-gold rounded p-2.5 text-white text-base min-h-[44px] focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="uppercase text-gold font-semibold tracking-wider">Contact Number</label>
                    <input
                      type="text"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      className="bg-navy border border-ocean/70 focus:border-gold rounded p-2.5 text-white text-base min-h-[44px] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="uppercase text-gold font-semibold tracking-wider">Academy / College</label>
                  <input
                    type="text"
                    value={profileData.college}
                    onChange={(e) => setProfileData({ ...profileData, college: e.target.value })}
                    className="bg-navy border border-ocean/70 focus:border-gold rounded p-2.5 text-white text-base min-h-[44px] focus:outline-none"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-gradient-to-r from-baltic to-bronze text-white rounded font-heading text-xs font-bold uppercase tracking-widest min-h-[44px] hover:scale-[1.02] transform transition-transform"
                  >
                    Save Coordinates
                  </button>
                </div>
              </form>
            </div>

          </div>

          {/* RIGHT 1/3 COLUMN: Ship's Log (Notifications) */}
          <div className="space-y-6">
            <div className="bg-ocean/30 border border-gold/15 rounded-xl p-6 flex flex-col h-[500px]">
              
              <div className="flex items-center justify-between border-b border-ocean/50 pb-3 mb-4">
                <h2 className="font-heading text-base font-bold text-gold tracking-wider flex items-center gap-1.5">
                  <Bell className="w-4.5 h-4.5" /> Ship's Log
                </h2>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-[10px] text-seafoam hover:text-white underline font-semibold font-body"
                  >
                    Mark read ({unreadCount})
                  </button>
                )}
              </div>

              {/* Scrollable list area */}
              <div className="flex-1 overflow-y-auto divide-y divide-ocean/40 pr-1">
                {notifications.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-center text-white/50 text-xs font-body">
                    ⛵ Log is clear. No alerts.
                  </div>
                ) : (
                  notifications.map((notif) => {
                    return (
                      <div key={notif._id} className="py-3 flex items-start gap-2.5">
                        {/* Red indicator dot */}
                        <div className="h-2 w-2 rounded-full bg-red-500 mt-1.5 flex-shrink-0 animate-pulse" />
                        
                        <div className="space-y-1 text-left">
                          <h4 className="text-xs font-bold text-gold font-heading">{notif.title}</h4>
                          <p className="text-[11px] text-white/90 leading-relaxed font-body">{notif.message}</p>
                          <span className="text-[9px] text-seafoam/70 block font-body">
                            {formatDate(notif.createdAt)}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Dashboard;
