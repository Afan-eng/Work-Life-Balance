import React, { useState } from 'react';
import { Sparkles, Brain, Wind, CheckCircle2, Play, Volume2, ShieldCheck, Heart } from 'lucide-react';
import { QuickBreathModal } from '../components/QuickBreathModal';
import { useStreak } from '../contexts/StreakContext';

export const MentalWellness: React.FC = () => {
  const { recordActivity } = useStreak();
  const [isBreathOpen, setIsBreathOpen] = useState(false);
  const [resetStep, setResetStep] = useState(0);
  const [resetCompleted, setResetCompleted] = useState(false);

  const RESET_STEPS = [
    { title: 'Physiological Sigh', desc: 'Take two quick deep inhales through your nose, followed by one long, slow mouth exhale.' },
    { title: 'Perceptual Broadening', desc: 'Soften your focal vision. Expand your awareness to the extreme edges of your peripheral view.' },
    { title: 'Spinal Decompression', desc: 'Reach your arms high overhead, lace your fingers, and gently tilt your torso side to side.' },
    { title: 'Gratitude Anchor', desc: 'Call to mind one person, animal, or simple pleasure that makes you feel effortlessly safe.' },
  ];

  const handleNextResetStep = () => {
    if (resetStep < RESET_STEPS.length - 1) {
      setResetStep(resetStep + 1);
    } else {
      setResetCompleted(true);
      recordActivity('moment', 'Completed 5-Minute Mental Reset Protocol');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header with authentic photography */}
      <div className="relative rounded-3xl overflow-hidden shadow-lift min-h-[280px] flex items-center p-8 sm:p-12">
        <img
          src="/assets/images/outdoor-reset.jpg"
          alt="Peaceful nature grounding"
          className="absolute inset-0 w-full h-full object-cover brightness-[0.7]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink-950/90 via-ink-900/70 to-transparent" />

        <div className="relative z-10 max-w-xl text-white space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/30 backdrop-blur-md border border-emerald-400/30 text-xs font-semibold text-emerald-200">
            <Brain className="w-3.5 h-3.5" />
            <span>Pillar I • Mental Equilibrium</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-heading">
            Mental Wellness & Somatic Peace
          </h1>
          <p className="text-xs sm:text-sm text-linen-200 leading-relaxed">
            Science-backed protocols to down-regulate sympathetic hyperactivity, quiet cognitive rumination, and cultivate lasting emotional reserve.
          </p>
        </div>
      </div>

      {/* 5-Minute Reset Interactive Protocol */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 shadow-soft border border-sage-200/80 dark:border-ink-700 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-heading font-bold text-xl text-ink-900 dark:text-linen-100 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-warmAmber-500" />
              Interactive 5-Minute Mind Reset
            </h3>
            <p className="text-xs text-ink-700/70 dark:text-linen-200/70 mt-1">
              Step through four sequential somatic anchors to downshift cortisol within 300 seconds.
            </p>
          </div>

          <span className="text-xs font-mono font-bold bg-sage-100 dark:bg-sage-950 text-sage-700 dark:text-sage-300 px-3 py-1 rounded-full self-start sm:self-auto">
            Step {resetStep + 1} of {RESET_STEPS.length}
          </span>
        </div>

        {/* Step Card */}
        <div className="p-6 rounded-2xl bg-linen-50 dark:bg-ink-800/80 border border-sage-200/70 dark:border-ink-700 space-y-3">
          <h4 className="font-heading font-extrabold text-lg text-sage-700 dark:text-sage-300">
            {RESET_STEPS[resetStep].title}
          </h4>
          <p className="text-sm text-ink-800 dark:text-linen-100 leading-relaxed">
            {RESET_STEPS[resetStep].desc}
          </p>
        </div>

        {/* Step Buttons */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={() => setIsBreathOpen(true)}
            className="px-4 py-2 rounded-xl border border-sage-200 dark:border-ink-700 text-xs font-bold text-ink-800 dark:text-linen-200 hover:bg-linen-100 flex items-center gap-1.5 transition"
          >
            <Wind className="w-3.5 h-3.5 text-teal-500" />
            <span>Open Box Breathing Coach</span>
          </button>

          {!resetCompleted ? (
            <button
              onClick={handleNextResetStep}
              className="px-6 py-2.5 rounded-xl bg-sage-500 hover:bg-sage-600 text-white font-bold text-xs shadow-soft transition"
            >
              {resetStep === RESET_STEPS.length - 1 ? 'Finish & Log to Streak' : 'Next Step →'}
            </button>
          ) : (
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950 px-3 py-1.5 rounded-xl">
              <CheckCircle2 className="w-4 h-4" /> Reset Complete! Synced with Supabase.
            </span>
          )}
        </div>
      </div>

      {/* Guided Principles Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card rounded-2xl p-6 border border-sage-200/70 dark:border-ink-700 space-y-3 shadow-soft">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center font-bold">
            1
          </div>
          <h4 className="font-heading font-bold text-sm text-ink-900 dark:text-linen-100">
            Vagal Nerve Stimulation
          </h4>
          <p className="text-xs text-ink-700/70 dark:text-linen-200/70 leading-relaxed">
            Long expirations naturally stimulate the vagus nerve, slowing heart rate and terminating fight-or-flight spikes.
          </p>
        </div>

        <div className="glass-card rounded-2xl p-6 border border-sage-200/70 dark:border-ink-700 space-y-3 shadow-soft">
          <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-950 text-teal-600 flex items-center justify-center font-bold">
            2
          </div>
          <h4 className="font-heading font-bold text-sm text-ink-900 dark:text-linen-100">
            Peripheral Gaze Softening
          </h4>
          <p className="text-xs text-ink-700/70 dark:text-linen-200/70 leading-relaxed">
            Staring at narrow smartphone screens contracts vision and activates stress circuits. Looking at distant horizons relaxes alertness.
          </p>
        </div>

        <div className="glass-card rounded-2xl p-6 border border-sage-200/70 dark:border-ink-700 space-y-3 shadow-soft">
          <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 flex items-center justify-center font-bold">
            3
          </div>
          <h4 className="font-heading font-bold text-sm text-ink-900 dark:text-linen-100">
            Cognitive Reframing
          </h4>
          <p className="text-xs text-ink-700/70 dark:text-linen-200/70 leading-relaxed">
            Shift from asking "How do I do more?" to "What is the single essential action that allows everything else to flow?"
          </p>
        </div>
      </div>

      <QuickBreathModal isOpen={isBreathOpen} onClose={() => setIsBreathOpen(false)} />
    </div>
  );
};
