import React, { useState } from 'react';
import { Zap, Clock, Target, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Productivity: React.FC = () => {
  const [selectedChronotype, setSelectedChronotype] = useState<'lark' | 'thirdBird' | 'owl'>('thirdBird');

  const CHRONOTYPES = {
    lark: {
      name: 'Morning Lark (20% of population)',
      peakFocus: '8:00 AM – 11:30 AM',
      trough: '1:30 PM – 3:30 PM',
      recovery: '4:00 PM – 6:30 PM',
      curfew: '9:30 PM',
    },
    thirdBird: {
      name: 'Balanced Rhythm / Third Bird (60% of population)',
      peakFocus: '10:00 AM – 1:00 PM',
      trough: '2:30 PM – 4:30 PM',
      recovery: '5:00 PM – 7:30 PM',
      curfew: '10:30 PM',
    },
    owl: {
      name: 'Night Owl (20% of population)',
      peakFocus: '4:00 PM – 8:00 PM',
      trough: '9:00 AM – 11:00 AM',
      recovery: '8:30 PM – 11:00 PM',
      curfew: '12:30 AM',
    },
  };

  const currentChrono = CHRONOTYPES[selectedChronotype];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="relative rounded-3xl overflow-hidden shadow-lift min-h-[280px] flex items-center p-8 sm:p-12">
        <img
          src="/assets/images/hero-focus.jpg"
          alt="Focused serene working desk"
          className="absolute inset-0 w-full h-full object-cover brightness-[0.7]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink-950/90 via-ink-900/70 to-transparent" />

        <div className="relative z-10 max-w-xl text-white space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/30 backdrop-blur-md border border-amber-400/30 text-xs font-semibold text-amber-200">
            <Zap className="w-3.5 h-3.5" />
            <span>Pillar II • Mindful Productivity</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-heading">
            Ultradian Flow & Energy Architecture
          </h1>
          <p className="text-xs sm:text-sm text-linen-200 leading-relaxed">
            Eliminate artificial hustle. Align high-value cognitive sprints with your biological chronotype to accomplish in 4 hours what exhausted workers struggle over in 10.
          </p>
        </div>
      </div>

      {/* Chronotype Energy Timeline Selector */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 shadow-soft border border-sage-200/80 dark:border-ink-700 space-y-6">
        <div>
          <h3 className="font-heading font-bold text-xl text-ink-900 dark:text-linen-100 flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-500" />
            Chronotype Energy Crest & Valley Timeline
          </h3>
          <p className="text-xs text-ink-700/70 dark:text-linen-200/70 mt-1">
            Select your natural biological circadian profile to inspect optimal deep work windows.
          </p>
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {(['lark', 'thirdBird', 'owl'] as const).map((key) => (
            <button
              key={key}
              onClick={() => setSelectedChronotype(key)}
              className={`p-3.5 rounded-2xl border text-center font-bold text-xs transition ${
                selectedChronotype === key
                  ? 'bg-sage-500 text-white border-sage-500 shadow-soft'
                  : 'bg-linen-100 dark:bg-ink-800 text-ink-800 dark:text-linen-200 border-sage-200 dark:border-ink-700 hover:bg-sage-100'
              }`}
            >
              {key === 'lark' && '🌅 Morning Lark'}
              {key === 'thirdBird' && '☀️ Third Bird (Standard)'}
              {key === 'owl' && '🌙 Night Owl'}
            </button>
          ))}
        </div>

        {/* Timeline Visualization Card */}
        <div className="p-6 rounded-2xl bg-linen-50 dark:bg-ink-800/80 border border-sage-200/70 dark:border-ink-700 space-y-4">
          <h4 className="font-heading font-extrabold text-base text-ink-900 dark:text-linen-100">
            {currentChrono.name}
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-2">
            <div className="p-3 rounded-xl bg-emerald-100/70 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 text-center">
              <span className="block text-[10px] uppercase font-bold text-emerald-800 dark:text-emerald-300">Prime Deep Work</span>
              <span className="text-xs font-mono font-extrabold text-emerald-950 dark:text-emerald-100 mt-1 block">
                {currentChrono.peakFocus}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-amber-100/70 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-800 text-center">
              <span className="block text-[10px] uppercase font-bold text-amber-800 dark:text-amber-300">Energy Trough (Pause)</span>
              <span className="text-xs font-mono font-extrabold text-amber-950 dark:text-amber-100 mt-1 block">
                {currentChrono.trough}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-teal-100/70 dark:bg-teal-950/50 border border-teal-300 dark:border-teal-800 text-center">
              <span className="block text-[10px] uppercase font-bold text-teal-800 dark:text-teal-300">Secondary Flow</span>
              <span className="text-xs font-mono font-extrabold text-teal-950 dark:text-teal-100 mt-1 block">
                {currentChrono.recovery}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-indigo-100/70 dark:bg-indigo-950/50 border border-indigo-300 dark:border-indigo-800 text-center">
              <span className="block text-[10px] uppercase font-bold text-indigo-800 dark:text-indigo-300">Sleep Curfew</span>
              <span className="text-xs font-mono font-extrabold text-indigo-950 dark:text-indigo-100 mt-1 block">
                {currentChrono.curfew}
              </span>
            </div>
          </div>
        </div>

        {/* CTA to launch Pomodoro */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-ink-700/60 dark:text-linen-200/60">
            Structure your prime window with 25-minute sprints
          </span>
          <Link
            to="/health-tracker"
            className="px-5 py-2.5 rounded-xl bg-sage-500 hover:bg-sage-600 text-white font-bold text-xs shadow-soft transition flex items-center gap-1.5"
          >
            <span>Launch Pomodoro Sprint</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
