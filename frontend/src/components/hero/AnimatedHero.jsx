import React, { useRef } from 'react';
import { motion, useMotionValue, useTransform, useReducedMotion } from 'framer-motion';
import { ArrowRight, Terminal, Sparkles, Brain, Code2, Database, Network } from 'lucide-react';

export function AnimatedHero({ onExploreClick, onPrepClick }) {
  const prefersReducedMotion = useReducedMotion();
  const containerRef = useRef(null);

  // 3D Tilt Effect on the Central Core
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-100, 100], [10, -10]);
  const rotateY = useTransform(x, [-100, 100], [-10, 10]);

  function handleMouseMove(e) {
    if (prefersReducedMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    x.set(e.clientX - rect.left - rect.width / 2);
    y.set(e.clientY - rect.top - rect.height / 2);
  }

  function handleMouseLeave() {
    if (prefersReducedMotion) return;
    x.set(0);
    y.set(0);
  }

  // Animation variants
  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 }
    }
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 20 } }
  };

  return (
    <section className="relative pt-12 pb-16 md:pt-16 md:pb-24 border-b border-borderSubtle bg-canvas theme-transition overflow-hidden">
      {/* Dynamic Animated Gradients */}
      <div className="absolute inset-0 bg-radial-glow opacity-80 pointer-events-none" />
      <div className="absolute inset-0 bg-dot-grid opacity-25 pointer-events-none" />
      
      {/* Background Pulse Rings */}
      {!prefersReducedMotion && (
        <>
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/2 left-[75%] -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-indigo-500/10 pointer-events-none"
          />
          <motion.div
            animate={{ scale: [1.2, 1.5, 1.2], opacity: [0.05, 0.1, 0.05] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/2 left-[75%] -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-sky-500/10 pointer-events-none"
          />
        </>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column - Staggered Text */}
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="lg:col-span-6 space-y-6"
          >
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface/80 backdrop-blur-md border border-indigo-500/30 text-xs font-mono shadow-[0_0_15px_rgba(99,102,241,0.15)]">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span className="text-indigo-400 font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-sky-400">AI-Powered Tech Hiring Ecosystem</span>
            </motion.div>

            <motion.h1 variants={fadeUp} className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-txtMain tracking-tight leading-[1.15]">
              Find your next <span className="relative whitespace-nowrap">
                <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">dream career move</span>
                {!prefersReducedMotion && (
                  <motion.span
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ delay: 0.8, duration: 0.8, ease: "circOut" }}
                    className="absolute bottom-1 left-0 h-3 bg-amber-500/20 -z-10 -rotate-1 origin-left"
                  />
                )}
              </span>
            </motion.h1>

            <motion.p variants={fadeUp} className="text-base sm:text-lg text-txtMuted max-w-2xl leading-relaxed">
              Discover 10,000+ verified tech roles with transparent packages, instant AI skill-gap analysis, and next-generation voice interview practice.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-4 pt-2">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(245, 158, 11, 0.4)" }}
                whileTap={{ scale: 0.95 }}
                onClick={onExploreClick}
                className="px-6 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-500 to-orange-500 text-black shadow-lg shadow-amber-500/25 flex items-center gap-2 transition-all cursor-pointer"
              >
                <span>Explore Openings</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: "rgba(99,102,241,0.1)" }}
                whileTap={{ scale: 0.95 }}
                onClick={onPrepClick}
                className="px-6 py-3.5 rounded-xl font-semibold text-sm bg-surface hover:bg-surface-nested text-txtMain border border-borderStrong transition-all cursor-pointer flex items-center gap-2 shadow-sm"
              >
                <Brain className="w-4 h-4 text-indigo-400" />
                <span>AI Voice Prep</span>
              </motion.button>
            </motion.div>

            {/* Combined Quiet Stats Row */}
            <motion.div variants={fadeUp} className="pt-8 border-t border-borderSubtle/60 grid grid-cols-3 gap-6 max-w-xl">
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-txtMain font-mono tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-400">10k+</div>
                <div className="text-xs text-txtMuted mt-0.5">Verified Roles</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-txtMain font-mono tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-400">500+</div>
                <div className="text-xs text-txtMuted mt-0.5">Hiring Partners</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-txtMain font-mono tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-400">50k+</div>
                <div className="text-xs text-txtMuted mt-0.5">Placed Engineers</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column - Creative Interactive Ecosystem */}
          <div className="lg:col-span-6 relative flex justify-center items-center h-[500px]" ref={containerRef}>
            
            {/* SVG Connecting Lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" style={{ filter: 'drop-shadow(0 0 8px rgba(56,189,248,0.5))' }}>
              <motion.path
                d="M 50% 50% Q 20% 20% 20% 30%"
                stroke="url(#gradient1)"
                strokeWidth="2"
                fill="transparent"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.6 }}
                transition={{ duration: 2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
              />
              <motion.path
                d="M 50% 50% Q 80% 20% 75% 35%"
                stroke="url(#gradient2)"
                strokeWidth="2"
                fill="transparent"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.6 }}
                transition={{ duration: 2.5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay: 0.5 }}
              />
              <motion.path
                d="M 50% 50% Q 70% 80% 60% 85%"
                stroke="url(#gradient3)"
                strokeWidth="2"
                fill="transparent"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.6 }}
                transition={{ duration: 2.2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay: 1 }}
              />
               <motion.path
                d="M 50% 50% Q 25% 75% 30% 65%"
                stroke="url(#gradient3)"
                strokeWidth="2"
                fill="transparent"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.6 }}
                transition={{ duration: 2.8, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay: 0.2 }}
              />
              
              <defs>
                <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#38bdf8" />
                  <stop offset="100%" stopColor="#818cf8" />
                </linearGradient>
                <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#34d399" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
                <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fbbf24" />
                  <stop offset="100%" stopColor="#f43f5e" />
                </linearGradient>
              </defs>
            </svg>

            {/* Central Glassmorphic 3D Core */}
            <motion.div
              style={{ rotateX, rotateY }}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="relative z-10 w-48 h-48 rounded-2xl bg-gradient-to-br from-[#1e293b]/80 to-[#0f172a]/80 backdrop-blur-xl border border-[#334155]/50 shadow-2xl flex flex-col items-center justify-center p-6 cursor-crosshair group perspective-1000"
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-sky-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute w-32 h-32 rounded-full bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 blur-xl pointer-events-none"
              />
              
              <Brain className="w-12 h-12 text-indigo-400 mb-3 drop-shadow-[0_0_10px_rgba(129,140,248,0.8)]" />
              <div className="text-sm font-bold text-white text-center">AI Match Engine</div>
              <div className="text-[10px] text-indigo-300 font-mono mt-1 px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20">Vector Processing</div>
            </motion.div>

            {/* Floating Orbital Badges */}
            <FloatingBadge 
              icon={<Code2 className="w-4 h-4 text-sky-400" />} 
              label="React/Next.js" 
              className="absolute top-[30%] left-[20%] -translate-x-1/2 -translate-y-1/2 bg-sky-500/10 border border-sky-500/30 text-sky-100"
              delay={0}
            />
            <FloatingBadge 
              icon={<Database className="w-4 h-4 text-emerald-400" />} 
              label="PostgreSQL" 
              className="absolute top-[35%] left-[75%] -translate-x-1/2 -translate-y-1/2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-100"
              delay={1}
            />
            <FloatingBadge 
              icon={<Network className="w-4 h-4 text-amber-400" />} 
              label="System Design" 
              className="absolute top-[85%] left-[60%] -translate-x-1/2 -translate-y-1/2 bg-amber-500/10 border border-amber-500/30 text-amber-100"
              delay={2}
            />
            <FloatingBadge 
              icon={<Terminal className="w-4 h-4 text-purple-400" />} 
              label="Python/LLM" 
              className="absolute top-[65%] left-[30%] -translate-x-1/2 -translate-y-1/2 bg-purple-500/10 border border-purple-500/30 text-purple-100"
              delay={1.5}
            />

          </div>
        </div>
      </div>
    </section>
  );
}

function FloatingBadge({ icon, label, className, delay }) {
  const prefersReducedMotion = useReducedMotion();
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ 
        opacity: 1, 
        scale: 1,
        y: prefersReducedMotion ? 0 : [0, -15, 0]
      }}
      transition={{
        opacity: { duration: 0.5, delay: delay * 0.2 },
        scale: { duration: 0.5, delay: delay * 0.2, type: "spring" },
        y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay }
      }}
      className={`z-20 flex items-center gap-2 px-3 py-2 rounded-xl backdrop-blur-md shadow-lg ${className}`}
    >
      {icon}
      <span className="text-xs font-bold tracking-wide">{label}</span>
    </motion.div>
  );
}
