import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Anchor, Compass, CheckCircle2, Copy, AlertTriangle, ArrowRight, Upload, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api/apiClient';
import RegistrationForm from '../components/RegistrationForm';

const Register = () => {
  const { token, user } = useAuth();
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Pass Status state
  const [passStatus, setPassStatus] = useState('NONE'); // NONE, PENDING, VERIFIED, REJECTED
  const [passRemark, setPassRemark] = useState('');
  const [passData, setPassData] = useState(null);
  
  // Event success state
  const [eventSuccessData, setEventSuccessData] = useState(null);
  
  // Form states for pass application
  const [utr, setUtr] = useState('');
  const [screenshotFile, setScreenshotFile] = useState(null);
  const [screenshotPreview, setScreenshotPreview] = useState(null);

  // Fetch Delegate Pass Status
  const fetchPassStatus = async () => {
    if (token) {
      try {
        const res = await apiClient.get('/delegate-pass/status');
        if (res.data && res.data.success && res.data.data) {
          setPassStatus(res.data.data.paymentStatus);
          setPassRemark(res.data.data.adminRemark || '');
          setPassData(res.data.data);
          setUtr(res.data.data.utr || '');
        } else {
          setPassStatus('NONE');
        }
      } catch (err) {
        console.error('Failed to fetch pass status:', err);
      }
    }
  };

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
    fetchPassStatus();
  }, [token]);

  // Handle screenshot file change & base64 conversion
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setScreenshotFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshotPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit Delegate Pass application
  const handlePassApplySubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      toast.error('Please login first to apply!');
      navigate('/login');
      return;
    }

    if (!utr.trim()) {
      toast.error('Please enter the UTR number of the payment transaction.');
      return;
    }

    if (!screenshotFile) {
      toast.error('Please upload a screenshot of your payment receipt.');
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading('Submitting Delegate Pass application...');

    try {
      const payload = new FormData();
      payload.append('utr', utr.trim());
      payload.append('paymentScreenshot', screenshotFile);

      const res = await apiClient.post('/delegate-pass/apply', payload, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.data && res.data.success) {
        toast.success('Delegate Pass application submitted successfully!', { id: toastId });
        setPassStatus('PENDING');
        setPassData(res.data.data);
      }
    } catch (err) {
      console.error('Pass application failed:', err.message);
      toast.error(err.message || 'Submission failed. Please try again.', { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit event registrations (Free since Delegate Pass is verified)
  const handleEventRegistrationSubmit = async (formData) => {
    if (!token) {
      toast.error('Please login first!');
      navigate('/login');
      return;
    }
    setIsSubmitting(true);
    const toastId = toast.loading('Registering you for events...');

    try {
      const res = await apiClient.post('/register', {
        eventsSelected: formData.eventsSelected,
      });

      if (res.data && res.data.success) {
        toast.success('Successfully registered for events!', { id: toastId });
        const registered = res.data.data;
        
        setTimeout(() => {
          if (registered && registered.length > 0) {
            window.location.href = `/events/${registered[0].slug}`;
          } else {
            window.location.href = '/events';
          }
        }, 1500);
      }
    } catch (err) {
      console.error('Event registration failed:', err.message);
      toast.error(err.message || 'Failed to register for events.', { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Registration ID copied to clipboard!');
  };

  // Loading indicator
  if (loadingEvents) {
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
      
      <Compass className="w-96 h-96 text-gold/[0.02] absolute -right-24 -top-24 animate-spin-slow pointer-events-none select-none z-0" />
      
      <div className="max-w-4xl w-full relative z-10">
        
        {eventSuccessData ? (
          // ============================================================
          // SUCCESS SCREEN: Events confirmed
          // ============================================================
          <div className="bg-ocean border-2 border-gold rounded-2xl p-8 md:p-12 text-center space-y-6 shadow-2xl relative overflow-hidden">
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-4" />
            <div className="w-16 h-16 rounded-full bg-mint/20 border-2 border-mint mx-auto flex items-center justify-center text-mint animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h1 className="font-heading text-2xl md:text-4xl font-black text-gold tracking-wider uppercase">
                Voyages Registered!
              </h1>
              <p className="text-xs md:text-sm text-seafoam font-body">
                You have successfully confirmed registrations for the following events.
              </p>
            </div>

            <div className="bg-navy/60 border border-gold/30 rounded-xl p-6 max-w-md mx-auto space-y-2.5">
              <span className="text-[10px] uppercase text-gold font-semibold tracking-widest block border-b border-gold/20 pb-1">
                Your Registered Events
              </span>
              <div className="space-y-1.5 text-left text-xs max-h-40 overflow-y-auto">
                {eventSuccessData.map((evt) => (
                  <div key={evt._id} className="flex justify-between items-center bg-navy/40 px-3 py-2 rounded">
                    <span className="font-semibold text-white">{evt.title}</span>
                    <span className="text-gold font-body uppercase text-[9px] tracking-wider">{evt.category}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/dashboard"
                className="flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-baltic to-bronze text-white font-heading text-xs font-bold tracking-widest rounded-lg min-h-[48px] uppercase hover:scale-105 transition-all shadow-md"
              >
                Go to Dashboard <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/events"
                className="flex items-center justify-center gap-2 px-8 py-3 bg-navy border border-gold/40 text-gold hover:text-white rounded-lg font-heading text-xs font-bold tracking-widest rounded-lg min-h-[48px] uppercase hover:bg-ocean/20 transition-all"
              >
                <Compass className="w-4 h-4" /> View More Events
              </Link>
            </div>
          </div>
        ) : passStatus === 'PENDING' ? (
          // ============================================================
          // PENDING VERIFICATION SCREEN
          // ============================================================
          <div className="bg-ocean/90 border border-gold/30 rounded-2xl p-8 md:p-12 text-center space-y-6 shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-gold/15 border-2 border-gold/50 mx-auto flex items-center justify-center text-gold animate-pulse">
              <Clock className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h1 className="font-heading text-xl md:text-3xl font-black text-gold tracking-widest uppercase">
                Verification Pending
              </h1>
              <p className="text-xs md:text-sm text-seafoam font-body">
                Your Delegate Pass application has been received and is in queue.
              </p>
            </div>

            <div className="bg-navy/50 border border-gold/20 rounded-xl p-5 max-w-md mx-auto text-xs space-y-3 leading-relaxed text-white/90">
              <p>
                Our captains are reviewing your transaction details. The submitted UTR code is:
              </p>
              <div className="bg-navy border border-gold/30 font-mono text-gold px-3 py-1.5 rounded inline-block text-sm tracking-wider font-extrabold">
                {utr || (passData && passData.utr) || 'N/A'}
              </div>
              <p className="text-[10px] text-seafoam/80">
                Once approved, you will get a sequential Delegate Pass ID and will be allowed to register for all fest events for free!
              </p>
            </div>

            <div className="pt-4">
              <Link
                to="/dashboard"
                className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-baltic to-bronze text-white font-heading text-xs font-bold tracking-widest rounded-lg min-h-[48px] uppercase hover:scale-105 transition-all shadow-md"
              >
                Go to Captain's Quarters (Dashboard) <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : passStatus === 'VERIFIED' ? (
          // ============================================================
          // VERIFIED SCREEN: Event Checklist
          // ============================================================
          <div
            className="bg-ocean/90 border-2 border-bronze/50 rounded-2xl p-6 md:p-10 shadow-2xl relative overflow-hidden"
            style={{
              backgroundImage: 'linear-gradient(rgba(22, 39, 63, 0.4), rgba(22, 39, 63, 0.4))',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
            }}
          >
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-gold via-bronze to-gold" />

            <div className="text-center mb-8 space-y-2">
              <h1 className="font-heading text-2xl md:text-4xl font-black text-gold tracking-widest uppercase flex items-center justify-center gap-2.5">
                <Anchor className="w-7 h-7 text-gold animate-bounce" /> Register for Events
              </h1>
              <p className="text-xs md:text-sm text-seafoam font-body uppercase tracking-wider font-semibold">
                Select your events below (covered by verified Delegate Pass)
              </p>
              <div className="w-16 h-[1px] bg-gold/40 mx-auto mt-2" />
            </div>

            <RegistrationForm
              events={events}
              onSubmit={handleEventRegistrationSubmit}
              isSubmitting={isSubmitting}
            />
          </div>
        ) : (
          // ============================================================
          // APPLICATION FORM SCREEN: NONE or REJECTED
          // ============================================================
          <div
            className="bg-ocean/90 border-2 border-bronze/50 rounded-2xl p-6 md:p-10 shadow-2xl relative overflow-hidden space-y-6"
            style={{
              backgroundImage: 'linear-gradient(rgba(22, 39, 63, 0.4), rgba(22, 39, 63, 0.4))',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
            }}
          >
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-gold via-bronze to-gold" />

            <div className="text-center mb-4 space-y-2">
              <h1 className="font-heading text-2xl md:text-4xl font-black text-gold tracking-widest uppercase flex items-center justify-center gap-2.5">
                <Anchor className="w-7 h-7 text-gold animate-bounce" /> Purchase Delegate Pass
              </h1>
              <p className="text-xs md:text-sm text-seafoam font-body uppercase tracking-wider font-semibold">
                Upload payment proof to request your pass
              </p>
              <div className="w-16 h-[1px] bg-gold/40 mx-auto mt-2" />
            </div>

            {passStatus === 'REJECTED' && (
              // Rejection alert
              <div className="bg-red-950/20 border border-red-500/50 rounded-xl p-4 flex gap-3 text-xs leading-relaxed text-red-200">
                <AlertTriangle className="w-5 h-5 flex-shrink-0 text-red-400" />
                <div>
                  <h4 className="font-heading font-bold text-red-400 uppercase tracking-wider text-[10px] mb-1">
                    Application Rejected By Admin
                  </h4>
                  <p className="mb-2">
                    Remark: <strong className="italic text-white">"{passRemark || 'Details verification failed.'}"</strong>
                  </p>
                  <p className="text-[10px] text-seafoam/80">
                    Please correct your payment screenshot or transaction UTR reference and submit again for verification.
                  </p>
                </div>
              </div>
            )}

            {/* UPI QR & Bank details card */}
            <div className="bg-navy/80 border border-gold/30 rounded-xl p-5 space-y-4 shadow-inner">
              <h3 className="font-heading text-xs font-bold text-gold uppercase tracking-wider">
                College Payment Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs font-body">
                <div className="space-y-2.5">
                  <p><strong className="text-seafoam uppercase text-[10px] tracking-wide block">Account Name</strong> HELIX 2026 AIIMS Deoghar</p>
                  <p><strong className="text-seafoam uppercase text-[10px] tracking-wide block">Bank Details</strong> State Bank of India</p>
                  <p><strong className="text-seafoam uppercase text-[10px] tracking-wide block">Account Number</strong> 12345678901</p>
                  <p><strong className="text-seafoam uppercase text-[10px] tracking-wide block">IFSC Code</strong> SBIN0001234</p>
                  <p><strong className="text-seafoam uppercase text-[10px] tracking-wide block">UPI ID</strong> helix2026@sbi</p>
                  <div className="bg-gold/10 border border-gold/30 rounded p-2.5 text-[11px] text-gold font-semibold uppercase tracking-wider text-center mt-2.5">
                    Price: Flat ₹500 for Delegate Pass
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center bg-white p-3 rounded-xl w-36 h-36 mx-auto border border-gold/20 shadow-lg">
                  <div className="text-navy text-[9px] font-black uppercase tracking-widest text-center mb-1">UPI QR CODE</div>
                  <svg className="w-24 h-24 text-navy" viewBox="0 0 100 100">
                    <rect x="0" y="0" width="100" height="100" fill="none" stroke="currentColor" strokeWidth="4" />
                    <rect x="10" y="10" width="20" height="20" fill="currentColor" />
                    <rect x="70" y="10" width="20" height="20" fill="currentColor" />
                    <rect x="10" y="70" width="20" height="20" fill="currentColor" />
                    <rect x="40" y="40" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="4" />
                    <rect x="48" y="48" width="4" height="4" fill="currentColor" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Submission Form */}
            <form onSubmit={handlePassApplySubmit} className="space-y-5 text-xs font-body">
              
              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase font-semibold text-gold tracking-widest">
                  Transaction UTR Number
                </label>
                <input
                  type="text"
                  value={utr}
                  onChange={(e) => setUtr(e.target.value)}
                  placeholder="Enter 12-digit UPI reference UTR number"
                  className="w-full bg-navy border border-gold/30 focus:border-gold rounded-lg px-4 py-3 text-white text-base min-h-[48px] focus:outline-none transition-colors"
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase font-semibold text-gold tracking-widest">
                  Upload Payment Screenshot
                </label>
                <div className="flex flex-col md:flex-row items-center gap-4">
                  <label className="flex flex-col items-center justify-center border-2 border-dashed border-gold/30 hover:border-gold rounded-xl cursor-pointer p-4 w-full md:w-1/2 min-h-[120px] transition-colors bg-navy/40">
                    <Upload className="w-6 h-6 text-gold mb-2" />
                    <span className="text-seafoam font-semibold text-center block">Choose payment receipt file</span>
                    <span className="text-[10px] text-white/50 block mt-1">PNG, JPG or JPEG</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      required={passStatus !== 'REJECTED'}
                    />
                  </label>
                  
                  {screenshotPreview && (
                    <div className="border border-gold/30 rounded-xl overflow-hidden max-h-[140px] max-w-[200px] shadow-lg flex items-center justify-center bg-black/40">
                      <img
                        src={screenshotPreview}
                        alt="Screenshot receipt preview"
                        className="max-h-[140px] object-contain"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center justify-center gap-2 w-full md:w-auto md:px-10 py-3 bg-gradient-to-r from-baltic to-bronze text-white rounded-lg font-heading text-sm font-bold tracking-widest min-h-[48px] uppercase hover:shadow-lg hover:shadow-baltic/20 hover:scale-[1.02] transform transition-all duration-300 disabled:opacity-50"
                >
                  <Anchor className={`w-4 h-4 ${isSubmitting ? 'animate-spin' : ''}`} />
                  {isSubmitting ? 'Processing...' : 'Purchase Delegate Pass'}
                </button>
              </div>

            </form>
          </div>
        )}

      </div>
    </div>
  );
};

export default Register;
