import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useAuth } from './AuthContext';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

export type ScheduleItem = { id: string; title: string; category: 'work' | 'break' | 'personal' | 'sleep' | 'movement'; start: string; end: string; days: number[]; enabled: boolean };
type ScheduleContextValue = { items: ScheduleItem[]; syncError: string; notificationPermission: NotificationPermission | 'unsupported'; addItem: (item: Omit<ScheduleItem, 'id' | 'enabled'>) => Promise<boolean>; removeItem: (id: string) => Promise<void>; requestNotifications: () => Promise<void> };
const ScheduleContext = createContext<ScheduleContextValue | undefined>(undefined);
const storageKey = (userId: string) => `balance_schedule_${userId}`;
const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const ScheduleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [items, setItems] = useState<ScheduleItem[]>([]);
  const [syncError, setSyncError] = useState('');
  const [permission, setPermission] = useState<NotificationPermission | 'unsupported'>(typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'unsupported');
  const [reminder, setReminder] = useState('');
  const notified = useRef(new Set<string>());
  const loadedUserId = useRef<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    if (!user) { loadedUserId.current = null; setItems([]); setSyncError(''); notified.current.clear(); return; }
    try { setItems(JSON.parse(localStorage.getItem(storageKey(user.id)) || '[]') as ScheduleItem[]); } catch { setItems([]); }
    loadedUserId.current = user.id;
    if (isSupabaseConfigured) void supabase.from('user_schedules').select('id,title,category,start_time,end_time,days,enabled').eq('user_id', user.id).then(({ data, error }) => {
      if (cancelled) return;
      if (error) { setSyncError('Could not sync your saved schedule. Showing the copy on this device.'); return; }
      const rows: ScheduleItem[] = (data || []).map((row: any) => ({ id: row.id, title: row.title, category: row.category, start: String(row.start_time).slice(0, 5), end: String(row.end_time).slice(0, 5), days: row.days.map(Number), enabled: row.enabled }));
      setItems(rows);
      localStorage.setItem(storageKey(user.id), JSON.stringify(rows));
      setSyncError('');
    });
    return () => { cancelled = true; };
  }, [user]);
  useEffect(() => { if (user && loadedUserId.current === user.id) localStorage.setItem(storageKey(user.id), JSON.stringify(items)); }, [user, items]);

  const addItem = useCallback(async (item: Omit<ScheduleItem, 'id' | 'enabled'>) => {
    if (!user) return false;
    let saved: ScheduleItem;
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('user_schedules').insert({ user_id: user.id, title: item.title, category: item.category, start_time: item.start, end_time: item.end, days: item.days }).select('id,title,category,start_time,end_time,days,enabled').single();
      if (error || !data) { setSyncError('Could not save your schedule. Check your connection and apply the productivity database migration.'); return false; }
      saved = { id: data.id, title: data.title, category: data.category, start: String(data.start_time).slice(0, 5), end: String(data.end_time).slice(0, 5), days: data.days.map(Number), enabled: data.enabled };
    } else saved = { ...item, id: crypto.randomUUID(), enabled: true };
    setItems(current => [...current, saved].sort((a, b) => a.start.localeCompare(b.start)));
    setSyncError('');
    return true;
  }, [user]);
  const removeItem = useCallback(async (id: string) => {
    if (isSupabaseConfigured) {
      const { error } = await supabase.from('user_schedules').delete().eq('id', id).eq('user_id', user?.id);
      if (error) { setSyncError('Could not remove this block. Please check your connection and try again.'); return; }
    }
    setItems(current => current.filter(item => item.id !== id));
    setSyncError('');
  }, [user]);
  const requestNotifications = useCallback(async () => {
    if (!('Notification' in window)) { setPermission('unsupported'); return; }
    try {
      const result = await Notification.requestPermission();
      setPermission(result);
    } catch {
      setPermission('unsupported');
    }
  }, []);

  useEffect(() => {
    if (!user) return;
    const check = () => {
      const now = new Date();
      const day = now.getDay();
      const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      for (const item of items) {
        const key = `${user.id}:${now.toDateString()}:${item.id}`;
        if (!item.enabled || !item.days.includes(day) || item.start !== time || notified.current.has(key)) continue;
        notified.current.add(key);
        setReminder(`${item.title} starts now · ${item.start}–${item.end}`);
        if ('Notification' in window && Notification.permission === 'granted') {
          try { new Notification(`Balance Compass · ${item.title}`, { body: `Your ${item.category} block starts now (${item.start}–${item.end}).` }); } catch { /* In-app reminder remains available. */ }
        }
      }
    };
    check();
    const timer = window.setInterval(check, 15_000);
    const visibility = () => { if (document.visibilityState === 'visible') check(); };
    document.addEventListener('visibilitychange', visibility);
    return () => { window.clearInterval(timer); document.removeEventListener('visibilitychange', visibility); };
  }, [items, user]);
  useEffect(() => {
    if (!reminder) return;
    const timeout = window.setTimeout(() => setReminder(''), 12_000);
    return () => window.clearTimeout(timeout);
  }, [reminder]);

  const value = useMemo(() => ({ items, syncError, notificationPermission: permission, addItem, removeItem, requestNotifications }), [items, syncError, permission, addItem, removeItem, requestNotifications]);
  return <ScheduleContext.Provider value={value}>{children}{reminder && <div role="status" className="fixed bottom-5 right-5 z-[100] max-w-sm rounded-2xl border border-sage-300 bg-white p-4 text-sm font-semibold text-ink-900 shadow-lift dark:border-sage-700 dark:bg-ink-900 dark:text-linen-100">⏰ {reminder}</div>}</ScheduleContext.Provider>;
};

export const useSchedule = () => {
  const context = useContext(ScheduleContext);
  if (!context) throw new Error('useSchedule must be used within ScheduleProvider');
  return context;
};

export const SCHEDULE_DAYS = weekdays;
