import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Trophy, Target, Gift, Star } from 'lucide-react';

const STREAK_KEY = 'workverse_streak';
const LAST_VISIT_KEY = 'workverse_last_visit';

function getStreakData() {
  try {
    const lastVisit = localStorage.getItem(LAST_VISIT_KEY);
    const streak = parseInt(localStorage.getItem(STREAK_KEY) || '0');
    const today = new Date().toDateString();

    if (!lastVisit) {
      // First visit ever
      localStorage.setItem(LAST_VISIT_KEY, today);
      localStorage.setItem(STREAK_KEY, '1');
      return { streak: 1, isNewDay: true, justLeveledUp: false };
    }

    if (lastVisit === today) {
      // Already visited today
      return { streak: streak || 1, isNewDay: false, justLeveledUp: false };
    }

    const lastDate = new Date(lastVisit);
    const todayDate = new Date(today);
    const diffDays = Math.floor((todayDate - lastDate) / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      // Consecutive day
      const newStreak = streak + 1;
      localStorage.setItem(LAST_VISIT_KEY, today);
      localStorage.setItem(STREAK_KEY, String(newStreak));
      return { streak: newStreak, isNewDay: true, justLeveledUp: newStreak % 5 === 0 };
    } else {
      // Streak broken
      localStorage.setItem(LAST_VISIT_KEY, today);
      localStorage.setItem(STREAK_KEY, '1');
      return { streak: 1, isNewDay: true, justLeveledUp: false };
    }
  } catch {
    return { streak: 1, isNewDay: true, justLeveledUp: false };
  }
}

function getStreakLevel(streak) {
  if (streak >= 30) return { title: 'Career Legend', icon: <Trophy className="w-4 h-4 text-amber-400" />, color: 'amber', bg: 'bg-amber-500/10 border-amber-500/30' };
  if (streak >= 14) return { title: 'Job Hunter Pro', icon: <Star className="w-4 h-4 text-indigo-400" />, color: 'indigo', bg: 'bg-indigo-500/10 border-indigo-500/30' };
  if (streak >= 7) return { title: 'Rising Star', icon: <Target className="w-4 h-4 text-emerald-400" />, color: 'emerald', bg: 'bg-emerald-500/10 border-emerald-500/30' };
  if (streak >= 3) return { title: 'Getting Warm', icon: <Flame className="w-4 h-4 text-orange-400" />, color: 'orange', bg: 'bg-orange-500/10 border-orange-500/30' };
  return { title: 'Just Starting', icon: <Flame className="w-4 h-4 text-red-400" />, color: 'red', bg: 'bg-red-500/10 border-red-500/30' };
}

export default function StreakBanner() {
  const [streakData, setStreakData] = useState(null);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    setStreakData(getStreakData());
  }, []);

  if (!streakData || isDismissed) return null;

  const level = getStreakLevel(streakData.streak);
  const nextMilestone = Math.ceil(streakData.streak / 5) * 5;
  const progress = ((streakData.streak % 5) / 5) * 100 || 100;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10, height: 0 }}
        animate={{ opacity: 1, y: 0, height: 'auto' }}
        exit={{ opacity: 0, y: -10, height: 0 }}
        className="w-full overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className={`flex items-center justify-between gap-4 px-4 py-3 rounded-xl border ${level.bg} backdrop-blur-sm`}>
            <div className="flex items-center gap-3 min-w-0">
              {/* Streak Fire */}
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                className="shrink-0"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/30 flex items-center justify-center">
                  <span className="text-xl">🔥</span>
                </div>
              </motion.div>

              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-bold text-txtMain">
                    {streakData.streak}-Day Streak!
                  </span>
                  <span className={`flex items-center gap-1 px-2 py-0.5 text-[11px] font-bold rounded-md border ${level.bg}`}>
                    {level.icon}
                    {level.title}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 max-w-[120px] h-1.5 bg-surface rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 1.5, ease: 'easeOut', delay: 0.3 }}
                      className="h-full bg-gradient-to-r from-orange-500 to-amber-400 rounded-full"
                    />
                  </div>
                  <span className="text-[11px] text-txtMuted font-mono">{streakData.streak}/{nextMilestone} to next badge</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsDismissed(true)}
              className="text-txtMuted hover:text-txtMain text-xs shrink-0 opacity-60 hover:opacity-100 transition-opacity"
            >
              ✕
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
