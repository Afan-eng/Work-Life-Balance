import React from 'react';
import { Flame, Snowflake, Award, Calendar, CheckCircle2, Circle, Sparkles } from 'lucide-react';
import { useStreak } from '../contexts/StreakContext';

export const StreakCard: React.FC = () => {
  const { currentStreak, bestStreak, freezeTokens, completionMatrix, useFreezeToken, recordActivity } = useStreak();

  // Get last 7 days names and dates
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date();

  const last7Days = Array.from({ length: 7 }).map((_, index) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (6 - index));
    const dateStr = d.toISOString().split('T')[0];
    const isToday = index === 6;
    const dayName = days[d.getDay()];
    const isCompleted = Boolean(completionMatrix[dateStr]);

    return {
      dateStr,
      dayName,
      dayNumber: d.getDate(),
      isToday,
      isCompleted,
    };
  });

  const handleUseFreeze = () => {
    const success = useFreezeToken();
    if (success) {
      alert('Freeze token activated! Your streak is protected for 24 hours against missed rituals.');
    } else {
      alert('No streak freeze tokens available. Complete a 7-day milestone to earn another token!');
    }
  };

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-7 shadow-lift relative overflow-hidden border border-sage-200/80 dark:border-ink-700">
      {/* Subtle background glow */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-amber-400/10 via-sage-400/10 to-transparent rounded-full blur-2xl pointer-events-none" />

      {/* Top metrics row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-sage-100 dark:border-ink-800 pb-5">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-warmAmber-400 to-warmAmber-600 flex items-center justify-center text-white shadow-soft">
            <Flame className="w-8 h-8 fill-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading font-extrabold text-3xl text-ink-900 dark:text-linen-100">
                {currentStreak}
              </span>
              <span className="text-sm font-bold text-warmAmber-600 dark:text-warmAmber-400 uppercase tracking-wide">
                Day Streak
              </span>
            </div>
            <p className="text-xs text-ink-700/70 dark:text-linen-200/70">
              Synced with Supabase engine & daily micro-rituals
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Best Record */}
          <div className="px-3.5 py-2 rounded-2xl bg-linen-100/80 dark:bg-ink-800/80 border border-sage-200/60 dark:border-ink-700 flex items-center gap-2">
            <Award className="w-4 h-4 text-warmAmber-500" />
            <div className="text-left">
              <span className="block text-[10px] uppercase font-bold text-ink-700/60 dark:text-linen-200/60">Best Record</span>
              <span className="text-xs font-bold text-ink-900 dark:text-linen-100">{bestStreak} Days</span>
            </div>
          </div>

          {/* Freeze Tokens */}
          <button
            onClick={handleUseFreeze}
            className="px-3.5 py-2 rounded-2xl bg-teal-50 dark:bg-teal-950/40 hover:bg-teal-100 dark:hover:bg-teal-900/40 border border-teal-200 dark:border-teal-800 flex items-center gap-2 transition"
            title="Click to apply streak freeze protection"
          >
            <Snowflake className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <div className="text-left">
              <span className="block text-[10px] uppercase font-bold text-teal-700/70 dark:text-teal-300/70">Freeze Shields</span>
              <span className="text-xs font-bold text-teal-800 dark:text-teal-200">{freezeTokens} Available</span>
            </div>
          </button>
        </div>
      </div>

      {/* 7-Day Matrix */}
      <div className="mt-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold font-heading text-ink-900 dark:text-linen-100 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-sage-600 dark:text-sage-400" />
            7-Day Ritual Matrix
          </span>
          <span className="text-[11px] text-sage-600 dark:text-sage-400 font-medium">
            Tap today to log activity
          </span>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {last7Days.map((d) => (
            <button
              key={d.dateStr}
              onClick={() => {
                if (d.isToday) {
                  recordActivity('moment', 'Quick Check-in from Streak Card');
                }
              }}
              className={`p-2.5 rounded-2xl border text-center transition flex flex-col items-center justify-center gap-1.5 ${
                d.isToday
                  ? 'border-sage-500 bg-sage-50 dark:bg-sage-950/60 ring-2 ring-sage-500/20'
                  : 'border-sage-200/60 dark:border-ink-800 bg-white/60 dark:bg-ink-800/40'
              }`}
            >
              <span className="text-[10px] uppercase font-bold text-ink-700/60 dark:text-linen-200/60">
                {d.dayName}
              </span>
              <span className="text-xs font-extrabold text-ink-900 dark:text-linen-100">
                {d.dayNumber}
              </span>
              {d.isCompleted ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-500 fill-emerald-100 dark:fill-emerald-950" />
              ) : (
                <Circle className="w-4 h-4 text-ink-700/30 dark:text-linen-200/30" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
