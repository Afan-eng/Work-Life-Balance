import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { useAuth } from './AuthContext';
import { calculateStreaks, getLocalDateKey } from '../lib/utils';

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
  todayCompleted: boolean;
  projectedStreak: number;
  streakError: string;
  todayActions: string[];
  recentActivities: ActivityLog[];
  completionMatrix: Record<string, boolean>;
  dailyGoals: DailyGoal[];
  remainingGoalsCount: number;
  recordActivity: (actionType: ActivityLog['actionType'], label?: string) => void;
  toggleDailyGoal: (goalId: string) => void;
  isActionCompletedToday: (actionType: string) => boolean;
}

interface StoredStreak {
  currentStreak?: number;
  bestStreak?: number;
  todayActions?: string[];
  lastActiveDate?: string;
  recentActivities?: ActivityLog[];
  completionMatrix?: Record<string, boolean>;
}

const StreakContext = createContext<StreakContextType | undefined>(undefined);
const LOCAL_STORAGE_STREAK_KEY = 'balance_streak_data_v1';
const INITIAL_DAILY_GOALS: DailyGoal[] = [];
const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';

const readStored = (userId: string): StoredStreak => {
  try {
    return JSON.parse(localStorage.getItem(`${LOCAL_STORAGE_STREAK_KEY}_${userId}`) || '{}') as StoredStreak;
  } catch {
    return {};
  }
};

export const StreakProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [currentStreak, setCurrentStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [todayActions, setTodayActions] = useState<string[]>([]);
  const [recentActivities, setRecentActivities] = useState<ActivityLog[]>([]);
  const [completionMatrix, setCompletionMatrix] = useState<Record<string, boolean>>({});
  const [dailyGoals, setDailyGoals] = useState<DailyGoal[]>(INITIAL_DAILY_GOALS);
  const [streakError, setStreakError] = useState('');
  const matrixRef = useRef<Record<string, boolean>>({});
  const actionsRef = useRef<string[]>([]);
  const activitiesRef = useRef<ActivityLog[]>([]);
  const goalsRef = useRef<DailyGoal[]>([]);
  const userRef = useRef<string | null>(null);

  const persist = useCallback((matrix: Record<string, boolean>, actions: string[], activities: ActivityLog[], userId: string, activityDate = getLocalDateKey()) => {
    const today = getLocalDateKey();
    const streaks = calculateStreaks(matrix, today);
    const completedDates = Object.keys(matrix).filter((date) => matrix[date]).sort();
    const latestActivity = completedDates[completedDates.length - 1] || null;
    const payload: StoredStreak = {
      ...streaks,
      todayActions: actions,
      lastActiveDate: actions.length ? activityDate : latestActivity || undefined,
      recentActivities: activities,
      completionMatrix: matrix,
    };
    localStorage.setItem(`${LOCAL_STORAGE_STREAK_KEY}_${userId}`, JSON.stringify(payload));
  }, []);

  useEffect(() => {
    let cancelled = false;
    if (!user) {
      userRef.current = null;
      matrixRef.current = {};
      actionsRef.current = [];
      activitiesRef.current = [];
      goalsRef.current = INITIAL_DAILY_GOALS;
      setStreakError('');
      setCurrentStreak(0);
      setBestStreak(0);
      setTodayActions([]);
      setRecentActivities([]);
      setCompletionMatrix({});
      setDailyGoals(INITIAL_DAILY_GOALS);
      return;
    }

    const userId = user.id;
    userRef.current = userId;
    setStreakError('');
    const today = getLocalDateKey();
    const cached = readStored(userId);
    const cachedMatrix = cached.completionMatrix || {};
    const actions = cached.lastActiveDate === today ? cached.todayActions || [] : [];
    matrixRef.current = cachedMatrix;
    actionsRef.current = actions;
    activitiesRef.current = cached.recentActivities || [];
    setCompletionMatrix(cachedMatrix);
    setTodayActions(actions);
    setRecentActivities(activitiesRef.current);
    try { goalsRef.current = JSON.parse(localStorage.getItem(`balance_daily_goals_${userId}`) || '[]'); }
    catch { goalsRef.current = INITIAL_DAILY_GOALS; }
    setDailyGoals(goalsRef.current);
    const cachedStreaks = calculateStreaks(cachedMatrix, today);
    setCurrentStreak(cachedStreaks.currentStreak);
    setBestStreak(cachedStreaks.bestStreak);

    const hydrateRemote = async () => {
      if (!isSupabaseConfigured) return;
      const { data } = await supabase.from('user_streaks').select('completion_matrix').eq('user_id', userId).maybeSingle();
      if (cancelled || userRef.current !== userId) return;
      const remoteMatrix = (data?.completion_matrix || {}) as Record<string, boolean>;
      const merged = isSupabaseConfigured ? remoteMatrix : { ...remoteMatrix, ...matrixRef.current };
      matrixRef.current = merged;
      const summary = calculateStreaks(merged, getLocalDateKey());
      setCompletionMatrix(merged);
      setCurrentStreak(summary.currentStreak);
      setBestStreak(summary.bestStreak);
      const currentDay = getLocalDateKey();
      const todayActions = cached.lastActiveDate === currentDay && remoteMatrix[currentDay] ? actionsRef.current : [];
      actionsRef.current = todayActions;
      setTodayActions(todayActions);
      persist(merged, todayActions, cached.recentActivities || [], userId);
    };
    void hydrateRemote();

    return () => { cancelled = true; };
  }, [user, persist]);

  // Lock yesterday's contribution when the user's local calendar day changes.
  useEffect(() => {
    if (!user) return;
    let observedDay = getLocalDateKey();
    const timer = window.setInterval(() => {
      const nextDay = getLocalDateKey();
      if (nextDay === observedDay) return;
      observedDay = nextDay;
      actionsRef.current = [];
      setTodayActions([]);
      const summary = calculateStreaks(matrixRef.current, nextDay);
      setCurrentStreak(summary.currentStreak);
      setBestStreak(summary.bestStreak);
      persist(matrixRef.current, [], activitiesRef.current, user.id);
    }, 30_000);
    return () => window.clearInterval(timer);
  }, [user, persist]);

  const recordActivity = useCallback(async (actionType: ActivityLog['actionType'], label?: string) => {
    const userId = userRef.current;
    if (!userId) return;
    let activityDate = getLocalDateKey();
    let nextMatrix: Record<string, boolean>;
    let verifiedSummary: { current_streak?: number; best_streak?: number } | null = null;
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.rpc('record_tracker_completion', { p_action_type: actionType, p_time_zone: timeZone });
        if (error || !data) {
          setStreakError('This tracker contribution could not be verified. Check your connection and apply the streak database migration; the day was not counted.');
          return;
        }
        activityDate = data.today as string;
        nextMatrix = data.completion_matrix as Record<string, boolean>;
        verifiedSummary = data as { current_streak?: number; best_streak?: number };
        setStreakError('');
      } catch {
        setStreakError('This tracker contribution could not be verified. Check your connection; the day was not counted.');
        return;
      }
    } else {
      nextMatrix = { ...matrixRef.current, [activityDate]: true };
    }
    const wasCompletedToday = Boolean(matrixRef.current[activityDate]);
    matrixRef.current = nextMatrix;
    const todayActions = activityDate === getLocalDateKey() ? actionsRef.current : [];
    const nextActions = todayActions.includes(actionType) ? todayActions : [...todayActions, actionType];
    actionsRef.current = nextActions;
    const nextActivities: ActivityLog[] = [
      { actionType, label: label || `Completed ${actionType} tracker`, timestamp: new Date().toISOString() },
      ...activitiesRef.current.slice(0, 6),
    ];
    activitiesRef.current = nextActivities;
    setCompletionMatrix(nextMatrix);
    setTodayActions(nextActions);
    setRecentActivities(nextActivities);
    const summary = calculateStreaks(nextMatrix, getLocalDateKey());
    setCurrentStreak(verifiedSummary?.current_streak ?? summary.currentStreak);
    setBestStreak(verifiedSummary?.best_streak ?? summary.bestStreak);
    persist(nextMatrix, nextActions, nextActivities, userId, activityDate);
    if (!wasCompletedToday) {
      try { confetti({ particleCount: 35, spread: 55, origin: { y: 0.8 }, colors: ['#2F9A5D', '#38B76E', '#FCD466'] }); } catch { /* optional animation */ }
    }
  }, [persist]);

  const toggleDailyGoal = useCallback((goalId: string) => {
    const previous = goalsRef.current;
    const next = previous.map((goal) => goal.id === goalId ? { ...goal, completed: !goal.completed } : goal);
    goalsRef.current = next;
    setDailyGoals(next);
    const owner = userRef.current;
    if (owner) localStorage.setItem(`balance_daily_goals_${owner}`, JSON.stringify(next));
    if (next.length > 0 && next.every((goal) => goal.completed) && !previous.every((goal) => goal.completed)) {
      void recordActivity('habit', 'Completed all daily micro-goals');
    }
  }, [recordActivity]);

  const todayKey = getLocalDateKey();
  const todayCompleted = Boolean(completionMatrix[todayKey]);
  const projectedStreak = todayCompleted
    ? (completionMatrix[shiftYesterday(todayKey)] ? currentStreak + 1 : 1)
    : currentStreak;
  const remainingGoalsCount = dailyGoals.filter((goal) => !goal.completed).length;
  const isActionCompletedToday = useCallback((actionType: string) => todayActions.includes(actionType), [todayActions]);

  return <StreakContext.Provider value={{
    currentStreak,
    bestStreak,
    todayCompleted,
    projectedStreak,
    streakError,
    todayActions,
    recentActivities,
    completionMatrix,
    dailyGoals,
    remainingGoalsCount,
    recordActivity,
    toggleDailyGoal,
    isActionCompletedToday,
  }}>{children}</StreakContext.Provider>;
};

function shiftYesterday(today: string) {
  const [year, month, day] = today.split('-').map(Number);
  const date = new Date(year, month - 1, day, 12);
  date.setDate(date.getDate() - 1);
  return getLocalDateKey(date);
}

export const useStreak = () => {
  const context = useContext(StreakContext);
  if (!context) throw new Error('useStreak must be used within a StreakProvider');
  return context;
};
