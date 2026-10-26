import React, { useState, useEffect } from 'react';
import {
  CheckCircle2, Circle, Plus, Flame, Sparkles, Filter,
  Trash2, X, Target, Calendar, Award
} from 'lucide-react';
import { useStreak } from '../contexts/StreakContext';
import { useAuth } from '../contexts/AuthContext';
import { supabase, isSupabaseConfigured, type UserHabitRecord } from '../lib/supabase';
import confetti from 'canvas-confetti';
import { getLocalDateKey, shiftDateKey } from '../lib/utils';

const streakFromDates = (dates: string[], today: string) => {
  const completed = new Set(dates);
  let cursor = completed.has(today) ? today : shiftDateKey(today, -1);
  let streak = 0;
  while (completed.has(cursor)) { streak += 1; cursor = shiftDateKey(cursor, -1); }
  return streak;
};

export const HabitTracker: React.FC = () => {
  const { recordActivity } = useStreak();
  const { user } = useAuth();

  const [habits, setHabits] = useState<UserHabitRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'mind' | 'body' | 'focus' | 'rest'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New habit form states
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'mind' | 'body' | 'focus' | 'rest'>('mind');
  const [newFrequency, setNewFrequency] = useState<'daily' | 'weekdays' | 'weekend'>('daily');

  // Fetch habits on mount
  useEffect(() => {
    const fetchHabits = async () => {
      if (isSupabaseConfigured && user) {
        const { data, error } = await supabase
          .from('user_habits')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (!error && data) {
          const today = getLocalDateKey();
          setHabits((data as UserHabitRecord[]).map((habit) => {
            const history = Array.isArray(habit.history) ? habit.history : [];
            return { ...habit, history, completed_today: history.includes(today), streak: streakFromDates(history, today) };
          }));
        }
      } else {
        const saved = user ? localStorage.getItem(`balance_user_habits_${user.id}`) : null;
        if (saved) {
          try {
            const today = getLocalDateKey();
            setHabits((JSON.parse(saved) as UserHabitRecord[]).map((habit) => {
              const history = Array.isArray(habit.history) ? habit.history : [];
              return { ...habit, history, completed_today: history.includes(today), streak: streakFromDates(history, today) };
            }));
          } catch (e) {
            setHabits([]);
          }
        } else {
          setHabits([]);
        }
      }
      setLoading(false);
    };

    fetchHabits();
  }, [user]);

  const saveHabits = async (newHabits: UserHabitRecord[]) => {
    setHabits(newHabits);
    if (user) localStorage.setItem(`balance_user_habits_${user.id}`, JSON.stringify(newHabits));
  };

  const handleToggleHabit = async (id: string) => {
    const habit = habits.find(h => h.id === id);
    if (!habit) return;

    const today = getLocalDateKey();
    const history = Array.isArray(habit.history) ? [...habit.history] : [];
    const nextCompleted = !history.includes(today);
    const nextHistory = nextCompleted ? [...history, today] : history.filter((date) => date !== today);
    const updatedHabit = {
      ...habit,
      completed_today: nextCompleted,
      history: nextHistory,
      streak: streakFromDates(nextHistory, today),
    };
    if (isSupabaseConfigured && user) {
      const { error } = await supabase.from('user_habits').upsert(updatedHabit);
      if (error) { alert(`Habit could not be saved: ${error.message}`); return; }
    }
    saveHabits(habits.map(h => h.id === id ? updatedHabit : h));

    if (nextCompleted) {
      recordActivity('habit', `Completed habit: ${habit.title}`);
      try { confetti({ particleCount: 40, spread: 60, origin: { y: 0.8 }, colors: ['#2F9A5D', '#38B76E', '#FCD466'] }); } catch { /* optional animation */ }
    }
  };

  const handleAddHabit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newHabit: Partial<UserHabitRecord> = {
      user_id: user?.id || '',
      title: newTitle.trim(),
      category: newCategory,
      frequency: newFrequency,
      streak: 0,
      completed_today: false,
      history: [],
    };

    if (isSupabaseConfigured && user) {
      const { data, error } = await supabase
        .from('user_habits')
        .insert(newHabit)
        .select()
        .single();

      if (!error && data) {
        saveHabits([data as UserHabitRecord, ...habits]);
      }
    } else if (user) {
      const demoHabit = { ...newHabit, id: `h_${Date.now()}` } as UserHabitRecord;
      saveHabits([demoHabit, ...habits]);
    }

    setNewTitle('');
    setIsAddModalOpen(false);
  };

  const handleDeleteHabit = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();

    if (isSupabaseConfigured && user) {
      await supabase.from('user_habits').delete().eq('id', id);
    }

    saveHabits(habits.filter((h) => h.id !== id));
  };

  const filteredHabits = categoryFilter === 'all'
    ? habits
    : habits.filter((h) => h.category === categoryFilter);

  const completedCount = habits.filter((h) => h.completed_today).length;
  const completionPercentage = habits.length ? Math.round((completedCount / habits.length) * 100) : 0;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sage-100 dark:bg-sage-950/60 text-sage-700 dark:text-sage-300 text-xs font-semibold mb-2">
            <Target className="w-3.5 h-3.5 text-sage-500" />
            <span>Habit Architecture</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-ink-900 dark:text-linen-100">
            Daily Consistency Matrix
          </h1>
          <p className="text-xs sm:text-sm text-ink-700/70 dark:text-linen-200/70 mt-1">
            Build unshakeable momentum through microscopic rituals synced with Supabase.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-5 py-2.5 rounded-2xl bg-sage-500 hover:bg-sage-600 text-white text-xs font-bold shadow-soft hover:shadow-lift transition flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Custom Habit</span>
        </button>
      </div>

      {/* Overview Metric Banner */}
      <div className="glass-card rounded-3xl p-6 sm:p-7 shadow-soft border border-sage-200/80 dark:border-ink-700 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-sage-100 dark:bg-sage-950 text-sage-600 flex items-center justify-center font-heading font-extrabold text-2xl shadow-inner">
            {completionPercentage}%
          </div>
          <div>
            <h3 className="font-heading font-bold text-base text-ink-900 dark:text-linen-100">
              Today's Execution Rate
            </h3>
            <p className="text-xs text-ink-700/70 dark:text-linen-200/70">
              {completedCount} of {habits.length} rituals checked off
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full sm:w-64 bg-sage-100 dark:bg-ink-800 h-3 rounded-full overflow-hidden">
          <div
            className="bg-sage-500 h-full rounded-full transition-all duration-700"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {(['all', 'mind', 'body', 'focus', 'rest'] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold capitalize transition ${
              categoryFilter === cat
                ? 'bg-sage-500 text-white shadow-soft'
                : 'bg-linen-100 dark:bg-ink-800 text-ink-800 dark:text-linen-200 hover:bg-sage-100 border border-sage-200/60 dark:border-ink-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Habits List */}
      <div className="space-y-3">
        {loading ? (
          <div className="text-center py-20 animate-pulse">
            <Sparkles className="w-10 h-10 text-sage-300 mx-auto mb-4" />
            <p className="text-sm text-ink-700/60 dark:text-linen-200/60">Calibrating your habit matrix...</p>
          </div>
        ) : filteredHabits.length === 0 ? (
          <div className="text-center py-20 glass-card rounded-3xl border border-sage-200/60">
            <Target className="w-10 h-10 text-sage-300 mx-auto mb-4" />
            <p className="text-sm text-ink-900 dark:text-linen-100 font-bold">No habits in this category yet.</p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="text-xs text-sage-600 font-bold mt-2 hover:underline"
            >
              + Create your first habit
            </button>
          </div>
        ) : filteredHabits.map((habit) => (
          <div
            key={habit.id}
            onClick={() => handleToggleHabit(habit.id)}
            className={`glass-card rounded-2xl p-4 sm:p-5 border cursor-pointer transition flex items-center justify-between gap-4 group ${
              habit.completed_today
                ? 'border-emerald-300 dark:border-emerald-800 bg-emerald-50/40 dark:bg-emerald-950/30'
                : 'border-sage-200/70 dark:border-ink-700 hover:bg-linen-100 dark:hover:bg-ink-800/60'
            }`}
          >
            <div className="flex items-center gap-3.5">
              {habit.completed_today ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-500 fill-emerald-100 dark:fill-emerald-950 shrink-0" />
              ) : (
                <Circle className="w-6 h-6 text-ink-700/30 dark:text-linen-200/30 group-hover:text-sage-500 shrink-0" />
              )}
              <div>
                <h4
                  className={`text-sm font-bold font-heading ${
                    habit.completed_today
                      ? 'line-through text-ink-700/50 dark:text-linen-200/50'
                      : 'text-ink-900 dark:text-linen-100'
                  }`}
                >
                  {habit.title}
                </h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-sage-100 dark:bg-sage-950 text-sage-700 dark:text-sage-300">
                    {habit.category}
                  </span>
                  <span className="text-[10px] text-ink-700/60 dark:text-linen-200/60 capitalize">
                    {habit.frequency}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1 font-bold text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1 rounded-xl border border-amber-200/50">
                <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                {habit.streak}d streak
              </span>

              <button
                onClick={(e) => handleDeleteHabit(habit.id, e)}
                className="opacity-0 group-hover:opacity-100 p-1.5 text-ink-700/40 hover:text-red-500 rounded-lg transition"
                title="Delete habit"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Custom Habit Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-white dark:bg-ink-900 border border-sage-200 dark:border-ink-700 rounded-3xl p-6 shadow-lift relative">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-ink-700/60 hover:text-ink-900 dark:text-linen-200/60 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold font-heading text-ink-900 dark:text-linen-100 mb-4">
              Add New Habit
            </h3>

            <form onSubmit={handleAddHabit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1 text-ink-800 dark:text-linen-200">
                  Habit Title
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. 10 minutes unplugged morning walk"
                  className="w-full px-3.5 py-2.5 bg-linen-50 dark:bg-ink-800 border border-sage-200 dark:border-ink-700 rounded-xl text-sm text-ink-900 dark:text-linen-100 focus:outline-none focus:ring-2 focus:ring-sage-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-ink-800 dark:text-linen-200">
                  Wellness Category
                </label>
                <select
                  value={newCategory}
                  onChange={(e: any) => setNewCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-linen-50 dark:bg-ink-800 border border-sage-200 dark:border-ink-700 rounded-xl text-sm text-ink-900 dark:text-linen-100 focus:outline-none focus:ring-2 focus:ring-sage-500"
                >
                  <option value="mind">Mind</option>
                  <option value="body">Body</option>
                  <option value="focus">Focus</option>
                  <option value="rest">Rest</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-ink-800 dark:text-linen-200">
                  Target Frequency
                </label>
                <select
                  value={newFrequency}
                  onChange={(e: any) => setNewFrequency(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-linen-50 dark:bg-ink-800 border border-sage-200 dark:border-ink-700 rounded-xl text-sm text-ink-900 dark:text-linen-100 focus:outline-none focus:ring-2 focus:ring-sage-500"
                >
                  <option value="daily">Daily</option>
                  <option value="weekdays">Weekdays Only</option>
                  <option value="weekend">Weekends Only</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-sage-500 hover:bg-sage-600 text-white font-bold rounded-xl text-sm shadow-soft transition mt-2"
              >
                Create Habit
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
