import React, { useState, useRef, useEffect } from 'react';
import { 
  Headphones, Play, Pause, SkipForward, SkipBack, Volume2, 
  VolumeX, Sparkles, CheckCircle2, Clock, Share2 
} from 'lucide-react';
import { useStreak } from '../contexts/StreakContext';
import { formatTime } from '../lib/utils';

interface PodcastEpisode {
  id: string;
  title: string;
  host: string;
  guest: string;
  duration: number; // in seconds
  description: string;
  image: string;
}

const EPISODES: PodcastEpisode[] = [
  {
    id: 'ep_1',
    title: 'Ep. 42: De-escalating Corporate Burnout with Somatic Anchors',
    host: 'Elena Vance',
    guest: 'Dr. Soraya Kim, MD',
    duration: 1840, // ~30m
    description: 'Why intellectualizing stress fails, and how vagal nerve exercises reset sympathetic nervous activation.',
    image: '/assets/images/outdoor-reset.jpg',
  },
  {
    id: 'ep_2',
    title: 'Ep. 41: Deep Work in the Age of Constant Interruption',
    host: 'Elena Vance',
    guest: 'Marcus Vance',
    duration: 1520, // ~25m
    description: 'Architecting your day around Ultradian 90-minute biological rhythms without feeling guilty for taking pauses.',
    image: '/assets/images/hero-focus.jpg',
  },
  {
    id: 'ep_3',
    title: 'Ep. 40: The Gut-Brain Axis: Mindful Nutrition Protocols',
    host: 'Elena Vance',
    guest: 'Chef Amina Noor',
    duration: 1680,
    description: 'Transforming mealtime into a restorative sensory practice to eliminate systemic digestive inflammation.',
    image: '/assets/images/nutrition-mindful.jpg',
  },
  {
    id: 'ep_4',
    title: 'Ep. 39: Digital Detox: Building a Phone-Free Bedroom Sanctuary',
    host: 'Elena Vance',
    guest: 'David Okafor',
    duration: 1340,
    description: 'Practical tactics from high-output founders on reclaiming morning clarity from algorithmic distraction.',
    image: '/assets/images/serenity-work-banner.jpg',
  },
];

export const Podcasts: React.FC = () => {
  const { recordActivity } = useStreak();

  const [currentEpIndex, setCurrentEpIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(120); // 2m preview
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);

  const currentEp = EPISODES[currentEpIndex];

  // Simulated scrubber progression
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((t) => {
          if (t >= currentEp.duration) {
            setIsPlaying(false);
            recordActivity('moment', `Listened to ${currentEp.title}`);
            return 0;
          }
          return t + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentEp, recordActivity]);

  const togglePlay = () => {
    if (!isPlaying) {
      recordActivity('moment', `Started podcast: ${currentEp.title}`);
    }
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    setCurrentEpIndex((prev) => (prev + 1) % EPISODES.length);
    setCurrentTime(0);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentEpIndex((prev) => (prev - 1 + EPISODES.length) % EPISODES.length);
    setCurrentTime(0);
    setIsPlaying(true);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sage-100 dark:bg-sage-950/60 text-sage-700 dark:text-sage-300 text-xs font-semibold">
          <Headphones className="w-3.5 h-3.5" />
          <span>Mindful Audio Conversations</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-ink-900 dark:text-linen-100">
          Balance Studio Audio Lounge
        </h1>
        <p className="text-xs sm:text-sm text-ink-700/70 dark:text-linen-200/70">
          Listen to restorative dialogues on somatic neuroscience, boundary setting, and intentional living.
        </p>
      </div>

      {/* Featured Interactive Player */}
      <div className="glass-card rounded-3xl p-6 sm:p-9 shadow-lift border border-sage-200/80 dark:border-ink-700 flex flex-col md:flex-row items-center gap-8">
        <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-3xl overflow-hidden shrink-0 shadow-soft relative">
          <img
            src={currentEp.image}
            alt={currentEp.title}
            className="w-full h-full object-cover"
          />
          {isPlaying && (
            <div className="absolute inset-0 bg-ink-950/40 backdrop-blur-xs flex items-center justify-center">
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-6 bg-white rounded-full animate-bounce" />
                <span className="w-1.5 h-10 bg-white rounded-full animate-bounce delay-75" />
                <span className="w-1.5 h-8 bg-white rounded-full animate-bounce delay-150" />
                <span className="w-1.5 h-5 bg-white rounded-full animate-bounce delay-200" />
              </div>
            </div>
          )}
        </div>

        <div className="flex-1 w-full space-y-4">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-sage-600 dark:text-sage-400 bg-sage-100 dark:bg-sage-950 px-2.5 py-0.5 rounded-full inline-block mb-1">
              Now Playing
            </span>
            <h2 className="font-heading font-bold text-lg sm:text-xl text-ink-900 dark:text-linen-100">
              {currentEp.title}
            </h2>
            <p className="text-xs text-ink-700/70 dark:text-linen-200/70 mt-1">
              Hosted by {currentEp.host} • Featuring {currentEp.guest}
            </p>
          </div>

          {/* Scrubber */}
          <div className="space-y-1">
            <input
              type="range"
              min="0"
              max={currentEp.duration}
              value={currentTime}
              onChange={(e) => setCurrentTime(Number(e.target.value))}
              className="w-full accent-sage-500 h-2 bg-sage-200/70 dark:bg-ink-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[11px] font-mono text-ink-700/60 dark:text-linen-200/60">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(currentEp.duration)}</span>
            </div>
          </div>

          {/* Controls Bar */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-4">
              <button
                onClick={handlePrev}
                className="p-2 rounded-xl text-ink-700 dark:text-linen-200 hover:bg-linen-100 dark:hover:bg-ink-800 transition"
              >
                <SkipBack className="w-5 h-5" />
              </button>

              <button
                onClick={togglePlay}
                className="w-12 h-12 rounded-2xl bg-sage-500 hover:bg-sage-600 text-white flex items-center justify-center shadow-soft hover:scale-105 transition"
              >
                {isPlaying ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-white ml-0.5" />}
              </button>

              <button
                onClick={handleNext}
                className="p-2 rounded-xl text-ink-700 dark:text-linen-200 hover:bg-linen-100 dark:hover:bg-ink-800 transition"
              >
                <SkipForward className="w-5 h-5" />
              </button>
            </div>

            {/* Volume */}
            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="text-ink-700/60 dark:text-linen-200/60 hover:text-ink-900"
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={(e) => {
                  setVolume(Number(e.target.value));
                  setIsMuted(false);
                }}
                className="w-20 accent-sage-500 h-1.5 bg-sage-200 dark:bg-ink-800 rounded-lg cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Episodes Directory */}
      <div className="space-y-4">
        <h3 className="font-heading font-bold text-lg text-ink-900 dark:text-linen-100">
          All Episodes ({EPISODES.length})
        </h3>

        <div className="space-y-3">
          {EPISODES.map((ep, idx) => (
            <div
              key={ep.id}
              onClick={() => {
                setCurrentEpIndex(idx);
                setCurrentTime(0);
                setIsPlaying(true);
              }}
              className={`glass-card rounded-2xl p-4 sm:p-5 border cursor-pointer transition flex items-center justify-between gap-4 ${
                idx === currentEpIndex
                  ? 'border-sage-500 bg-sage-50/50 dark:bg-sage-950/40 ring-1 ring-sage-500/30'
                  : 'border-sage-200/70 dark:border-ink-700 hover:bg-linen-100'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0">
                  <img src={ep.image} alt={ep.title} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-xs sm:text-sm text-ink-900 dark:text-linen-100">
                    {ep.title}
                  </h4>
                  <p className="text-[11px] text-ink-700/60 dark:text-linen-200/60 mt-0.5 line-clamp-1">
                    {ep.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="text-xs font-mono text-ink-700/60 dark:text-linen-200/60">
                  {formatTime(ep.duration)}
                </span>
                <button className="w-8 h-8 rounded-full bg-sage-100 dark:bg-sage-950 text-sage-600 flex items-center justify-center hover:bg-sage-500 hover:text-white transition">
                  <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
