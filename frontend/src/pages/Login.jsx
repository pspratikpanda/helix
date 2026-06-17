import React, { useState } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { Compass, Ship, Lock, Mail, Anchor } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login, token, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    if (!email || !password) {
      toast.error('Please fill in all credentials!');
      return;
    }

    setIsSubmitting(true);
    const result = await login(email, password);
    setIsSubmitting(false);

    if (result && result.success) {
      toast.success('Welcome aboard, Navigator! Anchors away!');
      navigate('/dashboard');
    } else {
      toast.error(result?.message || 'Invalid credentials or connection issues.');
    }
  };

  // If already logged in, redirect to dashboard
  if (token && !authLoading) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="w-full min-h-screen bg-navy text-white flex items-center justify-center pt-28 pb-16 px-4 relative overflow-hidden font-body">
      
      {/* Decorative compass watermark */}
      <Compass className="w-96 h-96 text-gold/[0.02] absolute -left-20 -bottom-20 animate-spin-slow pointer-events-none select-none z-0" />
      
      <div className="w-full max-w-md bg-ocean border border-gold/30 rounded-2xl p-8 shadow-2xl relative z-10 mx-4">
        
        {/* Top visual accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-baltic via-gold to-baltic" />

        <div className="text-center mb-8 space-y-2">
          <div className="w-12 h-12 rounded-full bg-navy/60 border border-gold/30 mx-auto flex items-center justify-center text-gold mb-3">
            <Ship className="w-6 h-6" />
          </div>
          <h1 className="font-heading text-2xl md:text-3xl font-black text-gold tracking-widest uppercase">
            Board the Ship
          </h1>
          <p className="text-xs text-seafoam">
            Enter your coordinates to explore Captain's Quarters
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email field */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] uppercase font-semibold text-gold tracking-widest flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5" /> Email Coordinates
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="e.g. navigator@helix.com"
              className="w-full bg-navy border border-seafoam focus:border-gold rounded-lg px-4 py-3 text-white text-base min-h-[48px] focus:outline-none transition-colors"
              required
            />
          </div>

          {/* Password field */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] uppercase font-semibold text-gold tracking-widest flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" /> Security Key
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full bg-navy border border-seafoam focus:border-gold rounded-lg px-4 py-3 text-white text-base min-h-[48px] focus:outline-none transition-colors"
              required
            />
          </div>

          {/* Submit button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-baltic to-bronze text-white font-heading text-sm font-bold tracking-widest rounded-lg min-h-[48px] uppercase hover:shadow-lg hover:shadow-baltic/20 hover:scale-[1.02] transform transition-all duration-300 disabled:opacity-50"
            >
              <Anchor className={`w-4 h-4 ${isSubmitting ? 'animate-spin' : ''}`} />
              {isSubmitting ? 'Verifying coordinates...' : 'Board the Ship'}
            </button>
          </div>
        </form>

        {/* Footer Redirect link */}
        <div className="text-center mt-6 pt-4 border-t border-ocean/50">
          <p className="text-xs text-white/80">
            Don't have an account?{' '}
            <Link
              to="/signup"
              className="text-gold hover:text-white font-semibold underline underline-offset-4 tracking-wider transition-colors inline-flex items-center gap-1.5"
            >
              Set Sail <span className="text-sm font-bold">→</span>
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Login;
