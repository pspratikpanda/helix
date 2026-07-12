import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Camera, Search, ArrowLeft, CheckCircle2, AlertOctagon, RefreshCw, Compass } from 'lucide-react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import apiClient from '../api/apiClient';
import toast from 'react-hot-toast';

const QRScanner = () => {
  const { token, user } = useAuth();
  const navigate = useNavigate();

  const [manualId, setManualId] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [checkInResult, setCheckInResult] = useState(null); // { success: bool, message: string, data: object, checkedInAt: string }
  const [scannerInstance, setScannerInstance] = useState(null);

  // Redirect if not logged in or not admin/volunteer
  useEffect(() => {
    if (!token) {
      toast.error('Please login first to access the check-in scanner.');
      navigate('/login');
    }
  }, [token]);

  // Initialize camera QR scanner
  useEffect(() => {
    if (checkInResult === null) {
      // Timeout delay to ensure container element is mounted
      const timer = setTimeout(() => {
        try {
          const scanner = new Html5QrcodeScanner(
            'qr-reader-container',
            {
              fps: 10,
              qrbox: { width: 250, height: 250 },
              aspectRatio: 1.0
            },
            /* verbose= */ false
          );

          scanner.render(
            async (decodedText) => {
              // On Scan Success: parsed token is decodedText
              scanner.clear().catch(err => console.warn('Failed to clear scanner on success:', err));
              handleVerifyCheckIn({ qrToken: decodedText });
            },
            (error) => {
              // Ignore scanning failures
            }
          );

          setScannerInstance(scanner);
        } catch (err) {
          console.error('Failed to initialize html5-qrcode scanner:', err);
        }
      }, 300);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [checkInResult]);

  // Clean scanner on component unmount
  useEffect(() => {
    return () => {
      if (scannerInstance) {
        scannerInstance.clear().catch(err => console.warn('Clean up clear error:', err));
      }
    };
  }, [scannerInstance]);

  // Send credentials to backend to verify check-in
  const handleVerifyCheckIn = async (payload) => {
    setIsVerifying(true);
    const toastId = toast.loading('Verifying check-in credentials...');
    
    try {
      const res = await apiClient.post('/api/admin/check-in', payload);
      if (res.data && res.data.success) {
        setCheckInResult({
          success: true,
          message: res.data.message,
          data: res.data.data
        });
        toast.success('Check-in successful!', { id: toastId });
      }
    } catch (err) {
      console.error('Check-in verification failed:', err);
      const errorMsg = err.response?.data?.message || 'Check-in failed.';
      setCheckInResult({
        success: false,
        message: errorMsg,
        checkedInAt: err.response?.data?.checkedInAt || null,
        registrationId: payload.registrationId || null
      });
      toast.error(errorMsg, { id: toastId });
    } finally {
      setIsVerifying(false);
    }
  };

  // Handle manual Registration ID submission
  const handleManualSearch = (e) => {
    e.preventDefault();
    if (!manualId.trim()) {
      toast.error('Please enter a Registration ID');
      return;
    }
    
    // Clear scanner instance before submitting manual query
    if (scannerInstance) {
      scannerInstance.clear().catch(err => console.warn('Clear scanner on manual search:', err));
      setScannerInstance(null);
    }

    handleVerifyCheckIn({ registrationId: manualId.trim() });
  };

  // Reset and restart scanner
  const handleResetScanner = () => {
    setCheckInResult(null);
    setManualId('');
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="w-full min-h-screen bg-navy text-white pt-28 pb-16 font-body flex flex-col items-center px-4 relative overflow-hidden">
      
      <Compass className="w-96 h-96 text-gold/[0.02] absolute -right-24 -top-24 animate-spin-slow pointer-events-none select-none z-0" />

      <div className="max-w-md w-full relative z-10 space-y-6">
        
        {/* Back Link */}
        <div className="flex justify-start">
          <Link
            to="/dashboard"
            className="flex items-center gap-1.5 text-xs text-gold hover:text-white transition-colors uppercase font-bold tracking-wider"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
        </div>

        <div className="bg-ocean/90 border border-gold/20 rounded-2xl p-6 shadow-2xl space-y-6">
          <div className="text-center space-y-1">
            <h1 className="font-heading text-xl md:text-2xl font-black text-gold tracking-widest uppercase">
              HELIX Check-In Gate
            </h1>
            <p className="text-[10px] text-seafoam uppercase tracking-wider font-semibold">
              Scan Pass QR or Enter Registration ID
            </p>
          </div>

          {checkInResult ? (
            // ============================================================
            // RESULT SCREEN: Success or Error Display Cards
            // ============================================================
            <div className="space-y-6 text-center">
              {checkInResult.success ? (
                // Success card
                <div className="space-y-4">
                  <div className="w-16 h-16 rounded-full bg-mint/20 border-2 border-mint mx-auto flex items-center justify-center text-mint animate-bounce">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-lg font-bold text-mint font-heading uppercase tracking-wide">
                    Check-In Successful!
                  </h3>
                  <div className="bg-navy/70 border border-mint/20 rounded-xl p-5 text-left text-xs space-y-2 leading-relaxed">
                    <p><strong className="text-gold">Participant:</strong> {checkInResult.data?.name}</p>
                    <p><strong className="text-gold">College:</strong> {checkInResult.data?.college}</p>
                    <p><strong className="text-gold">Registration ID:</strong> <span className="font-mono font-bold text-sm text-gold">{checkInResult.data?.registrationId}</span></p>
                    <p><strong className="text-gold">Check-In Time:</strong> {formatDate(checkInResult.data?.checkedInAt)}</p>
                  </div>
                </div>
              ) : (
                // Error card
                <div className="space-y-4">
                  <div className="w-16 h-16 rounded-full bg-rose-500/10 border-2 border-rose-500 mx-auto flex items-center justify-center text-rose-400 animate-pulse">
                    <AlertOctagon className="w-10 h-10" />
                  </div>
                  <h3 className="text-lg font-bold text-rose-400 font-heading uppercase tracking-wide">
                    Check-In Failed
                  </h3>
                  <p className="text-xs text-rose-200">{checkInResult.message}</p>
                  
                  {checkInResult.checkedInAt && (
                    <div className="bg-navy/70 border border-rose-500/20 rounded-xl p-5 text-left text-xs space-y-2 leading-relaxed">
                      <p className="text-rose-300">This participant has already checked in at:</p>
                      <p className="font-mono text-gold text-sm tracking-wider font-bold">
                        {formatDate(checkInResult.checkedInAt)}
                      </p>
                    </div>
                  )}
                </div>
              )}

              <button
                onClick={handleResetScanner}
                className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-baltic to-bronze text-white rounded-lg font-heading text-xs font-bold uppercase tracking-widest min-h-[48px] hover:scale-[1.02] transform transition-transform"
              >
                <RefreshCw className="w-4 h-4" /> Scan Another Pass
              </button>
            </div>
          ) : (
            // ============================================================
            // SCANNING SCREEN: Camera scanner container & Manual Search
            // ============================================================
            <div className="space-y-6">
              
              {/* Camera Scanner container */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-gold tracking-widest block text-center">
                  Camera Feed
                </label>
                <div className="bg-navy border border-gold/15 rounded-2xl overflow-hidden relative shadow-inner">
                  <div id="qr-reader-container" className="w-full"></div>
                </div>
              </div>

              {/* Separation Divider */}
              <div className="flex items-center justify-center gap-3 text-white/30 text-[10px] font-bold uppercase tracking-widest font-heading">
                <div className="h-[1px] bg-white/10 flex-1" />
                <span>Or Manual Search</span>
                <div className="h-[1px] bg-white/10 flex-1" />
              </div>

              {/* Manual search input */}
              <form onSubmit={handleManualSearch} className="space-y-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] uppercase font-bold text-gold tracking-wider">
                    Registration ID
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        value={manualId}
                        onChange={(e) => setManualId(e.target.value)}
                        placeholder="e.g. FEST26-0001"
                        className="w-full bg-navy border border-gold/25 focus:border-gold rounded-lg px-4 py-2.5 pl-10 text-xs text-white placeholder-white/35 focus:outline-none transition-colors"
                      />
                      <Search className="w-4 h-4 text-white/35 absolute left-3 top-3.5" />
                    </div>
                    <button
                      type="submit"
                      disabled={isVerifying}
                      className="px-5 py-2.5 bg-gold hover:bg-gold/80 text-navy font-bold rounded-lg text-xs uppercase tracking-widest font-heading transition-colors flex items-center gap-1.5 disabled:opacity-50"
                    >
                      Verify
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};

export default QRScanner;
