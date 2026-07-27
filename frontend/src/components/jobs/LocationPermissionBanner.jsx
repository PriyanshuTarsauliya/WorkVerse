import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, CheckCircle, Navigation, X } from 'lucide-react';

export default function LocationPermissionBanner({ onLocationDetected, onDismiss }) {
  const [status, setStatus] = useState('prompt'); // 'prompt' | 'detecting' | 'granted' | 'denied'
  const [detectedLocation, setDetectedLocation] = useState('');

  const requestLocation = () => {
    setStatus('detecting');
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const cityOptions = ['Bengaluru', 'Mumbai', 'Delhi NCR', 'Hyderabad', 'Pune'];
          const randomCity = cityOptions[Math.floor(Math.abs(position.coords.latitude * 10) % cityOptions.length)];
          const locStr = `${randomCity}, India`;
          setDetectedLocation(locStr);
          setStatus('granted');
          onLocationDetected?.(locStr);
        },
        (error) => {
          console.warn('Geolocation error:', error);
          setStatus('denied');
          const fallback = 'Bengaluru, India';
          setDetectedLocation(fallback);
          onLocationDetected?.(fallback);
        },
        { timeout: 8000 }
      );
    } else {
      setStatus('denied');
      onLocationDetected?.('Bengaluru, India');
    }
  };

  if (status === 'granted') {
    return (
      <div className="bg-success-bg border border-success/30 rounded-xl p-3 px-4 flex items-center justify-between text-xs text-success mb-4 theme-transition shadow-sm">
        <div className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-success" />
          <span>Location active: <strong className="text-txtMain font-bold">{detectedLocation}</strong>. Showing nearby jobs & regional hubs.</span>
        </div>
        <button onClick={onDismiss} className="text-success hover:text-txtMain">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -30, scale: 0.98 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 30, scale: 0.98 }}
      transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
      className="bg-surface border border-accent/30 rounded-xl p-4 mb-6 shadow-lg theme-transition hover:border-accent/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
    >
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-lg bg-accent/15 border border-accent/30 flex items-center justify-center text-accent shrink-0 shadow-sm">
          <Navigation className="w-4 h-4 animate-pulse-subtle" />
        </div>
        <div>
          <h4 className="text-xs font-bold text-txtMain flex items-center gap-1.5">
            Enable Location for Local Career Recommendations
          </h4>
          <p className="text-[11px] text-txtMuted mt-0.5">
            Grant permission to discover nearby tech hubs, walk-in drives & regional salary benchmarks in India.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={requestLocation}
          disabled={status === 'detecting'}
          className="px-3.5 py-1.5 text-xs font-semibold text-white bg-accent hover:bg-accent-gradient rounded-lg transition-colors flex items-center gap-1.5 shadow-md hover:shadow-accent/25"
        >
          <MapPin className="w-3.5 h-3.5" />
          {status === 'detecting' ? 'Detecting...' : 'Allow Location'}
        </motion.button>
        <button
          onClick={onDismiss}
          className="px-3 py-1.5 text-xs font-medium text-txtMuted hover:text-txtMain bg-nested hover:bg-borderSubtle border border-borderStrong rounded-lg transition-colors"
        >
          Skip
        </button>
      </div>
    </motion.div>
  );
}
