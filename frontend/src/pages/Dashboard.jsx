import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotificationsContext } from '../context/NotificationContext';
import { Compass, Ship, Anchor, Bell, User, Phone, MapPin, Calendar, CheckCircle, Clock, ShieldAlert, Award, FileText, ChevronRight, Check, X, AlertTriangle, Download, Search } from 'lucide-react';
import apiClient from '../api/apiClient';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useAuth();
  const { notifications, unreadCount, markAllRead } = useNotificationsContext();
  const navigate = useNavigate();
  
  // Student state
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [passData, setPassData] = useState(null);
  const [loadingPass, setLoadingPass] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);

  // Admin state
  const [delegatePasses, setDelegatePasses] = useState([]);
  const [loadingAdminPasses, setLoadingAdminPasses] = useState(true);
  const [adminFilter, setAdminFilter] = useState('PENDING'); // PENDING, ALL

  // Admin Check-In state
  const [checkInStats, setCheckInStats] = useState(null);
  const [loadingCheckInStats, setLoadingCheckInStats] = useState(true);
  const [checkInSearch, setCheckInSearch] = useState('');

  // Profile Stub
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    college: user?.college || '',
    phone: user?.phone || '',
  });

  // Fetch Student Pass details and Registered Events
  const fetchStudentDashboardData = async () => {
    if (user?.role !== 'admin') {
      try {
        // Fetch registered events
        const eventRes = await apiClient.get('/register/my');
        if (eventRes.data && eventRes.data.success) {
          setRegisteredEvents(eventRes.data.data);
        }
      } catch (err) {
        console.error('Failed to query registered events:', err);
      } finally {
        setLoadingEvents(false);
      }

      try {
        // Fetch Delegate Pass status
        const passRes = await apiClient.get('/delegate-pass/status');
        if (passRes.data && passRes.data.success && passRes.data.data) {
          setPassData(passRes.data.data);
        }
      } catch (err) {
        console.error('Failed to fetch pass status:', err);
      } finally {
        setLoadingPass(false);
      }
    }
  };

  // Fetch Admin list of delegate passes
  const fetchAdminDashboardData = async () => {
    if (user?.role === 'admin') {
      setLoadingAdminPasses(true);
      try {
        const res = await apiClient.get('/admin/delegate-passes');
        if (res.data && res.data.success) {
          setDelegatePasses(res.data.data);
        }
      } catch (err) {
        console.error('Failed to query delegate passes for verification:', err);
        toast.error('Stormy waters blocked loading verification requests.');
      } finally {
        setLoadingAdminPasses(false);
      }
    }
  };

  // Fetch Admin Check-In Statistics & Logs
  const fetchCheckInStats = async (search = '') => {
    if (user?.role === 'admin') {
      try {
        const res = await apiClient.get('/admin/check-in/stats', {
          params: { search },
        });
        if (res.data && res.data.success) {
          setCheckInStats(res.data.data);
        }
      } catch (err) {
        console.error('Failed to query check-in logs:', err);
      } finally {
        setLoadingCheckInStats(false);
      }
    }
  };

  useEffect(() => {
    fetchStudentDashboardData();
    fetchAdminDashboardData();
    fetchCheckInStats();
  }, [user]);

  // Handle student downloading Delegate Pass PDF
  const handleDownloadPass = async () => {
    if (isDownloading) return;
    setIsDownloading(true);
    const toastId = toast.loading('Generating and downloading your Delegate Pass PDF...');

    try {
      const response = await apiClient.get('/delegate-pass/download', {
        responseType: 'blob',
      });

      // Create browser link to download the blob
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `DelegatePass-${passData?.registrationId || 'helix'}.pdf`);
      document.body.appendChild(link);
      link.click();
      
      // Clean up DOM and memory
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('Delegate Pass PDF downloaded successfully!', { id: toastId });
    } catch (err) {
      console.error('Failed to download pass PDF:', err);
      toast.error('Failed to generate or download pass. Please contact support.', { id: toastId });
    } finally {
      setIsDownloading(false);
    }
  };

  // Admin verification action handler (Approve / Reject)
  const handleVerifyPass = async (passId, status) => {
    let adminRemark = '';
    if (status === 'REJECTED') {
      const remarkInput = prompt('Please enter the reason for rejection (this will be shown to the student):');
      if (remarkInput === null) return; // user cancelled prompt
      adminRemark = remarkInput.trim() || 'Payment screenshot or details verification failed';
    } else {
      const confirmApprove = window.confirm('Are you sure you want to approve this Delegate Pass? This will generate their FEST26 Registration ID.');
      if (!confirmApprove) return;
    }

    const toastId = toast.loading(`Processing verification for status ${status}...`);
    try {
      const res = await apiClient.post(`/admin/delegate-passes/${passId}/verify`, {
        status,
        adminRemark,
      });

      if (res.data && res.data.success) {
        toast.success(`Delegate Pass successfully ${status.toLowerCase()}ed!`, { id: toastId });
        fetchAdminDashboardData(); // Refresh pass list
        fetchCheckInStats(); // Refresh check-in stats
      }
    } catch (err) {
      console.error('Verification request failed:', err);
      toast.error(err.message || 'Failed to process verification request.', { id: toastId });
    }
  };

  // Check-In Search Form trigger
  const handleSearchCheckIn = (e) => {
    e.preventDefault();
    fetchCheckInStats(checkInSearch);
  };

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    toast.success("Navigator's log update request submitted! (Profile update TODO stub)");
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Date TBA';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  // Filtered passes for admin verification
  const filteredPasses = delegatePasses.filter(pass => {
    if (adminFilter === 'PENDING') {
      return pass.paymentStatus === 'PENDING';
    }
    return true; // ALL
  });

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
              Current Rank: {user?.role === 'admin' ? 'Fleet Admiral (Admin)' : 'Navigator (Student)'} • Port coordinates set
            </p>
          </div>
          
          {user?.role !== 'admin' && (
            <div className="flex items-center gap-3 bg-navy/60 px-4 py-2 border border-gold/30 rounded-xl">
              <Anchor className="w-5 h-5 text-gold animate-bounce" />
              <div className="text-left">
                <span className="text-[10px] text-seafoam block uppercase tracking-wider font-semibold">Registered Events</span>
                <span className="text-sm font-bold text-white font-heading">
                  {registeredEvents.length} Voyages Set
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Responsive Grid: Mobile: 1 col, Desktop: 3 cols (2 col Left, 1 col Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT 2/3 COLUMN: Admin Verification / Check-in Stats OR Student Pass details */}
          <div className="lg:col-span-2 space-y-8">
            
            {user?.role === 'admin' ? (
              // ============================================================
              // ADMIN VIEW: Admin Verification Panel & Check-In History
              // ============================================================
              <>
                {/* Check-In History & Stats Dashboard Section */}
                <div className="bg-ocean/30 border border-gold/15 rounded-xl p-6 space-y-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-ocean/50 pb-3 gap-4">
                    <h2 className="font-heading text-lg font-bold text-gold tracking-wider flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-gold animate-pulse" /> Volunteer Check-In Dashboard
                    </h2>
                    <Link
                      to="/admin/check-in"
                      className="px-5 py-2 bg-gradient-to-r from-baltic to-bronze text-white font-heading font-bold text-[10px] tracking-widest rounded-lg transition-transform hover:scale-105 uppercase"
                    >
                      Open Check-In Scanner
                    </Link>
                  </div>

                  {loadingCheckInStats ? (
                    <div className="py-10 text-center text-white/50 text-xs animate-pulse">
                      Loading check-in metrics...
                    </div>
                  ) : checkInStats ? (
                    <div className="space-y-6">
                      {/* Metric KPI cards */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="bg-navy/70 border border-gold/20 rounded-xl p-4 text-center">
                          <span className="text-[10px] text-seafoam block uppercase tracking-wider font-semibold">Total Verified Passes</span>
                          <span className="font-heading text-xl font-black text-gold">{checkInStats.totalVerified}</span>
                        </div>
                        <div className="bg-navy/70 border border-mint/20 rounded-xl p-4 text-center">
                          <span className="text-[10px] text-mint block uppercase tracking-wider font-semibold">Checked-In Students</span>
                          <span className="font-heading text-xl font-black text-mint">{checkInStats.checkedInCount}</span>
                        </div>
                        <div className="bg-navy/70 border border-gold/20 rounded-xl p-4 text-center">
                          <span className="text-[10px] text-white/50 block uppercase tracking-wider font-semibold">Pending Check-In</span>
                          <span className="font-heading text-xl font-black text-white">{checkInStats.notCheckedInCount}</span>
                        </div>
                      </div>

                      {/* Log Search input */}
                      <form onSubmit={handleSearchCheckIn} className="flex gap-2">
                        <div className="relative flex-1">
                          <input
                            type="text"
                            value={checkInSearch}
                            onChange={(e) => setCheckInSearch(e.target.value)}
                            placeholder="Search by Registration ID, Student Name, or College..."
                            className="w-full bg-navy border border-ocean/65 rounded-lg px-4 py-2.5 pl-10 text-xs text-white placeholder-white/40 focus:outline-none focus:border-gold"
                          />
                          <Search className="w-4 h-4 text-white/40 absolute left-3 top-3" />
                        </div>
                        <button
                          type="submit"
                          className="px-5 py-2.5 bg-navy border border-gold/45 text-gold hover:text-white rounded-lg text-xs uppercase font-bold tracking-widest font-heading transition-colors"
                        >
                          Search
                        </button>
                      </form>

                      {/* Stats log table */}
                      <div className="border border-ocean/55 rounded-xl overflow-hidden">
                        <div className="overflow-x-auto">
                          <table className="w-full text-left border-collapse text-xs font-body">
                            <thead>
                              <tr className="bg-navy/80 border-b border-ocean/55 text-gold font-bold uppercase tracking-wider text-[9px]">
                                <th className="p-3">ID</th>
                                <th className="p-3">Student</th>
                                <th className="p-3">College</th>
                                <th className="p-3 text-center">Check-In</th>
                                <th className="p-3">Checked In By</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-ocean/40 bg-navy/20">
                              {checkInStats.passes?.length === 0 ? (
                                <tr>
                                  <td colSpan="5" className="p-8 text-center text-white/40 italic">
                                    No verified records match search query.
                                  </td>
                                </tr>
                              ) : (
                                checkInStats.passes.map((p) => (
                                  <tr key={p._id} className="hover:bg-navy/40 transition-colors">
                                    <td className="p-3 font-mono font-bold text-gold">{p.registrationId}</td>
                                    <td className="p-3 font-semibold text-white">{p.user?.name || 'N/A'}</td>
                                    <td className="p-3 text-seafoam max-w-[150px] truncate" title={p.user?.college}>{p.user?.college || 'N/A'}</td>
                                    <td className="p-3 text-center">
                                      {p.checkedIn ? (
                                        <span className="inline-block text-[9px] uppercase font-bold text-mint bg-mint/10 border border-mint/20 px-2 py-0.5 rounded-full" title={`Checked-in at ${formatDate(p.checkedInAt)}`}>
                                          Done
                                        </span>
                                      ) : (
                                        <span className="inline-block text-[9px] uppercase font-bold text-white/50 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full">
                                          No
                                        </span>
                                      )}
                                    </td>
                                    <td className="p-3">
                                      {p.checkedIn ? (
                                        <div className="flex flex-col gap-0.5">
                                          <span className="font-semibold text-white">{p.checkedInBy?.name || 'Admin'}</span>
                                          <span className="text-[9px] text-white/50">{formatDate(p.checkedInAt)}</span>
                                        </div>
                                      ) : (
                                        <span className="text-white/30">-</span>
                                      )}
                                    </td>
                                  </tr>
                                ))
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>

                {/* Delegate Pass Approvals Section */}
                <div className="bg-ocean/30 border border-gold/15 rounded-xl p-6 space-y-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-ocean/50 pb-3 gap-3">
                    <h2 className="font-heading text-lg font-bold text-gold tracking-wider flex items-center gap-2">
                      <Award className="w-5 h-5 text-gold" /> Delegate Pass Approvals
                    </h2>
                    <div className="flex bg-navy/60 p-1 border border-gold/20 rounded-lg text-[10px] uppercase font-semibold">
                      <button
                        onClick={() => setAdminFilter('PENDING')}
                        className={`px-3 py-1.5 rounded transition-colors ${adminFilter === 'PENDING' ? 'bg-gold text-navy font-bold' : 'text-seafoam'}`}
                      >
                        Pending Only
                      </button>
                      <button
                        onClick={() => setAdminFilter('ALL')}
                        className={`px-3 py-1.5 rounded transition-colors ${adminFilter === 'ALL' ? 'bg-gold text-navy font-bold' : 'text-seafoam'}`}
                      >
                        All Requests
                      </button>
                    </div>
                  </div>

                  {loadingAdminPasses ? (
                    <div className="py-24 text-center text-white/50 text-xs animate-pulse">
                      Unrolling pass logs...
                    </div>
                  ) : filteredPasses.length === 0 ? (
                    <div className="py-24 text-center text-white/50 text-sm">
                      ⛵ No delegate pass verification requests found matching filter.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredPasses.map((pass) => (
                        <div
                          key={pass._id}
                          className="bg-navy/55 border border-ocean/60 rounded-xl p-5 hover:border-gold/30 transition-colors space-y-4 text-xs font-body"
                        >
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-ocean/30 pb-2.5">
                            <div>
                              <span className="text-[9px] uppercase tracking-wider text-seafoam font-semibold block">Applicant</span>
                              <h4 className="text-sm font-bold text-white">{pass.user?.name || 'Mock Student'}</h4>
                              <span className="text-[10px] text-seafoam">{pass.user?.email || 'N/A'} • {pass.user?.phone || 'N/A'}</span>
                            </div>
                            <span className={`px-2.5 py-1 text-[9px] font-bold rounded-full border uppercase tracking-wider ${
                              pass.paymentStatus === 'VERIFIED' ? 'text-mint bg-mint/10 border-mint/20' :
                              pass.paymentStatus === 'REJECTED' ? 'text-rose-400 bg-rose-500/10 border-rose-500/20' :
                              'text-gold bg-gold/10 border-gold/20'
                            }`}>
                              {pass.paymentStatus}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2 leading-relaxed">
                              <p><strong className="text-gold">College:</strong> {pass.user?.college || 'Mock College'}</p>
                              <p><strong className="text-gold">UTR Number:</strong> <span className="font-mono text-gold/90 font-semibold tracking-wider text-sm">{pass.utr}</span></p>
                              <p><strong className="text-gold">Date Applied:</strong> {formatDate(pass.createdAt)}</p>
                              {pass.adminRemark && (
                                <p className="text-red-400"><strong className="text-rose-400">Admin Remark:</strong> {pass.adminRemark}</p>
                              )}
                            </div>
                            
                            <div className="flex flex-col gap-2">
                              <span className="text-[9px] uppercase font-bold text-gold tracking-wider">Payment Receipt Screenshot</span>
                              <a
                                href={pass.paymentScreenshot}
                                target="_blank"
                                rel="noreferrer"
                                className="border border-gold/20 rounded-lg overflow-hidden h-28 flex items-center justify-center bg-black/40 hover:border-gold transition-colors relative group"
                              >
                                <img
                                  src={pass.paymentScreenshot}
                                  alt="Transaction Receipt"
                                  className="max-h-28 object-contain"
                                />
                                <div className="absolute inset-0 bg-navy/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-[10px] uppercase font-bold text-gold tracking-widest gap-1">
                                  <ChevronRight className="w-3.5 h-3.5" /> View Full Image
                                </div>
                              </a>
                            </div>
                          </div>

                          {pass.paymentStatus === 'PENDING' && (
                            <div className="pt-2 border-t border-ocean/30 flex justify-end gap-3.5">
                              <button
                                onClick={() => handleVerifyPass(pass._id, 'REJECTED')}
                                className="flex items-center gap-1.5 px-4 py-2 bg-rose-950/20 hover:bg-rose-500/20 border border-rose-500/50 hover:border-rose-500 text-rose-300 font-heading font-bold text-[10px] tracking-widest rounded transition-all uppercase"
                              >
                                <X className="w-3.5 h-3.5" /> Reject Request
                              </button>
                              <button
                                onClick={() => handleVerifyPass(pass._id, 'VERIFIED')}
                                className="flex items-center gap-1.5 px-4 py-2 bg-mint/10 hover:bg-mint/20 border border-mint/50 hover:border-mint text-mint font-heading font-bold text-[10px] tracking-widest rounded transition-all uppercase"
                              >
                                <Check className="w-3.5 h-3.5" /> Approve Pass
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            ) : (
              // ============================================================
              // STUDENT VIEW: My Delegate Pass Card details & Download
              // ============================================================
              <div className="bg-ocean/30 border border-gold/15 rounded-xl p-6 space-y-6">
                <h2 className="font-heading text-lg font-bold text-gold tracking-wider flex items-center gap-2 border-b border-ocean/50 pb-3">
                  <Award className="w-5 h-5 text-gold animate-bounce" /> My Delegate Pass
                </h2>

                {loadingPass ? (
                  <div className="py-12 text-center text-white/50 text-xs animate-pulse">
                    Retrieving your Delegate Pass details...
                  </div>
                ) : !passData ? (
                  // Case: NONE
                  <div className="bg-navy/55 border border-gold/20 rounded-xl p-5 text-center space-y-4">
                    <p className="text-sm font-semibold text-seafoam font-body">
                      ⛵ You do not have a Delegate Pass yet.
                    </p>
                    <p className="text-xs text-white/70 max-w-md mx-auto leading-relaxed">
                      Purchase a Delegate Pass for a flat ₹500 to unlock entry to the entire fest and unlimited free event registrations!
                    </p>
                    <div className="pt-2">
                      <a
                        href="/register"
                        className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-baltic to-bronze text-white font-heading text-xs font-bold uppercase tracking-widest rounded min-h-[44px] hover:scale-[1.02] transform transition-transform"
                      >
                        Purchase Delegate Pass
                      </a>
                    </div>
                  </div>
                ) : passData.paymentStatus === 'REJECTED' ? (
                  // Case: REJECTED
                  <div className="bg-red-950/15 border border-red-500/40 rounded-xl p-5 space-y-4">
                    <div className="flex gap-3">
                      <AlertTriangle className="w-6 h-6 text-rose-400 flex-shrink-0" />
                      <div>
                        <h3 className="font-heading font-bold text-rose-400 uppercase tracking-widest text-xs mb-1">
                          Pass Application Rejected
                        </h3>
                        <p className="text-xs text-white/90 leading-relaxed">
                          Rejection Reason: <strong className="italic text-white">"{passData.adminRemark || 'Incorrect screenshot or transaction info'}"</strong>
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-white/70 leading-relaxed">
                      Your UTR log transaction code was: <span className="font-mono text-gold font-bold">{passData.utr}</span>. Please click the button below to upload the correct payment screenshot and submit a new UTR trace.
                    </p>
                    <div className="pt-2">
                      <a
                        href="/register"
                        className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-navy border border-gold/40 text-gold hover:text-white hover:bg-gold/10 font-heading text-xs font-bold uppercase tracking-widest rounded min-h-[44px] transition-colors"
                      >
                        Re-upload Payment Proof
                      </a>
                    </div>
                  </div>
                ) : passData.paymentStatus === 'PENDING' ? (
                  // Case: PENDING
                  <div className="bg-navy/55 border border-gold/20 rounded-xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="space-y-2 text-xs">
                      <span className="flex items-center gap-1.5 text-gold font-bold uppercase tracking-widest text-[9px] bg-gold/10 px-2.5 py-1 rounded-full border border-gold/25 w-max">
                        <Clock className="w-3.5 h-3.5" /> Pending Verification
                      </span>
                      <p className="text-sm font-semibold text-white">Your payment proof is being verified by captains</p>
                      <p className="text-white/60">UTR reference code: <strong className="font-mono text-gold">{passData.utr}</strong></p>
                      <p className="text-[10px] text-seafoam leading-relaxed pt-1">
                        Please check back soon. Once approved, you can register for events for free!
                      </p>
                    </div>
                    <div className="w-24 h-24 bg-white/5 rounded-xl border border-gold/20 flex flex-col items-center justify-center text-white/40 select-none flex-shrink-0">
                      <Clock className="w-8 h-8 animate-spin-slow mb-1" />
                      <span className="text-[8px] uppercase tracking-wider">Locked</span>
                    </div>
                  </div>
                ) : (
                  // Case: VERIFIED (Visual Ticket Pass with Download)
                  <div className="space-y-6">
                    <div className="bg-gradient-to-br from-baltic/30 via-ocean/20 to-bronze/10 border-2 border-gold rounded-xl p-6 shadow-2xl relative overflow-hidden flex flex-col md:flex-row justify-between items-stretch gap-6">
                      {/* Decorative watermark */}
                      <Anchor className="w-36 h-36 text-gold/[0.03] absolute -left-10 -bottom-10 pointer-events-none select-none z-0" />
                      
                      <div className="space-y-4 flex-1 relative z-10 text-xs">
                        <div className="flex items-center gap-1.5">
                          <span className="flex items-center gap-1 text-[9px] uppercase font-bold text-mint bg-mint/15 px-2.5 py-1 rounded-full border border-mint/20">
                            <CheckCircle className="w-3 h-3" /> Delegate Pass Verified
                          </span>
                          <span className="text-white/40">• Approved {formatDate(passData.verifiedAt)}</span>
                        </div>
                        
                        <div className="space-y-1.5">
                          <span className="text-[9px] uppercase text-seafoam font-semibold block tracking-wider">Registration ID</span>
                          <h3 className="font-heading text-2xl md:text-3xl font-black text-gold tracking-widest">{passData.registrationId}</h3>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-1">
                          <div>
                            <span className="text-[8px] uppercase text-seafoam font-semibold block">Pass Holder</span>
                            <span className="font-bold text-white text-[11px] block truncate">{user.name}</span>
                          </div>
                          <div>
                            <span className="text-[8px] uppercase text-seafoam font-semibold block">Academy</span>
                            <span className="font-semibold text-white/90 text-[10px] block truncate">{user.college || 'N/A'}</span>
                          </div>
                        </div>
                      </div>

                      <div className="border-t-2 border-dashed md:border-t-0 md:border-l-2 border-gold/30 md:pl-6 pt-6 md:pt-0 flex flex-col items-center justify-center flex-shrink-0 relative z-10">
                        <div className="bg-white p-2.5 rounded shadow-lg w-28 h-28 flex flex-col items-center justify-center border border-gold/20">
                          <span className="text-navy text-[7px] font-black uppercase tracking-wider mb-1">Pass QR Code</span>
                          {/* Visual QR SVG representation - qrToken is NOT exposed as text */}
                          <svg className="w-20 h-20 text-navy" viewBox="0 0 100 100">
                            <rect x="0" y="0" width="100" height="100" fill="none" stroke="currentColor" strokeWidth="4" />
                            <rect x="10" y="10" width="20" height="20" fill="currentColor" />
                            <rect x="70" y="10" width="20" height="20" fill="currentColor" />
                            <rect x="10" y="70" width="20" height="20" fill="currentColor" />
                            <rect x="35" y="35" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="3" />
                            <rect x="42" y="42" width="16" height="16" fill="currentColor" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* PDF Download Button */}
                    <div className="flex justify-start">
                      <button
                        onClick={handleDownloadPass}
                        disabled={isDownloading}
                        className="flex items-center justify-center gap-2 px-8 py-3.5 bg-gradient-to-r from-baltic to-bronze text-white font-heading text-xs font-bold uppercase tracking-widest rounded-lg transition-transform hover:scale-[1.02] shadow-lg disabled:opacity-50 min-h-[48px]"
                      >
                        <Download className="w-4.5 h-4.5" />
                        {isDownloading ? 'Downloading Pass...' : 'Download Delegate Pass PDF'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 2. Registered Events list (For Students) */}
            {user?.role !== 'admin' && (
              <div className="bg-ocean/30 border border-gold/15 rounded-xl p-6 space-y-6">
                <h2 className="font-heading text-lg font-bold text-gold tracking-wider flex items-center gap-2 border-b border-ocean/50 pb-3">
                  <Ship className="w-5 h-5 text-gold" /> My Registered Voyages (Events)
                </h2>

                {loadingEvents ? (
                  <div className="py-12 text-center text-white/50 text-xs animate-pulse">
                    Unrolling event manifests...
                  </div>
                ) : registeredEvents.length === 0 ? (
                  <div className="py-12 text-center text-white/50 text-xs text-center space-y-2.5">
                    <p>⛵ You are not registered for any events yet.</p>
                    {passData?.paymentStatus === 'VERIFIED' ? (
                      <p className="text-[10px] text-seafoam">
                        Your Delegate Pass is active! Click below to select and register for events for free.
                      </p>
                    ) : (
                      <p className="text-[10px] text-seafoam">
                        Purchase and verify your Delegate Pass to start registering for events.
                      </p>
                    )}
                    <div className="pt-2">
                      <a href="/register" className="text-gold underline hover:text-white transition-colors font-semibold">
                        {passData?.paymentStatus === 'VERIFIED' ? 'Register for Events Now' : 'Purchase Pass / Verify status'}
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {registeredEvents.map((event) => (
                      <div
                        key={event._id}
                        className="bg-navy/55 border border-ocean/60 rounded-xl p-4 hover:border-gold/30 transition-colors flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
                      >
                        <div className="flex items-center gap-3">
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
                            <Calendar className="w-3.5 h-3.5 text-gold" /> {formatDate(event.date)}
                          </span>
                          <span className="flex items-center gap-1 sm:justify-end">
                            <MapPin className="w-3.5 h-3.5 text-gold" /> {event.venue || 'TBA'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Profile update stub (available to all) */}
            <div className="bg-ocean/30 border border-gold/15 rounded-xl p-6 space-y-6">
              <h2 className="font-heading text-lg font-bold text-gold tracking-wider flex items-center gap-2 border-b border-ocean/50 pb-3">
                <User className="w-5 h-5 text-gold" /> Navigator's Log (Profile Settings)
              </h2>

              <form onSubmit={handleProfileUpdate} className="space-y-4 font-body text-xs">
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
