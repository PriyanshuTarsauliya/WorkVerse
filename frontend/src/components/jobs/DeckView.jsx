import React, { useState, useEffect, useCallback } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import {
  MapPin, IndianRupee, Star, RotateCcw, Check, X, Volume2, VolumeX, Sparkles,
  Clock, Users, Layers, LayoutGrid, RotateCw
} from 'lucide-react';

// Format salary into LPA format
const formatSalaryRupees = (min, max) => {
  const minLakhs = (min / 100000).toFixed(min % 100000 === 0 ? 0 : 1);
  const maxLakhs = max ? (max / 100000).toFixed(max % 100000 === 0 ? 0 : 1) : null;
  return maxLakhs ? `₹${minLakhs} – ₹${maxLakhs} LPA` : `₹${minLakhs}+ LPA`;
};

// Format posted days
const formatPostedDate = (days) => {
  if (!days || days === 0) return 'Today';
  if (days === 1) return '1d ago';
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
};

// Web Audio API Synthesizer Sound Generator (No external files needed)
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

// Draggable Top Card Component
function SwipeableCard({ job, onSwipeRight, onSwipeLeft, onSelect, isTop, isSoundMuted }) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 0, 200], [-18, 0, 18]);
  
  // Stamp overlays opacity scaling
  const applyOpacity = useTransform(x, [20, 120], [0, 1]);
  const passOpacity = useTransform(x, [-20, -120], [0, 1]);

  const [exitDirection, setExitDirection] = useState(null);

  const handleDragEnd = (_, info) => {
    const threshold = 120;
    if (info.offset.x > threshold) {
      setExitDirection('right');
      if (!isSoundMuted) soundManager.playApplyChime();
      onSwipeRight(job);
    } else if (info.offset.x < -threshold) {
      setExitDirection('left');
      if (!isSoundMuted) soundManager.playPassClick();
      onSwipeLeft(job);
    }
  };

  const matchScore = job.matchScore || job.matchPct || 85;

  return (
    <motion.div
      style={{
        x: isTop ? x : 0,
        rotate: isTop ? rotate : 0,
      }}
      drag={isTop ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.8}
      onDragEnd={handleDragEnd}
      animate={
        exitDirection === 'right'
          ? { x: 600, rotate: 25, opacity: 0 }
          : exitDirection === 'left'
          ? { x: -600, rotate: -25, opacity: 0 }
          : { x: 0, rotate: 0, opacity: 1 }
      }
      transition={{ type: 'spring', stiffness: 400, damping: 28 }}
      className="absolute inset-0 bg-surface border border-borderStrong rounded-2xl p-6 shadow-2xl theme-transition cursor-grab active:cursor-grabbing select-none overflow-hidden flex flex-col justify-between"
    >
      {/* Visual Stamps Overlay */}
      {isTop && (
        <>
          {/* APPLY STAMP (Right Drag) */}
          <motion.div
            style={{ opacity: applyOpacity }}
            className="absolute top-8 left-8 z-30 px-4 py-1.5 border-4 border-emerald-500 text-emerald-500 rounded-xl text-xl font-extrabold tracking-wider uppercase transform -rotate-12 pointer-events-none bg-surface/80 backdrop-blur-xs shadow-lg"
          >
            APPLY & SAVE ✓
          </motion.div>

          {/* PASS STAMP (Left Drag) */}
          <motion.div
            style={{ opacity: passOpacity }}
            className="absolute top-8 right-8 z-30 px-4 py-1.5 border-4 border-rose-500 text-rose-500 rounded-xl text-xl font-extrabold tracking-wider uppercase transform rotate-12 pointer-events-none bg-surface/80 backdrop-blur-xs shadow-lg"
          >
            PASS ✕
          </motion.div>
        </>
      )}

      {/* Card Content Header */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-lg font-extrabold shadow-md shrink-0">
              {(job.company || 'W').charAt(0)}
            </div>
            <div>
              <h3 className="text-lg font-bold text-txtMain line-clamp-1">{job.title}</h3>
              <div className="flex items-center gap-2 text-xs text-txtMuted mt-0.5">
                <span className="font-semibold text-txtMain">{job.company}</span>
                {job.companyRating && (
                  <span className="flex items-center gap-0.5 text-amber-500 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-500" />
                    {job.companyRating}
                  </span>
                )}
              </div>
            </div>
          </div>

          <span className={`px-3 py-1 rounded-full text-xs font-extrabold border ${
            matchScore >= 80 ? 'bg-success-bg border-success/40 text-success' : 'bg-accent/15 border-accent/30 text-accent'
          }`}>
            {matchScore}% Match
          </span>
        </div>

        {/* Location & Salary Badges */}
        <div className="flex flex-wrap items-center gap-2 mb-3 text-xs font-semibold">
          <span className="flex items-center gap-1 text-txtMuted bg-nested border border-borderSubtle px-2.5 py-1 rounded-lg">
            <MapPin className="w-3.5 h-3.5" /> {job.location}
          </span>
          <span className="flex items-center gap-1 text-success bg-success-bg border border-success/30 px-2.5 py-1 rounded-lg font-bold">
            <IndianRupee className="w-3.5 h-3.5" /> {formatSalaryRupees(job.salaryMin, job.salaryMax)}
          </span>
          {(job.applicationCount || 0) < 10 ? (
            <span className="flex items-center gap-1 text-xs font-bold text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg">
              🚀 First 10 applicants!
            </span>
          ) : (
            <span className="flex items-center gap-1 text-xs font-bold text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-lg">
              🔥 {job.applicationCount} applied recently
            </span>
          )}
        </div>

        {/* Company Insight Snippet */}
        {job.companyInsights?.summary && (
          <div className="mb-3 px-3 py-1.5 rounded-xl bg-accent/5 border border-accent/20 text-xs font-medium text-txtMuted flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-accent shrink-0" />
            <span className="truncate">{job.companyInsights.summary}</span>
          </div>
        )}

        {/* Description Snippet */}
        <p className="text-sm text-txtMuted line-clamp-3 leading-relaxed mb-4">
          {job.description}
        </p>

        {/* Tech Stack Pills */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {(job.techStack || []).slice(0, 5).map((tech, i) => (
            <span key={i} className="px-2.5 py-1 text-xs font-medium text-txtMuted bg-nested border border-borderSubtle rounded-md">
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Card Footer Metadata */}
      <div className="pt-3 border-t border-borderSubtle flex items-center justify-between text-xs text-txtMuted font-medium">
        <span className="flex items-center gap-1">
          <Users className="w-3.5 h-3.5" /> {job.applicationCount || 0} applicants
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelect(job);
          }}
          className="text-xs font-bold text-accent hover:underline flex items-center gap-1 cursor-pointer pointer-events-auto"
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
    return saved !== null ? saved === 'true' : true; // Muted by default on 1st visit
  });
  const [showSoundHint, setShowSoundHint] = useState(() => {
    if (typeof window === 'undefined') return false;
    return !localStorage.getItem('workverse_deck_sound');
  });

  const [activeBtnFlash, setActiveBtnFlash] = useState(null); // 'pass' | 'apply' | 'undo'

  // Filter out rejected jobs for this session deck
  const activeDeckJobs = jobs.filter((j) => !rejectedIds.has(j.id));
  const topJob = activeDeckJobs[0];

  // Save sound mute setting
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

  // Keyboard navigation listener (ArrowLeft = Pass, ArrowRight = Apply, Ctrl+Z = Undo)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handleBtnPass();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleBtnApply();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        handleUndo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [topJob, lastSwipedStack]);

  return (
    <div className="flex flex-col items-center justify-center py-6 px-4 space-y-6">
      {/* Sound Mute Toggle & Hint Header */}
      <div className="flex items-center justify-between w-full max-w-md">
        <div className="flex items-center gap-2 text-xs font-semibold text-txtMuted">
          <Layers className="w-4 h-4 text-accent" />
          <span>Swipeable Job Deck ({activeDeckJobs.length} remaining)</span>
        </div>

        <div className="flex items-center gap-2">
          {showSoundHint && (
            <span className="text-[11px] font-bold text-accent bg-accent/15 border border-accent/30 px-2.5 py-1 rounded-full animate-bounce">
              🔊 Tap to enable swipe sounds
            </span>
          )}
          <button
            onClick={toggleMute}
            data-testid="sound-toggle"
            className={`p-2 rounded-xl border transition-colors ${
              !isSoundMuted
                ? 'bg-accent text-white border-accent shadow-md shadow-accent/20'
                : 'bg-nested border-borderStrong text-txtMuted hover:text-txtMain'
            }`}
            aria-label={isSoundMuted ? 'Unmute sounds' : 'Mute sounds'}
            title={isSoundMuted ? 'Enable Swipe Sounds' : 'Mute Sounds'}
          >
            {isSoundMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Card Deck Container */}
      <div className="relative w-full max-w-md h-[460px]">
        {activeDeckJobs.length > 0 ? (
          activeDeckJobs.slice(0, 4).map((job, index) => {
            const isTop = index === 0;
            const stackScale = 1 - index * 0.04;
            const stackTranslateY = index * 12;

            return (
              <motion.div
                key={job.id}
                data-testid={isTop ? 'deck-card' : `deck-card-stacked-${index}`}
                style={{
                  zIndex: 10 - index,
                  scale: isTop ? 1 : stackScale,
                  y: isTop ? 0 : stackTranslateY,
                }}
                className="absolute inset-0"
                transition={{ type: 'spring', stiffness: 350, damping: 28 }}
              >
                <SwipeableCard
                  job={job}
                  isTop={isTop}
                  isSoundMuted={isSoundMuted}
                  onSwipeRight={handleApply}
                  onSwipeLeft={handlePass}
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
            className="w-full h-full bg-surface border border-borderSubtle rounded-2xl p-8 flex flex-col items-center justify-center text-center space-y-4 shadow-xl"
          >
            <div className="w-14 h-14 rounded-2xl bg-accent/15 border border-accent/30 flex items-center justify-center text-accent shadow-md">
              <Sparkles className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-txtMain">You've reviewed all jobs!</h3>
              <p className="text-xs text-txtMuted mt-1 max-w-xs leading-relaxed">
                No more unreviewed cards in this deck. Reset the deck to review again or switch back to the Grid view.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={handleReshuffleDeck}
                className="px-4 py-2.5 text-xs font-bold text-white bg-accent hover:bg-accent-gradient rounded-xl transition-all shadow-md flex items-center gap-1.5"
              >
                <RotateCw className="w-4 h-4" /> Reset Deck
              </button>
              <button
                onClick={onSwitchToGrid}
                className="px-4 py-2.5 text-xs font-bold text-txtMain bg-nested border border-borderStrong hover:border-accent/40 rounded-xl transition-colors flex items-center gap-1.5"
              >
                <LayoutGrid className="w-4 h-4" /> Switch to Grid
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Button Controls Below Deck */}
      <div className="flex items-center gap-6 pt-2">
        {/* REJECT/PASS BUTTON */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleBtnPass}
          disabled={!topJob}
          data-testid="deck-pass-button"
          className={`w-14 h-14 rounded-full flex items-center justify-center border-2 transition-all shadow-lg ${
            activeBtnFlash === 'pass'
              ? 'bg-rose-500 border-rose-500 text-white scale-110 shadow-rose-500/40'
              : 'bg-surface border-rose-500/40 text-rose-500 hover:bg-rose-500/15 hover:border-rose-500'
          } disabled:opacity-40 disabled:cursor-not-allowed`}
          title="Pass / Reject (← Left Arrow)"
          aria-label="Pass Job"
        >
          <X className="w-6 h-6 stroke-[2.5]" />
        </motion.button>

        {/* UNDO BUTTON */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleUndo}
          disabled={lastSwipedStack.length === 0}
          data-testid="deck-undo-button"
          className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all shadow-md ${
            activeBtnFlash === 'undo'
              ? 'bg-amber-500 border-amber-500 text-white scale-110'
              : 'bg-surface border-borderStrong text-txtMuted hover:text-amber-500 hover:border-amber-500/40'
          } disabled:opacity-30 disabled:cursor-not-allowed`}
          title="Undo Last Swipe (Ctrl+Z)"
          aria-label="Undo Last Swipe"
        >
          <RotateCcw className="w-4 h-4" />
        </motion.button>

        {/* APPLY & SAVE BUTTON */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleBtnApply}
          disabled={!topJob}
          data-testid="deck-apply-button"
          className={`w-14 h-14 rounded-full flex items-center justify-center border-2 transition-all shadow-lg ${
            activeBtnFlash === 'apply'
              ? 'bg-emerald-500 border-emerald-500 text-white scale-110 shadow-emerald-500/40'
              : 'bg-surface border-emerald-500/40 text-emerald-500 hover:bg-emerald-500/15 hover:border-emerald-500'
          } disabled:opacity-40 disabled:cursor-not-allowed`}
          title="Apply & Save (Right Arrow →)"
          aria-label="Apply Job"
        >
          <Check className="w-6 h-6 stroke-[2.5]" />
        </motion.button>
      </div>

      <p className="text-[11px] text-txtMuted font-medium flex items-center gap-2">
        <span>💡 Keyboard Shortcuts: <kbd className="px-1.5 py-0.5 bg-nested border border-borderStrong rounded text-[10px]">←</kbd> Pass</span>
        <span><kbd className="px-1.5 py-0.5 bg-nested border border-borderStrong rounded text-[10px]">→</kbd> Apply</span>
        <span><kbd className="px-1.5 py-0.5 bg-nested border border-borderStrong rounded text-[10px]">Ctrl+Z</kbd> Undo</span>
      </p>
    </div>
  );
}
