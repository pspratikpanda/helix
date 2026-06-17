import React, { useState, useEffect } from 'react';
import { Compass, Camera, Sparkles } from 'lucide-react';
import apiClient from '../api/apiClient';

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await apiClient.get('/gallery');
        if (res.data && res.data.success) {
          setImages(res.data.data);
        }
      } catch (err) {
        console.error('Failed to retrieve logbook archives:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, []);

  return (
    <div className="w-full min-h-screen bg-navy text-white pt-28 pb-16 font-body">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Title */}
        <div className="text-center space-y-3">
          <h1 className="font-heading text-3xl md:text-5xl font-black text-gold tracking-widest flex items-center justify-center gap-2">
            <Camera className="w-7 h-7 text-gold animate-bounce" /> The Logbook Archives
          </h1>
          <div className="w-64 h-3 mx-auto overflow-hidden opacity-80">
            <svg viewBox="0 0 100 10" preserveAspectRatio="none" className="w-full h-full stroke-gold fill-none" strokeWidth="2">
              <path d="M 0 5 Q 25 0, 50 5 T 100 5" />
            </svg>
          </div>
          <p className="text-xs md:text-sm text-seafoam uppercase tracking-widest font-semibold">
            Visual logs of past annual expeditions & spectacles
          </p>
        </div>

        {loading ? (
          <div className="py-24 text-center space-y-4">
            <div className="w-10 h-10 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="font-heading text-xs text-gold tracking-widest">
              Unrolling logbooks...
            </p>
          </div>
        ) : images.length === 0 ? (
          <div className="py-12 text-center text-white/50 text-xs">
            ⛵ No image logs catalogued yet.
          </div>
        ) : (
          /* Responsive image Grid */
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3 lg:gap-4">
            {images.map((img) => (
              <div
                key={img.id}
                className="group relative rounded-xl overflow-hidden aspect-square border border-gold/10 hover:border-gold/50 shadow-lg cursor-pointer transform hover:scale-[1.01] transition-all duration-300"
              >
                {/* Visual image */}
                <img
                  src={img.url}
                  alt={img.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Dark overlay drawer on hover */}
                <div className="absolute inset-0 bg-navy/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 text-left">
                  <span className="text-[9px] uppercase font-bold text-baltic bg-baltic/25 border border-baltic/45 px-2 py-0.5 rounded w-max mb-1.5 font-body tracking-wider">
                    {img.category}
                  </span>
                  <h3 className="font-heading text-sm font-bold text-gold tracking-wide">
                    {img.title}
                  </h3>
                  <p className="text-[10px] text-white/80 font-body mt-1 leading-relaxed">
                    {img.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default Gallery;
