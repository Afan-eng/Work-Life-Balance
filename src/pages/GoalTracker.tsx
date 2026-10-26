import React, { useState } from 'react';
import { Target, Award, Calendar, Plus, CheckCircle2, Circle, X, Sparkles, Trophy } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase, isSupabaseConfigured, type UserGoalRecord } from '../lib/supabase';

const INITIAL_GOALS: UserGoalRecord[] = [
  {
    id: 'g_1',
    user_id: 'usr_demo',
    title: 'Achieve Sustainable 35-Hour Focused Workweek',
    category: 'Career',
    target_date: '2026-12-15',
    progress: 75,
    milestones: [
      { id: 'm1', title: 'Audit weekly calendar & remove 4 unnecessary meetings', completed: true },
      { id: 'm2', title: 'Institute non-negotiable 90m deep work sprint daily', completed: true },
      { id: 'm3', title: 'Decline all afternoon notifications', completed: true },
      { id: 'm4', title: 'Leave office by 5:30 PM for 5 consecutive workdays', completed: false },
    ],
    status: 'active',
  },
  {
    id: 'g_2',
    user_id: 'usr_demo',
    title: 'Complete 21-Day Nervous System Reset',
    category: 'Mental',
    target_date: '2026-11-20',
    progress: 60,
    milestones: [
      { id: 'm5', title: 'Complete 7 days of Box Breathing', completed: true },
      { id: 'm6', title: 'Take 3 nature grounding walks without earphones', completed: true },
      { id: 'm7', title: 'Log evening mood journal 14 consecutive nights', completed: false },
    ],
    status: 'active',
  },
  {
    id: 'g_3',
    user_id: 'usr_demo',
    title: 'Consistent 7.5+ Hours Circadian Sleep',
    category: 'Physical',
    target_date: '2026-11-30',
    progress: 40,
    milestones: [
      { id: 'm8', title: 'Screen off at 9:30 PM for 10 days', completed: true },
      { id: 'm9', title: 'Morning sunlight exposure within 30 mins of waking', completed: true },
      { id: 'm10', title: 'Zero caffeine after 1:00 PM', completed: false },
    ],
    status: 'active',
  },
];

const BADGES = [
  { title: 'Somatic Pioneer', desc: 'Completed first 7-day grounding milestone', icon: '🌿', unlocked: true },
  { title: 'Focus Sprint Master', desc: 'Over 10 successful Pomodoro cycles', icon: '⏱️', unlocked: true },
  { title: 'Circadian Alchemist', desc: 'Consistent sleep hygiene streak', icon: '🌙', unlocked: true },
  { title: 'Zen Equilibrium', desc: 'Achieved 95%+ Balance Score', icon: '💎', unlocked: false },
];

export const GoalTracker: React.FC = () => {
  const { user } = useAuth();
  const [goals, setGoals] = useState<UserGoalRecord[]>(INITIAL_GOALS);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'Career' | 'Physical' | 'Mental' | 'Relationships'>('Mental');
  const [newDate, setNewDate] = useState('2026-12-31');

  const handleToggleMilestone = (goalId: string, milestoneId: string) => {
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id === goalId) {
          const updatedMilestones = g.milestones.map((m) =>
            m.id === milestoneId ? { ...m, completed: !m.completed } : m
          );
          const completedCount = updatedMilestones.filter((m) => m.completed).length;
          const nextProgress = Math.round((completedCount / updatedMilestones.length) * 100);
          return {
            ...g,
            milestones: updatedMilestones,
            progress: nextProgress,
            status: nextProgress === 100 ? 'completed' : 'active',
          };
        }
        return g;
      })
    );
  };

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newGoal: UserGoalRecord = {
      id: `g_${Date.now()}`,
      user_id: user?.id || 'usr_demo',
      title: newTitle.trim(),
      category: newCategory,
      target_date: newDate,
      progress: 0,
      milestones: [
        { id: `m_${Date.now()}_1`, title: 'Define first actionable micro-step', completed: false },
        { id: `m_${Date.now()}_2`, title: 'Schedule weekly reflection review', completed: false },
      ],
      status: 'active',
    };

    setGoals([newGoal, ...goals]);
    setNewTitle('');
    setIsAddModalOpen(false);
  };

  const filteredGoals = selectedCategory === 'All'
    ? goals
    : goals.filter((g) => g.category === selectedCategory);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sage-100 dark:bg-sage-950/60 text-sage-700 dark:text-sage-300 text-xs font-semibold mb-2">
            <Target className="w-3.5 h-3.5 text-sage-500" />
            <span>Long-Horizon Trajectory</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-ink-900 dark:text-linen-100">
            Life Harmony Goals
          </h1>
          <p className="text-xs sm:text-sm text-ink-700/70 dark:text-linen-200/70 mt-1">
            Track holistic aspirations divided across Career, Mental, Physical, and Relational balance.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-5 py-2.5 rounded-2xl bg-sage-500 hover:bg-sage-600 text-white text-xs font-bold shadow-soft transition flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Holistic Goal</span>
        </button>
      </div>

      {/* Badges Carousel */}
      <div className="glass-card rounded-3xl p-6 shadow-soft border border-sage-200/80 dark:border-ink-700">
        <h3 className="font-heading font-bold text-sm text-ink-900 dark:text-linen-100 mb-4 flex items-center gap-2">
          <Trophy className="w-4 h-4 text-warmAmber-500" />
          <span>Accomplishment Badges</span>
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {BADGES.map((b, idx) => (
            <div
              key={idx}
              className={`p-3.5 rounded-2xl border text-center transition flex flex-col items-center gap-1 ${
                b.unlocked
                  ? 'bg-amber-50/60 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900/60'
                  : 'bg-linen-100/50 dark:bg-ink-800/40 border-sage-200/50 opacity-50'
              }`}
            >
              <span className="text-3xl mb-1">{b.icon}</span>
              <span className="text-xs font-bold text-ink-900 dark:text-linen-100">{b.title}</span>
              <span className="text-[10px] text-ink-700/70 dark:text-linen-200/70 line-clamp-2">{b.desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2">
        {['All', 'Career', 'Mental', 'Physical', 'Relationships'].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition ${
              selectedCategory === cat
                ? 'bg-sage-500 text-white shadow-soft'
                : 'bg-linen-100 dark:bg-ink-800 text-ink-800 dark:text-linen-200 hover:bg-sage-100 border border-sage-200/60'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Goals Progression Cards */}
      <div className="space-y-6">
        {filteredGoals.map((goal) => (
          <div
            key={goal.id}
            className="glass-card rounded-3xl p-6 sm:p-7 shadow-soft border border-sage-200/80 dark:border-ink-700 space-y-5"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded-md bg-sage-100 dark:bg-sage-950 text-sage-700 dark:text-sage-300 text-[10px] font-bold uppercase">
                    {goal.category}
                  </span>
                  <span className="text-xs text-ink-700/60 dark:text-linen-200/60 flex items-center gap-1 font-mono">
                    <Calendar className="w-3 h-3" /> Target: {goal.target_date}
                  </span>
                </div>
                <h3 className="font-heading font-bold text-lg text-ink-900 dark:text-linen-100">
                  {goal.title}
                </h3>
              </div>
              <div className="text-right">
                <span className="text-2xl font-extrabold font-heading text-sage-600 dark:text-sage-400">
                  {goal.progress}%
                </span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-sage-100 dark:bg-ink-800 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-sage-500 h-full rounded-full transition-all duration-700"
                style={{ width: `${goal.progress}%` }}
              />
            </div>

            {/* Milestones checklist */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold text-ink-700/70 dark:text-linen-200/70 block uppercase tracking-wider">
                Milestones & Key Results:
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {goal.milestones.map((m) => (
                  <div
                    key={m.id}
                    onClick={() => handleToggleMilestone(goal.id, m.id)}
                    className="p-2.5 rounded-xl bg-linen-50/80 dark:bg-ink-800/60 border border-sage-200/60 dark:border-ink-700 hover:bg-sage-50 dark:hover:bg-ink-800 cursor-pointer transition flex items-center gap-2.5"
                  >
                    {m.completed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    ) : (
                      <Circle className="w-4 h-4 text-ink-700/30 shrink-0" />
                    )}
                    <span
                      className={`text-xs ${
                        m.completed ? 'line-through text-ink-700/50 dark:text-linen-200/50' : 'text-ink-800 dark:text-linen-200 font-medium'
                      }`}
                    >
                      {m.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Goal Modal */}
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
              Create Life Harmony Goal
            </h3>

            <form onSubmit={handleCreateGoal} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1 text-ink-800 dark:text-linen-200">
                  Goal Title
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Master digital unplugging on weekends"
                  className="w-full px-3.5 py-2.5 bg-linen-50 dark:bg-ink-800 border border-sage-200 dark:border-ink-700 rounded-xl text-sm text-ink-900 dark:text-linen-100 focus:outline-none focus:ring-2 focus:ring-sage-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-ink-800 dark:text-linen-200">
                  Category
                </label>
                <select
                  value={newCategory}
                  onChange={(e: any) => setNewCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-linen-50 dark:bg-ink-800 border border-sage-200 dark:border-ink-700 rounded-xl text-sm text-ink-900 dark:text-linen-100 focus:outline-none focus:ring-2 focus:ring-sage-500"
                >
                  <option value="Career">Career & Deep Work</option>
                  <option value="Mental">Mental & Somatic Peace</option>
                  <option value="Physical">Physical & Circadian Vitality</option>
                  <option value="Relationships">Relationships & Community</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-ink-800 dark:text-linen-200">
                  Target Deadline
                </label>
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-linen-50 dark:bg-ink-800 border border-sage-200 dark:border-ink-700 rounded-xl text-sm text-ink-900 dark:text-linen-100 focus:outline-none focus:ring-2 focus:ring-sage-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-sage-500 hover:bg-sage-600 text-white font-bold rounded-xl text-sm shadow-soft transition mt-2"
              >
                Save Life Goal
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
