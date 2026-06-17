import React from 'react';

const WaveDivider = ({ fill = '#16273f', className = '' }) => {
  return (
    <div className={`w-full overflow-hidden leading-[0] ${className}`}>
      <svg
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        width="100%"
        height="40px"
        className="relative block"
        style={{ fill: fill }}
      >
        <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V0C26.9,4.75,55.05,16.31,84,24.87,150,44.42,219.89,68.79,321.39,56.44Z" />
      </svg>
    </div>
  );
};

export default WaveDivider;
