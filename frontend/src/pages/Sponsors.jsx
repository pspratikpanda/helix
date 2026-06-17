import React, { useState, useEffect } from 'react';
import { Award, Compass, HeartHandshake } from 'lucide-react';
import apiClient from '../api/apiClient';
import SponsorCard from '../components/SponsorCard';

const Sponsors = () => {
  const [sponsors, setSponsors] = useState({ title: [], gold: [], silver: [], bronze: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSponsorsList = async () => {
      try {
        const res = await apiClient.get('/sponsors');
        if (res.data && res.data.success) {
          setSponsors(res.data.data);
        }
      } catch (err) {
        console.error('Failed to resolve patrons:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSponsorsList();
  }, []);

  return (
    <div className="w-full min-h-screen bg-navy text-white pt-28 pb-16 font-body">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Title */}
        <div className="text-center space-y-3">
          <h1 className="font-heading text-3xl md:text-5xl font-black text-gold tracking-widest flex items-center justify-center gap-2">
            <HeartHandshake className="w-7 h-7 text-gold animate-bounce" /> Our Patrons
          </h1>
          <div className="w-64 h-3 mx-auto overflow-hidden opacity-80">
            <svg viewBox="0 0 100 10" preserveAspectRatio="none" className="w-full h-full stroke-gold fill-none" strokeWidth="2">
              <path d="M 0 5 Q 25 0, 50 5 T 100 5" />
            </svg>
          </div>
          <p className="text-xs md:text-sm text-seafoam uppercase tracking-widest font-semibold">
            Steering the vessel of HELIX 2026 alongside AIIMS Deoghar
          </p>
        </div>

        {loading ? (
          <div className="py-24 text-center space-y-4">
            <div className="w-10 h-10 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="font-heading text-xs text-gold tracking-widest">
              Mapping sponsors list...
            </p>
          </div>
        ) : (
          <div className="space-y-16">
            
            {/* Title Sponsors */}
            {sponsors.title && sponsors.title.length > 0 && (
              <div className="space-y-6 text-center">
                <h2 className="font-heading text-lg md:text-2xl font-bold text-gold tracking-widest flex items-center justify-center gap-2">
                  🏆 TITLE SPONSOR
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-xl mx-auto justify-center">
                  {sponsors.title.map((sp) => (
                    <SponsorCard key={sp._id} sponsor={sp} />
                  ))}
                </div>
              </div>
            )}

            {/* Gold Sponsors */}
            {sponsors.gold && sponsors.gold.length > 0 && (
              <div className="space-y-6 text-center">
                <h2 className="font-heading text-base md:text-xl font-bold text-gold/85 tracking-widest flex items-center justify-center gap-2">
                  ⚓ GOLD PATRONS
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 justify-center">
                  {sponsors.gold.map((sp) => (
                    <SponsorCard key={sp._id} sponsor={sp} />
                  ))}
                </div>
              </div>
            )}

            {/* Silver Sponsors */}
            {sponsors.silver && sponsors.silver.length > 0 && (
              <div className="space-y-6 text-center">
                <h2 className="font-heading text-sm md:text-lg font-bold text-seafoam tracking-widest flex items-center justify-center gap-2">
                  🧭 SILVER SPONSORS
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 justify-center">
                  {sponsors.silver.map((sp) => (
                    <SponsorCard key={sp._id} sponsor={sp} />
                  ))}
                </div>
              </div>
            )}

            {/* Bronze Sponsors */}
            {sponsors.bronze && sponsors.bronze.length > 0 && (
              <div className="space-y-6 text-center">
                <h2 className="font-heading text-xs md:text-sm font-bold text-bronze tracking-widest flex items-center justify-center gap-2">
                  🐚 BRONZE SPONSORS
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 justify-center">
                  {sponsors.bronze.map((sp) => (
                    <SponsorCard key={sp._id} sponsor={sp} />
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
};

export default Sponsors;
