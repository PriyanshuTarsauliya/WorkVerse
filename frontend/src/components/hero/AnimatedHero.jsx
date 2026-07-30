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
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50/80 dark:bg-indigo-950/60 backdrop-blur-md border border-indigo-200 dark:border-indigo-500/30 text-xs font-mono shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span className="text-indigo-700 dark:text-indigo-300 font-bold tracking-wide">AI-Powered Tech Hiring Ecosystem</span>
            </motion.div>

            <motion.h1 variants={fadeUp} className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-txtMain tracking-tight leading-[1.15]">
              Find your next <span className="relative whitespace-nowrap">
                <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600 dark:from-amber-400 dark:to-orange-500">dream career move</span>
                {!prefersReducedMotion && (
                  <motion.span
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ delay: 0.8, duration: 0.8, ease: "circOut" }}
                    className="absolute bottom-1 left-0 h-3 bg-amber-500/30 -z-10 -rotate-1 origin-left"
                  />
                )}
              </span>
            </motion.h1>

            <motion.p variants={fadeUp} className="text-base sm:text-lg text-slate-700 dark:text-slate-300 max-w-2xl leading-relaxed font-medium">
              Discover 10,000+ verified tech roles with transparent packages, instant AI skill-gap analysis, and next-generation voice interview practice.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-4 pt-2">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(245, 158, 11, 0.4)" }}
                whileTap={{ scale: 0.95 }}
                onClick={onExploreClick}
                className="px-6 py-3.5 rounded-xl font-extrabold text-sm bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-lg shadow-amber-500/25 flex items-center gap-2 transition-all cursor-pointer"
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
                <Brain className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
                <span>AI Voice Prep</span>
              </motion.button>
            </motion.div>

            {/* Combined Quiet Stats Row */}
            <motion.div variants={fadeUp} className="pt-8 border-t border-borderSubtle/60 grid grid-cols-3 gap-6 max-w-xl">
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-mono tracking-tight">10k+</div>
                <div className="text-xs font-semibold text-slate-600 dark:text-slate-400 mt-0.5">Verified Roles</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-mono tracking-tight">500+</div>
                <div className="text-xs font-semibold text-slate-600 dark:text-slate-400 mt-0.5">Hiring Partners</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-mono tracking-tight">50k+</div>
                <div className="text-xs font-semibold text-slate-600 dark:text-slate-400 mt-0.5">Placed Engineers</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column - Creative Interactive Ecosystem */}
          <div className="lg:col-span-6 relative flex flex-col justify-center items-center py-4 lg:py-0" ref={containerRef}>
            
            {/* Top Floating Badge */}
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="absolute -top-4 right-4 z-20 hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-emerald-500/40 text-emerald-400 text-xs font-bold shadow-xl backdrop-blur-md"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>🔥 500+ Top Hiring Partners Active</span>
            </motion.div>

            {/* Main Glassmorphic Interactive Ecosystem Card */}
            <motion.div
              style={{ rotateX, rotateY }}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 w-full max-w-md bg-gradient-to-b from-slate-900/95 via-slate-950/95 to-slate-900/95 border border-indigo-500/30 rounded-3xl p-5 sm:p-6 shadow-[0_0_50px_rgba(99,102,241,0.2)] backdrop-blur-2xl overflow-hidden group transition-all duration-300 hover:border-indigo-400/60"
            >
              {/* Glowing Top Border Accent Line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-indigo-500 to-emerald-400" />
              
              {/* Background Glow Orbs */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

              {/* Candidate Profile Header inside visual */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800/80 mb-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-amber-500 via-indigo-600 to-emerald-400 p-0.5 shadow-md">
                      <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center font-bold text-amber-400 text-sm">
                        AS
                      </div>
                    </div>
                    <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-slate-950" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                      Aarav Sharma
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        Verified
                      </span>
                    </h4>
                    <p className="text-xs text-slate-400 font-medium">Senior Full Stack Engineer · 5 yrs</p>
                  </div>
                </div>

                {/* Match Score Badge */}
                <div className="flex flex-col items-end">
                  <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-bold text-xs shadow-sm">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                    <span>98% Match</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono mt-1">AI Vector Engine</span>
                </div>
              </div>

              {/* Live AI Skill Breakdown Grid */}
              <div className="space-y-2.5 mb-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-300 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <Brain className="w-3.5 h-3.5 text-indigo-400" />
                    Validated Tech Competencies
                  </span>
                  <span className="text-emerald-400 font-mono font-bold text-[11px]">4 Roles Matched</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Code2 className="w-4 h-4 text-sky-400" />
                      <span className="text-xs font-bold text-slate-200">React / Next.js</span>
                    </div>
                    <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">99%</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Terminal className="w-4 h-4 text-indigo-400" />
                      <span className="text-xs font-bold text-slate-200">Java / Spring</span>
                    </div>
                    <span className="text-[11px] font-bold text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded">95%</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Network className="w-4 h-4 text-amber-400" />
                      <span className="text-xs font-bold text-slate-200">System Design</span>
                    </div>
                    <span className="text-[11px] font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded">92%</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Database className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs font-bold text-slate-200">PostgreSQL</span>
                    </div>
                    <span className="text-[11px] font-bold text-sky-400 bg-sky-500/10 px-1.5 py-0.5 rounded">90%</span>
                  </div>
                </div>
              </div>

              {/* Salary & Referral Highlight Row */}
              <div className="p-3 rounded-2xl bg-indigo-950/40 border border-indigo-500/25 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-indigo-300 tracking-wider block">Target Package Range</span>
                  <span className="text-sm font-extrabold text-amber-400">₹32 - ₹48 LPA</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-indigo-300 tracking-wider block">Referral Multiplier</span>
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded-full border border-emerald-500/30">
                    ⚡ 4x Callbacks
                  </span>
                </div>
              </div>

              {/* Bottom AI Voice Practice Equalizer Bar */}
              <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-slate-300 font-medium text-[11px]">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>Live Audio Voice Interview Simulator</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-1 h-3 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1 h-4 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  <span className="w-1 h-5 bg-sky-400 rounded-full animate-bounce" style={{ animationDelay: '450ms' }} />
                </div>
              </div>
            </motion.div>

            {/* Bottom Floating Badge */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="absolute -bottom-4 left-4 z-20 hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-amber-500/40 text-amber-300 text-xs font-bold shadow-xl backdrop-blur-md"
            >
              <Brain className="w-3.5 h-3.5 text-amber-400" />
              <span>⚡ Instant ATS Match & Skill Gap Analysis</span>
            </motion.div>

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
