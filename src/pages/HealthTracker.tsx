import React, { useState, useEffect } from 'react';
import { 
  Play, Pause, RotateCcw, Wind, Clock, Flame, 
  Volume2, VolumeX, Sparkles, CheckCircle2, Globe, Heart 
} from 'lucide-react';
import { useStreak } from '../contexts/StreakContext';
import { formatTime } from '../lib/utils';
import confetti from 'canvas-confetti';

export const HealthTracker: React.FC = () => {
  const { recordActivity } = useStreak();

  // 1. Pomodoro Timer State
  const [pomodoroMode, setPomodoroMode] = useState<'focus' | 'rest'>('focus');
  const FOCUS_SECONDS = 25 * 60; // 25 min
  const REST_SECONDS = 5 * 60; // 5 min
  const [pomoSecondsLeft, setPomoSecondsLeft] = useState(FOCUS_SECONDS);
  const [isPomoRunning, setIsPomoRunning] = useState(false);
  const [pomoSoundEnabled, setPomoSoundEnabled] = useState(true);
  const [completedSprints, setCompletedSprints] = useState(2);

  // 2. BreathBox Guided Coach State
  const [breathPhase, setBreathPhase] = useState<'Inhale' | 'Hold (Full)' | 'Exhale' | 'Hold (Empty)'>('Inhale');
  const [breathSecondsLeft, setBreathSecondsLeft] = useState(4);
  const [isBreathRunning, setIsBreathRunning] = useState(false);
  const [breathTotalTime, setBreathTotalTime] = useState(0);
  const [breathFinished, setBreathFinished] = useState(false);

  // 3. Timezone Clocks
  const [currentLocalTime, setCurrentLocalTime] = useState(new Date());

  useEffect(() => {
    const tzTimer = setInterval(() => setCurrentLocalTime(new Date()), 1000);
    return () => clearInterval(tzTimer);
  }, []);

  // Pomodoro countdown
  useEffect(() => {
    if (!isPomoRunning) return;
    const timer = setInterval(() => {
      setPomoSecondsLeft((prev) => {
        if (prev <= 1) {
          // Play synthetic tone / chime
          if (pomoSoundEnabled) {
            try {
              const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
              const osc = ctx.createOscillator();
              osc.type = 'sine';
              osc.frequency.setValueAtTime(528, ctx.currentTime); // 528 Hz miracle tone
              osc.connect(ctx.destination);
              osc.start();
              osc.stop(ctx.currentTime + 0.6);
            } catch (e) {
              // ignore audio ctx restriction
            }
          }

          if (pomodoroMode === 'focus') {
            setCompletedSprints((s) => s + 1);
            recordActivity('pomodoro', 'Completed 25m Focus Sprint');
            try {
              confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
            } catch (e) {}
            setPomodoroMode('rest');
            return REST_SECONDS;
          } else {
            setPomodoroMode('focus');
            return FOCUS_SECONDS;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPomoRunning, pomodoroMode, pomoSoundEnabled, recordActivity]);

  // BreathBox countdown
  useEffect(() => {
    if (!isBreathRunning || breathFinished) return;

    const bTimer = setInterval(() => {
      setBreathTotalTime((t) => {
        const next = t + 1;
        if (next >= 60) {
          setBreathFinished(true);
          setIsBreathRunning(false);
          recordActivity('breath', 'Completed 60s BreathBox Session');
          return 60;
        }
        return next;
      });

      setBreathSecondsLeft((s) => {
        if (s <= 1) {
          setBreathPhase((curr) => {
            if (curr === 'Inhale') return 'Hold (Full)';
            if (curr === 'Hold (Full)') return 'Exhale';
            if (curr === 'Exhale') return 'Hold (Empty)';
            return 'Inhale';
          });
          return 4;
        }
        return s - 1;
      });
    }, 1000);

    return () => clearInterval(bTimer);
  }, [isBreathRunning, breathFinished, recordActivity]);

  const handlePomoReset = () => {
    setIsPomoRunning(false);
    setPomoSecondsLeft(pomodoroMode === 'focus' ? FOCUS_SECONDS : REST_SECONDS);
  };

  const handleSwitchPomoMode = (mode: 'focus' | 'rest') => {
    setIsPomoRunning(false);
    setPomodoroMode(mode);
    setPomoSecondsLeft(mode === 'focus' ? FOCUS_SECONDS : REST_SECONDS);
  };

  const getTimeString = (timeZone: string) => {
    return new Intl.DateTimeFormat([], {
      timeZone,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    }).format(currentLocalTime);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Page Title */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 text-xs font-semibold">
          <Heart className="w-3.5 h-3.5" />
          <span>Somatic Grounding & Flow State</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-ink-900 dark:text-linen-100">
          Health & Focus Cockpit
        </h1>
        <p className="text-xs sm:text-sm text-ink-700/70 dark:text-linen-200/70">
          Calibrate autonomic tone with 4-4-4-4 Box Breathing and structure deep work through 25-minute Pomodoro sprints.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Module 1: Working Pomodoro Timer (7 cols) */}
        <div className="lg:col-span-7 glass-card rounded-3xl p-6 sm:p-9 shadow-lift border border-sage-200/80 dark:border-ink-700 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-sage-600" />
                <h3 className="font-heading font-bold text-lg text-ink-900 dark:text-linen-100">
                  Pomodoro Focus Sprint
                </h3>
              </div>
              <button
                onClick={() => setPomoSoundEnabled(!pomoSoundEnabled)}
                className="p-2 rounded-xl bg-linen-100 dark:bg-ink-800 text-ink-700/70 dark:text-linen-200/70 hover:text-ink-900 transition"
                title={pomoSoundEnabled ? 'Chime Sound Enabled' : 'Chime Sound Muted'}
              >
                {pomoSoundEnabled ? <Volume2 className="w-4 h-4 text-sage-600" /> : <VolumeX className="w-4 h-4" />}
              </button>
            </div>

            {/* Mode Selector */}
            <div className="flex justify-center gap-2 mb-8">
              <button
                onClick={() => handleSwitchPomoMode('focus')}
                className={`px-5 py-2 rounded-2xl text-xs font-bold transition ${
                  pomodoroMode === 'focus'
                    ? 'bg-sage-500 text-white shadow-soft'
                    : 'bg-linen-100 dark:bg-ink-800 text-ink-800 dark:text-linen-200 hover:bg-sage-100'
                }`}
              >
                Focus Sprint (25m)
              </button>
              <button
                onClick={() => handleSwitchPomoMode('rest')}
                className={`px-5 py-2 rounded-2xl text-xs font-bold transition ${
                  pomodoroMode === 'rest'
                    ? 'bg-teal-500 text-white shadow-soft'
                    : 'bg-linen-100 dark:bg-ink-800 text-ink-800 dark:text-linen-200 hover:bg-teal-100'
                }`}
              >
                Restorative Pause (5m)
              </button>
            </div>

            {/* Huge Digital Timer */}
            <div className="text-center py-6">
              <span className="font-heading font-extrabold text-6xl sm:text-7xl font-mono tracking-tight text-ink-900 dark:text-linen-100">
                {formatTime(pomoSecondsLeft)}
              </span>
              <p className="text-xs text-ink-700/70 dark:text-linen-200/70 mt-3 uppercase tracking-wider font-semibold">
                {pomodoroMode === 'focus' ? 'Deep Monotasking Sprint' : 'Eyes Off Screen & Hydrate'}
              </p>
            </div>
          </div>

          {/* Controls & Sprints Count */}
          <div className="pt-6 border-t border-sage-100 dark:border-ink-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-3 py-1.5 rounded-xl border border-amber-200/60">
              <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
              <span>{completedSprints} Sprints Finished Today</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsPomoRunning(!isPomoRunning)}
                className="px-6 py-2.5 rounded-xl bg-sage-500 hover:bg-sage-600 text-white font-bold text-xs sm:text-sm shadow-soft transition flex items-center gap-2"
              >
                {isPomoRunning ? (
                  <>
                    <Pause className="w-4 h-4 fill-white" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-white" />
                    <span>Start Sprint</span>
                  </>
                )}
              </button>

              <button
                onClick={handlePomoReset}
                className="p-2.5 rounded-xl border border-sage-200 dark:border-ink-700 hover:bg-linen-100 dark:hover:bg-ink-800 text-ink-700 dark:text-linen-200 transition"
                title="Reset timer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Module 2: Guided "BreathBox" 60-Second Coach (5 cols) */}
        <div className="lg:col-span-5 glass-card rounded-3xl p-6 sm:p-9 shadow-lift border border-sage-200/80 dark:border-ink-700 flex flex-col justify-between text-center">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Wind className="w-5 h-5 text-teal-600" />
                <h3 className="font-heading font-bold text-lg text-ink-900 dark:text-linen-100">
                  Guided BreathBox
                </h3>
              </div>
              <span className="text-[10px] bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 font-bold px-2 py-0.5 rounded-full">
                4-4-4-4
              </span>
            </div>

            {/* Animated Box Breathing Visual */}
            <div className="relative w-48 h-48 mx-auto my-6 flex items-center justify-center">
              <div
                className={`absolute inset-2 rounded-3xl border-2 border-teal-500 transition-all duration-[4000ms] ease-in-out ${
                  breathPhase === 'Inhale' || breathPhase === 'Hold (Full)'
                    ? 'scale-125 bg-teal-400/20 shadow-glow'
                    : 'scale-90 bg-teal-100/30'
                }`}
              />
              <div className="relative z-10">
                <span className="text-3xl font-heading font-extrabold text-ink-900 dark:text-linen-100 block">
                  {breathFinished ? 'Done' : `${breathSecondsLeft}s`}
                </span>
                <span className="text-xs uppercase font-bold text-teal-600 dark:text-teal-400 tracking-wider">
                  {breathFinished ? 'Restored' : breathPhase}
                </span>
              </div>
            </div>

            <p className="text-xs text-ink-700/80 dark:text-linen-200/80 h-8 flex items-center justify-center">
              {breathFinished ? (
                <span className="text-emerald-600 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> 60s Session Complete. Vagal tone primed!
                </span>
              ) : isBreathRunning ? (
                `Follow the expanding box: ${breathPhase}`
              ) : (
                'Press start for a 60-second guided autonomic reset'
              )}
            </p>
          </div>

          <div className="pt-6 border-t border-sage-100 dark:border-ink-800 flex items-center justify-center gap-3">
            {!breathFinished ? (
              <button
                onClick={() => setIsBreathRunning(!isBreathRunning)}
                className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm shadow-soft transition flex items-center gap-2"
              >
                {isBreathRunning ? (
                  <>
                    <Pause className="w-4 h-4" /> <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-white" /> <span>Begin 60s Coach</span>
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={() => {
                  setBreathFinished(false);
                  setBreathTotalTime(0);
                  setBreathSecondsLeft(4);
                  setBreathPhase('Inhale');
                  setIsBreathRunning(true);
                }}
                className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-soft transition flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" /> <span>Breathe Again</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Module 3: Live Global Timezone Clocks (Remote & Circadian Harmony) */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 shadow-soft border border-sage-200/80 dark:border-ink-700">
        <div className="flex items-center gap-2.5 mb-6">
          <Globe className="w-5 h-5 text-sage-600" />
          <div>
            <h3 className="font-heading font-bold text-base text-ink-900 dark:text-linen-100">
              Circadian & Asynchronous Timezones
            </h3>
            <p className="text-xs text-ink-700/70 dark:text-linen-200/70">
              Synchronize your schedule with global collaborators without sacrificing personal sleep sanctuaries.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-linen-50 dark:bg-ink-800 border border-sage-200/70 dark:border-ink-700 text-center">
            <span className="block text-xs font-bold text-ink-900 dark:text-linen-100">Local Sanctuary</span>
            <span className="font-mono text-base font-extrabold text-sage-600 dark:text-sage-400 mt-1 block">
              {currentLocalTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
            <span className="text-[10px] text-ink-700/60 dark:text-linen-200/60">Primary Meridian</span>
          </div>

          <div className="p-4 rounded-2xl bg-linen-50 dark:bg-ink-800 border border-sage-200/70 dark:border-ink-700 text-center">
            <span className="block text-xs font-bold text-ink-900 dark:text-linen-100">New York (EST)</span>
            <span className="font-mono text-base font-extrabold text-ink-800 dark:text-linen-100 mt-1 block">
              {getTimeString('America/New_York')}
            </span>
            <span className="text-[10px] text-ink-700/60 dark:text-linen-200/60">US East Coast</span>
          </div>

          <div className="p-4 rounded-2xl bg-linen-50 dark:bg-ink-800 border border-sage-200/70 dark:border-ink-700 text-center">
            <span className="block text-xs font-bold text-ink-900 dark:text-linen-100">London (GMT/BST)</span>
            <span className="font-mono text-base font-extrabold text-ink-800 dark:text-linen-100 mt-1 block">
              {getTimeString('Europe/London')}
            </span>
            <span className="text-[10px] text-ink-700/60 dark:text-linen-200/60">Europe Central</span>
          </div>

          <div className="p-4 rounded-2xl bg-linen-50 dark:bg-ink-800 border border-sage-200/70 dark:border-ink-700 text-center">
            <span className="block text-xs font-bold text-ink-900 dark:text-linen-100">Tokyo (JST)</span>
            <span className="font-mono text-base font-extrabold text-ink-800 dark:text-linen-100 mt-1 block">
              {getTimeString('Asia/Tokyo')}
            </span>
            <span className="text-[10px] text-ink-700/60 dark:text-linen-200/60">Asia Pacific</span>
          </div>
        </div>
      </div>
    </div>
  );
};
