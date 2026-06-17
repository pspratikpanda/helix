import React, { useState, useRef, useEffect } from 'react';
import { Bell, Anchor, X } from 'lucide-react';
import { useNotificationsContext } from '../context/NotificationContext';
import NotificationItem from './NotificationItem';

const NotificationBell = () => {
  const { notifications, unreadCount, markAllRead } = useNotificationsContext();
  const [isOpen, setIsOpen] = useState(false);
  const bellRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (bellRef.current && !bellRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = () => {
    const nextState = !isOpen;
    setIsOpen(nextState);
    if (nextState) {
      markAllRead();
    }
  };

  return (
    <div className="relative" ref={bellRef}>
      {/* Nautical Styled Bell Button */}
      <button
        onClick={handleToggle}
        className="relative flex items-center justify-center w-10 h-10 rounded-full bg-ocean/30 hover:bg-ocean/60 border border-gold/30 hover:border-gold/60 text-gold hover:text-white transition-all duration-300 focus:outline-none"
        title="Ship's Log Notifications"
      >
        <Bell className="w-5 h-5 animate-pulse" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 border border-navy text-[10px] font-bold text-white shadow-lg animate-bounce">
            {unreadCount}
          </span>
        )}
      </button>

      {/* --- DESKTOP VIEWPORT DROPDOWN PANEL --- */}
      {isOpen && (
        <div className="hidden md:block absolute right-0 mt-3 w-80 bg-navy border border-gold/40 rounded-xl shadow-2xl z-50 overflow-hidden transform origin-top-right transition-all duration-200">
          {/* Header */}
          <div className="px-4 py-3 bg-ocean/60 border-b border-gold/30 flex items-center justify-between">
            <h3 className="font-heading text-sm font-bold text-gold tracking-wider flex items-center gap-1.5">
              <Anchor className="w-4 h-4" /> Ship's Logbook
            </h3>
            <span className="text-[10px] font-body text-seafoam">
              {notifications.length} entries
            </span>
          </div>

          {/* List area */}
          <div className="max-h-96 overflow-y-auto divide-y divide-ocean/50">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-xs text-white/50 font-body">
                ⛵ No announcements in the logbook.
              </div>
            ) : (
              notifications.map((notif) => (
                <NotificationItem key={notif._id} notification={notif} />
              ))
            )}
          </div>
        </div>
      )}

      {/* --- MOBILE VIEWPORT BOTTOM SHEET OVERLAY --- */}
      {isOpen && (
        <>
          {/* Dark Dim backdrop background */}
          <div
            className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Fixed bottom sheet sliding panel */}
          <div className="md:hidden fixed bottom-0 left-0 right-0 max-h-[60vh] bg-navy border-t-2 border-gold rounded-t-2xl z-50 flex flex-col shadow-2xl transition-transform duration-300 transform translate-y-0">
            {/* Grab handle/Header */}
            <div className="px-4 py-4 bg-ocean/70 border-b border-gold/30 rounded-t-2xl flex items-center justify-between">
              <h3 className="font-heading text-sm font-bold text-gold tracking-widest flex items-center gap-1.5">
                <Anchor className="w-4.5 h-4.5 text-gold animate-spin-slow" /> Ship's Logbook
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-navy/50 text-gold hover:text-white border border-gold/20"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* List scrollable section */}
            <div className="overflow-y-auto flex-1 pb-6 divide-y divide-ocean/50">
              {notifications.length === 0 ? (
                <div className="p-10 text-center text-xs text-white/50">
                  ⛵ No announcements in the logbook.
                </div>
              ) : (
                notifications.map((notif) => (
                  <NotificationItem key={notif._id} notification={notif} />
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationBell;
