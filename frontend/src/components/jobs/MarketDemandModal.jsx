import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, TrendingUp, BarChart2, Briefcase, Activity } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export default function MarketDemandModal({ isOpen, onClose }) {
  const [demandData, setDemandData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [keywords, setKeywords] = useState('Software Engineer');
  const [location, setLocation] = useState('London'); // Using London as a default based on the prompt's Adzuna example

  useEffect(() => {
    if (isOpen) {
      fetchDemandData();
    }
  }, [isOpen, keywords, location]);

  const fetchDemandData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/insights/market-demand?keywords=${encodeURIComponent(keywords)}&location=${encodeURIComponent(location)}`);
      if (response.ok) {
        const data = await response.json();
        setDemandData(data);
      }
    } catch (error) {
      console.error('Failed to fetch market demand', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-xl bg-surface border border-borderStrong shadow-2xl overflow-hidden rounded-2xl flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-borderSubtle">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-md">
                <BarChart2 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-txtMain tracking-tight">Market Demand Insights</h2>
                <p className="text-xs text-txtMuted">Live hiring trends powered by Careerjet</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-nested hover:bg-surface border border-borderSubtle flex items-center justify-center text-txtMuted hover:text-txtMain transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-6">
            {/* Controls */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-[11px] font-semibold text-txtMuted mb-1 uppercase tracking-wider">Role</label>
                <input 
                  type="text" 
                  value={keywords} 
                  onChange={(e) => setKeywords(e.target.value)}
                  className="w-full bg-nested border border-borderSubtle focus:border-indigo-500 rounded-xl px-3 py-2 text-sm text-txtMain outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-txtMuted mb-1 uppercase tracking-wider">Location</label>
                <input 
                  type="text" 
                  value={location} 
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-nested border border-borderSubtle focus:border-indigo-500 rounded-xl px-3 py-2 text-sm text-txtMain outline-none"
                />
              </div>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Activity className="w-8 h-8 text-indigo-400 animate-pulse mb-3" />
                <p className="text-sm text-txtMuted">Analyzing job market data...</p>
              </div>
            ) : demandData ? (
              <div className="bg-nested rounded-xl border border-borderSubtle p-6 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-500/10 text-indigo-400 mb-4">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <h3 className="text-4xl font-black text-txtMain mb-1">
                  {demandData.posting_count.toLocaleString()}
                </h3>
                <p className="text-sm text-txtMuted font-medium mb-6">Active Job Postings Found</p>
                
                <div className="flex justify-center">
                  <div className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${
                    demandData.posting_count_level === 'High' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                    demandData.posting_count_level === 'Medium' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                    'bg-red-500/10 text-red-400 border border-red-500/20'
                  }`}>
                    {demandData.posting_count_level === 'High' && <Activity className="w-3.5 h-3.5" />}
                    {demandData.posting_count_level} Demand Level
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-txtMuted text-sm">
                Could not load market data.
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
