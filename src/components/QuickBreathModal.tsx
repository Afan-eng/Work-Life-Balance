import React, { useState, useEffect } from 'react';
import { X, Play, RotateCcw, Heart, CheckCircle2 } from 'lucide-react';
import { useStreak } from '../contexts/StreakContext';

interface QuickBreathModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuickBreathModal: React.FC<QuickBreathModalProps> = ({ isOpen, onClose }) => {
  const { recordActivity } = useStreak();

  const [phase, setPhase] = useState<'Inhale' | 'Hold (Full)' | 'Exhale' | 'Hold (Empty)'>('Inhale');
  const [phaseSeconds, setPhaseSeconds] = useState(4);
  const [totalSecondsElapsed, setTotalSecondsElapsed] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [completed, setCompleted] = useState(false);

  // Target duration: 60 seconds (approx 4 full 16-second box cycles)
  const TARGET_DURATION = 60;

  useEffect(() => {
    if (!isOpen) {
      setIsActive(false);
      setTotalSecondsElapsed(0);
      setPhaseSeconds(4);
      setPhase('Inhale');
      setCompleted(false);
      return;
    }
    setIsActive(true);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !isActive || completed) return;

    const timer = setInterval(() => {
      setTotalSecondsElapsed(prev => {
        const next = prev + 1;
        if (next >= TARGET_DURATION) {
          setCompleted(true);
          recordActivity('breath', 'Completed 60s Box Breathing Session');
          return TARGET_DURATION;
        }
        return next;
      });

      setPhaseSeconds(prev => {
        if (prev <= 1) {
          // cycle to next phase
          setPhase(current => {
            if (current === 'Inhale') return 'Hold (Full)';
            if (current === 'Hold (Full)') return 'Exhale';
            if (current === 'Exhale') return 'Hold (Empty)';
            return 'Inhale';
          });
          return 4;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, isActive, completed, recordActivity]);

  if (!isOpen) return null;

  const getPhaseInstruction = () => {
    switch (phase) {
      case 'Inhale':
        return 'Breathe in slowly through your nose, expanding your lower belly';
      case 'Hold (Full)':
        return 'Gently retain your breath with ease, keeping your shoulders relaxed';
      case 'Exhale':
        return 'Release softly and completely through open mouth or nostrils';
      case 'Hold (Empty)':
        return 'Rest in peaceful stillness before the next gentle breath';
    }
  };

  const getScaleClass = () => {
    if (phase === 'Inhale') return 'scale-125 bg-sage-400/40 border-sage-500';
    if (phase === 'Hold (Full)') return 'scale-125 bg-sage-500/50 border-sage-600';
    if (phase === 'Exhale') return 'scale-90 bg-sage-300/30 border-sage-400';
    return 'scale-90 bg-sage-200/20 border-sage-300';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-linen-50 dark:bg-ink-900 border border-sage-200 dark:border-ink-700 rounded-3xl shadow-lift overflow-hidden text-center p-8">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-ink-700/60 hover:text-ink-900 dark:text-linen-200/60 dark:hover:text-white rounded-full hover:bg-sage-100 dark:hover:bg-ink-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sage-100 dark:bg-sage-950/60 text-sage-700 dark:text-sage-300 text-xs font-semibold mb-6">
          <Heart className="w-3.5 h-3.5 fill-sage-500 text-sage-500" />
          <span>Vagus Nerve Reset • 4-4-4-4 Rhythm</span>
        </div>

        {/* Dynamic Box Coach Display */}
        <div className="relative w-56 h-56 mx-auto my-6 flex items-center justify-center">
          {/* Animated pulsing outer halo */}
          <div
            className={`absolute inset-4 rounded-3xl border-2 transition-all duration-[4000ms] ease-in-out ${getScaleClass()}`}
          />
          <div className="absolute inset-8 rounded-2xl bg-white/80 dark:bg-ink-800/80 backdrop-blur-sm border border-sage-200/80 dark:border-ink-700 shadow-soft flex flex-col items-center justify-center p-4">
            <span className="text-3xl font-heading font-extrabold text-ink-900 dark:text-linen-100">
              {completed ? 'Complete' : phaseSeconds}s
            </span>
            <span className="text-sm font-semibold tracking-wide text-sage-600 dark:text-sage-400 uppercase mt-1">
              {completed ? 'Centered' : phase}
            </span>
          </div>
        </div>

        {/* Phase instruction */}
        <p className="text-sm text-ink-700/80 dark:text-linen-200/80 max-w-sm mx-auto h-10 mb-6 flex items-center justify-center">
          {completed ? (
            <span className="text-sage-600 dark:text-sage-400 font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> 60s Session Complete. Streak logged!
            </span>
          ) : (
            getPhaseInstruction()
          )}
        </p>

        {/* Progress bar */}
        <div className="w-full bg-sage-200/50 dark:bg-ink-800 h-2 rounded-full overflow-hidden mb-6">
          <div
            className="bg-sage-500 h-full transition-all duration-1000 ease-linear rounded-full"
            style={{ width: `${(totalSecondsElapsed / TARGET_DURATION) * 100}%` }}
          />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4">
          {!completed ? (
            <button
              onClick={() => setIsActive(!isActive)}
              className="px-6 py-2.5 rounded-xl bg-sage-500 hover:bg-sage-600 text-white font-semibold text-sm flex items-center gap-2 shadow-soft transition"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>{isActive ? 'Pause' : 'Resume'}</span>
            </button>
          ) : (
            <button
              onClick={() => {
                setCompleted(false);
                setTotalSecondsElapsed(0);
                setPhaseSeconds(4);
                setPhase('Inhale');
                setIsActive(true);
              }}
              className="px-6 py-2.5 rounded-xl bg-sage-500 hover:bg-sage-600 text-white font-semibold text-sm flex items-center gap-2 shadow-soft transition"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Breathe Again</span>
            </button>
          )}

          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-sage-200 dark:border-ink-700 hover:bg-linen-100 dark:hover:bg-ink-800 text-ink-800 dark:text-linen-200 font-medium text-sm transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
