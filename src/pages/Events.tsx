import React, { useEffect, useMemo, useState } from 'react';
import { ArrowRight, BookOpenCheck, CalendarDays, CheckCircle2, Clock3, MessageCircle, Sparkles, Users } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import { Link } from 'react-router-dom';

const PROGRAMS = [
  { id: 'focus-reset', kind: 'Workshop', title: 'Focused work, humane pace', length: '25 min', startsAt: '2026-10-29T18:00:00+05:30', endsAt: '2026-10-29T18:25:00+05:30', description: 'A guided planning session to choose one priority, reduce distractions and protect a real break.', steps: ['Name the one task that matters most today', 'Break it into a first 15-minute action', 'Set a finish line and a recovery break'] },
  { id: 'workday-boundaries', kind: 'Workshop', title: 'Build a kinder workday boundary', length: '20 min', startsAt: '2026-10-30T18:00:00+05:30', endsAt: '2026-10-30T18:20:00+05:30', description: 'Create a practical start-up and shut-down ritual that fits your actual work situation.', steps: ['Notice what pulls work into personal time', 'Choose one boundary you can realistically test', 'Write a shutdown cue and a hand-off note'] },
  { id: 'body-reset', kind: 'Workshop', title: 'Desk-to-body reset', length: '12 min', startsAt: '2026-10-31T10:00:00+05:30', endsAt: '2026-10-31T10:12:00+05:30', description: 'A gentle sequence for moving, looking away from screens and checking what your body needs.', steps: ['Stand or change position if comfortable', 'Rest your eyes on something distant', 'Choose a movement that suits your body'] },
  { id: 'weekly-circle', kind: 'Community circle', title: 'Weekly balance check-in', length: '30 min · self-guided', startsAt: '2026-11-01T10:00:00+05:30', endsAt: '2026-11-01T10:30:00+05:30', description: 'A small-group conversation format you can use with colleagues, friends or your own journal.', steps: ['What gave you energy this week?', 'Where did work spill into rest?', 'What one small experiment will you try next week?'] },
  { id: 'care-circle', kind: 'Community circle', title: 'Care, boundaries & belonging', length: '30 min · self-guided', startsAt: '2026-11-04T19:00:00+05:30', endsAt: '2026-11-04T19:30:00+05:30', description: 'A respectful prompt set for discussing boundaries and mutual support without pressure to disclose personal details.', steps: ['Share one thing that helps you feel included', 'What makes it easier to ask for a pause?', 'Offer one practical support, without fixing'] },
];

const formatSlot = (start: string, end: string) => {
  const day = new Intl.DateTimeFormat('en-IN', { timeZone: 'Asia/Kolkata', weekday: 'short', day: 'numeric', month: 'short' }).format(new Date(start));
  const time = (value: string) => new Intl.DateTimeFormat('en-IN', { timeZone: 'Asia/Kolkata', hour: 'numeric', minute: '2-digit' }).format(new Date(value));
  return `${day} · ${time(start)}–${time(end)} IST`;
};

export const Events: React.FC = () => {
  const { user, openAuthModal } = useAuth();
  const [active, setActive] = useState<(typeof PROGRAMS)[number] | null>(null);
  const [joined, setJoined] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem(`balance_circle_interest_${user?.id || 'guest'}`) || '[]') as string[]; } catch { return []; }
  });
  const [completed, setCompleted] = useState<string[]>([]);
  const [toast, setToast] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const workshops = useMemo(() => PROGRAMS.filter(item => item.kind === 'Workshop'), []);
  const circles = useMemo(() => PROGRAMS.filter(item => item.kind === 'Community circle'), []);

  useEffect(() => {
    let cancelled = false;
    setJoined([]); setCompleted([]);
    if (!user) return;
    if (isSupabaseConfigured) void Promise.all([
      supabase.from('workshop_interests').select('program_id').eq('user_id', user.id),
      supabase.from('workshop_completions').select('program_id').eq('user_id', user.id),
    ]).then(([interests, finishes]) => {
      if (cancelled) return;
      if (interests.data) setJoined(interests.data.map((row: { program_id: string }) => row.program_id));
      if (finishes.data) setCompleted(finishes.data.map((row: { program_id: string }) => row.program_id));
    });
    else {
      try { setJoined(JSON.parse(localStorage.getItem(`balance_circle_interest_${user.id}`) || '[]') as string[]); } catch { setJoined([]); }
      try { setCompleted(JSON.parse(localStorage.getItem(`balance_workshop_completions_${user.id}`) || '[]') as string[]); } catch { setCompleted([]); }
    }
    return () => { cancelled = true; };
  }, [user]);

  const join = async (id: string) => {
    if (!user) { openAuthModal('login'); return; }
    setSaveError(''); setSaving(true);
    if (isSupabaseConfigured) {
      const { error } = await supabase.from('workshop_interests').upsert({ user_id: user.id, program_id: id }, { onConflict: 'user_id,program_id' });
      if (error) { setSaveError('Could not save your interest. Apply the productivity migration and try again.'); setSaving(false); return; }
    }
    const next = joined.includes(id) ? joined : [...joined, id];
    setJoined(next);
    if (!isSupabaseConfigured) localStorage.setItem(`balance_circle_interest_${user.id}`, JSON.stringify(next));
    setSaving(false);
    setToast('Interest saved. This is a suggested slot; no live host or meeting link is provided.');
    window.setTimeout(() => setToast(''), 4500);
  };

  const finish = async (id: string) => {
    if (!user) { openAuthModal('login'); return; }
    if (isSupabaseConfigured) {
      const { error } = await supabase.from('workshop_completions').upsert({ user_id: user.id, program_id: id }, { onConflict: 'user_id,program_id' });
      if (error) { setSaveError('Could not save completion. Apply the productivity migration and try again.'); return; }
    } else localStorage.setItem(`balance_workshop_completions_${user.id}`, JSON.stringify([...new Set([...completed, id])]));
    setCompleted(current => current.includes(id) ? current : [...current, id]);
    setActive(null);
    setToast('Workshop guide marked complete.');
    window.setTimeout(() => setToast(''), 3500);
  };

  const programCard = (item: (typeof PROGRAMS)[number]) => (
      <article key={item.id} className="flex flex-col rounded-3xl border border-sage-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lift dark:border-ink-700 dark:bg-ink-900">
      <div className="flex items-center justify-between"><span className="rounded-full bg-sage-100 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-sage-800 dark:bg-sage-950 dark:text-sage-200">{item.kind}</span><span className="inline-flex items-center gap-1 text-xs text-ink-700/60 dark:text-linen-200/60"><Clock3 className="h-3.5 w-3.5"/>{item.length}</span></div>
      <h3 className="mt-4 font-heading text-xl font-bold text-ink-900 dark:text-linen-100">{item.title}</h3><p className="mt-2 flex-1 text-sm leading-6 text-ink-700/70 dark:text-linen-200/70">{item.description}</p>
      <div className="mt-4 flex items-start gap-2 rounded-xl bg-linen-100 p-3 text-xs text-ink-700 dark:bg-ink-950 dark:text-linen-200"><CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-sage-700"/><span><strong>Suggested slot · India time</strong><br/>{formatSlot(item.startsAt, item.endsAt)}<br/><span className="opacity-70">Self-guided / participant-led; no host or meeting link.</span></span></div>
      {completed.includes(item.id) && <p className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-emerald-700 dark:text-emerald-300"><CheckCircle2 className="h-4 w-4"/>Completed</p>}
      <div className="mt-5 flex gap-2"><button onClick={() => setActive(item)} className="inline-flex items-center gap-2 rounded-xl bg-sage-700 px-4 py-2.5 text-xs font-bold text-white hover:bg-sage-800">Open guide <ArrowRight className="h-4 w-4"/></button>{item.kind === 'Community circle' && <button disabled={saving} onClick={() => void join(item.id)} className="rounded-xl border border-sage-300 px-4 py-2.5 text-xs font-bold text-sage-800 disabled:opacity-50 dark:border-ink-600 dark:text-sage-200">{joined.includes(item.id) ? 'Interest saved ✓' : saving ? 'Saving…' : 'Save interest'}</button>}</div>
    </article>
  );

  return <div className="mx-auto max-w-6xl space-y-10 px-4 py-10 sm:px-6 lg:px-8">
    <section className="rounded-[2rem] bg-gradient-to-br from-ink-950 via-ink-900 to-sage-950 p-8 text-white shadow-lift sm:p-11"><div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs"><Users className="h-4 w-4"/> Workshops & circles · IST</div><h1 className="mt-5 font-heading text-4xl font-extrabold">Learn together. Rest together.</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-white/75">Practical workshop kits and community circle prompts, with suggested India time slots. Guides are self-led and circles are participant-led; live hosting and meeting links are not currently provided.</p><Link to="/community" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-ink-900 transition hover:bg-sage-100">Join the community <ArrowRight className="h-4 w-4"/></Link></section>
    <section className="space-y-4"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-sage-100 text-sage-800 dark:bg-sage-950 dark:text-sage-200"><BookOpenCheck className="h-5 w-5"/></span><div><h2 className="font-heading text-2xl font-bold text-ink-900 dark:text-linen-100">Guided workshops</h2><p className="text-xs text-ink-700/60 dark:text-linen-200/60">Short activities to plan sustainable work and recovery.</p></div></div><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{workshops.map(programCard)}</div></section>
    <section className="space-y-4"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-sage-100 text-sage-800 dark:bg-sage-950 dark:text-sage-200"><MessageCircle className="h-5 w-5"/></span><div><h2 className="font-heading text-2xl font-bold text-ink-900 dark:text-linen-100">Community circle guides</h2><p className="text-xs text-ink-700/60 dark:text-linen-200/60">Suggested dates and times for groups you organize; save interest to keep the circle on your list.</p></div></div><div className="grid gap-4 md:grid-cols-2">{circles.map(programCard)}</div></section>
    <aside className="flex gap-3 rounded-2xl border border-sage-200 bg-sage-50 p-4 text-xs leading-5 text-ink-700 dark:border-ink-700 dark:bg-ink-900 dark:text-linen-200"><Sparkles className="h-4 w-4 shrink-0 text-sage-700 dark:text-sage-300"/><p>Participation is optional. Skip any prompt that does not feel right, avoid sharing confidential workplace details, and seek professional support for urgent or serious concerns.</p></aside>
    {saveError && <div role="alert" className="fixed bottom-5 right-5 z-50 max-w-sm rounded-2xl bg-rose-800 p-4 text-sm text-white shadow-lift">{saveError}</div>}{toast && <div role="status" className="fixed bottom-5 right-5 z-50 max-w-sm rounded-2xl bg-ink-900 p-4 text-sm text-white shadow-lift">{toast}</div>}
    {active && <div className="fixed inset-0 z-50 grid place-items-center bg-ink-950/75 p-4 backdrop-blur-sm"><div role="dialog" aria-modal="true" aria-labelledby="program-title" className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl bg-white p-6 shadow-lift dark:bg-ink-900 sm:p-8"><div className="flex items-start justify-between gap-4"><div><span className="text-xs font-bold uppercase tracking-widest text-sage-700 dark:text-sage-300">{active.kind} · {active.length}</span><h2 id="program-title" className="mt-2 font-heading text-2xl font-extrabold text-ink-900 dark:text-linen-100">{active.title}</h2></div><button onClick={() => setActive(null)} aria-label="Close guide" className="rounded-lg px-3 py-2 text-sm hover:bg-linen-100 dark:hover:bg-ink-800">Close</button></div><p className="mt-4 text-sm leading-6 text-ink-700 dark:text-linen-200">{active.description}</p><ol className="mt-6 space-y-3">{active.steps.map((step, index) => <li key={step} className="flex gap-3 rounded-xl bg-linen-100 p-4 text-sm leading-5 dark:bg-ink-950"><span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-sage-700 text-xs font-bold text-white">{index + 1}</span>{step}</li>)}</ol><div className="mt-6 flex gap-2 rounded-xl border border-sage-200 p-4 text-xs leading-5 text-ink-700 dark:border-ink-700 dark:text-linen-200"><CalendarDays className="h-4 w-4 shrink-0"/>Take one idea into your schedule if it suits your day. Use Personal Schedule to set a reminder.</div><button onClick={() => void finish(active.id)} className="mt-6 w-full rounded-xl bg-sage-700 px-4 py-3 text-sm font-bold text-white">{completed.includes(active.id) ? 'Completed ✓' : 'Finish & mark complete'} <CheckCircle2 className="ml-1 inline h-4 w-4"/></button></div></div>}
  </div>;
};
