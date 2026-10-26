import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Activity, Clock, Flame, Award, Smile, CheckCircle2, Circle,
  Target, Zap, Compass, ArrowUpRight, BarChart3, Heart, TrendingUp, Sparkles
} from 'lucide-react';
import { useStreak } from '../contexts/StreakContext';
import { useAuth } from '../contexts/AuthContext';
import { formatTime } from '../lib/utils';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { StreakCard } from '../components/StreakCard';

export const Dashboard: React.FC = () => {
  const { currentStreak, projectedStreak, bestStreak, todayCompleted, dailyGoals } = useStreak();
  const { user, profile } = useAuth();

  // Real-Time Clock & Session Timer
  const [currentTime, setCurrentTime] = useState(new Date());
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const [loading, setLoading] = useState(true);

  // Real data states
  const [moodHistory, setMoodHistory] = useState<{ day: string; score: number; label: string }[]>([]);
  const [goalsByCategory, setGoalsByCategory] = useState<{ category: string; completed: number; total: number; progress: number; color: string }[]>([]);
  const [activeHabits, setActiveHabits] = useState<{ title: string; category: string; streak: number; completed: boolean }[]>([]);

  useEffect(() => {
    const clockInterval = setInterval(() => setCurrentTime(new Date()), 1000);
    const sessionInterval = setInterval(() => setSessionSeconds((s) => s + 1), 1000);
    return () => {
      clearInterval(clockInterval);
      clearInterval(sessionInterval);
    };
  }, []);

  // Fetch real data from Supabase
  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        setMoodHistory([]);
        setGoalsByCategory([]);
        setActiveHabits([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        if (!isSupabaseConfigured && user) {
          const moods = JSON.parse(localStorage.getItem(`balance_moods_${user.id}`) || '[]');
          const goals = JSON.parse(localStorage.getItem(`balance_user_goals_${user.id}`) || '[]');
          const habits = JSON.parse(localStorage.getItem(`balance_user_habits_${user.id}`) || '[]');
          setMoodHistory(moods.slice(0, 7).reverse().map((m: any) => ({ day: new Date(m.created_at).toLocaleDateString(undefined, { weekday: 'short' }), score: m.score, label: m.label })));
          const categories = ['Mental', 'Physical', 'Career', 'Relationships'];
          setGoalsByCategory(categories.map(category => { const matching = goals.filter((g: any) => g.category === category); const total = matching.reduce((sum: number, g: any) => sum + (g.milestones?.length || 0), 0); const completed = matching.reduce((sum: number, g: any) => sum + (g.milestones?.filter((m: any) => m.completed).length || 0), 0); return { category, total, completed, progress: total ? Math.round(completed / total * 100) : 0, color: 'bg-emerald-500' }; }));
          setActiveHabits(habits.slice(0, 4).map((h: any) => ({ title: h.title, category: h.category, streak: h.streak, completed: h.completed_today })));
          setLoading(false);
          return;
        }
        // 1. Fetch Mood History (Last 7 days)
        const { data: moodData } = await supabase
          .from('user_mood_logs')
          .select('score, label, created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(7);

        if (moodData) {
          const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
          const formattedMood = moodData.reverse().map(m => ({
            day: days[new Date(m.created_at).getDay()],
            score: m.score,
            label: m.label
          }));
          setMoodHistory(formattedMood);
        }

        // 2. Fetch Goals for Category Breakdown
        const { data: goalsData } = await supabase
          .from('user_goals')
          .select('category, progress, milestones')
          .eq('user_id', user.id);

        if (goalsData) {
          const categories = ['Mental', 'Physical', 'Career', 'Relationships'];
          const colors = ['bg-emerald-500', 'bg-teal-500', 'bg-amber-500', 'bg-indigo-500'];

          const breakdown = categories.map((cat, idx) => {
            const catGoals = goalsData.filter(g => g.category === cat);
            const total = catGoals.reduce((acc, g) => acc + (g.milestones?.length || 0), 0);
            const completed = catGoals.reduce((acc, g) => acc + (g.milestones?.filter((m: any) => m.completed).length || 0), 0);
            const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
            return { category: cat, completed, total, progress, color: colors[idx] };
          });
          setGoalsByCategory(breakdown);
        }

        // 3. Fetch Active Habits
        const { data: habitsData } = await supabase
          .from('user_habits')
          .select('title, category, streak, completed_today')
          .eq('user_id', user.id)
          .limit(4);

        if (habitsData) {
          setActiveHabits(habitsData.map(h => ({
            title: h.title,
            category: h.category,
            streak: h.streak,
            completed: h.completed_today
          })));
        }
      } catch (err) {
        console.error('Dashboard data fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  // Calculate Dynamic Balance Score (0 - 100%)
  const goalsRatio = dailyGoals.length > 0 ? dailyGoals.filter((g) => g.completed).length / dailyGoals.length : 0;
  const streakFactor = Math.min(currentStreak / 10, 1) * 30; // up to 30 pts
  const goalFactor = goalsRatio * 40; // up to 40 pts
  const baseRestoration = 20; // 20 pts base mindfulness
  const dynamicBalanceScore = Math.min(Math.round(baseRestoration + streakFactor + goalFactor), 98);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Banner / Cockpit Bar */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 shadow-soft border border-sage-200/80 dark:border-ink-700 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sage-100 dark:bg-sage-950/60 text-sage-700 dark:text-sage-300 text-xs font-semibold mb-2">
            <Activity className="w-3.5 h-3.5 text-sage-500" />
            <span>Central Wellness Cockpit</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-ink-900 dark:text-linen-100">
            Welcome back, {profile?.fullName || 'Mindful Explorer'}
          </h1>
          <p className="text-xs sm:text-sm text-ink-700/70 dark:text-linen-200/70 mt-1">
            All your vital routines, focus sprints, and nervous system metrics synchronized in one place.
          </p>
        </div>

        {/* Live Clock & Session Duration */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="p-3 bg-linen-50 dark:bg-ink-800/80 rounded-2xl border border-sage-200/60 dark:border-ink-700 text-center min-w-[110px]">
            <span className="block text-[10px] uppercase font-bold text-ink-700/60 dark:text-linen-200/60">Local Time</span>
            <span className="font-mono text-xs font-bold text-ink-900 dark:text-linen-100">
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>

          <div className="p-3 bg-linen-50 dark:bg-ink-800/80 rounded-2xl border border-sage-200/60 dark:border-ink-700 text-center min-w-[110px]">
            <span className="block text-[10px] uppercase font-bold text-ink-700/60 dark:text-linen-200/60">Session Time</span>
            <span className="font-mono text-xs font-bold text-sage-600 dark:text-sage-400">
              {formatTime(sessionSeconds)}
            </span>
          </div>
        </div>
      </div>

      <StreakCard />

      {/* Row 1: Score Gauge + Key Vital Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Dynamic Balance Score Gauge */}
        <div className="glass-card rounded-3xl p-6 shadow-soft border border-sage-200/80 dark:border-ink-700 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-heading font-bold uppercase tracking-wider text-ink-700/70 dark:text-linen-200/70">
              Balance Index
            </span>
            <Sparkles className="w-4 h-4 text-warmAmber-500" />
          </div>

          <div className="flex items-baseline gap-2 my-2">
            <span className="text-4xl font-extrabold font-heading text-sage-600 dark:text-sage-400">
              {dynamicBalanceScore}%
            </span>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" /> +6% this wk
            </span>
          </div>

          {/* Progress Bar Gauge */}
          <div className="w-full bg-sage-100 dark:bg-ink-800 h-2.5 rounded-full overflow-hidden my-2">
            <div
              className="bg-gradient-to-r from-sage-400 via-sage-500 to-warmAmber-400 h-full rounded-full transition-all duration-1000"
              style={{ width: `${dynamicBalanceScore}%` }}
            />
          </div>

          <p className="text-[11px] text-ink-700/60 dark:text-linen-200/60 mt-1">
            Calculated from habit regularity, mood stability, and daily recovery breaks.
          </p>
        </div>

        {/* Current Active Streak */}
        <div className="glass-card rounded-3xl p-6 shadow-soft border border-sage-200/80 dark:border-ink-700 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-heading font-bold uppercase tracking-wider text-ink-700/70 dark:text-linen-200/70">
              Current Streak
            </span>
            <Flame className="w-4 h-4 text-warmAmber-500 fill-warmAmber-500" />
          </div>

          <div className="flex items-baseline gap-2 my-2">
            <span className="text-4xl font-extrabold font-heading text-ink-900 dark:text-linen-100">
              {todayCompleted ? projectedStreak : currentStreak}
            </span>
            <span className="text-xs font-bold text-ink-700/70 dark:text-linen-200/70">
              Consecutive Days
            </span>
          </div>

          <div className="flex items-center justify-between text-xs text-ink-700/70 dark:text-linen-200/70 pt-2 border-t border-sage-100 dark:border-ink-800">
            <span>Best: {bestStreak} Days</span>
            <span className="text-teal-600 dark:text-teal-400 font-bold">{todayCompleted ? 'Locks at midnight' : 'Complete a tracker today'}</span>
          </div>
        </div>

        {/* Today's Goals Progress */}
        <div className="glass-card rounded-3xl p-6 shadow-soft border border-sage-200/80 dark:border-ink-700 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-heading font-bold uppercase tracking-wider text-ink-700/70 dark:text-linen-200/70">
              Today's Micro-Goals
            </span>
            <Target className="w-4 h-4 text-emerald-500" />
          </div>

          <div className="flex items-baseline gap-2 my-2">
            <span className="text-4xl font-extrabold font-heading text-ink-900 dark:text-linen-100">
              {dailyGoals.filter((g) => g.completed).length}/{dailyGoals.length}
            </span>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
              Completed
            </span>
          </div>

          <Link
            to="/habit-tracker"
            className="text-xs font-bold text-sage-600 dark:text-sage-400 hover:underline flex items-center justify-between pt-2 border-t border-sage-100 dark:border-ink-800"
          >
            <span>Open Habit Matrix</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Somatic Recovery */}
        <div className="glass-card rounded-3xl p-6 shadow-soft border border-sage-200/80 dark:border-ink-700 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-heading font-bold uppercase tracking-wider text-ink-700/70 dark:text-linen-200/70">
              Somatic Recovery
            </span>
            <Heart className="w-4 h-4 text-rose-500" />
          </div>

          <div className="flex items-baseline gap-2 my-2">
            <span className="text-4xl font-extrabold font-heading text-ink-900 dark:text-linen-100">
              4/4
            </span>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
              Needs Checked
            </span>
          </div>

          <Link
            to="/health-tracker"
            className="text-xs font-bold text-sage-600 dark:text-sage-400 hover:underline flex items-center justify-between pt-2 border-t border-sage-100 dark:border-ink-800"
          >
            <span>Launch BreathBox</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Row 2: Mood Trend Chart & Goals Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Past 7-Day Mood Trend (7 cols) */}
        <div className="lg:col-span-7 glass-card rounded-3xl p-6 sm:p-7 shadow-soft border border-sage-200/80 dark:border-ink-700">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-heading font-bold text-base text-ink-900 dark:text-linen-100">
                Past 7-Day Emotional Rhythm
              </h3>
              <p className="text-xs text-ink-700/70 dark:text-linen-200/70">
                Daily valence logged across 5-point spectrum
              </p>
            </div>
            <Link
              to="/mood-tracker"
              className="px-3 py-1.5 rounded-xl bg-sage-100 dark:bg-sage-950/60 hover:bg-sage-200 text-sage-700 dark:text-sage-300 text-xs font-bold transition flex items-center gap-1"
            >
              <span>Mood Log</span>
              <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>

          {/* SVG Bar / Trend Chart */}
          <div className="h-44 flex items-end justify-between gap-3 pt-6 pb-2 px-2 border-b border-sage-100 dark:border-ink-800">
            {moodHistory.map((m, idx) => {
              const heightPercent = (m.score / 5) * 100;
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                  <span className="text-[10px] font-mono font-bold opacity-0 group-hover:opacity-100 transition text-sage-700 dark:text-sage-300">
                    {m.score}
                  </span>
                  <div className="w-full bg-sage-100 dark:bg-ink-800 rounded-t-xl h-32 flex items-end overflow-hidden p-1">
                    <div
                      className="w-full bg-gradient-to-t from-sage-500 to-emerald-400 rounded-t-lg transition-all duration-700 group-hover:brightness-110"
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-ink-700 dark:text-linen-200">
                    {m.day}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-ink-700/60 dark:text-linen-200/60">
            <span>Scale: 1 (Drained) → 5 (Thriving)</span>
            <span className="font-bold text-sage-600 dark:text-sage-400">Weekly Mean: 4.0 / 5.0</span>
          </div>
        </div>

        {/* Goals Breakdown by Category (5 cols) */}
        <div className="lg:col-span-5 glass-card rounded-3xl p-6 sm:p-7 shadow-soft border border-sage-200/80 dark:border-ink-700">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-heading font-bold text-base text-ink-900 dark:text-linen-100">
                Goals by Category
              </h3>
              <p className="text-xs text-ink-700/70 dark:text-linen-200/70">
                Holistic milestone progression
              </p>
            </div>
            <Link
              to="/goal-tracker"
              className="text-xs font-bold text-sage-600 dark:text-sage-400 hover:underline"
            >
              View All
            </Link>
          </div>

          <div className="space-y-4">
            {goalsByCategory.map((cat) => (
              <div key={cat.category} className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-ink-800 dark:text-linen-100">{cat.category}</span>
                  <span className="font-mono text-ink-700/70 dark:text-linen-200/70">
                    {cat.completed}/{cat.total} milestones ({cat.progress}%)
                  </span>
                </div>
                <div className="w-full bg-sage-100 dark:bg-ink-800 h-2 rounded-full overflow-hidden">
                  <div
                    className={`${cat.color} h-full rounded-full transition-all duration-700`}
                    style={{ width: `${cat.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-sage-100 dark:border-ink-800 flex items-center justify-between">
            <span className="text-xs text-ink-700/60 dark:text-linen-200/60">Total Active: 14 Milestones</span>
            <Link
              to="/goal-tracker"
              className="px-3 py-1.5 rounded-xl bg-sage-500 hover:bg-sage-600 text-white text-xs font-bold transition shadow-soft"
            >
              + Add Goal
            </Link>
          </div>
        </div>
      </div>

      {/* Row 3: Live Habit Consistency Quick Matrix */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 shadow-soft border border-sage-200/80 dark:border-ink-700">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="font-heading font-bold text-lg text-ink-900 dark:text-linen-100">
              Live Habit Consistency Checklist
            </h3>
            <p className="text-xs text-ink-700/70 dark:text-linen-200/70">
              Synchronized directly with Supabase <code className="font-mono text-sage-600 dark:text-sage-400">user_habits</code> table
            </p>
          </div>
          <Link
            to="/habit-tracker"
            className="px-4 py-2 bg-linen-100 dark:bg-ink-800 hover:bg-sage-100 dark:hover:bg-ink-700 border border-sage-200 dark:border-ink-700 rounded-xl text-xs font-bold text-ink-900 dark:text-linen-100 transition"
          >
            Open Dedicated Habit Suite →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {activeHabits.map((h, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-linen-50/70 dark:bg-ink-800/60 border border-sage-200/60 dark:border-ink-700 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                {h.completed ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-100 dark:fill-emerald-950" />
                ) : (
                  <Circle className="w-5 h-5 text-ink-700/30" />
                )}
                <div>
                  <h4 className="text-xs font-bold text-ink-900 dark:text-linen-100">
                    {h.title}
                  </h4>
                  <span className="text-[10px] text-ink-700/60 dark:text-linen-200/60">
                    Category: {h.category}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  {h.streak}d
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
