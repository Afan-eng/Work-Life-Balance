import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function getCurrentRhythmBadge(hour: number): { label: string; color: string; desc: string } {
  if (hour >= 5 && hour < 11) {
    return { label: 'Morning Focus', color: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-300 dark:border-amber-800', desc: 'Prime cognitive bandwidth & intention setting' };
  } else if (hour >= 11 && hour < 15) {
    return { label: 'Midday Reset', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800', desc: 'Hydration, nourishing lunch & posture checks' };
  } else if (hour >= 15 && hour < 19) {
    return { label: 'Afternoon Recharge', color: 'bg-teal-100 text-teal-800 dark:bg-teal-950/60 dark:text-teal-300 border-teal-300 dark:border-teal-800', desc: 'Collaborative sprints & brisk movement' };
  } else if (hour >= 19 && hour < 23) {
    return { label: 'Evening Wind-Down', color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-300 dark:border-indigo-800', desc: 'Screen dimming, reflection & restorative calm' };
  } else {
    return { label: 'Deep Restoration', color: 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border-purple-300 dark:border-purple-800', desc: 'Circadian healing & uninterrupted sleep' };
  }
}
