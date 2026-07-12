import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Calendar, Anchor, DollarSign, Users, Image, MapPin, AlignLeft } from 'lucide-react';
import apiClient from '../api/apiClient';
import toast from 'react-hot-toast';

const toDatetimeLocal = (isoString) => {
  if (!isoString) return '';
  const d = new Date(isoString);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const EventModal = ({ isOpen, onClose, onSuccess, event = null }) => {
  const [formData, setFormData] = useState({
    title: '',
    category: 'cultural',
    description: '',
    date: '',
    venue: '',
    maxParticipants: '',
    posterImage: '',
    coordinators: [{ name: '', phone: '' }],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title || '',
        category: event.category || 'cultural',
        description: event.description || '',
        date: event.date ? toDatetimeLocal(event.date) : '',
        venue: event.venue || '',
        maxParticipants: event.maxParticipants || '',
        posterImage: event.posterImage || '',
        coordinators: event.coordinators && event.coordinators.length > 0
          ? event.coordinators.map((c) => ({ name: c.name || '', phone: c.phone || '' }))
          : [{ name: '', phone: '' }],
      });
    } else {
      setFormData({
        title: '',
        category: 'cultural',
        description: '',
        date: '',
        venue: '',
        maxParticipants: '',
        posterImage: '',
        coordinators: [{ name: '', phone: '' }],
      });
    }
  }, [event, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCoordinatorChange = (index, field, value) => {
    const updated = [...formData.coordinators];
    updated[index][field] = value;
    setFormData({ ...formData, coordinators: updated });
  };

  const addCoordinator = () => {
    setFormData({
      ...formData,
      coordinators: [...formData.coordinators, { name: '', phone: '' }],
    });
  };

  const removeCoordinator = (index) => {
    const updated = formData.coordinators.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      coordinators: updated.length > 0 ? updated : [{ name: '', phone: '' }],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error('Voyage title is required!');
      return;
    }

    setIsSubmitting(true);
    try {
      const filteredCoordinators = formData.coordinators.filter(
        (c) => c.name.trim() !== '' && c.phone.trim() !== ''
      );

      const payload = {
        ...formData,
        coordinators: filteredCoordinators,
        maxParticipants: formData.maxParticipants !== '' ? Number(formData.maxParticipants) : undefined,
      };

      let res;
      if (event && event._id) {
        res = await apiClient.put(`/events/${event._id}`, payload);
      } else {
        res = await apiClient.post('/events', payload);
      }

      if (res.data && res.data.success) {
        toast.success(event ? 'Voyage log updated successfully!' : 'New voyage logged successfully!');
        onSuccess();
        onClose();
      } else {
        toast.error(res.data.message || 'Failed to save voyage settings.');
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || err.message || 'Stormy waters blocked saving event.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-navy border border-gold/40 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col font-body text-white">
        
        {/* Top visual accent bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-baltic via-gold to-baltic" />

        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-ocean/55 bg-ocean/20">
          <h2 className="font-heading text-xl font-bold uppercase tracking-widest text-gold flex items-center gap-2">
            <Anchor className="w-5 h-5 text-gold animate-spin-slow" />
            {event ? 'Update Voyage Details' : 'Log New Voyage'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-seafoam hover:text-white hover:bg-ocean/40 transition-colors focus:outline-none"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Form Scroll Area */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          
          {/* Title and Category Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 flex flex-col gap-1.5">
              <label className="text-[10px] uppercase font-semibold text-gold tracking-wider flex items-center gap-1">
                Voyage Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Deep Sea Exploration"
                className="w-full bg-navy border border-seafoam focus:border-gold rounded-lg px-3 py-2.5 text-sm focus:outline-none transition-colors"
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase font-semibold text-gold tracking-wider">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full bg-navy border border-seafoam focus:border-gold rounded-lg px-3 py-2.5 text-sm focus:outline-none transition-colors"
              >
                <option value="cultural">Cultural</option>
                <option value="literary">Literary</option>
                <option value="sports">Sports</option>
                <option value="arts">Arts</option>
                <option value="medical">Medical</option>
                <option value="technical">Technical</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase font-semibold text-gold tracking-wider flex items-center gap-1">
              <AlignLeft className="w-3.5 h-3.5" /> Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              placeholder="Describe the rules, parameters and itinerary of the voyage..."
              className="w-full bg-navy border border-seafoam focus:border-gold rounded-lg px-3 py-2.5 text-sm focus:outline-none transition-colors"
            />
          </div>

          {/* Date and Venue Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase font-semibold text-gold tracking-wider flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> Launch Date & Time
              </label>
              <input
                type="datetime-local"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full bg-navy border border-seafoam focus:border-gold rounded-lg px-3 py-2.5 text-sm focus:outline-none transition-colors"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase font-semibold text-gold tracking-wider flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" /> Harbor coordinates (Venue)
              </label>
              <input
                type="text"
                name="venue"
                value={formData.venue}
                onChange={handleChange}
                placeholder="e.g. Captain's Deck / Hall A"
                className="w-full bg-navy border border-seafoam focus:border-gold rounded-lg px-3 py-2.5 text-sm focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase font-semibold text-gold tracking-wider flex items-center gap-1">
                <Users className="w-3.5 h-3.5" /> Max Crew Size
              </label>
              <input
                type="number"
                name="maxParticipants"
                value={formData.maxParticipants}
                onChange={handleChange}
                min="1"
                placeholder="Unlimited"
                className="w-full bg-navy border border-seafoam focus:border-gold rounded-lg px-3 py-2.5 text-sm focus:outline-none transition-colors"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase font-semibold text-gold tracking-wider flex items-center gap-1">
                <Image className="w-3.5 h-3.5" /> Poster Image URL
              </label>
              <input
                type="url"
                name="posterImage"
                value={formData.posterImage}
                onChange={handleChange}
                placeholder="https://..."
                className="w-full bg-navy border border-seafoam focus:border-gold rounded-lg px-3 py-2.5 text-sm focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Coordinators Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-ocean/45 pb-1">
              <span className="text-[10px] uppercase font-bold text-gold tracking-widest">
                Voyage Deck Officers (Coordinators)
              </span>
              <button
                type="button"
                onClick={addCoordinator}
                className="flex items-center gap-1 text-[10px] uppercase font-bold text-mint hover:text-white transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Add Officer
              </button>
            </div>

            <div className="space-y-3">
              {formData.coordinators.map((coordinator, index) => (
                <div key={index} className="flex items-center gap-3 bg-ocean/10 p-3 rounded-lg border border-ocean/30">
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={coordinator.name}
                      onChange={(e) => handleCoordinatorChange(index, 'name', e.target.value)}
                      placeholder="Officer Name"
                      className="bg-navy border border-seafoam/60 focus:border-gold rounded-lg px-3 py-2 text-xs focus:outline-none"
                    />
                    <input
                      type="text"
                      value={coordinator.phone}
                      onChange={(e) => handleCoordinatorChange(index, 'phone', e.target.value)}
                      placeholder="Officer Phone Number"
                      className="bg-navy border border-seafoam/60 focus:border-gold rounded-lg px-3 py-2 text-xs focus:outline-none"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeCoordinator(index)}
                    disabled={formData.coordinators.length === 1 && coordinator.name === '' && coordinator.phone === ''}
                    className="p-2 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors disabled:opacity-30 disabled:pointer-events-none"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-ocean/45 flex justify-end gap-3 bg-ocean/5 -mx-6 -mb-6 p-6">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 border border-ocean text-seafoam hover:text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-colors min-h-[44px]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-baltic to-bronze text-white font-bold rounded-lg text-xs font-heading uppercase tracking-wider hover:scale-[1.02] active:scale-[0.98] transition-all min-h-[44px]"
            >
              <Anchor className={`w-3.5 h-3.5 ${isSubmitting ? 'animate-spin' : ''}`} />
              {isSubmitting ? 'Saving coordinates...' : event ? 'Update Voyage' : 'Log Voyage'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

export default EventModal;
