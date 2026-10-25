import React, { useState } from 'react';
import { Video, Play, X, Clock, Sparkles, BookOpen } from 'lucide-react';

interface MasterclassVideo {
  id: string;
  title: string;
  instructor: string;
  duration: string;
  category: string;
  thumbnail: string;
  embedUrl: string;
  summary: string;
  keyPoints: string[];
}

const VIDEOS: MasterclassVideo[] = [
  {
    id: 'vid_1',
    title: 'Somatic Grounding: 15-Minute Full Body Decompression',
    instructor: 'Dr. Soraya Kim',
    duration: '15 mins',
    category: 'Somatic Reset',
    thumbnail: '/assets/images/outdoor-reset.jpg',
    embedUrl: 'https://www.youtube-nocookie.com/embed/inpok4MKVLM',
    summary: 'A guided floor-based session targeting the psoas and spinal extensors to release accumulated tension from desk sitting.',
    keyPoints: [
      'De-escalating the psoas muscle fight-or-flight reflex',
      'Diaphragmatic lower-rib breathing cues',
      'Grounding the sacrum to lower sympathetic heart rate',
    ],
  },
  {
    id: 'vid_2',
    title: 'The Ultradian Sprint: How to Flow for 90 Minutes',
    instructor: 'Marcus Vance',
    duration: '22 mins',
    category: 'Productivity',
    thumbnail: '/assets/images/hero-focus.jpg',
    embedUrl: 'https://www.youtube-nocookie.com/embed/5qap5aO4i9A',
    summary: 'The biological playbook for setting up high-yield monotasking environments that banish cognitive friction.',
    keyPoints: [
      'Eliminating visual micro-distractions in your periphery',
      'The 5-minute pre-sprint mental intention checklist',
      'Transition protocols between deep work and recovery',
    ],
  },
  {
    id: 'vid_3',
    title: 'Mindful Cooking: The Sacred Chemistry of Whole Nutrition',
    instructor: 'Chef Amina Noor',
    duration: '18 mins',
    category: 'Nourishment',
    thumbnail: '/assets/images/nutrition-mindful.jpg',
    embedUrl: 'https://www.youtube-nocookie.com/embed/6p_yaNFSYao',
    summary: 'Transform culinary preparation into an active sensory meditation that grounds the senses and honors the gut-brain axis.',
    keyPoints: [
      'Sensory presence while slicing raw ingredients',
      'Balancing prebiotic fiber and anti-inflammatory polyphenols',
      'Slowing digestive pacing for peak nutrient assimilation',
    ],
  },
];

export const Videos: React.FC = () => {
  const [activeVideo, setActiveVideo] = useState<MasterclassVideo | null>(null);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sage-100 dark:bg-sage-950/60 text-sage-700 dark:text-sage-300 text-xs font-semibold">
          <Video className="w-3.5 h-3.5" />
          <span>Visual Masterclasses</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-ink-900 dark:text-linen-100">
          Balance Studio Video Library
        </h1>
        <p className="text-xs sm:text-sm text-ink-700/70 dark:text-linen-200/70">
          Guided movement sessions, ergonomic workshops, and mindfulness masterclasses taught by studio experts.
        </p>
      </div>

      {/* Video Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {VIDEOS.map((vid) => (
          <div
            key={vid.id}
            onClick={() => setActiveVideo(vid)}
            className="glass-card rounded-3xl overflow-hidden shadow-soft hover:shadow-lift border border-sage-200/80 dark:border-ink-700 cursor-pointer group transition flex flex-col justify-between"
          >
            <div>
              <div className="h-52 relative overflow-hidden">
                <img
                  src={vid.thumbnail}
                  alt={vid.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                <div className="absolute inset-0 bg-ink-950/30 group-hover:bg-ink-950/10 transition flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-white/90 text-sage-600 flex items-center justify-center shadow-lift group-hover:scale-110 transition">
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  </div>
                </div>
                <span className="absolute bottom-3 right-3 bg-ink-900/80 backdrop-blur-sm text-white px-2 py-0.5 rounded-md text-[10px] font-mono">
                  {vid.duration}
                </span>
                <span className="absolute top-3 left-3 bg-white/90 dark:bg-ink-900/90 text-sage-700 dark:text-sage-300 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase">
                  {vid.category}
                </span>
              </div>

              <div className="p-6">
                <h3 className="font-heading font-bold text-base text-ink-900 dark:text-linen-100 group-hover:text-sage-600 transition leading-snug">
                  {vid.title}
                </h3>
                <p className="text-xs text-ink-700/60 dark:text-linen-200/60 mt-1">
                  Instructed by {vid.instructor}
                </p>
                <p className="text-xs text-ink-700/80 dark:text-linen-200/80 mt-2 line-clamp-2">
                  {vid.summary}
                </p>
              </div>
            </div>

            <div className="p-6 pt-0 border-t border-sage-100 dark:border-ink-800 mt-2 text-xs font-bold text-sage-600 dark:text-sage-400 flex items-center justify-between">
              <span>Watch Masterclass</span>
              <Play className="w-3.5 h-3.5 fill-current" />
            </div>
          </div>
        ))}
      </div>

      {/* Video Modal Player */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-950/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-3xl bg-white dark:bg-ink-900 border border-sage-200 dark:border-ink-700 rounded-3xl shadow-lift overflow-hidden flex flex-col max-h-[90vh]">
            <div className="relative aspect-video bg-black">
              <iframe
                src={`${activeVideo.embedUrl}?autoplay=1`}
                title={activeVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
              <button
                onClick={() => setActiveVideo(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-ink-900/70 text-white hover:bg-ink-900 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-sage-600 dark:text-sage-400 bg-sage-100 dark:bg-sage-950 px-2 py-0.5 rounded-full">
                  {activeVideo.category} • {activeVideo.duration}
                </span>
                <h3 className="font-heading font-extrabold text-xl text-ink-900 dark:text-linen-100 mt-2">
                  {activeVideo.title}
                </h3>
                <p className="text-xs text-ink-700/60 dark:text-linen-200/60">
                  Taught by {activeVideo.instructor}
                </p>
              </div>

              <p className="text-xs sm:text-sm text-ink-800/80 dark:text-linen-200/80 leading-relaxed">
                {activeVideo.summary}
              </p>

              <div className="p-4 rounded-2xl bg-linen-50 dark:bg-ink-800 border border-sage-200/70 dark:border-ink-700">
                <span className="text-xs font-bold text-ink-900 dark:text-linen-100 block mb-2">
                  Key Takeaway Practices:
                </span>
                <ul className="space-y-1.5 text-xs text-ink-700/80 dark:text-linen-200/80">
                  {activeVideo.keyPoints.map((pt, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-sage-500 shrink-0" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
