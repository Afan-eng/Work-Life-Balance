import React, { useEffect, useState } from 'react';
import { Activity, Flame, Users, TrendingUp, Globe2, ShieldCheck, CalendarDays } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface ActivityDay { date: string; active: number | null }
interface PublicStreakStats {
  cohort_ready: boolean;
  member_count: number;
  active_today: number | null;
  members_with_streak: number | null;
  average_streak: number | null;
  last_365_days: ActivityDay[];
}
const EMPTY: PublicStreakStats = { cohort_ready: false, member_count: 0, active_today: 0, members_with_streak: 0, average_streak: 0, last_365_days: [] };

const buildCalendar = (days: ActivityDay[]) => {
  if (!days.length) return { weeks: [] as ActivityDay[][], months: [] as { index: number; label: string }[] };
  const byDate = new Map(days.map((day) => [day.date, day]));
  const first = new Date(`${days[0].date}T12:00:00`);
  first.setDate(first.getDate() - first.getDay());
  const weeks: ActivityDay[][] = [];
  for (let week = 0; week < 53; week += 1) {
    const cells: ActivityDay[] = [];
    for (let weekday = 0; weekday < 7; weekday += 1) {
      const date = new Date(first);
      date.setDate(first.getDate() + week * 7 + weekday);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      cells.push(byDate.get(key) || { date: key, active: null });
    }
    weeks.push(cells);
  }
  const months = weeks.map((week, index) => {
    const start = week.find((day) => day.date.endsWith('-01'));
    if (!start || start.date < days[0].date || start.date > days[days.length - 1].date) return null;
    const label = new Date(`${start.date}T12:00:00`).toLocaleDateString(undefined, { month: 'short' });
    return { index, label };
  }).filter((month): month is { index: number; label: string } => Boolean(month));
  return { weeks, months };
};

export const GlobalDashboard: React.FC = () => {
  const [stats, setStats] = useState<PublicStreakStats>(EMPTY);
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [error, setError] = useState('');
  useEffect(() => {
    if (!isSupabaseConfigured) return;
    let active = true;
    void (async () => {
      try {
        const { data, error: rpcError } = await supabase.rpc('get_public_streak_stats');
        if (!active) return;
        if (rpcError) setError('Apply the latest database schema migration to enable shared audience statistics.');
        else if (data) setStats(data as PublicStreakStats);
      } catch {
        if (active) setError('Audience statistics are temporarily unavailable.');
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  const metrics = [
    { title: 'Streak members', value: stats.cohort_ready ? stats.member_count.toLocaleString() : '—', icon: Users, detail: 'Accounts with a tracker record' },
    { title: 'Active today', value: stats.cohort_ready && stats.active_today !== null ? stats.active_today.toLocaleString() : '—', icon: Activity, detail: 'Small counts are hidden for privacy' },
    { title: 'On a streak', value: stats.cohort_ready && stats.members_with_streak !== null ? stats.members_with_streak.toLocaleString() : '—', icon: Flame, detail: 'Shown after five active streaks' },
    { title: 'Average run', value: stats.cohort_ready && stats.average_streak !== null ? `${stats.average_streak} days` : '—', icon: TrendingUp, detail: 'Shown after five active streaks' },
  ];
  const calendar = buildCalendar(stats.last_365_days);
  const visibleDays = stats.last_365_days.filter((day) => day.active !== null).length;
  const maxActive = Math.max(5, ...stats.last_365_days.map((day) => day.active || 0));

  return <main className="mx-auto max-w-7xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
    <header className="relative isolate overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#052e2b] via-[#075b48] to-[#0e7665] p-7 text-white shadow-[0_28px_90px_-38px_rgba(4,90,62,.7)] sm:p-10">
      <div className="absolute -right-10 -top-24 -z-10 h-80 w-80 rounded-full bg-teal-300/15 blur-3xl"/><div className="absolute -bottom-32 left-1/3 -z-10 h-72 w-72 rounded-full bg-emerald-300/10 blur-3xl"/>
      <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-100"><Globe2 className="h-3.5 w-3.5"/>Community streaks</div>
      <div className="mt-5 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end"><div><h1 className="max-w-3xl font-heading text-3xl font-extrabold tracking-tight sm:text-5xl">A year of small steps, together.</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-emerald-50/80">See the community build consistency one completed tracker at a time. This public view shares totals only; personal journals and individual histories stay private.</p></div><div className="inline-flex items-center gap-2 self-start rounded-2xl border border-white/15 bg-black/10 px-4 py-3 text-xs font-semibold text-emerald-50 lg:self-end"><ShieldCheck className="h-4 w-4 text-emerald-200"/>Daily totals below five are hidden</div></div>
    </header>

    {error && <div role="status" className="rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">{error}</div>}
    {!isSupabaseConfigured && <div role="status" className="rounded-2xl border border-sage-200 bg-white/70 p-4 text-sm text-ink-800 dark:border-ink-700 dark:bg-ink-900 dark:text-linen-200">Preview mode: community totals need a connected Supabase database. Personal demo streaks remain private in this browser.</div>}
    {loading && <p className="text-sm text-ink-700 dark:text-linen-200">Loading community totals…</p>}

    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Community streak metrics">{metrics.map(({ title, value, icon: Icon, detail }) => <article key={title} className="group rounded-2xl border border-sage-200/80 bg-white/80 p-5 shadow-[0_12px_40px_-28px_rgba(5,70,50,.35)] transition hover:-translate-y-0.5 hover:shadow-lg dark:border-ink-700 dark:bg-ink-900/80"><div className="flex items-center justify-between"><span className="text-xs font-semibold text-ink-700/70 dark:text-linen-200/70">{title}</span><span className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-50 text-emerald-700 transition group-hover:bg-emerald-600 group-hover:text-white dark:bg-emerald-950 dark:text-emerald-300"><Icon className="h-4 w-4"/></span></div><p className="mt-4 font-heading text-3xl font-extrabold tracking-tight text-ink-900 dark:text-linen-100">{loading ? '…' : value}</p><p className="mt-1 text-[11px] text-ink-700/60 dark:text-linen-200/60">{detail}</p></article>)}</section>

    <section className="overflow-hidden rounded-[2rem] border border-sage-200/80 bg-white/85 p-5 shadow-[0_24px_80px_-48px_rgba(5,85,60,0.3)] dark:border-ink-700 dark:bg-ink-900/85 sm:p-8">
      <div className="flex flex-wrap items-end justify-between gap-4"><div><div className="mb-2 inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-700 dark:text-emerald-300"><CalendarDays className="h-3.5 w-3.5"/>Contribution map</div><h2 className="font-heading text-xl font-extrabold tracking-tight text-ink-900 dark:text-linen-100 sm:text-2xl">The community showed up</h2><p className="mt-1 text-xs text-ink-700/65 dark:text-linen-200/65">A day lights up when at least five members completed a tracker.</p></div><div className="rounded-2xl bg-emerald-50 px-4 py-3 text-right dark:bg-emerald-950/50"><strong className="block text-2xl font-extrabold text-emerald-800 dark:text-emerald-300">{stats.cohort_ready ? visibleDays : '—'}</strong><span className="text-[9px] font-bold uppercase tracking-[0.15em] text-emerald-700/70 dark:text-emerald-300/70">days with activity</span></div></div>
      {stats.cohort_ready && calendar.weeks.length ? <div className="mt-6 overflow-x-auto pb-2"><div className="min-w-[760px]"><div className="mb-2 grid h-4 text-[9px] font-semibold text-ink-500 dark:text-linen-400" style={{ gridTemplateColumns: 'repeat(53, minmax(0, 1fr))' }}>{calendar.months.map(({ index, label }) => <span key={`${label}-${index}`} style={{ gridColumnStart: index + 1 }}>{label}</span>)}</div><div className="grid gap-[3px]" style={{ gridTemplateColumns: 'repeat(53, minmax(0, 1fr))', gridTemplateRows: 'repeat(7, 13px)', gridAutoFlow: 'column' }}>{calendar.weeks.flatMap((week, weekIndex) => week.map((day, weekday) => { const intensity = day.active || 0; const level = intensity === 0 ? 0 : intensity < maxActive * 0.35 ? 1 : intensity < maxActive * 0.65 ? 2 : intensity < maxActive * 0.85 ? 3 : 4; const shade = ['bg-emerald-50 dark:bg-ink-800', 'bg-emerald-200 dark:bg-emerald-950', 'bg-emerald-300 dark:bg-emerald-800', 'bg-emerald-500 dark:bg-emerald-600', 'bg-emerald-700 dark:bg-emerald-400'][level]; return <span key={`${weekIndex}-${weekday}`} title={`${day.date}: ${day.active === null ? 'fewer than five members or no activity' : `${day.active} members completed a tracker`}`} aria-label={`${day.date}: ${day.active === null ? 'activity hidden for privacy' : `${day.active} active members`}`} className={`rounded-[3px] ${shade}`} />; }))}</div><div className="mt-4 flex flex-wrap items-center justify-between gap-3"><span className="text-[10px] text-ink-600/70 dark:text-linen-300/60">Daily activity stays anonymous and is hidden below five members.</span><div className="flex items-center gap-1.5 text-[9px] text-ink-600/70 dark:text-linen-300/60"><span>Less</span><i className="h-3 w-3 rounded-[3px] bg-emerald-50 dark:bg-ink-800"/><i className="h-3 w-3 rounded-[3px] bg-emerald-200 dark:bg-emerald-950"/><i className="h-3 w-3 rounded-[3px] bg-emerald-500"/><i className="h-3 w-3 rounded-[3px] bg-emerald-700 dark:bg-emerald-400"/><span>More</span></div></div></div></div> : <div className="mt-6 rounded-2xl bg-linen-50 p-8 text-center text-sm text-ink-700/70 dark:bg-ink-800 dark:text-linen-200/70">Shared contribution history will appear when the community has at least five streak records. Each completed tracker adds one day square.</div>}
    </section>
  </main>;
};

export default GlobalDashboard;
