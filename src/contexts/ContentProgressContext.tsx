import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from './AuthContext';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

export type ContentKind = 'article' | 'video' | 'podcast';
type CompletedContent = { id: string; kind: ContentKind; title: string; completedAt: string };
type ContentProgressContextType = { completed: CompletedContent[]; busy: boolean; isCompleted: (kind: ContentKind, id: string) => boolean; markCompleted: (kind: ContentKind, id: string, title: string) => Promise<boolean> };
const ContentProgressContext = createContext<ContentProgressContextType | undefined>(undefined);
const keyFor = (userId: string) => `balance_content_progress_${userId}`;

export const ContentProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [completed, setCompleted] = useState<CompletedContent[]>([]);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    if (!user) { setCompleted([]); return; }
    let local: CompletedContent[] = [];
    try { local = JSON.parse(localStorage.getItem(keyFor(user.id)) || '[]') as CompletedContent[]; } catch { local = []; }
    setCompleted(local);
    if (isSupabaseConfigured) {
      void supabase.from('content_completions').select('content_id,content_type,title,completed_at').eq('user_id', user.id).then(({ data }) => {
        if (cancelled || !data) return;
        setCompleted(data.map((row: any) => ({ id: row.content_id, kind: row.content_type, title: row.title, completedAt: row.completed_at })));
      });
    }
    return () => { cancelled = true; };
  }, [user]);

  const isCompleted = useCallback((kind: ContentKind, id: string) => completed.some(item => item.kind === kind && item.id === id), [completed]);
  const markCompleted = useCallback(async (kind: ContentKind, id: string, title: string) => {
    if (!user) return false;
    if (completed.some(item => item.kind === kind && item.id === id)) return true;
    setBusy(true);
    const item = { id, kind, title, completedAt: new Date().toISOString() };
    if (isSupabaseConfigured) {
      const { error } = await supabase.from('content_completions').upsert({ user_id: user.id, content_id: id, content_type: kind, title }, { onConflict: 'user_id,content_type,content_id' });
      if (error) { setBusy(false); return false; }
    }
    const next = [...completed, item];
    setCompleted(next);
    localStorage.setItem(keyFor(user.id), JSON.stringify(next));
    setBusy(false);
    return true;
  }, [completed, user]);

  const value = useMemo(() => ({ completed, busy, isCompleted, markCompleted }), [completed, busy, isCompleted, markCompleted]);
  return <ContentProgressContext.Provider value={value}>{children}</ContentProgressContext.Provider>;
};

export const useContentProgress = () => {
  const context = useContext(ContentProgressContext);
  if (!context) throw new Error('useContentProgress must be used within ContentProgressProvider');
  return context;
};
