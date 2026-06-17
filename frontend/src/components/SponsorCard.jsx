import React from 'react';
import { Compass } from 'lucide-react';

const SponsorCard = ({ sponsor }) => {
  // Border coloring depending on the nautical sponsor tier
  const getTierColors = (tier) => {
    switch (tier) {
      case 'title':
        return 'border-gold shadow-gold/10';
      case 'gold':
        return 'border-gold/60 shadow-gold/5';
      case 'silver':
        return 'border-seafoam/50 shadow-seafoam/5';
      case 'bronze':
        return 'border-driftwood/50 shadow-driftwood/5';
      default:
        return 'border-ocean/40';
    }
  };

  return (
    <a
      href={sponsor.website || '#'}
      target="_blank"
      rel="noreferrer"
      className={`reveal-on-scroll group block bg-ocean/30 border-2 ${getTierColors(
        sponsor.tier
      )} rounded-xl p-6 flex flex-col items-center justify-center relative overflow-hidden transform hover:scale-105 hover:-translate-y-1 hover:bg-ocean/60 shadow-xl transition-all duration-300 w-full min-h-[140px]`}
    >
      {/* Decorative compass indicator in background */}
      <Compass className="w-16 h-16 text-gold/5 absolute -right-4 -bottom-4 group-hover:rotate-90 group-hover:scale-110 transition-all duration-500" />
      
      {/* Brand logo image */}
      <img
        src={sponsor.logoUrl}
        alt={sponsor.name}
        className="max-h-16 max-w-full object-contain filter brightness-90 hover:brightness-100 group-hover:scale-105 transition-transform duration-300"
      />
      
      {/* Sponsor Name */}
      <span className="text-[10px] font-heading font-semibold uppercase tracking-wider text-gold mt-4 text-center">
        {sponsor.name}
      </span>
    </a>
  );
};

export default SponsorCard;
