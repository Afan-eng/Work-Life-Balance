import React, { useEffect, useState } from 'react';
import { Smile, Sparkles, Plus, Calendar, Tag, CheckCircle2, History, Heart, ArrowRight } from 'lucide-react';
import { useStreak } from '../contexts/StreakContext';
import { useAuth } from '../contexts/AuthContext';
import { supabase, isSupabaseConfigured, type UserMoodLogRecord } from '../lib/supabase';

const MOOD_LEVELS = [
  { score: 1, label: 'Drained', emoji: '🪫', desc: 'Depleted, low energy, need gentle restoration' },
  { score: 2, label: 'Low', emoji: '🌧️', desc: 'Mild tension or sluggishness, tender mind' },
  { score: 3, label: 'Balanced', emoji: '🌱', desc: 'Steady equilibrium, grounded and present' },
  { score: 4, label: 'Energized', emoji: '☀️', desc: 'Positive clarity, ready for focused action' },
  { score: 5, label: 'Thriving', emoji: '✨', desc: 'Deep joy, creative abundance and vitality' },
];

const AVAILABLE_TAGS = [
  'Deep Work', 'Restful Sleep', 'Somatic Movement', 'Nutrition',
  'Family & Friends', 'Nature Walk', 'Hydration', 'Solitude', 'Screen Fatigue'
];

export const MoodTracker: React.FC = () => {
  const { recordActivity } = useStreak();
  const { user } = useAuth();

  const [selectedScore, setSelectedScore] = useState<number>(3);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [journalNote, setJournalNote] = useState('');
  const [isLoggedSuccess, setIsLoggedSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  const [history, setHistory] = useState<UserMoodLogRecord[]>([]);

  // Fetch mood history on mount
  useEffect(() => {
    const fetchMoodHistory = async () => {
      if (isSupabaseConfigured && user) {
        const { data, error } = await supabase
          .from('user_mood_logs')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (!error && data) {
          setHistory(data as UserMoodLogRecord[]);
        }
      } else if (user) {
        try {
          setHistory(JSON.parse(localStorage.getItem(`balance_moods_${user.id}`) || '[]'));
        } catch { setHistory([]); }
      } else {
        setHistory([]);
      }
      setLoading(false);
    };

    fetchMoodHistory();
  }, [user]);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };


  const handleLogMood = async (e: React.FormEvent) => {
    e.preventDefault();

    const currentLevel =
      MOOD_LEVELS.find(m => m.score === selectedScore) || MOOD_LEVELS[2];

    if (!user?.id) {
      alert('Please sign in before saving your mood entry.');
      return;
    }

    const newRecord: UserMoodLogRecord = {
      id: crypto.randomUUID(),
      user_id: user.id,
      score: selectedScore,
      label: currentLevel.label,
      tags: selectedTags,
      note: journalNote,
      created_at: new Date().toISOString(),
    };

    if (!isSupabaseConfigured) {
      const next = [newRecord, ...history];
      setHistory(next);
      localStorage.setItem(`balance_moods_${user.id}`, JSON.stringify(next));
      recordActivity('mood', `Logged mood: ${currentLevel.label} (${selectedScore}/5)`);
      setIsLoggedSuccess(true);
      setJournalNote('');
      setTimeout(() => setIsLoggedSuccess(false), 3000);
      return;
    }

    const { data, error } = await supabase
      .from('user_mood_logs')
      .insert(newRecord)
      .select()
      .single();

    if (error) {
      console.error('Failed to save mood entry:', error);
      alert(`Mood entry could not be saved: ${error.message}`);
      return;
    }

    setHistory(prev => [data as UserMoodLogRecord, ...prev]);
    recordActivity(
      'mood',
      `Logged mood: ${currentLevel.label} (${selectedScore}/5)`
    );

    setIsLoggedSuccess(true);
    setJournalNote('');

    setTimeout(() => setIsLoggedSuccess(false), 3000);
  };

  const currentLevel = MOOD_LEVELS.find(m => m.score === selectedScore) || MOOD_LEVELS[2];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
          <Smile className="w-3.5 h-3.5" />
          <span>Somatic Emotion Log</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-ink-900 dark:text-linen-100">
          Mindful Mood & Journal
        </h1>
        <p className="text-xs sm:text-sm text-ink-700/70 dark:text-linen-200/70">
          Name what is alive within you. Research shows that acknowledging emotional state reduces amygdala reactivity by 40%.
        </p>
      </div>

      {/* Main Check-In Form */}
      <div className="glass-card rounded-3xl p-6 sm:p-9 shadow-lift border border-sage-200/80 dark:border-ink-700">
        <form onSubmit={handleLogMood} className="space-y-8">
          {/* 1. 5-Point Selector */}
          <div>
            <label className="block text-xs font-heading font-bold uppercase tracking-wider text-ink-700/70 dark:text-linen-200/70 mb-4">
              Step 1 • How is your emotional energy right now?
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {MOOD_LEVELS.map((level) => {
                const isSelected = selectedScore === level.score;
                return (
                  <button
                    key={level.score}
                    type="button"
                    onClick={() => setSelectedScore(level.score)}
                    className={`p-4 rounded-2xl border text-center transition flex flex-col items-center gap-2 ${
                      isSelected
                        ? 'border-sage-500 bg-sage-50 dark:bg-sage-950/70 text-sage-900 dark:text-sage-100 ring-2 ring-sage-500/30 shadow-soft'
                        : 'border-sage-200/60 dark:border-ink-800 bg-white/60 dark:bg-ink-800/40 text-ink-800 dark:text-linen-200 hover:bg-linen-100'
                    }`}
                  >
                    <span className="text-3xl">{level.emoji}</span>
                    <span className="text-sm font-bold">{level.label}</span>
                    <span className="text-[10px] opacity-75 line-clamp-2">{level.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Tag Chips */}
          <div>
            <label className="block text-xs font-heading font-bold uppercase tracking-wider text-ink-700/70 dark:text-linen-200/70 mb-3">
              Step 2 • Influencing Catalysts & Context
            </label>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_TAGS.map((tag) => {
                const isTagActive = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition ${
                      isTagActive
                        ? 'bg-sage-500 text-white border-sage-500 shadow-soft'
                        : 'bg-linen-100 dark:bg-ink-800 text-ink-800 dark:text-linen-200 border-sage-200 dark:border-ink-700 hover:bg-sage-100'
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Reflection Journal Note */}
          <div>
            <label className="block text-xs font-heading font-bold uppercase tracking-wider text-ink-700/70 dark:text-linen-200/70 mb-2">
              Step 3 • Mindful Reflection & Somatic Note
            </label>
            <textarea
              rows={3}
              value={journalNote}
              onChange={(e) => setJournalNote(e.target.value)}
              placeholder="What thoughts or physical sensations are present? What does your body need today?"
              className="w-full p-4 bg-linen-50 dark:bg-ink-800 border border-sage-200 dark:border-ink-700 rounded-2xl text-xs sm:text-sm text-ink-900 dark:text-linen-100 focus:outline-none focus:ring-2 focus:ring-sage-500 resize-none"
            />
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-between pt-4 border-t border-sage-100 dark:border-ink-800">
            <div className="flex items-center gap-2 text-xs text-ink-700/60 dark:text-linen-200/60">
              <Sparkles className="w-4 h-4 text-warmAmber-500" />
              <span>Logging updates your personal streak</span>
            </div>

            <button
              type="submit"
              className="px-6 py-3 bg-sage-500 hover:bg-sage-600 text-white text-xs sm:text-sm font-bold rounded-xl shadow-soft hover:shadow-lift transition flex items-center gap-2"
            >
              {isLoggedSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Logged to Supabase!</span>
                </>
              ) : (
                <>
                  <span>Save Today's Reflection</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Historical Timeline */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-heading font-bold text-lg text-ink-900 dark:text-linen-100 flex items-center gap-2">
            <History className="w-4 h-4 text-sage-600" />
            Recent Mood Timeline
          </h3>
          <span className="text-xs text-ink-700/60 dark:text-linen-200/60">
            {history.length} entries recorded
          </span>
        </div>

        <div className="space-y-3">
          {loading ? (
            <div className="text-center py-10 animate-pulse">
              <Sparkles className="w-8 h-8 text-sage-300 mx-auto mb-2" />
              <p className="text-xs text-ink-700/60 dark:text-linen-200/60">Fetching your emotional timeline...</p>
            </div>
          ) : history.length === 0 ? (
            <div className="text-center py-10 glass-card rounded-2xl border border-sage-200/60">
              <History className="w-8 h-8 text-sage-200 mx-auto mb-2" />
              <p className="text-xs text-ink-700/60 dark:text-linen-200/60">Your reflection history will appear here.</p>
            </div>
          ) : history.map((record) => (
            <div
              key={record.id}
              className="glass-card rounded-2xl p-5 border border-sage-200/70 dark:border-ink-700 shadow-soft space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">
                    {MOOD_LEVELS.find((m) => m.score === record.score)?.emoji || '🌱'}
                  </span>
                  <div>
                    <h4 className="font-heading font-bold text-sm text-ink-900 dark:text-linen-100">
                      {record.label} ({record.score}/5)
                    </h4>
                    <span className="text-[10px] text-ink-700/60 dark:text-linen-200/60">
                      {new Date(record.created_at).toLocaleDateString([], {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {record.tags.map((t) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 rounded-md bg-sage-100 dark:bg-sage-950 text-sage-700 dark:text-sage-300 text-[10px] font-bold"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {record.note && (
                <p className="text-xs text-ink-700/80 dark:text-linen-200/80 italic pl-1 border-l-2 border-sage-300 dark:border-sage-700">
                  "{record.note}"
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
