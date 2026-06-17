import React, { useState, useEffect } from 'react';

const CountdownTimer = () => {
  const targetDate = new Date('2026-09-12T00:00:00').getTime();
  
  const calculateTimeLeft = () => {
    const now = new Date().getTime();
    const difference = targetDate - now;
    
    let timeLeft = { Days: 0, Hours: 0, Minutes: 0, Seconds: 0 };
    
    if (difference > 0) {
      timeLeft = {
        Days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        Hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        Minutes: Math.floor((difference / 1000 / 60) % 60),
        Seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full flex justify-center py-4">
      {/* Mobile: 2x2 grid, Tablet+: flex row */}
      <div className="grid grid-cols-2 gap-4 md:flex md:flex-row md:gap-6 justify-center">
        {Object.entries(timeLeft).map(([label, value]) => (
          <div
            key={label}
            className="flex flex-col items-center justify-center bg-ocean/40 border border-gold/30 rounded-lg p-3 min-w-[90px] md:min-w-[110px] backdrop-blur-sm shadow-lg transform hover:scale-105 transition-transform duration-300"
          >
            <span className="font-heading text-3xl md:text-4xl font-extrabold text-gold tracking-wider">
              {String(value).padStart(2, '0')}
            </span>
            <span className="text-xs md:text-sm font-body uppercase text-seafoam font-medium tracking-widest mt-1">
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CountdownTimer;
