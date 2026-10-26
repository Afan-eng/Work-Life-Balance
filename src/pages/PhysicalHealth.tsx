import React, { useState } from 'react';
import { Heart, Activity, CheckCircle2, Circle, Sparkles, ArrowRight, Move, Droplets, Sun } from 'lucide-react';
import { useStreak } from '../contexts/StreakContext';

export const PhysicalHealth: React.FC = () => {
  const { recordActivity } = useStreak();

  const [checklist, setChecklist] = useState([
    { id: 'p1', title: 'Morning hydration: 500ml water with pinch of sea salt', completed: true },
    { id: 'p2', title: '10-minute natural sunlight walk before 9:00 AM', completed: true },
    { id: 'p3', title: 'Every 50m desk pause: Stand, stretch hip flexors & gaze at distance', completed: false },
    { id: 'p4', title: '7,500 daily baseline movement steps logged', completed: false },
    { id: 'p5', title: 'Chew meals slowly without looking at phones or laptops', completed: true },
  ]);

  const toggleItem = (id: string) => {
    setChecklist(prev => {
      const next = prev.map(item => item.id === id ? { ...item, completed: !item.completed } : item);
      const clicked = next.find(item => item.id === id);
      if (clicked?.completed) {
        recordActivity('habit', `Checked: ${clicked.title}`);
      }
      return next;
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="relative rounded-3xl overflow-hidden shadow-lift min-h-[280px] flex items-center p-8 sm:p-12">
        <img
          src="/assets/images/nutrition-mindful.jpg"
          alt="Mindful nutrition with fresh vegetables"
          className="absolute inset-0 w-full h-full object-cover brightness-[0.7]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink-950/90 via-ink-900/70 to-transparent" />

        <div className="relative z-10 max-w-xl text-white space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/30 backdrop-blur-md border border-teal-400/30 text-xs font-semibold text-teal-200">
            <Activity className="w-3.5 h-3.5" />
            <span>Pillar III • Somatic & Physical Vitality</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-heading">
            Physical Health & Movement
          </h1>
          <p className="text-xs sm:text-sm text-linen-200 leading-relaxed">
            Your body is the primary hardware through which all consciousness and creative output flow. Nurture circadian biology, spinal freedom, and mindful nourishment.
          </p>
        </div>
      </div>

      {/* Movement & Posture Checklist */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 shadow-soft border border-sage-200/80 dark:border-ink-700 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-heading font-bold text-xl text-ink-900 dark:text-linen-100 flex items-center gap-2">
              <Move className="w-5 h-5 text-emerald-600" />
              Daily Somatic Checklist
            </h3>
            <p className="text-xs text-ink-700/70 dark:text-linen-200/70 mt-1">
              Tap items to check off and increment your consistency streak.
            </p>
          </div>
          <span className="text-xs font-bold font-mono bg-sage-100 dark:bg-sage-950 text-sage-700 dark:text-sage-300 px-3 py-1 rounded-full">
            {checklist.filter(c => c.completed).length}/{checklist.length} Completed
          </span>
        </div>

        <div className="space-y-3">
          {checklist.map((item) => (
            <div
              key={item.id}
              onClick={() => toggleItem(item.id)}
              className="p-4 rounded-2xl bg-linen-50/80 dark:bg-ink-800/60 border border-sage-200/70 dark:border-ink-700 hover:bg-sage-50 dark:hover:bg-ink-800 cursor-pointer transition flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                {item.completed ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-100 dark:fill-emerald-950 shrink-0" />
                ) : (
                  <Circle className="w-5 h-5 text-ink-700/30 shrink-0" />
                )}
                <span className={`text-xs sm:text-sm font-semibold ${item.completed ? 'line-through text-ink-700/40 dark:text-linen-200/40' : 'text-ink-900 dark:text-linen-100'}`}>
                  {item.title}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Desk Ergonomics Quick Guide */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card rounded-2xl p-6 border border-sage-200/70 dark:border-ink-700 shadow-soft space-y-2">
          <Droplets className="w-6 h-6 text-blue-500 mb-2" />
          <h4 className="font-heading font-bold text-sm text-ink-900 dark:text-linen-100">Hydration Priming</h4>
          <p className="text-xs text-ink-700/70 dark:text-linen-200/70 leading-relaxed">
            Dehydration of just 2% impairs attention, memory, and executive function. Keep a glass bottle at your desk.
          </p>
        </div>

        <div className="glass-card rounded-2xl p-6 border border-sage-200/70 dark:border-ink-700 shadow-soft space-y-2">
          <Move className="w-6 h-6 text-emerald-500 mb-2" />
          <h4 className="font-heading font-bold text-sm text-ink-900 dark:text-linen-100">Eye-Level Displays</h4>
          <p className="text-xs text-ink-700/70 dark:text-linen-200/70 leading-relaxed">
            Elevate your laptop screen so your eyes align with the top 1/3 of the monitor, preventing forward head posture.
          </p>
        </div>

        <div className="glass-card rounded-2xl p-6 border border-sage-200/70 dark:border-ink-700 shadow-soft space-y-2">
          <Sun className="w-6 h-6 text-amber-500 mb-2" />
          <h4 className="font-heading font-bold text-sm text-ink-900 dark:text-linen-100">Circadian Sun Photons</h4>
          <p className="text-xs text-ink-700/70 dark:text-linen-200/70 leading-relaxed">
            Morning photons striking your retinal ganglion cells set the timer for melatonin release 14 hours later.
          </p>
        </div>
      </div>
    </div>
  );
};
