import React, { useEffect, useRef } from 'react';
import { LockKeyhole, Sparkles } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading, openAuthModal } = useAuth();
  const requested = useRef(false);
  useEffect(() => {
    if (loading) return;
    if (user) { requested.current = false; return; }
    if (!requested.current) { requested.current = true; openAuthModal('login'); }
  }, [loading, user, openAuthModal]);

  if (loading) return <div className="max-w-xl mx-auto px-6 py-24 text-center text-sm text-ink-700 dark:text-linen-200">Loading your account…</div>;
  if (user) return <>{children}</>;
  return <div className="max-w-xl mx-auto px-6 py-24 text-center"><div className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-sage-100 text-sage-700 dark:bg-sage-950 dark:text-sage-300"><LockKeyhole /></div><h1 className="font-heading text-2xl font-bold text-ink-900 dark:text-linen-100">Sign in to use your personal tracker</h1><p className="mt-2 text-sm text-ink-700/70 dark:text-linen-200/70">Your mood, habits, goals, and streaks are private to your account.</p><button onClick={() => openAuthModal('login')} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-sage-600 px-5 py-3 text-sm font-bold text-white hover:bg-sage-700"><Sparkles className="h-4 w-4" /> Sign in or create an account</button></div>;
};
