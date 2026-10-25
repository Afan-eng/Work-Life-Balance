import React, { useState } from 'react';
import { Smartphone, ShieldCheck, BellOff, Moon, Eye, Sparkles, CheckCircle2 } from 'lucide-react';
import { useStreak } from '../contexts/StreakContext';

export const DigitalWellbeing: React.FC = () => {
  const { recordActivity } = useStreak();
  const [dailyHours, setDailyHours] = useState(4.5);
  const [curfewAgreed, setCurfewAgreed] = useState(false);

  // Calculate lifetime screen time (over 50 years)
  const lifetimeYears = Math.round((dailyHours * 365 * 50) / (24 * 365));

  const handleAgreeCurfew = () => {
    setCurfewAgreed(true);
    recordActivity('habit', 'Signed Digital Evening Curfew Agreement');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="relative rounded-3xl overflow-hidden shadow-lift min-h-[280px] flex items-center p-8 sm:p-12">
        <img
          src="/assets/images/serenity-work-banner.jpg"
          alt="Clean digital setup with balance"
          className="absolute inset-0 w-full h-full object-cover brightness-[0.7]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink-950/90 via-ink-900/70 to-transparent" />

        <div className="relative z-10 max-w-xl text-white space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/30 backdrop-blur-md border border-indigo-400/30 text-xs font-semibold text-indigo-200">
            <Smartphone className="w-3.5 h-3.5" />
            <span>Pillar IV • Digital Sovereignty</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-heading">
            Digital Wellbeing & Screen Hygiene
          </h1>
          <p className="text-xs sm:text-sm text-linen-200 leading-relaxed">
            Technology should serve human intention, not exploit evolutionary vulnerabilities. Reclaim your sovereignty from algorithm-driven distraction loops.
          </p>
        </div>
      </div>

      {/* Interactive Screen Time Lifetime Audit */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 shadow-soft border border-sage-200/80 dark:border-ink-700 space-y-6">
        <div>
          <h3 className="font-heading font-bold text-xl text-ink-900 dark:text-linen-100 flex items-center gap-2">
            <Eye className="w-5 h-5 text-indigo-600" />
            Interactive Screen Time Lifetime Audit
          </h3>
          <p className="text-xs text-ink-700/70 dark:text-linen-200/70 mt-1">
            Slide to your current average daily recreational screen time to visualize its cumulative footprint over 50 years.
          </p>
        </div>

        <div className="space-y-4 max-w-xl">
          <div className="flex justify-between text-sm font-bold">
            <span className="text-ink-900 dark:text-linen-100">Daily Phone & Screen Time:</span>
            <span className="text-indigo-600 dark:text-indigo-400 font-mono text-base">{dailyHours} Hours/Day</span>
          </div>
          <input
            type="range"
            min="1"
            max="12"
            step="0.5"
            value={dailyHours}
            onChange={(e) => setDailyHours(Number(e.target.value))}
            className="w-full accent-indigo-600 h-2 bg-sage-200 dark:bg-ink-800 rounded-lg cursor-pointer"
          />
        </div>

        {/* Shock metric card */}
        <div className="p-6 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="block text-xs uppercase font-bold text-indigo-800 dark:text-indigo-300">Cumulative Lifetime Footprint</span>
            <span className="font-heading font-extrabold text-3xl sm:text-4xl text-indigo-950 dark:text-indigo-100 mt-1 block">
              {lifetimeYears} Entire Years
            </span>
            <p className="text-xs text-indigo-900/70 dark:text-indigo-200/70 mt-1">
              Spent looking into glass pixels instead of nature, deep connections, or restorative sleep.
            </p>
          </div>
        </div>
      </div>

      {/* 3 Golden Rules of Notification Hygiene */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card rounded-2xl p-6 border border-sage-200/70 dark:border-ink-700 shadow-soft space-y-3">
          <BellOff className="w-6 h-6 text-indigo-500 mb-1" />
          <h4 className="font-heading font-bold text-sm text-ink-900 dark:text-linen-100">Zero Red Badges</h4>
          <p className="text-xs text-ink-700/70 dark:text-linen-200/70 leading-relaxed">
            Red notification bubbles trigger subconscious urgency alarms in the brain. Disable all app icon badge counters.
          </p>
        </div>

        <div className="glass-card rounded-2xl p-6 border border-sage-200/70 dark:border-ink-700 shadow-soft space-y-3">
          <Eye className="w-6 h-6 text-teal-500 mb-1" />
          <h4 className="font-heading font-bold text-sm text-ink-900 dark:text-linen-100">Greyscale Display Filter</h4>
          <p className="text-xs text-ink-700/70 dark:text-linen-200/70 leading-relaxed">
            Removing vibrant RGB colors strips apps of psychological dopamine rewards, reducing compulsive checking by 30%.
          </p>
        </div>

        <div className="glass-card rounded-2xl p-6 border border-sage-200/70 dark:border-ink-700 shadow-soft space-y-3">
          <Moon className="w-6 h-6 text-amber-500 mb-1" />
          <h4 className="font-heading font-bold text-sm text-ink-900 dark:text-linen-100">Phone-Free Bedroom</h4>
          <p className="text-xs text-ink-700/70 dark:text-linen-200/70 leading-relaxed">
            Charge your phone outside the bedroom overnight and use a simple analog clock to reclaim pre-sleep tranquility.
          </p>
        </div>
      </div>

      {/* Digital Boundary Contract Card */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 shadow-soft border border-sage-200/80 dark:border-ink-700 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h4 className="font-heading font-bold text-base text-ink-900 dark:text-linen-100">
            Sign the Evening Digital Curfew
          </h4>
          <p className="text-xs text-ink-700/70 dark:text-linen-200/70 mt-1">
            "I commit to placing all work tabs and social feeds in airplane mode at least 60 minutes before bedtime tonight."
          </p>
        </div>

        <button
          onClick={handleAgreeCurfew}
          disabled={curfewAgreed}
          className={`px-5 py-2.5 rounded-xl font-bold text-xs transition shrink-0 ${
            curfewAgreed
              ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-soft'
          }`}
        >
          {curfewAgreed ? (
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Curfew Pledged 🔥
            </span>
          ) : (
            'I Pledge Tonight'
          )}
        </button>
      </div>
    </div>
  );
};
