import React, { useState, useEffect, useCallback } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import {
  MapPin, IndianRupee, Star, RotateCcw, Check, X, Volume2, VolumeX, Sparkles,
  Clock, Users, Layers, LayoutGrid, RotateCw, Zap, Flame, Award
} from 'lucide-react';

// Format salary into LPA format
const formatSalaryRupees = (min, max) => {
  const minLakhs = (min / 100000).toFixed(min % 100000 === 0 ? 0 : 1);
  const maxLakhs = max ? (max / 100000).toFixed(max % 100000 === 0 ? 0 : 1) : null;
  return maxLakhs ? `₹${minLakhs} – ₹${maxLakhs} LPA` : `₹${minLakhs}+ LPA`;
};

// Web Audio API Synthesizer Sound Generator (Zero external dependencies)
class DeckSoundSystem {
  constructor() {
    this.audioCtx = null;
  }

  initContext() {
    if (!this.audioCtx && typeof window !== 'undefined') {
      const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  playApplyChime() {
    try {
      this.initContext();
      if (!this.audioCtx) return;
      const ctx = this.audioCtx;
      const now = ctx.currentTime;

      // Ascending two-tone chime
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sine';
      osc2.type = 'sine';

      osc1.frequency.setValueAtTime(523.25, now); // C5
      osc1.frequency.exponentialRampToValueAtTime(659.25, now + 0.12); // E5

      osc2.frequency.setValueAtTime(659.25, now + 0.1);
      osc2.frequency.exponentialRampToValueAtTime(783.99, now + 0.22); // G5

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now + 0.08);
      osc1.stop(now + 0.28);
      osc2.stop(now + 0.28);
    } catch { /* Fallback silent catch */ }
  }

  playSuperLikeChime() {
    try {
      this.initContext();
      if (!this.audioCtx) return;
      const ctx = this.audioCtx;
      const now = ctx.currentTime;

      // Triumphant 3-tone arpeggio + sparkle frequency shift
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.06);

        gain.gain.setValueAtTime(0.18, now + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.3);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 0.3);
      });
    } catch { /* Fallback */ }
  }

  playPassClick() {
    try {
      this.initContext();
      if (!this.audioCtx) return;
      const ctx = this.audioCtx;
      const now = ctx.currentTime;

      // Soft neutral click/whoosh
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(110, now + 0.1);

      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.12);
    } catch { /* Fallback */ }
  }

  playUndoPop() {
    try {
      this.initContext();
      if (!this.audioCtx) return;
      const ctx = this.audioCtx;
      const now = ctx.currentTime;

      // Descending reverse pop sound
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(350, now);
      osc.frequency.exponentialRampToValueAtTime(480, now + 0.15);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.18);
    } catch { /* Fallback */ }
  }
}

const soundManager = new DeckSoundSystem();

// Draggable Holographic Card Component
function SwipeableCard({ job, onSwipeRight, onSwipeLeft, onSwipeUp, onSelect, isTop, isSoundMuted }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotate = useTransform(x, [-200, 0, 200], [-18, 0, 18]);

  // Stamp overlays opacity scaling based on drag position
  const applyOpacity = useTransform(x, [20, 120], [0, 1]);
  const passOpacity = useTransform(x, [-20, -120], [0, 1]);
  const superLikeOpacity = useTransform(y, [-20, -110], [0, 1]);

  // Glow border effect on drag
  const borderColorRight = useTransform(x, [0, 150], ['rgba(51,65,85,0.4)', 'rgba(16,185,129,0.8)']);
  const borderColorLeft = useTransform(x, [-150, 0], ['rgba(244,63,94,0.8)', 'rgba(51,65,85,0.4)']);

  const [exitDirection, setExitDirection] = useState(null);

  const handleDragEnd = (_, info) => {
    const xThreshold = 120;
    const yThreshold = -100;

    if (info.offset.y < yThreshold && Math.abs(info.offset.x) < 140) {
      setExitDirection('up');
      if (!isSoundMuted) soundManager.playSuperLikeChime();
      onSwipeUp(job);
    } else if (info.offset.x > xThreshold) {
      setExitDirection('right');
      if (!isSoundMuted) soundManager.playApplyChime();
      onSwipeRight(job);
    } else if (info.offset.x < -xThreshold) {
      setExitDirection('left');
      if (!isSoundMuted) soundManager.playPassClick();
      onSwipeLeft(job);
    }
  };

  const matchScore = job.matchScore || job.matchPct || 88;

  return (
    <motion.div
      style={{
        x: isTop ? x : 0,
        y: isTop ? y : 0,
        rotate: isTop ? rotate : 0,
      }}
      drag={isTop ? true : false}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.85}
      onDragEnd={handleDragEnd}
      animate={
        exitDirection === 'up'
          ? { y: -650, scale: 1.1, opacity: 0 }
          : exitDirection === 'right'
          ? { x: 650, rotate: 25, opacity: 0 }
          : exitDirection === 'left'
          ? { x: -650, rotate: -25, opacity: 0 }
          : { x: 0, y: 0, rotate: 0, opacity: 1 }
      }
      transition={{ type: 'spring', stiffness: 420, damping: 30 }}
      className="absolute inset-0 bg-slate-900/95 dark:bg-slate-900/95 backdrop-blur-2xl border border-slate-700/80 dark:border-indigo-500/30 rounded-3xl p-6 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] shadow-indigo-500/10 theme-transition cursor-grab active:cursor-grabbing select-none overflow-hidden flex flex-col justify-between group"
    >
      {/* Dynamic Background Holographic Glow Mesh */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-gradient-to-br from-indigo-500/20 via-purple-500/15 to-amber-500/20 rounded-full blur-3xl pointer-events-none group-hover:scale-125 transition-transform duration-700" />
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-gradient-to-tr from-sky-500/20 via-emerald-500/15 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Visual Action Stamp Overlays */}
      {isTop && (
        <>
          {/* APPLY STAMP (Right Drag) */}
          <motion.div
            style={{ opacity: applyOpacity }}
            className="absolute top-8 left-8 z-40 px-5 py-2 border-4 border-emerald-400 text-emerald-400 rounded-2xl text-xl font-black tracking-widest uppercase transform -rotate-12 pointer-events-none bg-slate-900/90 backdrop-blur-md shadow-[0_0_30px_rgba(52,211,153,0.6)]"
          >
            APPLY & SAVE ✓
          </motion.div>

          {/* PASS STAMP (Left Drag) */}
          <motion.div
            style={{ opacity: passOpacity }}
            className="absolute top-8 right-8 z-40 px-5 py-2 border-4 border-rose-500 text-rose-500 rounded-2xl text-xl font-black tracking-widest uppercase transform rotate-12 pointer-events-none bg-slate-900/90 backdrop-blur-md shadow-[0_0_30px_rgba(244,63,94,0.6)]"
          >
            PASS ✕
          </motion.div>

          {/* SUPER LIKE STAMP (Up Drag) */}
          <motion.div
            style={{ opacity: superLikeOpacity }}
            className="absolute top-1/3 left-1/2 -translate-x-1/2 z-40 px-6 py-2.5 border-4 border-sky-400 text-sky-400 rounded-2xl text-2xl font-black tracking-widest uppercase transform -rotate-6 pointer-events-none bg-slate-900/90 backdrop-blur-md shadow-[0_0_40px_rgba(56,189,248,0.7)] flex items-center gap-2"
          >
            <Star className="w-6 h-6 fill-sky-400 animate-spin" /> SUPER LIKE ★
          </motion.div>
        </>
      )}

      {/* Card Content Header */}
      <div className="relative z-10">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-600 to-sky-500 flex items-center justify-center text-white text-xl font-black shadow-lg shadow-indigo-500/30 shrink-0 border border-white/20">
              {(job.company || 'W').charAt(0)}
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-white line-clamp-1 tracking-tight drop-shadow-xs">{job.title}</h3>
              <div className="flex items-center gap-2 text-xs text-slate-300 mt-0.5">
                <span className="font-bold text-slate-200">{job.company}</span>
                {job.companyRating && (
                  <span className="flex items-center gap-0.5 text-amber-300 font-bold bg-amber-400/20 px-2 py-0.5 rounded-full border border-amber-400/30">
                    <Star className="w-3 h-3 fill-amber-300" />
                    {job.companyRating}
                  </span>
                )}
              </div>
            </div>
          </div>

          <span className={`px-3.5 py-1.5 rounded-full text-xs font-black border ${
            matchScore >= 80
              ? 'bg-emerald-500/25 border-emerald-400/50 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.25)]'
              : 'bg-indigo-500/25 border-indigo-400/50 text-indigo-300 shadow-[0_0_12px_rgba(99,102,241,0.25)]'
          }`}>
            {matchScore}% Match
          </span>
        </div>

        {/* Location, Salary & Badge Highlights */}
        <div className="flex flex-wrap items-center gap-2 mb-3.5 text-xs font-semibold">
          <span className="flex items-center gap-1.5 text-slate-200 bg-slate-800/80 border border-slate-700/70 px-3 py-1.5 rounded-xl backdrop-blur-md shadow-xs">
            <MapPin className="w-3.5 h-3.5 text-sky-400" /> {job.location}
          </span>
          <span className="flex items-center gap-1.5 text-emerald-300 bg-emerald-950/70 border border-emerald-500/40 px-3 py-1.5 rounded-xl font-extrabold shadow-[0_0_10px_rgba(16,185,129,0.15)]">
            <IndianRupee className="w-3.5 h-3.5" /> {formatSalaryRupees(job.salaryMin, job.salaryMax)}
          </span>
          {(job.applicationCount || 0) < 10 ? (
            <span className="flex items-center gap-1 text-xs font-bold text-emerald-300 bg-emerald-950/70 border border-emerald-500/40 px-3 py-1.5 rounded-xl shadow-xs">
              <Zap className="w-3.5 h-3.5 fill-emerald-300 text-emerald-300" /> Fast Track Applicant
            </span>
          ) : (
            <span className="flex items-center gap-1 text-xs font-bold text-amber-300 bg-amber-950/70 border border-amber-500/40 px-3 py-1.5 rounded-xl shadow-xs">
              <Flame className="w-3.5 h-3.5 fill-amber-300 text-amber-300" /> {job.applicationCount} Applied
            </span>
          )}
        </div>

        {/* Company Insight Snippet */}
        {job.companyInsights?.summary && (
          <div className="mb-3.5 px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-950/80 via-purple-950/80 to-slate-900/80 border border-indigo-500/35 text-xs font-semibold text-indigo-200 flex items-center gap-2 backdrop-blur-md shadow-xs">
            <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 animate-pulse" />
            <span className="truncate">{job.companyInsights.summary}</span>
          </div>
        )}

        {/* Job Description Preview */}
        <p className="text-sm text-slate-300 line-clamp-3 leading-relaxed mb-4 font-normal drop-shadow-xs">
          {job.description}
        </p>

        {/* Tech Stack Interactive Pills */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {(job.techStack || []).slice(0, 5).map((tech, i) => (
            <motion.span
              key={i}
              whileHover={{ scale: 1.05 }}
              className="px-3 py-1 text-xs font-semibold text-indigo-200 bg-indigo-950/70 border border-indigo-500/35 rounded-xl hover:border-indigo-400 hover:bg-indigo-900/70 hover:text-white transition-all shadow-xs"
            >
              {tech}
            </motion.span>
          ))}
        </div>
      </div>

      {/* Card Footer */}
      <div className="relative z-10 pt-3.5 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-300 font-medium">
        <span className="flex items-center gap-1.5 text-slate-300 font-medium">
          <Users className="w-4 h-4 text-indigo-400" /> {job.applicationCount || 0} active applicants
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelect(job);
          }}
          className="px-3.5 py-1.5 rounded-xl text-xs font-black text-sky-300 bg-sky-950/70 hover:bg-sky-900/90 border border-sky-400/40 hover:border-sky-300 transition-all shadow-xs flex items-center gap-1 cursor-pointer pointer-events-auto"
        >
          View Details ↗
        </button>
      </div>
    </motion.div>
  );
}

// Main DeckView Component Export
export default function DeckView({
  jobs = [],
  onApply,
  onToggleBookmark,
  onSwitchToGrid,
}) {
  const [rejectedIds, setRejectedIds] = useState(new Set());
  const [lastSwipedStack, setLastSwipedStack] = useState([]);
  const [isSoundMuted, setIsSoundMuted] = useState(() => {
    if (typeof window === 'undefined') return true;
    const saved = localStorage.getItem('workverse_deck_sound');
    return saved !== null ? saved === 'true' : true;
  });
  const [showSoundHint, setShowSoundHint] = useState(() => {
    if (typeof window === 'undefined') return false;
    return !localStorage.getItem('workverse_deck_sound');
  });

  const [activeBtnFlash, setActiveBtnFlash] = useState(null); // 'pass' | 'apply' | 'superlike' | 'undo'

  // Filter out rejected/swiped jobs for this session
  const activeDeckJobs = jobs.filter((j) => !rejectedIds.has(j.id));
  const topJob = activeDeckJobs[0];

  const toggleMute = () => {
    const newMuted = !isSoundMuted;
    setIsSoundMuted(newMuted);
    localStorage.setItem('workverse_deck_sound', String(newMuted));
    if (showSoundHint) setShowSoundHint(false);
  };

  const handleApply = useCallback((job) => {
    if (!job) return;
    if (!job.isBookmarked) onToggleBookmark(job.id);
    setRejectedIds((prev) => new Set(prev).add(job.id));
    setLastSwipedStack((prev) => [...prev, { job, action: 'apply' }]);
  }, [onToggleBookmark]);

  const handleSuperLike = useCallback((job) => {
    if (!job) return;
    if (!job.isBookmarked) onToggleBookmark(job.id);
    onApply(job);
    setRejectedIds((prev) => new Set(prev).add(job.id));
    setLastSwipedStack((prev) => [...prev, { job, action: 'superlike' }]);
  }, [onApply, onToggleBookmark]);

  const handlePass = useCallback((job) => {
    if (!job) return;
    setRejectedIds((prev) => new Set(prev).add(job.id));
    setLastSwipedStack((prev) => [...prev, { job, action: 'pass' }]);
  }, []);

  const handleUndo = useCallback(() => {
    if (lastSwipedStack.length === 0) return;
    const last = lastSwipedStack[lastSwipedStack.length - 1];
    setLastSwipedStack((prev) => prev.slice(0, -1));
    setRejectedIds((prev) => {
      const next = new Set(prev);
      next.delete(last.job.id);
      return next;
    });
    if (!isSoundMuted) soundManager.playUndoPop();
    setActiveBtnFlash('undo');
    setTimeout(() => setActiveBtnFlash(null), 300);
  }, [lastSwipedStack, isSoundMuted]);

  const handleBtnPass = () => {
    if (!topJob) return;
    if (!isSoundMuted) soundManager.playPassClick();
    setActiveBtnFlash('pass');
    setTimeout(() => setActiveBtnFlash(null), 300);
    handlePass(topJob);
  };

  const handleBtnSuperLike = () => {
    if (!topJob) return;
    if (!isSoundMuted) soundManager.playSuperLikeChime();
    setActiveBtnFlash('superlike');
    setTimeout(() => setActiveBtnFlash(null), 300);
    handleSuperLike(topJob);
  };

  const handleBtnApply = () => {
    if (!topJob) return;
    if (!isSoundMuted) soundManager.playApplyChime();
    setActiveBtnFlash('apply');
    setTimeout(() => setActiveBtnFlash(null), 300);
    handleApply(topJob);
  };

  const handleReshuffleDeck = () => {
    setRejectedIds(new Set());
    setLastSwipedStack([]);
  };

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handleBtnPass();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleBtnApply();
      } else if (e.key === 'ArrowUp' || e.key.toLowerCase() === 's') {
        e.preventDefault();
        handleBtnSuperLike();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        handleUndo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [topJob, lastSwipedStack]);

  return (
    <div className="flex flex-col items-center justify-center py-6 px-4 space-y-6">
      {/* Sound Mute Toggle & Header Info */}
      <div className="flex items-center justify-between w-full max-w-md">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
          <Layers className="w-4 h-4 text-indigo-400" />
          <span>Swipeable Deck ({activeDeckJobs.length} roles remaining)</span>
        </div>

        <div className="flex items-center gap-2">
          {showSoundHint && (
            <span className="text-[11px] font-bold text-sky-400 bg-sky-500/15 border border-sky-500/30 px-2.5 py-1 rounded-full animate-bounce">
              🔊 Tap to enable sound effects
            </span>
          )}
          <button
            onClick={toggleMute}
            data-testid="sound-toggle"
            className={`p-2 rounded-xl border transition-all ${
              !isSoundMuted
                ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-500/25'
                : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
            }`}
            aria-label={isSoundMuted ? 'Unmute sounds' : 'Mute sounds'}
            title={isSoundMuted ? 'Enable Swipe Sounds' : 'Mute Sounds'}
          >
            {isSoundMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* 3D Card Deck Container */}
      <div className="relative w-full max-w-md h-[480px]">
        {activeDeckJobs.length > 0 ? (
          activeDeckJobs.slice(0, 4).map((job, index) => {
            const isTop = index === 0;
            const stackScale = 1 - index * 0.04;
            const stackTranslateY = index * 14;
            // Messy deck rotation offset effect for physical realism
            const stackRotate = isTop ? 0 : index % 2 === 1 ? index * 2.5 : -(index * 2.5);

            return (
              <motion.div
                key={job.id}
                data-testid={isTop ? 'deck-card' : `deck-card-stacked-${index}`}
                style={{
                  zIndex: 10 - index,
                  scale: isTop ? 1 : stackScale,
                  y: isTop ? 0 : stackTranslateY,
                  rotateZ: isTop ? 0 : stackRotate,
                  filter: !isTop ? `blur(${index * 0.5}px)` : 'none',
                  opacity: 1 - index * 0.1,
                }}
                className="absolute inset-0"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              >
                <SwipeableCard
                  job={job}
                  isTop={isTop}
                  isSoundMuted={isSoundMuted}
                  onSwipeRight={handleApply}
                  onSwipeLeft={handlePass}
                  onSwipeUp={handleSuperLike}
                  onSelect={onApply}
                />
              </motion.div>
            );
          })
        ) : (
          /* Empty Deck State */
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full h-full bg-slate-900/95 backdrop-blur-2xl border border-slate-700/80 rounded-3xl p-8 flex flex-col items-center justify-center text-center space-y-4 shadow-2xl text-slate-200"
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500/30 to-purple-500/30 border border-indigo-500/40 flex items-center justify-center text-indigo-300 shadow-lg">
              <Sparkles className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Deck Complete!</h3>
              <p className="text-xs text-slate-300 mt-1 max-w-xs leading-relaxed">
                You've reviewed all available cards in this session deck. Reset to review again or switch back to Grid view.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={handleReshuffleDeck}
                className="px-5 py-2.5 text-xs font-bold text-black bg-gradient-to-r from-amber-400 to-orange-500 hover:brightness-110 rounded-xl transition-all shadow-lg flex items-center gap-2 cursor-pointer"
              >
                <RotateCw className="w-4 h-4" /> Reset Deck
              </button>
              <button
                onClick={onSwitchToGrid}
                className="px-5 py-2.5 text-xs font-bold text-white bg-slate-800 border border-slate-700 hover:border-indigo-500/50 rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
              >
                <LayoutGrid className="w-4 h-4" /> Switch to Grid
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Control Buttons Bar */}
      <div className="flex items-center gap-4 pt-2">
        {/* REJECT / PASS BUTTON */}
        <motion.button
          whileHover={{ scale: 1.12 }}
          whileTap={{ scale: 0.88 }}
          onClick={handleBtnPass}
          disabled={!topJob}
          data-testid="deck-pass-button"
          className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-lg ${
            activeBtnFlash === 'pass'
              ? 'bg-rose-600 border-2 border-rose-400 text-white scale-110 shadow-[0_0_25px_rgba(244,63,94,0.7)]'
              : 'bg-slate-900/90 border-2 border-rose-500/50 text-rose-400 hover:bg-rose-600 hover:text-white hover:border-rose-400 hover:shadow-[0_0_20px_rgba(244,63,94,0.5)]'
          } disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer`}
          title="Pass / Reject (← Left Arrow)"
          aria-label="Pass Job"
        >
          <X className="w-6 h-6 stroke-[3]" />
        </motion.button>

        {/* UNDO BUTTON */}
        <motion.button
          whileHover={{ scale: 1.12 }}
          whileTap={{ scale: 0.88 }}
          onClick={handleUndo}
          disabled={lastSwipedStack.length === 0}
          data-testid="deck-undo-button"
          className={`w-11 h-11 rounded-xl flex items-center justify-center border transition-all shadow-md ${
            activeBtnFlash === 'undo'
              ? 'bg-amber-500 border-amber-400 text-white scale-110 shadow-lg'
              : 'bg-slate-900/90 border border-slate-700/80 text-slate-300 hover:text-amber-300 hover:border-amber-400/60 hover:bg-amber-950/50'
          } disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer`}
          title="Undo Last Swipe (Ctrl+Z)"
          aria-label="Undo Last Swipe"
        >
          <RotateCcw className="w-4 h-4" />
        </motion.button>

        {/* SUPER LIKE BUTTON */}
        <motion.button
          whileHover={{ scale: 1.12 }}
          whileTap={{ scale: 0.88 }}
          onClick={handleBtnSuperLike}
          disabled={!topJob}
          data-testid="deck-superlike-button"
          className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all shadow-lg ${
            activeBtnFlash === 'superlike'
              ? 'bg-sky-400 border-2 border-sky-300 text-black scale-110 shadow-[0_0_25px_rgba(56,189,248,0.7)]'
              : 'bg-slate-900/90 border-2 border-sky-400/50 text-sky-300 hover:bg-sky-500 hover:text-black hover:border-sky-300 hover:shadow-[0_0_20px_rgba(56,189,248,0.5)]'
          } disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer`}
          title="Super Like (↑ Up Arrow or 'S')"
          aria-label="Super Like Job"
        >
          <Star className="w-5 h-5 fill-sky-400" />
        </motion.button>

        {/* APPLY & SAVE BUTTON */}
        <motion.button
          whileHover={{ scale: 1.12 }}
          whileTap={{ scale: 0.88 }}
          onClick={handleBtnApply}
          disabled={!topJob}
          data-testid="deck-apply-button"
          className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-lg ${
            activeBtnFlash === 'apply'
              ? 'bg-emerald-600 border-2 border-emerald-400 text-white scale-110 shadow-[0_0_25px_rgba(16,185,129,0.7)]'
              : 'bg-slate-900/90 border-2 border-emerald-500/50 text-emerald-400 hover:bg-emerald-600 hover:text-white hover:border-emerald-400 hover:shadow-[0_0_20px_rgba(16,185,129,0.5)]'
          } disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer`}
          title="Apply & Save (Right Arrow →)"
          aria-label="Apply Job"
        >
          <Check className="w-6 h-6 stroke-[3]" />
        </motion.button>
      </div>

      {/* Shortcuts Guidance Footer */}
      <p className="text-[11px] text-slate-300 font-semibold flex flex-wrap items-center justify-center gap-3">
        <span><kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-[10px] text-white">←</kbd> Pass</span>
        <span><kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-[10px] text-white">↑</kbd> Super Like</span>
        <span><kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-[10px] text-white">→</kbd> Apply</span>
        <span><kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-[10px] text-white">Ctrl+Z</kbd> Undo</span>
      </p>
    </div>
  );
}
