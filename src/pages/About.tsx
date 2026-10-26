import React from 'react';
import { Sparkles, Heart, Compass, ShieldCheck } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Hero */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sage-100 dark:bg-sage-950/60 text-sage-700 dark:text-sage-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Our Origins & Ethos</span>
        </div>
        <h1 className="text-4xl font-extrabold font-heading text-ink-900 dark:text-linen-100">
          Life works better in balance.
        </h1>
        <p className="text-sm text-ink-700/80 dark:text-linen-200/80 leading-relaxed">
          Balance Compass was founded in response to the modern epidemic of digital overstimulation, chronic burnout, and fractured human connection.
        </p>
      </div>

      <div className="rounded-3xl overflow-hidden shadow-lift max-h-[380px]">
        <img
          src="/assets/images/community-family.jpg"
          alt="People gathered in warm mindful connection"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Core Philosophy */}
      <div className="glass-card rounded-3xl p-8 sm:p-10 shadow-soft border border-sage-200/80 dark:border-ink-700 space-y-6">
        <h2 className="text-2xl font-bold font-heading text-ink-900 dark:text-linen-100">
          The Sanctuary Creed
        </h2>
        <div className="space-y-4 text-xs sm:text-sm text-ink-800/80 dark:text-linen-200/80 leading-relaxed">
          <p>
            We believe that true productivity is not a race toward exhaustion, but an organic consequence of deep restoration. When human biology is honored through circadian light, conscious breath, nourishing food, and non-transactional community, high performance becomes graceful and sustainable.
          </p>
          <p>
            Our software is deliberately built with calm botanical aesthetics—free from addictive slot-machine gamification, flashing urgency indicators, or exploitative advertising models. Every tool is an invitation to pause, breathe, and return to yourself.
          </p>
        </div>
      </div>

      {/* Pillars of Integrity */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card rounded-2xl p-6 border border-sage-200/70 dark:border-ink-700 shadow-soft space-y-2">
          <Heart className="w-5 h-5 text-rose-500 mb-2" />
          <h4 className="font-heading font-bold text-sm text-ink-900 dark:text-linen-100">Somatic Primacy</h4>
          <p className="text-xs text-ink-700/70 dark:text-linen-200/70 leading-relaxed">
            The mind cannot calm a body that feels unsafe. We ground the nervous system first, letting clarity follow.
          </p>
        </div>

        <div className="glass-card rounded-2xl p-6 border border-sage-200/70 dark:border-ink-700 shadow-soft space-y-2">
          <Compass className="w-5 h-5 text-teal-500 mb-2" />
          <h4 className="font-heading font-bold text-sm text-ink-900 dark:text-linen-100">Human Sovereignty</h4>
          <p className="text-xs text-ink-700/70 dark:text-linen-200/70 leading-relaxed">
            We build open tools that empower autonomy. Your attention belongs to you, not an engagement algorithm.
          </p>
        </div>

        <div className="glass-card rounded-2xl p-6 border border-sage-200/70 dark:border-ink-700 shadow-soft space-y-2">
          <ShieldCheck className="w-5 h-5 text-emerald-500 mb-2" />
          <h4 className="font-heading font-bold text-sm text-ink-900 dark:text-linen-100">Total Privacy</h4>
          <p className="text-xs text-ink-700/70 dark:text-linen-200/70 leading-relaxed">
            Postgres Row Level Security and zero data brokering. Your reflections are protected sanctuaries.
          </p>
        </div>
      </div>
    </div>
  );
};
