import React, { useState } from 'react';
import { 
  Sparkles, BatteryCharging, Zap, Users, Droplets, Move, Wind, 
  Sun, CheckCircle2, RotateCw, HeartHandshake, Smile, ShieldAlert, ArrowRight 
} from 'lucide-react';
import { useStreak } from '../contexts/StreakContext';
import { QuickBreathModal } from './QuickBreathModal';
import { Link } from 'react-router-dom';

const RANDOM_MOMENTS = [
  "Look away from your screen. Identify 3 distant objects in natural light and soften your gaze for 20 seconds.",
  "Unclench your jaw, drop your shoulders 2 inches, and take a long, audible exhale through open lips.",
  "Pour a glass of room-temperature water. Drink the entire glass with full mindful presence.",
  "Stand up, place both feet firmly on the ground, and do 5 gentle calf raises while breathing deeply.",
  "Send a quick 1-sentence note of gratitude to someone who made your week a little lighter.",
  "Place both hands flat over your chest. Feel the steady rhythm of your heartbeat for 30 seconds.",
];

interface EmotionOption {
  key: string;
  emoji: string;
  label: string;
  recommendation: {
    title: string;
    description: string;
    actionLabel: string;
    actionRoute?: string;
  };
}

const EMOTIONS: EmotionOption[] = [
  {
    key: 'overwhelmed',
    emoji: '🌪️',
    label: 'Overwhelmed',
    recommendation: {
      title: 'Vagus Nerve Reset',
      description: 'Slow down sensory input. Focus on Box Breathing to signal safety to your sympathetic nervous system.',
      actionLabel: 'Launch 60s Box Breathing',
    },
  },
  {
    key: 'fatigued',
    emoji: '🪫',
    label: 'Low Energy',
    recommendation: {
      title: 'Hydration & Light Stimulus',
      description: 'Step near natural sunlight, drink 400ml water with electrolytes, and perform 2 minutes of spinal extension.',
      actionLabel: 'Log Hydration Pause',
    },
  },
  {
    key: 'scattered',
    emoji: '🧠',
    label: 'Scattered Focus',
    recommendation: {
      title: 'Monotasking Sprint',
      description: 'Brain dump everything onto scrap paper, close all unnecessary browser tabs, and start a 25-minute Pomodoro.',
      actionLabel: 'Open Pomodoro Focus',
      actionRoute: '/health-tracker',
    },
  },
  {
    key: 'restored',
    emoji: '🌿',
    label: 'Centered & Grounded',
    recommendation: {
      title: 'Creative Flow & Gratitude',
      description: 'Your nervous system is primed. Dive into your most meaningful high-leverage project or help a community peer.',
      actionLabel: 'Explore Community',
      actionRoute: '/community',
    },
  },
  {
    key: 'restless',
    emoji: '⚡',
    label: 'Restless Tension',
    recommendation: {
      title: 'Somatic Shake & Walk',
      description: 'Discharge trapped adrenaline through a brisk 10-minute walk without headphones or screens.',
      actionLabel: 'Physical Health Pillar',
      actionRoute: '/physical-health',
    },
  },
];

export const PersonalBalanceHub: React.FC = () => {
  const { recordActivity } = useStreak();

  // 1. Feeling Picker State
  const [selectedEmotion, setSelectedEmotion] = useState<EmotionOption>(EMOTIONS[0]);

  // 2. Balance Moment State
  const [momentIndex, setMomentIndex] = useState(0);
  const [momentLogged, setMomentLogged] = useState(false);

  // 3. Balance Bars (Sliders)
  const [energyBattery, setEnergyBattery] = useState(65);
  const [focusBattery, setFocusBattery] = useState(70);
  const [socialBattery, setSocialBattery] = useState(50);

  // 4. Needs Grid States
  const [needs, setNeeds] = useState({
    hydration: false,
    posture: false,
    freshAir: false,
    breathwork: false,
  });

  const [isBreathModalOpen, setIsBreathModalOpen] = useState(false);

  const handleShuffleMoment = () => {
    setMomentIndex((prev) => (prev + 1) % RANDOM_MOMENTS.length);
    setMomentLogged(false);
  };

  const handleLogMoment = () => {
    recordActivity('moment', `Grounding Moment: ${RANDOM_MOMENTS[momentIndex].substring(0, 30)}...`);
    setMomentLogged(true);
  };

  const toggleNeed = (key: keyof typeof needs) => {
    setNeeds((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      if (next[key]) {
        recordActivity('habit', `Checked Micro-Need: ${key}`);
      }
      return next;
    });
  };

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sage-100 dark:bg-sage-950/60 text-sage-700 dark:text-sage-300 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-sage-500" />
              <span>Interactive Balance Cockpit</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-ink-900 dark:text-linen-100">
              Your balance, today.
            </h2>
          </div>
          <p className="text-sm text-ink-700/70 dark:text-linen-200/70 max-w-md">
            Tune your emotional frequency, log grounding micro-rituals, and recalibrate your mind-body battery in real time.
          </p>
        </div>

        {/* 2x2 Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Module 1: Feeling Picker (7 cols) */}
          <div className="lg:col-span-7 glass-card rounded-3xl p-6 sm:p-7 shadow-soft border border-sage-200/70 dark:border-ink-700 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-heading font-bold uppercase tracking-wider text-ink-700/70 dark:text-linen-200/70">
                  Step 1 • How are you arriving right now?
                </span>
                <span className="text-xs text-sage-600 dark:text-sage-400 font-semibold">
                  Adaptive Prescription
                </span>
              </div>

              {/* Emotion Selector Buttons */}
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5 mb-6">
                {EMOTIONS.map((emo) => {
                  const isSelected = emo.key === selectedEmotion.key;
                  return (
                    <button
                      key={emo.key}
                      onClick={() => setSelectedEmotion(emo)}
                      className={`p-3 rounded-2xl border text-center transition flex flex-col items-center gap-1.5 ${
                        isSelected
                          ? 'border-sage-500 bg-sage-50 dark:bg-sage-950/70 text-sage-800 dark:text-sage-200 ring-2 ring-sage-500/20 shadow-soft'
                          : 'border-sage-200/60 dark:border-ink-800 bg-white/60 dark:bg-ink-800/40 text-ink-800 dark:text-linen-200 hover:bg-linen-100'
                      }`}
                    >
                      <span className="text-2xl">{emo.emoji}</span>
                      <span className="text-xs font-bold leading-tight">{emo.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Tailored Exercise Box */}
              <div className="p-4 rounded-2xl bg-linen-50 dark:bg-ink-800/80 border border-sage-200/70 dark:border-ink-700 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-heading font-bold text-sm text-ink-900 dark:text-linen-100 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-sage-500" />
                    Recommended Protocol: {selectedEmotion.recommendation.title}
                  </h4>
                  <span className="text-[11px] bg-sage-100 dark:bg-sage-950 text-sage-700 dark:text-sage-300 font-bold px-2 py-0.5 rounded-full">
                    Adaptive
                  </span>
                </div>
                <p className="text-xs text-ink-700/80 dark:text-linen-200/80 leading-relaxed">
                  {selectedEmotion.recommendation.description}
                </p>
              </div>
            </div>

            {/* CTA for selected emotion */}
            <div className="mt-5 pt-4 border-t border-sage-100 dark:border-ink-800 flex items-center justify-between">
              <span className="text-xs text-ink-700/60 dark:text-linen-200/60">
                Action syncs directly with daily streak
              </span>
              {selectedEmotion.recommendation.actionRoute ? (
                <Link
                  to={selectedEmotion.recommendation.actionRoute}
                  className="px-4 py-2 rounded-xl bg-sage-500 hover:bg-sage-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-soft transition"
                >
                  <span>{selectedEmotion.recommendation.actionLabel}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              ) : (
                <button
                  onClick={() => setIsBreathModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-sage-500 hover:bg-sage-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-soft transition"
                >
                  <Wind className="w-3.5 h-3.5" />
                  <span>{selectedEmotion.recommendation.actionLabel}</span>
                </button>
              )}
            </div>
          </div>

          {/* Module 2: Balance Moment (5 cols) */}
          <div className="lg:col-span-5 glass-card rounded-3xl p-6 sm:p-7 shadow-soft border border-sage-200/70 dark:border-ink-700 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-heading font-bold uppercase tracking-wider text-ink-700/70 dark:text-linen-200/70">
                  Step 2 • Daily Grounding Prompt
                </span>
                <button
                  onClick={handleShuffleMoment}
                  className="p-1 text-sage-600 dark:text-sage-400 hover:text-sage-700 transition flex items-center gap-1 text-xs font-semibold"
                  title="Randomize Prompt"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>Shuffle</span>
                </button>
              </div>

              <div className="p-5 rounded-2xl bg-gradient-to-br from-sage-50/80 to-linen-50 dark:from-ink-800/90 dark:to-ink-950 border border-sage-200/60 dark:border-ink-700 min-h-[140px] flex flex-col justify-center">
                <p className="text-sm sm:text-base font-serif italic text-ink-900 dark:text-linen-100 leading-relaxed">
                  "{RANDOM_MOMENTS[momentIndex]}"
                </p>
                <span className="text-[11px] font-sans font-bold text-sage-600 dark:text-sage-400 mt-3">
                  Grounding Moment #{momentIndex + 1}
                </span>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-sage-100 dark:border-ink-800 flex items-center justify-between">
              <span className="text-xs text-ink-700/60 dark:text-linen-200/60">
                1-Click Streak Check
              </span>
              <button
                onClick={handleLogMoment}
                disabled={momentLogged}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                  momentLogged
                    ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 cursor-default'
                    : 'bg-ink-800 hover:bg-ink-900 text-white shadow-soft hover:shadow-lift'
                }`}
              >
                {momentLogged ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Logged to Streak 🔥</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>I Completed This</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Module 3: Balance Bars - Energy, Focus, Social (6 cols) */}
          <div className="lg:col-span-6 glass-card rounded-3xl p-6 sm:p-7 shadow-soft border border-sage-200/70 dark:border-ink-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading font-bold text-sm text-ink-900 dark:text-linen-100 flex items-center gap-2">
                <BatteryCharging className="w-4 h-4 text-sage-600" />
                Balance Battery Sliders
              </h3>
              <span className="text-xs font-mono font-bold text-sage-600 dark:text-sage-400">
                Avg: {Math.round((energyBattery + focusBattery + socialBattery) / 3)}%
              </span>
            </div>

            <div className="space-y-4">
              {/* Energy */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-ink-800 dark:text-linen-200 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-warmAmber-500" /> Physical Energy
                  </span>
                  <span className="font-mono text-ink-700 dark:text-linen-300">{energyBattery}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={energyBattery}
                  onChange={(e) => setEnergyBattery(Number(e.target.value))}
                  className="w-full accent-sage-500 bg-sage-200/60 dark:bg-ink-800 h-2 rounded-lg cursor-pointer"
                />
              </div>

              {/* Focus */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-ink-800 dark:text-linen-200 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-500" /> Cognitive Focus
                  </span>
                  <span className="font-mono text-ink-700 dark:text-linen-300">{focusBattery}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={focusBattery}
                  onChange={(e) => setFocusBattery(Number(e.target.value))}
                  className="w-full accent-emerald-500 bg-sage-200/60 dark:bg-ink-800 h-2 rounded-lg cursor-pointer"
                />
              </div>

              {/* Social Battery */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-ink-800 dark:text-linen-200 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-teal-500" /> Social Battery
                  </span>
                  <span className="font-mono text-ink-700 dark:text-linen-300">{socialBattery}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={socialBattery}
                  onChange={(e) => setSocialBattery(Number(e.target.value))}
                  className="w-full accent-teal-500 bg-sage-200/60 dark:bg-ink-800 h-2 rounded-lg cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Module 4: Needs Grid (6 cols) */}
          <div className="lg:col-span-6 glass-card rounded-3xl p-6 sm:p-7 shadow-soft border border-sage-200/70 dark:border-ink-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading font-bold text-sm text-ink-900 dark:text-linen-100 flex items-center gap-2">
                <HeartHandshake className="w-4 h-4 text-emerald-600" />
                Somatic Needs Grid
              </h3>
              <span className="text-xs text-ink-700/60 dark:text-linen-200/60">
                Tap to check off
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => toggleNeed('hydration')}
                className={`p-3 rounded-2xl border text-left transition flex items-center gap-3 ${
                  needs.hydration
                    ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-200'
                    : 'border-sage-200/60 dark:border-ink-700 bg-white/60 dark:bg-ink-800/40 hover:bg-linen-100'
                }`}
              >
                <Droplets className={`w-5 h-5 ${needs.hydration ? 'text-blue-500' : 'text-ink-700/50'}`} />
                <div>
                  <span className="block text-xs font-bold">Hydration</span>
                  <span className="text-[10px] opacity-75">500ml pure water</span>
                </div>
              </button>

              <button
                onClick={() => toggleNeed('posture')}
                className={`p-3 rounded-2xl border text-left transition flex items-center gap-3 ${
                  needs.posture
                    ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-200'
                    : 'border-sage-200/60 dark:border-ink-700 bg-white/60 dark:bg-ink-800/40 hover:bg-linen-100'
                }`}
              >
                <Move className={`w-5 h-5 ${needs.posture ? 'text-emerald-500' : 'text-ink-700/50'}`} />
                <div>
                  <span className="block text-xs font-bold">Posture Check</span>
                  <span className="text-[10px] opacity-75">Shoulders back & down</span>
                </div>
              </button>

              <button
                onClick={() => toggleNeed('freshAir')}
                className={`p-3 rounded-2xl border text-left transition flex items-center gap-3 ${
                  needs.freshAir
                    ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-200'
                    : 'border-sage-200/60 dark:border-ink-700 bg-white/60 dark:bg-ink-800/40 hover:bg-linen-100'
                }`}
              >
                <Sun className={`w-5 h-5 ${needs.freshAir ? 'text-amber-500' : 'text-ink-700/50'}`} />
                <div>
                  <span className="block text-xs font-bold">Natural Light</span>
                  <span className="text-[10px] opacity-75">Step by open window</span>
                </div>
              </button>

              <button
                onClick={() => {
                  toggleNeed('breathwork');
                  setIsBreathModalOpen(true);
                }}
                className={`p-3 rounded-2xl border text-left transition flex items-center gap-3 ${
                  needs.breathwork
                    ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-200'
                    : 'border-sage-200/60 dark:border-ink-700 bg-white/60 dark:bg-ink-800/40 hover:bg-linen-100'
                }`}
              >
                <Wind className={`w-5 h-5 ${needs.breathwork ? 'text-teal-500' : 'text-ink-700/50'}`} />
                <div>
                  <span className="block text-xs font-bold">Breathwork</span>
                  <span className="text-[10px] opacity-75">60s Box Breathing</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      <QuickBreathModal isOpen={isBreathModalOpen} onClose={() => setIsBreathModalOpen(false)} />
    </section>
  );
};
