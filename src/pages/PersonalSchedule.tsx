import React, { useMemo, useState } from 'react';
import { Bell, CalendarDays, Clock3, Coffee, HeartPulse, Moon, Plus, Sparkles, Trash2, Waves } from 'lucide-react';
import { RequireAuth } from '../components/RequireAuth';
import { SCHEDULE_DAYS, useSchedule, type ScheduleItem } from '../contexts/ScheduleContext';

const categoryNames: Record<ScheduleItem['category'], string> = { work: 'Work', break: 'Break', personal: 'Personal', sleep: 'Rest & sleep', movement: 'Movement' };
const categoryIcons = { work: Clock3, break: Coffee, personal: HeartPulse, sleep: Moon, movement: Waves };

function analyzeSchedule(items: ScheduleItem[]) {
  const active = items.filter(item => item.enabled);
  const work = active.filter(item => item.category === 'work');
  const pauses = active.filter(item => ['break', 'personal', 'movement'].includes(item.category));
  const minutes = (time: string) => { const [h, m] = time.split(':').map(Number); return h * 60 + m; };
  const overlaps = work.some((item, index) => work.slice(index + 1).some(other => item.days.some(day => other.days.includes(day)) && minutes(item.start) < minutes(other.end) && minutes(other.start) < minutes(item.end)));
  const advice: string[] = [];
  const busiestDay = Math.max(0, ...Array.from({ length: 7 }, (_, day) => work.filter(item => item.days.includes(day)).reduce((total, item) => total + minutes(item.end) - minutes(item.start), 0)));
  const hasBreakInsideWorkday = Array.from({ length: 7 }, (_, day) => {
    const dayWork = work.filter(item => item.days.includes(day));
    const dayPauses = pauses.filter(item => item.days.includes(day));
    if (!dayWork.length) return true;
    const firstStart = Math.min(...dayWork.map(item => minutes(item.start)));
    const lastEnd = Math.max(...dayWork.map(item => minutes(item.end)));
    return dayPauses.some(item => minutes(item.start) >= firstStart && minutes(item.end) <= lastEnd);
  }).every(Boolean);
  if (!work.length) advice.push('Add a work block to get a clearer view of your work and recovery rhythm.');
  if (busiestDay > 480) advice.push(`Your busiest planned day has ${Math.floor(busiestDay / 60)}h ${busiestDay % 60}m of scheduled work. Consider shortening a block or adding more recovery time if this reflects your real day.`);
  if (work.length && (!pauses.length || !hasBreakInsideWorkday)) advice.push('Your plan has no break, movement or personal block inside at least one workday. Consider protecting a short reset between work blocks.');
  if (work.length > 4) advice.push('Many separate work blocks can make a day feel fragmented. Try grouping similar tasks and keeping clear shutdown time.');
  if (overlaps) advice.push('Some work blocks overlap on recurring days. Review those times so your plan stays realistic.');
  if (work.length && pauses.length && hasBreakInsideWorkday && !overlaps) advice.push('Your plan includes a recovery block during each scheduled workday. Keep those blocks flexible and treat recovery as a real commitment.');
  if (!advice.length) advice.push('Your schedule is ready. Check that its times match your local clock and adjust it as your needs change.');
  return advice;
}

const ScheduleContent: React.FC = () => {
  const { items, syncError, notificationPermission, addItem, removeItem, requestNotifications } = useSchedule();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ScheduleItem['category']>('work');
  const [start, setStart] = useState('09:00');
  const [end, setEnd] = useState('10:00');
  const [days, setDays] = useState<number[]>([1, 2, 3, 4, 5]);
  const [error, setError] = useState('');
  const advice = useMemo(() => analyzeSchedule(items), [items]);

  const toggleDay = (day: number) => setDays(current => current.includes(day) ? current.filter(value => value !== day) : [...current, day].sort());
  const save = async (event: React.FormEvent) => {
    event.preventDefault(); setError('');
    if (end <= start) { setError('End time must be later than start time. Add overnight sleep as two blocks if needed.'); return; }
    if (!days.length) { setError('Choose at least one day for this schedule block.'); return; }
    if (title.trim().length < 2) { setError('Add a short activity name.'); return; }
    const saved = await addItem({ title: title.trim(), category, start, end, days });
    if (!saved) { setError('The schedule could not be saved. Please try again.'); return; }
    setTitle('');
  };

  return <div className="mx-auto max-w-6xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
    <section className="rounded-[2rem] bg-gradient-to-br from-ink-950 via-ink-900 to-sage-950 p-7 text-white shadow-lift sm:p-10"><div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs"><CalendarDays className="h-4 w-4"/> Personal rhythm planner</div><h1 className="mt-5 font-heading text-4xl font-extrabold">Make room for your whole day.</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-white/75">Plan recurring work, breaks, movement and personal time. Your schedule belongs to your account; preview data stays in this browser.</p><div className="mt-5 flex flex-wrap items-center gap-3"><button onClick={() => void requestNotifications()} className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-ink-900"><Bell className="h-4 w-4"/>{notificationPermission === 'granted' ? 'Notifications enabled' : 'Enable reminders'}</button><span className="text-xs text-white/65">{notificationPermission === 'unsupported' ? 'System notifications unavailable; in-app reminders still work.' : notificationPermission === 'denied' ? 'Browser notifications are blocked in site settings; in-app reminders still work.' : 'Reminders work while this site is open. Allow notifications for desktop alerts.'}</span></div></section>
    <div className="grid items-start gap-6 lg:grid-cols-[.9fr_1.1fr]">
      <section className="rounded-3xl border border-sage-200 bg-white p-6 shadow-sm dark:border-ink-700 dark:bg-ink-900"><h2 className="font-heading text-xl font-bold text-ink-900 dark:text-linen-100">Add a schedule block</h2><form onSubmit={save} className="mt-5 space-y-4">
        <label className="block text-xs font-semibold">Activity name<input required maxLength={80} value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Focus work, tea break, school pickup" className="mt-2 w-full rounded-xl border border-sage-200 bg-white px-3 py-3 text-sm dark:border-ink-700 dark:bg-ink-950"/></label>
        <label className="block text-xs font-semibold">Type<select value={category} onChange={e => setCategory(e.target.value as ScheduleItem['category'])} className="mt-2 w-full rounded-xl border border-sage-200 bg-white px-3 py-3 text-sm dark:border-ink-700 dark:bg-ink-950">{Object.entries(categoryNames).map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></label>
        <div className="grid grid-cols-2 gap-3"><label className="block text-xs font-semibold">Start time<input type="time" required value={start} onChange={e => setStart(e.target.value)} className="mt-2 w-full rounded-xl border border-sage-200 bg-white px-3 py-3 text-sm dark:border-ink-700 dark:bg-ink-950"/></label><label className="block text-xs font-semibold">End time<input type="time" required value={end} onChange={e => setEnd(e.target.value)} className="mt-2 w-full rounded-xl border border-sage-200 bg-white px-3 py-3 text-sm dark:border-ink-700 dark:bg-ink-950"/></label></div>
        <fieldset><legend className="text-xs font-semibold">Repeat on</legend><div className="mt-2 flex flex-wrap gap-2">{SCHEDULE_DAYS.map((day, index) => <button type="button" key={day} aria-pressed={days.includes(index)} onClick={() => toggleDay(index)} className={`rounded-full px-3 py-2 text-xs font-bold ${days.includes(index) ? 'bg-sage-700 text-white' : 'bg-linen-100 text-ink-700 dark:bg-ink-800 dark:text-linen-200'}`}>{day.slice(0, 3)}</button>)}</div></fieldset>
        {error && <p role="alert" className="rounded-lg bg-rose-50 p-3 text-xs text-rose-800">{error}</p>}<button type="submit" className="inline-flex items-center gap-2 rounded-xl bg-sage-700 px-4 py-3 text-sm font-bold text-white hover:bg-sage-800"><Plus className="h-4 w-4"/>Save schedule</button><p className="text-[11px] leading-5 text-ink-700/60 dark:text-linen-200/60">Times use your device’s local timezone. Browser timers can be paused when the browser or device is asleep; use a calendar alarm for critical reminders.</p>
      </form></section>
      <div className="space-y-6">{syncError && <p role="alert" className="rounded-xl bg-amber-50 p-3 text-sm text-amber-900">{syncError}</p>}<section className="rounded-3xl border border-sage-200 bg-white p-6 shadow-sm dark:border-ink-700 dark:bg-ink-900"><div className="flex items-center gap-2 text-sage-700 dark:text-sage-300"><Sparkles className="h-5 w-5"/><p className="text-xs font-bold uppercase tracking-[.15em]">Schedule reflection</p></div><h2 className="mt-2 font-heading text-xl font-bold text-ink-900 dark:text-linen-100">A gentle balance check</h2><ul className="mt-4 space-y-3">{advice.map((line, index) => <li className="flex gap-3 text-sm leading-6 text-ink-700 dark:text-linen-200" key={index}><span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-sage-500"/>{line}</li>)}</ul><p className="mt-4 border-t border-sage-100 pt-3 text-[11px] text-ink-700/55 dark:border-ink-800 dark:text-linen-200/55">This is an on-device rule-based reflection, not an AI diagnosis or medical advice.</p></section>
      <section className="rounded-3xl border border-sage-200 bg-white p-6 shadow-sm dark:border-ink-700 dark:bg-ink-900"><div className="flex items-center justify-between"><h2 className="font-heading text-xl font-bold text-ink-900 dark:text-linen-100">Your recurring plan</h2><span className="text-xs text-ink-700/60 dark:text-linen-200/60">{items.length} blocks</span></div>{items.length ? <ul className="mt-4 divide-y divide-sage-100 dark:divide-ink-800">{items.map(item => { const Icon = categoryIcons[item.category]; return <li key={item.id} className="flex items-center gap-3 py-4"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-sage-100 text-sage-800 dark:bg-sage-950 dark:text-sage-200"><Icon className="h-5 w-5"/></span><div className="min-w-0 flex-1"><p className="truncate text-sm font-bold text-ink-900 dark:text-linen-100">{item.title}</p><p className="text-xs text-ink-700/60 dark:text-linen-200/60">{item.start}–{item.end} · {item.days.map(day => SCHEDULE_DAYS[day].slice(0, 3)).join(', ')}</p></div><button aria-label={`Remove ${item.title}`} onClick={() => removeItem(item.id)} className="rounded-lg p-2 text-ink-700/60 hover:bg-rose-50 hover:text-rose-700 dark:text-linen-200/60"><Trash2 className="h-4 w-4"/></button></li>; })}</ul> : <div className="py-10 text-center"><CalendarDays className="mx-auto h-8 w-8 text-sage-500"/><p className="mt-3 text-sm font-semibold">Your schedule is ready to shape</p><p className="mt-1 text-xs text-ink-700/60 dark:text-linen-200/60">Start with your work hours, then add recovery time.</p></div>}</section></div>
    </div>
  </div>;
};

export const PersonalSchedule: React.FC = () => <RequireAuth><ScheduleContent /></RequireAuth>;
