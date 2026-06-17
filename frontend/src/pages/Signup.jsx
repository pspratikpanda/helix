import React, { useState } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { Compass, Ship, Lock, Mail, Anchor, User, Phone, Book } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
  const { signup, token, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    college: '',
    password: '',
    confirmPassword: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, phone, college, password, confirmPassword } = formData;

    if (!name || !email || !phone || !college || !password || !confirmPassword) {
      toast.error('Please complete all credential fields!');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Security key confirmation does not match!');
      return;
    }

    setIsSubmitting(true);
    const result = await signup({ name, email, phone, college, password });
    setIsSubmitting(false);

    if (result && result.success) {
      toast.success('Voyage initiated! Welcome onboard!');
      navigate('/dashboard');
    } else {
      toast.error(result?.message || 'Failed to start voyage credentials.');
    }
  };

  if (token && !authLoading) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="w-full min-h-screen bg-navy text-white flex items-center justify-center pt-28 pb-16 px-4 relative overflow-hidden font-body">
      
      {/* Background decoration */}
      <Compass className="w-96 h-96 text-gold/[0.02] absolute -right-20 -bottom-20 animate-spin-slow pointer-events-none select-none z-0" />
      
      <div className="w-full max-w-lg bg-ocean border border-gold/30 rounded-2xl p-8 shadow-2xl relative z-10 mx-4">
        
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-baltic via-gold to-baltic" />

        <div className="text-center mb-6 space-y-1">
          <div className="w-12 h-12 rounded-full bg-navy/60 border border-gold/30 mx-auto flex items-center justify-center text-gold mb-3">
            <Compass className="w-6 h-6 animate-spin-slow" />
          </div>
          <h1 className="font-heading text-2xl md:text-3xl font-black text-gold tracking-widest uppercase">
            Join the Voyage
          </h1>
          <p className="text-xs text-seafoam">
            Create your account to register and save your coordinates
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Name & Email Group */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase font-semibold text-gold tracking-widest flex items-center gap-1">
                <User className="w-3 h-3" /> Navigator Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Jack Sparrow"
                className="w-full bg-navy border border-seafoam focus:border-gold rounded-lg px-4 py-2.5 text-white text-base min-h-[48px] focus:outline-none transition-colors"
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase font-semibold text-gold tracking-widest flex items-center gap-1">
                <Mail className="w-3 h-3" /> Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="jack@blackpearl.com"
                className="w-full bg-navy border border-seafoam focus:border-gold rounded-lg px-4 py-2.5 text-white text-base min-h-[48px] focus:outline-none transition-colors"
                required
              />
            </div>
          </div>

          {/* College & Phone Group */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase font-semibold text-gold tracking-widest flex items-center gap-1">
                <Book className="w-3 h-3" /> College/Academy
              </label>
              <input
                type="text"
                name="college"
                value={formData.college}
                onChange={handleChange}
                placeholder="AIIMS Deoghar"
                className="w-full bg-navy border border-seafoam focus:border-gold rounded-lg px-4 py-2.5 text-white text-base min-h-[48px] focus:outline-none transition-colors"
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase font-semibold text-gold tracking-widest flex items-center gap-1">
                <Phone className="w-3 h-3" /> Contact Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 98765 43210"
                className="w-full bg-navy border border-seafoam focus:border-gold rounded-lg px-4 py-2.5 text-white text-base min-h-[48px] focus:outline-none transition-colors"
                required
              />
            </div>
          </div>

          {/* Passwords Group */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase font-semibold text-gold tracking-widest flex items-center gap-1">
                <Lock className="w-3 h-3" /> Security Key
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full bg-navy border border-seafoam focus:border-gold rounded-lg px-4 py-2.5 text-white text-base min-h-[48px] focus:outline-none transition-colors"
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase font-semibold text-gold tracking-widest flex items-center gap-1">
                <Lock className="w-3 h-3" /> Confirm Key
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full bg-navy border border-seafoam focus:border-gold rounded-lg px-4 py-2.5 text-white text-base min-h-[48px] focus:outline-none transition-colors"
                required
              />
            </div>
          </div>

          {/* Submit button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-baltic to-bronze text-white font-heading text-sm font-bold tracking-widest rounded-lg min-h-[48px] uppercase hover:shadow-lg hover:shadow-baltic/20 hover:scale-[1.02] transform transition-all duration-300 disabled:opacity-50"
            >
              <Anchor className={`w-4 h-4 ${isSubmitting ? 'animate-spin' : ''}`} />
              {isSubmitting ? 'Creating Log Credentials...' : 'Join the Voyage'}
            </button>
          </div>
        </form>

        <div className="text-center mt-6 pt-4 border-t border-ocean/50">
          <p className="text-xs text-white/80">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-gold hover:text-white font-semibold underline underline-offset-4 tracking-wider transition-colors inline-flex items-center gap-1.5"
            >
              Board the Ship <span className="text-sm font-bold">→</span>
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Signup;
