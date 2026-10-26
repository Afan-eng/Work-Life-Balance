import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { useAuth } from './AuthContext';

export interface DailyGoal {
  id: string;
  title: string;
  category: 'mind' | 'body' | 'focus';
  completed: boolean;
}

export interface ActivityLog {
  actionType: 'moment' | 'mood' | 'habit' | 'pomodoro' | 'breath' | 'challenge';
  label: string;
  timestamp: string;
}

interface StreakContextType {
  currentStreak: number;
  bestStreak: number;
  freezeTokens: number;
  todayActions: string[];
  recentActivities: ActivityLog[];
  completionMatrix: Record<string, boolean>; // 'YYYY-MM-DD': boolean
  dailyGoals: DailyGoal[];
  remainingGoalsCount: number;
  recordActivity: (actionType: 'moment' | 'mood' | 'habit' | 'pomodoro' | 'breath' | 'challenge', label?: string) => void;
  toggleDailyGoal: (goalId: string) => void;
  useFreezeToken: () => boolean;
  isActionCompletedToday: (actionType: string) => boolean;
}

const StreakContext = createContext<StreakContextType | undefined>(undefined);

const LOCAL_STORAGE_STREAK_KEY = 'balance_streak_data_v1';

const INITIAL_DAILY_GOALS: DailyGoal[] = [
  { id: 'dg_1', title: '60s Box Breathing reset', category: 'mind', completed: true },
  { id: 'dg_2', title: 'Complete 25m Focus Sprint', category: 'focus', completed: false },
  { id: 'dg_3', title: 'Midday hydration & posture pause', category: 'body', completed: true },
];

export const StreakProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();

  const getTodayDateStr = () => new Date().toISOString().split('T')[0];

  const [currentStreak, setCurrentStreak] = useState<number>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_STREAK_KEY);
    if (saved) {
      try {
        return JSON.parse(saved).currentStreak || 6;
      } catch (e) {
        return 6;
      }
    }
    return 6;
  });

  const [bestStreak, setBestStreak] = useState<number>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_STREAK_KEY);
    if (saved) {
      try {
        return JSON.parse(saved).bestStreak || 14;
      } catch (e) {
        return 14;
      }
    }
    return 14;
  });

  const [freezeTokens, setFreezeTokens] = useState<number>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_STREAK_KEY);
    if (saved) {
      try {
        return JSON.parse(saved).freezeTokens ?? 2;
      } catch (e) {
        return 2;
      }
    }
    return 2;
  });

  const [todayActions, setTodayActions] = useState<string[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_STREAK_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.lastActiveDate === getTodayDateStr()) {
          return parsed.todayActions || ['breath', 'moment'];
        }
      } catch (e) {
        return ['breath', 'moment'];
      }
    }
    return ['breath', 'moment'];
  });

  const [recentActivities, setRecentActivities] = useState<ActivityLog[]>([
    { actionType: 'breath', label: 'Completed 60s Box Breathing', timestamp: '20 mins ago' },
    { actionType: 'moment', label: 'Grounding Balance Moment logged', timestamp: '1 hour ago' },
    { actionType: 'mood', label: 'Midday Mood recorded: Balanced', timestamp: '3 hours ago' },
  ]);

  const [completionMatrix, setCompletionMatrix] = useState<Record<string, boolean>>(() => {
    // Generate realistic 7-day completion
    const matrix: Record<string, boolean> = {};
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const str = d.toISOString().split('T')[0];
      matrix[str] = i !== 5; // e.g. 6 out of 7 days completed
    }
    return matrix;
  });

  const [dailyGoals, setDailyGoals] = useState<DailyGoal[]>(() => {
    const saved = localStorage.getItem('balance_daily_goals');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_DAILY_GOALS;
      }
    }
    return INITIAL_DAILY_GOALS;
  });

  // Sync to localStorage
  useEffect(() => {
    const payload = {
      currentStreak,
      bestStreak,
      freezeTokens,
      todayActions,
      lastActiveDate: getTodayDateStr(),
      completionMatrix,
    };
    localStorage.setItem(LOCAL_STORAGE_STREAK_KEY, JSON.stringify(payload));
  }, [currentStreak, bestStreak, freezeTokens, todayActions, completionMatrix]);

  useEffect(() => {
    localStorage.setItem('balance_daily_goals', JSON.stringify(dailyGoals));
  }, [dailyGoals]);

  // Sync with Supabase when logged in
  useEffect(() => {
    if (isSupabaseConfigured && user) {
      const fetchStreakData = async () => {
        const { data, error } = await supabase
          .from('user_streaks')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (data && !error) {
          setCurrentStreak(data.current_streak);
          setBestStreak(data.best_streak);
          setFreezeTokens(data.freeze_tokens);
          if (data.completion_matrix) {
            setCompletionMatrix(data.completion_matrix);
          }
          // Check if last activity was today to set todayActions
          const today = getTodayDateStr();
          if (data.last_activity_date === today) {
            // In a real app, we might store todayActions in DB too, 
            // for now we'll rely on local state or derive from matrix
          }
        } else if (error && error.code === 'PGRST116') {
          // No record found, create one
          const newStreak = {
            user_id: user.id,
            current_streak: 0,
            best_streak: 0,
            freeze_tokens: 2,
            last_activity_date: null,
            completion_matrix: {},
          };
          await supabase.from('user_streaks').insert(newStreak);
        }
      };

      fetchStreakData();
    }
  }, [user]);

  const recordActivity = useCallback(
    async (actionType: 'moment' | 'mood' | 'habit' | 'pomodoro' | 'breath' | 'challenge', label?: string) => {
      const todayStr = getTodayDateStr();
      const actionName = label || `Completed ${actionType} activity`;

      setTodayActions(prev => {
        if (!prev.includes(actionType)) {
          return [...prev, actionType];
        }
        return prev;
      });

      setRecentActivities(prev => [
        { actionType, label: actionName, timestamp: 'Just now' },
        ...prev.slice(0, 7),
      ]);

      const newMatrix = { ...completionMatrix, [todayStr]: true };
      setCompletionMatrix(newMatrix);

      let nextStreak = currentStreak;
      let nextBest = bestStreak;

      // If this was the first action today, increment current streak!
      if (!todayActions.length || !todayActions.includes(actionType)) {
        nextStreak = currentStreak + 1;
        nextBest = Math.max(bestStreak, nextStreak);
        
        setCurrentStreak(nextStreak);
        setBestStreak(nextBest);

        // Trigger celebratory confetti
        try {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.8 },
            colors: ['#2F9A5D', '#38B76E', '#FCD466', '#E3F2E9'],
          });
        } catch (e) {}
      }

      // Supabase async upsert if user logged in
      if (isSupabaseConfigured && user) {
        await supabase.from('user_streaks').upsert({
          user_id: user.id,
          current_streak: nextStreak,
          best_streak: nextBest,
          freeze_tokens: freezeTokens,
          last_activity_date: todayStr,
          completion_matrix: newMatrix,
          updated_at: new Date().toISOString(),
        });
      }
    },
    [todayActions, currentStreak, bestStreak, freezeTokens, completionMatrix, user]
  );

  const toggleDailyGoal = useCallback(
    (goalId: string) => {
      setDailyGoals(prev => {
        const next = prev.map(g => (g.id === goalId ? { ...g, completed: !g.completed } : g));
        const allCompleted = next.every(g => g.completed);
        if (allCompleted) {
          recordActivity('habit', 'All 3 Daily Micro-Goals Completed!');
        }
        return next;
      });
    },
    [recordActivity]
  );

  const useFreezeToken = useCallback((): boolean => {
    if (freezeTokens > 0) {
      setFreezeTokens(curr => curr - 1);
      return true;
    }
    return false;
  }, [freezeTokens]);

  const isActionCompletedToday = useCallback(
    (actionType: string) => {
      return todayActions.includes(actionType);
    },
    [todayActions]
  );

  const remainingGoalsCount = dailyGoals.filter(g => !g.completed).length;

  return (
    <StreakContext.Provider
      value={{
        currentStreak,
        bestStreak,
        freezeTokens,
        todayActions,
        recentActivities,
        completionMatrix,
        dailyGoals,
        remainingGoalsCount,
        recordActivity,
        toggleDailyGoal,
        useFreezeToken,
        isActionCompletedToday,
      }}
    >
      {children}
    </StreakContext.Provider>
  );
};

export const useStreak = () => {
  const context = useContext(StreakContext);
  if (!context) throw new Error('useStreak must be used within a StreakProvider');
  return context;
};
