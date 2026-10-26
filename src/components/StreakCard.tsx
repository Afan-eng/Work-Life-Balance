import React, { useEffect, useState } from 'react';
import { Award, CalendarDays, CheckCircle2, Flame, Info } from 'lucide-react';
import { useStreak } from '../contexts/StreakContext';
import { getLocalDateKey } from '../lib/utils';

export const StreakCard: React.FC = () => {
  const { currentStreak, projectedStreak, bestStreak, todayCompleted, completionMatrix, streakError } = useStreak();
  const today = new Date();
  const [clockNow, setClockNow] = useState(Date.now());
  useEffect(() => {
    const timer = window.setInterval(() => setClockNow(Date.now()), 30_000);
    return () => window.clearInterval(timer);
  }, []);
  const nextMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1).getTime();
  const minutesUntilMidnight = Math.max(0, Math.ceil((nextMidnight - clockNow) / 60_000));
  const hoursLeft = Math.floor(minutesUntilMidnight / 60);
  const minutesLeft = minutesUntilMidnight % 60;
  const todayKey = getLocalDateKey(today);
  const calendarStart = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 12);
  calendarStart.setDate(calendarStart.getDate() - 364 - calendarStart.getDay());
  const weeks: Date[][] = [];
  for (let week = 0; week < 53; week += 1) {
    const days = Array.from({ length: 7 }, (_, weekday) => {
      const date = new Date(calendarStart);
      date.setDate(calendarStart.getDate() + week * 7 + weekday);
      return date;
    });
    weeks.push(days);
  }
  const yearAgo = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 12);
  yearAgo.setDate(yearAgo.getDate() - 364);
  const contributionCount = Object.entries(completionMatrix).filter(([date, completed]) => completed && date >= getLocalDateKey(yearAgo) && date <= todayKey).length;
  const monthLabels = weeks.map((week, index) => {
    const monthStart = week.find((date) => date.getDate() === 1 && date <= today);
    return monthStart ? { index, label: monthStart.toLocaleDateString(undefined, { month: 'short' }) } : null;
  }).filter((label): label is { index: number; label: string } => Boolean(label));
  const headlineStreak = todayCompleted ? projectedStreak : currentStreak;

  return <section className="relative overflow-hidden rounded-[2rem] border border-emerald-200/70 bg-gradient-to-br from-white via-emerald-50/70 to-teal-50/80 p-6 shadow-[0_24px_80px_-42px_rgba(5,85,60,0.35)] dark:border-emerald-900/70 dark:from-ink-900 dark:via-ink-900 dark:to-emerald-950/50 sm:p-8" aria-labelledby="streak-dashboard-title">
    <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-emerald-300/20 blur-3xl dark:bg-emerald-500/10" />
    {streakError && <p role="status" className="relative mb-4 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-xs leading-5 text-amber-950 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200">{streakError}</p>}
    <div className="relative flex flex-col justify-between gap-6 lg:flex-row lg:items-start">
      <div>
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-emerald-800 dark:border-emerald-900 dark:bg-ink-900/70 dark:text-emerald-300"><CalendarDays className="h-3.5 w-3.5" /> Your consistency</div>
        <h2 id="streak-dashboard-title" className="mt-4 font-heading text-2xl font-extrabold tracking-tight text-ink-950 dark:text-linen-100 sm:text-3xl">Every day you show up counts.</h2>
        <p className="mt-2 max-w-xl text-sm leading-6 text-ink-700/70 dark:text-linen-200/70">A contribution is recorded only after you complete a wellness tracker. Your local calendar day must finish before it becomes an official streak day.</p>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:min-w-[320px]">
        <div className="rounded-2xl border border-amber-200/80 bg-white/85 p-4 dark:border-amber-900/60 dark:bg-ink-900/80"><div className="flex items-center gap-2 text-amber-700 dark:text-amber-300"><Flame className="h-4 w-4 fill-current"/><span className="text-[10px] font-extrabold uppercase tracking-wider">{todayCompleted ? 'Pending today' : 'Current streak'}</span></div><div className="mt-2 flex items-baseline gap-1.5"><strong className="font-heading text-4xl font-extrabold tracking-tight text-ink-950 dark:text-white">{headlineStreak}</strong><span className="text-xs font-semibold text-ink-600 dark:text-linen-300">days</span></div><p className="mt-1 text-[11px] text-ink-600/70 dark:text-linen-300/60">{todayCompleted ? 'Locks at local midnight' : 'Completed calendar days'}</p></div>
        <div className="rounded-2xl border border-emerald-200/80 bg-white/85 p-4 dark:border-emerald-900/60 dark:bg-ink-900/80"><div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300"><Award className="h-4 w-4"/><span className="text-[10px] font-extrabold uppercase tracking-wider">Personal best</span></div><div className="mt-2 flex items-baseline gap-1.5"><strong className="font-heading text-4xl font-extrabold tracking-tight text-ink-950 dark:text-white">{bestStreak}</strong><span className="text-xs font-semibold text-ink-600 dark:text-linen-300">days</span></div><p className="mt-1 text-[11px] text-ink-600/70 dark:text-linen-300/60">Longest completed run</p></div>
      </div>
    </div>

    <div className="relative mt-7 rounded-2xl border border-emerald-100 bg-white/75 p-4 dark:border-ink-700 dark:bg-ink-950/45 sm:p-5">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2"><div><h3 className="text-sm font-bold text-ink-900 dark:text-linen-100">Activity over the last year</h3><p className="mt-1 text-[11px] text-ink-700/60 dark:text-linen-200/60">One square means you completed at least one tracker that day.</p></div><div className="rounded-xl bg-emerald-50 px-3 py-2 text-right dark:bg-emerald-950/50"><strong className="block text-lg font-extrabold text-emerald-800 dark:text-emerald-300">{contributionCount}</strong><span className="text-[9px] font-bold uppercase tracking-wider text-emerald-700/70 dark:text-emerald-300/70">Active days</span></div></div>
      <div className="overflow-x-auto pb-2" role="group" aria-label={`Contribution calendar with ${contributionCount} active days during the last year`}>
        <div className="min-w-[720px]">
          <div className="mb-1 grid h-4 text-[9px] font-semibold text-ink-500 dark:text-linen-400" style={{ gridTemplateColumns: 'repeat(53, minmax(0, 1fr))' }}>{monthLabels.map(({ index, label }) => <span key={`${label}-${index}`} style={{ gridColumnStart: index + 1 }}>{label}</span>)}</div>
          <div className="grid gap-[3px]" style={{ gridTemplateColumns: 'repeat(53, minmax(0, 1fr))', gridTemplateRows: 'repeat(7, 12px)', gridAutoFlow: 'column' }}>
            {weeks.flatMap((week, weekIndex) => week.map((date, weekday) => {
              const dateKey = getLocalDateKey(date);
              const active = Boolean(completionMatrix[dateKey]);
              const isToday = dateKey === todayKey;
              const inRange = dateKey >= getLocalDateKey(yearAgo) && dateKey <= todayKey;
              return <span key={`${weekIndex}-${weekday}`} title={`${date.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}${active ? ' · tracker completed' : ''}${isToday ? ' · today' : ''}`} aria-label={`${dateKey}: ${active ? 'tracker completed' : 'no tracker completed'}${isToday ? ', today' : ''}`} className={`rounded-[3px] ${!inRange ? 'bg-transparent' : active ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.22)] dark:bg-emerald-400' : 'bg-emerald-100/90 dark:bg-ink-700'} ${isToday ? 'ring-2 ring-amber-400 ring-offset-1 ring-offset-white dark:ring-offset-ink-950' : ''}`} />;
            }))}
          </div>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3"><div className="flex items-center gap-2 text-[10px] text-ink-600/70 dark:text-linen-300/60"><Info className="h-3.5 w-3.5"/>{todayCompleted ? `Today is recorded · day closes in ${hoursLeft}h ${String(minutesLeft).padStart(2, '0')}m` : `Complete a tracker · day closes in ${hoursLeft}h ${String(minutesLeft).padStart(2, '0')}m`}</div><div className="flex items-center gap-1.5 text-[9px] text-ink-600/70 dark:text-linen-300/60"><span>Less</span><i className="h-3 w-3 rounded-[3px] bg-emerald-100 dark:bg-ink-700"/><i className="h-3 w-3 rounded-[3px] bg-emerald-500 dark:bg-emerald-400"/><span>More</span></div></div>
        </div>
      </div>
    </div>
    {currentStreak > 0 && !todayCompleted && <p className="relative mt-4 flex items-center gap-2 text-xs font-medium text-amber-800 dark:text-amber-300"><CheckCircle2 className="h-4 w-4"/> Your {currentStreak}-day run is secured through yesterday. Complete any tracker today to keep it going.</p>}
  </section>;
};
