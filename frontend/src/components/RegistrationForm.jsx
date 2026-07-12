import React, { useState, useEffect } from 'react';
import { Anchor, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const RegistrationForm = ({ events = [], onSubmit, isSubmitting = false }) => {
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    college: user?.college || '',
    city: user?.city || '',
    eventsSelected: [],
  });

  // Keep state updated if user context loads later
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: prev.name || user.name || '',
        email: prev.email || user.email || '',
        phone: prev.phone || user.phone || '',
        college: prev.college || user.college || '',
        city: prev.city || user.city || '',
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (eventId) => {
    const isAlreadySelected = formData.eventsSelected.includes(eventId);
    if (isAlreadySelected) {
      setFormData({
        ...formData,
        eventsSelected: formData.eventsSelected.filter((id) => id !== eventId),
      });
    } else {
      setFormData({
        ...formData,
        eventsSelected: [...formData.eventsSelected, eventId],
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, email, phone, college, city, eventsSelected } = formData;

    if (!name || !email || !phone || !college || !city) {
      toast.error('Please complete all manifest fields!');
      return;
    }

    if (eventsSelected.length === 0) {
      toast.error('You must choose at least one event to register!');
      return;
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 font-body">
      
      {/* Name and Phone Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-xs uppercase font-semibold text-gold tracking-widest">
            Full Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. John Doe"
            className="w-full bg-navy border border-gold/30 focus:border-gold rounded-lg px-4 py-3 text-white text-base min-h-[48px] focus:outline-none transition-colors"
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-xs uppercase font-semibold text-gold tracking-widest">
            Phone Number
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="e.g. +91 98765 43210"
            className="w-full bg-navy border border-gold/30 focus:border-gold rounded-lg px-4 py-3 text-white text-base min-h-[48px] focus:outline-none transition-colors"
            required
          />
        </div>
      </div>

      {/* Email and College Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-xs uppercase font-semibold text-gold tracking-widest">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="e.g. john@example.com"
            className="w-full bg-navy border border-gold/30 focus:border-gold rounded-lg px-4 py-3 text-white text-base min-h-[48px] focus:outline-none transition-colors"
            required
            disabled
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-xs uppercase font-semibold text-gold tracking-widest">
            College / University
          </label>
          <input
            type="text"
            name="college"
            value={formData.college}
            onChange={handleChange}
            placeholder="e.g. AIIMS Deoghar"
            className="w-full bg-navy border border-gold/30 focus:border-gold rounded-lg px-4 py-3 text-white text-base min-h-[48px] focus:outline-none transition-colors"
            required
          />
        </div>
      </div>

      {/* City (Full Width) */}
      <div className="flex flex-col gap-2">
        <label className="text-xs uppercase font-semibold text-gold tracking-widest">
          City
        </label>
        <input
          type="text"
          name="city"
          value={formData.city}
          onChange={handleChange}
          placeholder="e.g. Deoghar"
          className="w-full bg-navy border border-gold/30 focus:border-gold rounded-lg px-4 py-3 text-white text-base min-h-[48px] focus:outline-none transition-colors"
          required
        />
      </div>

      {/* Events Selection (Grid Layout with Big Tap Targets) */}
      <div className="flex flex-col gap-3">
        <label className="text-xs uppercase font-semibold text-gold tracking-widest block">
          Select Your Events
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {events.map((event) => {
            const isChecked = formData.eventsSelected.includes(event._id);
            return (
              <div
                key={event._id}
                onClick={() => handleCheckboxChange(event._id)}
                className={`flex items-start gap-3 p-4 border rounded-xl cursor-pointer select-none transition-all duration-300 min-h-[60px] ${
                  isChecked
                    ? 'bg-baltic/25 border-gold text-white shadow-md shadow-baltic/10'
                    : 'bg-navy border-gold/20 hover:border-gold/50 text-white/80'
                }`}
              >
                <div className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 transition-colors ${
                  isChecked ? 'bg-gold border-gold text-navy' : 'border-gold/40'
                }`}>
                  {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between items-start gap-1">
                    <span className="text-sm font-semibold block">{event.title}</span>
                  </div>
                  <span className="text-[10px] text-seafoam font-body uppercase mt-0.5 block tracking-wider font-medium">
                    {event.category}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dynamic Price Summary Box */}
      <div className="bg-navy border border-gold/20 rounded-xl p-4 flex justify-between items-center font-heading text-sm">
        <span className="text-seafoam uppercase tracking-wider text-xs font-body">Event Fee Summary:</span>
        <span className="text-xl font-black text-gold">FREE (Covered by Delegate Pass)</span>
      </div>

      {/* Submit Button */}
      <div className="pt-4 flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center justify-center gap-2 w-full md:w-auto md:px-10 py-3 bg-gradient-to-r from-baltic to-bronze text-white rounded-lg font-heading text-sm font-bold tracking-widest min-h-[48px] uppercase hover:shadow-lg hover:shadow-baltic/20 hover:scale-[1.02] transform transition-all duration-300 disabled:opacity-50"
        >
          <Anchor className={`w-4 h-4 ${isSubmitting ? 'animate-spin' : ''}`} />
          {isSubmitting ? 'Confirming...' : 'Confirm Event Registrations'}
        </button>
      </div>

    </form>
  );
};

export default RegistrationForm;
