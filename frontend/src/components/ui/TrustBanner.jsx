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
              className="text-center p-4 rounded-xl bg-surface/50 border border-borderSubtle hover:border-accent/30 transition-all group cursor-default"
            >
              <div className={`text-3xl sm:text-4xl font-extrabold font-mono tracking-tight ${stat.color}`}>
                <AnimatedNumber target={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-xs text-txtMuted mt-1 font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Scrolling Company Logos Ticker */}
        <div className="space-y-3">
          <p className="text-center text-xs font-semibold text-txtMuted uppercase tracking-widest">Trusted by Engineers at India's Top Companies</p>
          <div className="relative overflow-hidden mask-fade-horizontal">
            <div className="flex gap-8 animate-ticker">
              {[...logos, ...logos].map((name, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-surface/40 border border-borderSubtle whitespace-nowrap shrink-0 hover:border-accent/30 transition-all"
                >
                  <div className="w-6 h-6 rounded-md bg-gradient-to-br from-indigo-500/20 to-sky-500/20 flex items-center justify-center text-xs font-bold text-indigo-400 border border-indigo-500/20">
                    {name.charAt(0)}
                  </div>
                  <span className="text-xs font-semibold text-txtMain">{name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
