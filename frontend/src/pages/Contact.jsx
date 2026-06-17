import React, { useState } from 'react';
import { Mail, Compass, Send, ShieldAlert, Anchor } from 'lucide-react';
import toast from 'react-hot-toast';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, email, message } = formData;

    if (!name || !email || !message) {
      toast.error('Manifest details incomplete! Your bottle cannot float.');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API delay
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success('Your Message in a Bottle has been cast to the currents! 🍾');
      setFormData({ name: '', email: '', message: '' });
    }, 1200);
  };

  return (
    <div className="w-full min-h-screen bg-navy text-white pt-28 pb-16 px-4 relative overflow-hidden font-body flex items-center justify-center">
      
      {/* Decorative compass watermark */}
      <Compass className="w-96 h-96 text-gold/[0.02] absolute -left-20 -bottom-20 animate-spin-slow pointer-events-none select-none z-0" />

      <div className="w-full max-w-lg bg-ocean border border-gold/30 rounded-2xl p-8 shadow-2xl relative z-10 mx-4">
        
        {/* Visual outline decoration */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-baltic via-gold to-baltic" />

        <div className="text-center mb-8 space-y-2">
          <div className="w-12 h-12 rounded-full bg-navy/60 border border-gold/30 mx-auto flex items-center justify-center text-gold mb-3">
            <Mail className="w-6 h-6" />
          </div>
          <h1 className="font-heading text-2xl md:text-3xl font-black text-gold tracking-widest uppercase">
            Message in a Bottle
          </h1>
          <p className="text-xs text-seafoam">
            Cast your thoughts or queries to the AIIMS Deoghar ports
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name field */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] uppercase font-semibold text-gold tracking-widest">
              Navigator Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Jack Sparrow"
              className="w-full bg-navy border border-seafoam focus:border-gold rounded-lg px-4 py-3 text-white text-base min-h-[48px] focus:outline-none transition-colors"
              required
            />
          </div>

          {/* Email field */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] uppercase font-semibold text-gold tracking-widest">
              Return Coordinates (Email)
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="e.g. jack@blackpearl.com"
              className="w-full bg-navy border border-seafoam focus:border-gold rounded-lg px-4 py-3 text-white text-base min-h-[48px] focus:outline-none transition-colors"
              required
            />
          </div>

          {/* Message field */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] uppercase font-semibold text-gold tracking-widest">
              Log Message Details
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Write your coordinates here..."
              rows="4"
              className="w-full bg-navy border border-seafoam focus:border-gold rounded-lg px-4 py-3 text-white text-base min-h-[100px] focus:outline-none transition-colors resize-none"
              required
            />
          </div>

          {/* Submit button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center justify-center gap-2 w-full md:w-auto md:px-10 py-3 bg-gradient-to-r from-baltic to-bronze text-white font-heading text-sm font-bold tracking-widest rounded-lg min-h-[48px] uppercase hover:shadow-lg hover:shadow-baltic/20 hover:scale-[1.02] transform transition-all duration-300 disabled:opacity-50"
            >
              <Send className={`w-4 h-4 ${isSubmitting ? 'animate-pulse' : ''}`} />
              {isSubmitting ? 'Casting Bottle...' : 'Cast Bottle'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

export default Contact;
