import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Zap, TrendingUp, Eye, Clock } from 'lucide-react';

const ACTIVITY_TEMPLATES = [
  { icon: <Zap className="w-3.5 h-3.5 text-amber-400" />, color: 'amber', template: (c) => `Someone just applied to ${c}` },
  { icon: <Users className="w-3.5 h-3.5 text-emerald-400" />, color: 'emerald', template: (c) => `5 new applicants at ${c} in the last hour` },
  { icon: <Eye className="w-3.5 h-3.5 text-sky-400" />, color: 'sky', template: (c) => `${c} is trending — 120+ views today` },
  { icon: <TrendingUp className="w-3.5 h-3.5 text-rose-400" />, color: 'rose', template: (c) => `${c} salary bumped +12% this quarter` },
  { icon: <Clock className="w-3.5 h-3.5 text-indigo-400" />, color: 'indigo', template: (c) => `${c} is closing applications in 2 days` },
  { icon: <Zap className="w-3.5 h-3.5 text-amber-400" />, color: 'amber', template: (c) => `A candidate got shortlisted at ${c}!` },
  { icon: <Users className="w-3.5 h-3.5 text-emerald-400" />, color: 'emerald', template: (c) => `${c} just posted 3 new roles` },
];

const COMPANIES = ['Razorpay', 'Google India', 'Flipkart', 'CRED', 'Swiggy', 'Postman', 'Goldman Sachs', 'Zomato', 'Unacademy', 'HDFC Securities'];
const CITIES = ['Bengaluru', 'Mumbai', 'Delhi NCR', 'Hyderabad', 'Remote'];
const TIME_AGO = ['just now', '1m ago', '2m ago', '5m ago', '12m ago', '30m ago'];

export default function LiveActivityTicker() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const generateActivity = (idx) => {
    const template = ACTIVITY_TEMPLATES[idx % ACTIVITY_TEMPLATES.length];
    const company = COMPANIES[idx % COMPANIES.length];
    const city = CITIES[idx % CITIES.length];
    const time = TIME_AGO[idx % TIME_AGO.length];
    return {
      ...template,
      text: template.template(company),
      city,
      time,
    };
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => prev + 1);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  const activity = generateActivity(currentIndex);

  if (!isVisible) return null;

  return (
    <div className="w-full bg-surface/80 backdrop-blur-sm border-b border-borderSubtle relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center py-2 gap-3">
          {/* Animated pulse dot */}
          <span className="relative flex h-2.5 w-2.5 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -16, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
              className="flex items-center gap-2 text-xs text-txtMuted"
            >
              {activity.icon}
              <span className="font-medium">
                <span className="text-txtMain font-semibold">{activity.text}</span>
                <span className="mx-1.5 text-borderStrong">•</span>
                <span className="text-txtMuted">{activity.time}</span>
              </span>
            </motion.div>
          </AnimatePresence>

          <button 
            onClick={() => setIsVisible(false)}
            className="text-txtMuted hover:text-txtMain text-xs ml-2 shrink-0 opacity-50 hover:opacity-100 transition-opacity"
            aria-label="Dismiss"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Animated gradient line */}
      <motion.div
        className="absolute bottom-0 left-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent"
        animate={{ x: ['-100%', '100%'] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'linear' }}
        style={{ width: '100%' }}
      />
    </div>
  );
}
