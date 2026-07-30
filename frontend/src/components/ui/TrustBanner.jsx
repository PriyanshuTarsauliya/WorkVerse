import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

function AnimatedNumber({ target, duration = 2, suffix = '', prefix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!isInView || hasAnimated.current) return;
    hasAnimated.current = true;

    const startTime = performance.now();
    const numTarget = typeof target === 'string' ? parseInt(target.replace(/\D/g, '')) : target;

    function animate(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / (duration * 1000), 1);
      // Ease out cubic for satisfying deceleration
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * numTarget));
      if (progress < 1) requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
  }, [isInView, target, duration]);

  return (
    <span ref={ref}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
}

export default function TrustBanner() {
  const stats = [
    { value: 10000, suffix: '+', label: 'Active Jobs', color: 'text-amber-400' },
    { value: 500, suffix: '+', label: 'Top Companies', color: 'text-emerald-400' },
    { value: 95, suffix: '%', label: 'Placement Rate', color: 'text-sky-400' },
    { value: 48, suffix: 'hrs', label: 'Avg Response Time', color: 'text-rose-400' },
  ];

  const logos = [
    'Razorpay', 'Google', 'Flipkart', 'Swiggy', 'CRED', 'Postman',
    'Goldman Sachs', 'Zomato', 'Microsoft', 'PhonePe', 'Atlassian', 'Oracle'
  ];

  return (
    <section className="w-full py-10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Animated Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="text-center p-5 rounded-2xl bg-surface/80 dark:bg-slate-900/60 border border-borderStrong hover:border-accent/40 transition-all group cursor-default shadow-md backdrop-blur-md"
            >
              <div className={`text-3xl sm:text-4xl font-extrabold font-mono tracking-tight ${stat.color}`}>
                <AnimatedNumber target={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-semibold mt-1.5">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Scrolling Company Logos Ticker */}
        <div className="space-y-4">
          <p className="text-center text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest">Trusted by Engineers at India's Top Companies</p>
          <div className="relative overflow-hidden mask-fade-horizontal">
            <div className="flex gap-4 animate-ticker py-1">
              {[...logos, ...logos].map((name, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-surface/80 dark:bg-slate-900/80 border border-borderStrong whitespace-nowrap shrink-0 hover:border-accent/50 transition-all shadow-sm"
                >
                  <div className="w-6 h-6 rounded-md bg-indigo-500/20 dark:bg-indigo-500/30 flex items-center justify-center text-xs font-bold text-indigo-700 dark:text-indigo-300 border border-indigo-500/40">
                    {name.charAt(0)}
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">{name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
