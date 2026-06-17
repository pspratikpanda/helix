import React, { useState, useEffect } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { Anchor, Compass, CheckCircle2, Copy, ShieldAlert, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api/apiClient';
import RegistrationForm from '../components/RegistrationForm';

const Register = () => {
  const { token, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successData, setSuccessData] = useState(null);

  // Fetch all events for checklist selection
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await apiClient.get('/events');
        if (res.data && res.data.success) {
          setEvents(res.data.data);
        }
      } catch (err) {
        console.error('Failed to catalog manifest events:', err.message);
        toast.error('Stormy weather disrupted event catalogs.');
      } finally {
        setLoadingEvents(false);
      }
    };

    fetchEvents();
  }, [token]);

  // Handle registration manifest submission
  const handleRegisterSubmit = async (formData) => {
    if (!token) {
      toast.error('Please board the ship (login) first to register!');
      navigate('/login');
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await apiClient.post('/register', formData);
      if (res.data && res.data.success) {
        setSuccessData(res.data.data);
        toast.success('Voyage registered successfully on the ship manifest!');
      }
    } catch (err) {
      console.error('Registration failed:', err.message);
      toast.error(err.message || 'Stormy waves blocked registration. Please retry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Registration ID copied to ship logs!');
  };

  // Redirect to login if user is unauthenticated
  if (authLoading) {
    return (
      <div className="min-h-screen bg-navy flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 font-heading text-gold tracking-widest animate-pulse">
          Checking ship charts...
        </p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-navy text-white pt-28 pb-16 font-body flex flex-col items-center px-4 relative overflow-hidden">
      
      {/* Decorative compass watermark in background */}
      <Compass className="w-96 h-96 text-gold/[0.02] absolute -right-24 -top-24 animate-spin-slow pointer-events-none select-none z-0" />
      
      <div className="max-w-4xl w-full relative z-10">
        
        {successData ? (
          // ============================================================
          // SUCCESS SCREEN: Displays HLX-XXXX ID & Congrats message
          // ============================================================
          <div
            className="bg-ocean border-2 border-gold rounded-2xl p-8 md:p-12 text-center space-y-6 shadow-2xl relative overflow-hidden"
            style={{ boxShadow: '0 0 30px rgba(231, 192, 125, 0.15)' }}
          >
            {/* Small top rope effect */}
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-4" />

            <div className="w-16 h-16 rounded-full bg-mint/20 border-2 border-mint mx-auto flex items-center justify-center text-mint animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h1 className="font-heading text-2xl md:text-4xl font-black text-gold tracking-wider uppercase">
                Welcome Aboard!
              </h1>
              <p className="text-xs md:text-sm text-seafoam font-body">
                Your credentials have been securely logged in the Ship's Manifest.
              </p>
            </div>

            {/* Generated Registration ID Container */}
            <div className="bg-navy/60 border border-gold/30 rounded-xl p-6 max-w-sm mx-auto space-y-2 flex flex-col items-center justify-center">
              <span className="text-[10px] uppercase text-seafoam font-semibold tracking-widest">
                Manifest Registration ID
              </span>
              <div className="flex items-center gap-3">
                <span className="font-heading text-2xl md:text-3xl font-black text-gold tracking-widest">
                  {successData.registrationId}
                </span>
                <button
                  onClick={() => copyToClipboard(successData.registrationId)}
                  className="w-8 h-8 rounded bg-ocean/50 hover:bg-ocean text-gold hover:text-white flex items-center justify-center border border-gold/20 transition-all focus:outline-none"
                  title="Copy ID"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>

            <p className="text-xs text-white/70 max-w-md mx-auto leading-relaxed">
              We have dispatched this log entries to your account dashboards. Please show this Registration ID at the AIIMS Deoghar welcome ports upon arrival on **September 12, 2026**.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/dashboard"
                className="flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-baltic to-bronze text-white font-heading text-xs font-bold tracking-widest rounded-lg min-h-[48px] uppercase hover:scale-105 transition-all shadow-md"
              >
                Captain's Quarters <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/events"
                className="flex items-center justify-center gap-2 px-8 py-3 bg-navy border border-gold/40 text-gold hover:text-white rounded-lg font-heading text-xs font-bold tracking-widest rounded-lg min-h-[48px] uppercase hover:bg-ocean/20 transition-all"
              >
                <Compass className="w-4 h-4" /> View More Voyages
              </Link>
            </div>

          </div>
        ) : (
          // ============================================================
          // FORM SCREEN: Manifest scroll layout
          // ============================================================
          <div
            className="bg-ocean/90 border-2 border-bronze/50 rounded-2xl p-6 md:p-10 shadow-2xl relative overflow-hidden"
            style={{
              backgroundImage: 'linear-gradient(rgba(22, 39, 63, 0.4), rgba(22, 39, 63, 0.4))',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
            }}
          >
            {/* Top rope-border CSS styled effect */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-gold via-bronze to-gold" />

            <div className="text-center mb-8 space-y-2">
              <h1 className="font-heading text-2xl md:text-4xl font-black text-gold tracking-widest uppercase flex items-center justify-center gap-2.5">
                <Anchor className="w-7 h-7 text-gold animate-bounce" /> The Ship's Manifest
              </h1>
              <p className="text-xs md:text-sm text-seafoam font-body uppercase tracking-wider font-semibold">
                Declare your credentials & secure your voyage slots
              </p>
              <div className="w-16 h-[1px] bg-gold/40 mx-auto mt-2" />
            </div>

            {loadingEvents ? (
              <div className="py-24 text-center space-y-4">
                <div className="w-10 h-10 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="font-heading text-xs text-gold tracking-widest">
                  Loading available voyages...
                </p>
              </div>
            ) : (
              <RegistrationForm
                events={events}
                onSubmit={handleRegisterSubmit}
                isSubmitting={isSubmitting}
              />
            )}

          </div>
        )}

      </div>
    </div>
  );
};

export default Register;
