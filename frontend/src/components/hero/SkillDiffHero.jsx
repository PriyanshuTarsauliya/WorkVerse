import React, { useState, useEffect } from 'react';
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Terminal, Sparkles, CheckCircle2, FileCode, GitCompare, Cpu, ShieldCheck } from 'lucide-react';

const PRESETS = {
  frontend: {
    title: 'Senior Frontend Engineer',
    role: 'Razorpay • Bengaluru',
    score: '98.4%',
    lines: [
      { line: '01', type: 'hunk', text: '@@ -1,4 +1,5 @@ Candidate Profile vs Senior Frontend Role', color: 'text-sky-400 font-bold' },
      { line: '02', type: 'add', text: '+ React 18 & State Architecture', color: 'text-emerald-400 font-medium' },
      { line: '03', type: 'add', text: '+ TypeScript 5.0 Strict Typing', color: 'text-emerald-400 font-medium' },
      { line: '04', type: 'add', text: '+ Next.js & Micro-Frontend Architecture', color: 'text-emerald-400 font-medium' },
      { line: '05', type: 'gap', text: '– Kubernetes Orchestration', color: 'text-slate-400' },
      { line: '06', type: 'match', text: '✓ 98.4% Vector Match Score', color: 'text-amber-400 font-bold' },
    ]
  },
  ai_engineer: {
    title: 'Lead AI & LLM Engineer',
    role: 'Atlassian • Remote',
    score: '95.2%',
    lines: [
      { line: '01', type: 'hunk', text: '@@ -1,4 +1,5 @@ Candidate Profile vs AI Engineer Role', color: 'text-sky-400 font-bold' },
      { line: '02', type: 'add', text: '+ Python & PyTorch Pipeline', color: 'text-emerald-400 font-medium' },
      { line: '03', type: 'add', text: '+ RAG & Pinecone Vector Embeddings', color: 'text-emerald-400 font-medium' },
      { line: '04', type: 'add', text: '+ LangChain & OpenAI API Integrations', color: 'text-emerald-400 font-medium' },
      { line: '05', type: 'gap', text: '– C++ CUDA Kernel Optimization', color: 'text-slate-400' },
      { line: '06', type: 'match', text: '✓ 95.2% Vector Match Score', color: 'text-amber-400 font-bold' },
    ]
  },
  fullstack: {
    title: 'Fullstack Tech Lead',
    role: 'CRED • Bengaluru',
    score: '92.8%',
    lines: [
      { line: '01', type: 'hunk', text: '@@ -1,4 +1,5 @@ Candidate Profile vs Fullstack Lead Role', color: 'text-sky-400 font-bold' },
      { line: '02', type: 'add', text: '+ Node.js & Microservices', color: 'text-emerald-400 font-medium' },
      { line: '03', type: 'add', text: '+ PostgreSQL & Prisma ORM', color: 'text-emerald-400 font-medium' },
      { line: '04', type: 'add', text: '+ Redis Caching & Queue Worker', color: 'text-emerald-400 font-medium' },
      { line: '05', type: 'gap', text: '– AWS CloudFormation Infrastructure', color: 'text-slate-400' },
      { line: '06', type: 'match', text: '✓ 92.8% Vector Match Score', color: 'text-amber-400 font-bold' },
    ]
  }
};

export function SkillDiffHero({ onExploreClick, onPrepClick }) {
  const prefersReducedMotion = useReducedMotion();
  const [activePreset, setActivePreset] = useState('frontend');
  const currentData = PRESETS[activePreset];

  const [visibleLinesCount, setVisibleLinesCount] = useState(prefersReducedMotion ? currentData.lines.length : 0);

  useEffect(() => {
    setVisibleLinesCount(prefersReducedMotion ? currentData.lines.length : 0);
    if (prefersReducedMotion) return;
    
    // Typewriter pass: reveals lines one by one without looping
    const interval = setInterval(() => {
      setVisibleLinesCount((prev) => {
        if (prev < currentData.lines.length) {
          return prev + 1;
        }
        clearInterval(interval);
        return prev;
      });
    }, 350);

    return () => clearInterval(interval);
  }, [activePreset, prefersReducedMotion]);

  return (
    <section className="relative pt-12 pb-16 md:pt-16 md:pb-24 border-b border-borderSubtle bg-canvas theme-transition overflow-hidden">
      {/* Background radial glow wash */}
      <div className="absolute inset-0 bg-radial-glow opacity-80 pointer-events-none" />
      <div className="absolute inset-0 bg-dot-grid opacity-25 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column - Headline & CTAs */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface border border-borderStrong text-txtMuted text-xs font-mono shadow-sm">
              <Terminal className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-amber-500 font-bold">Skill-Gap Vector Matcher v2.5</span>
              <span className="text-txtMuted">| India & Remote</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-txtMain tracking-tight leading-[1.15]">
              Find your next <span className="text-amber-500 underline decoration-amber-500/30 underline-offset-8">dream career move</span>
            </h1>

            <p className="text-base sm:text-lg text-txtMuted max-w-2xl leading-relaxed">
              Discover 10,000+ verified tech roles with transparent packages, instant AI skill-gap analysis against real job descriptions, and voice interview practice.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onExploreClick}
                className="px-6 py-3.5 rounded-xl font-bold text-sm bg-amber-500 hover:bg-amber-600 text-black shadow-lg shadow-amber-500/25 flex items-center gap-2 transition-all cursor-pointer"
              >
                <span>Explore Openings</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onPrepClick}
                className="px-6 py-3.5 rounded-xl font-semibold text-sm bg-surface hover:bg-surface-nested text-txtMain border border-borderStrong transition-all cursor-pointer flex items-center gap-2 shadow-sm"
              >
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>AI Voice Interview Prep</span>
              </motion.button>
            </div>

            {/* Combined Quiet Stats Row */}
            <div className="pt-8 border-t border-borderSubtle/60 grid grid-cols-3 gap-6 max-w-xl">
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-txtMain font-mono tracking-tight">10,000+</div>
                <div className="text-xs text-txtMuted mt-0.5">Verified Roles</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-txtMain font-mono tracking-tight">500+</div>
                <div className="text-xs text-txtMuted mt-0.5">Hiring Partners</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-txtMain font-mono tracking-tight">50,000+</div>
                <div className="text-xs text-txtMuted mt-0.5">Placed Engineers</div>
              </div>
            </div>
          </div>

          {/* Right Column - Premium High-Contrast resume.diff IDE Component */}
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="bg-[#0B0F14] text-[#E6EDF3] border border-emerald-500/30 rounded-2xl shadow-[0_0_40px_rgba(74,222,128,0.12)] overflow-hidden font-mono text-sm max-w-md mx-auto lg:max-w-none relative"
            >
              {/* Preset Selector Tabs Header */}
              <div className="bg-[#161B22] px-3 py-2 border-b border-[#30363D] flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
                <div className="flex items-center gap-1.5 shrink-0">
                  <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
                  <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                  <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
                </div>

                <div className="flex items-center gap-1">
                  {Object.keys(PRESETS).map((key) => (
                    <button
                      key={key}
                      onClick={() => setActivePreset(key)}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-mono transition-all ${
                        activePreset === key
                          ? 'bg-[#21262D] text-amber-400 font-bold border border-amber-500/40 shadow-sm'
                          : 'text-[#8B949E] hover:text-[#C9D1D9] hover:bg-[#21262D]/50'
                      }`}
                    >
                      {key === 'frontend' ? 'Frontend' : key === 'ai_engineer' ? 'AI Eng' : 'Fullstack'}
                    </button>
                  ))}
                </div>

                <div className="text-[10px] text-emerald-400 font-mono flex items-center gap-1 shrink-0">
                  <GitCompare className="w-3 h-3 text-emerald-400" />
                  <span>git diff</span>
                </div>
              </div>

              {/* Title Info Row */}
              <div className="bg-[#0D1117] px-4 py-2.5 border-b border-[#30363D]/60 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 truncate">
                  <FileCode className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                  <span className="text-[#C9D1D9] font-semibold truncate">{currentData.title}</span>
                  <span className="text-[#8B949E] text-[10px] truncate">({currentData.role})</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40 shrink-0">
                  {currentData.score} Match
                </span>
              </div>

              {/* Editor Code Area */}
              <div className="p-4 space-y-2 min-h-[260px] bg-[#090D11]">
                <div className="space-y-1.5 font-mono text-xs">
                  {currentData.lines.slice(0, visibleLinesCount).map((lineItem, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.15 }}
                      className={`flex items-start gap-3 px-2 py-1 rounded transition-colors ${
                        lineItem.type === 'hunk'
                          ? 'bg-[#38BDF8]/10 text-sky-300 font-bold border-l-2 border-l-sky-400'
                          : lineItem.type === 'add'
                          ? 'bg-[#238636]/20 border-l-2 border-l-emerald-400 text-emerald-300'
                          : lineItem.type === 'gap'
                          ? 'bg-[#30363D]/40 border-l-2 border-l-slate-500 text-slate-400 border-dashed'
                          : 'bg-amber-500/15 border-l-2 border-l-amber-400 text-amber-300 mt-2 font-bold shadow-sm'
                      }`}
                    >
                      <span className="text-[#484F58] text-[10px] select-none shrink-0 w-4">{lineItem.line}</span>
                      <span className={`break-all ${lineItem.color}`}>{lineItem.text}</span>
                    </motion.div>
                  ))}

                  {visibleLinesCount < currentData.lines.length && !prefersReducedMotion && (
                    <div className="inline-block w-2 h-4 bg-amber-400 animate-pulse ml-6 align-middle" />
                  )}
                </div>

                {visibleLinesCount === currentData.lines.length && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="pt-3 border-t border-[#30363D]/50 text-[11px] text-[#8B949E] flex items-center justify-between"
                  >
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Vector Analysis Complete</span>
                    </div>
                    <span className="text-[10px] text-[#484F58]">1,420 vectors • 0.04s</span>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
