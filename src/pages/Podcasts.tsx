import React, { useState, useRef, useEffect } from 'react';
import { Headphones, Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, ExternalLink, Search } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useContentProgress } from '../contexts/ContentProgressContext';
import { formatTime } from '../lib/utils';

interface PodcastEpisode {
  id: string;
  title: string;
  host: string;
  guest: string;
  duration: number; // in seconds
  description: string;
  image: string;
  audioUrl?: string;
  sourceUrl: string;
}

const EPISODES: PodcastEpisode[] = [
  {
    id: 'ep_1',
    title: 'Meditation: Natural, Open Awareness',
    host: 'Tara Brach',
    guest: 'Guided mindfulness practice',
    duration: 1014,
    audioUrl: 'https://traffic.libsyn.com/tarabrach/2018-07-11-Meditation-Natural-Open-Awareness-TaraBrach.mp3',
    sourceUrl: 'https://www.tarabrach.com/meditation-natural-open-awareness/',
    description: 'A guided meditation that explores open awareness and gently works with stress and attention.',
    image: '/assets/covers/podcast-covers/ep_1.svg',
  },
  {
    id: 'ep_2',
    title: 'Breath Awareness Meditation',
    host: 'Dr. Genelle Weits · Military Health System',
    guest: 'Guided mindfulness practice',
    duration: 555,
    audioUrl: 'https://www.dvidshub.net/download/audio/69533',
    sourceUrl: 'https://www.dvidshub.net/audio/69533/military-meditation-coach-breath-awareness-meditation-dr-weits',
    description: 'A public-domain breath awareness meditation recorded by the Defense Health Agency.',
    image: '/assets/covers/podcast-covers/ep_2.svg',
  },
  {
    id: 'ep_3',
    title: 'The body keeps the score: loneliness and your health',
    host: 'World Health Organization',
    guest: 'Off the Record podcast',
    duration: 0,
    sourceUrl: 'https://www.who.int/podcasts/series/off-the-record/episode-2-the-body-keeps-the-score-loneliness-and-your-health',
    description: 'A WHO conversation about loneliness, social connection, and health. Listen on the publisher site.',
    image: '/assets/covers/podcast-covers/ep_3.svg',
  },
  {
    id: 'ep_4',
    title: 'Managing stress in uncertain times',
    host: 'Headspace',
    guest: 'Guided body scan meditation',
    duration: 0,
    sourceUrl: 'https://www.youtube.com/watch?v=GsE0NHdLn5I',
    description: 'A ten-minute guided body scan from Headspace. Open the source to listen.',
    image: '/assets/covers/podcast-covers/ep_4.svg',
  },
];

export const Podcasts: React.FC = () => {
  const { user, openAuthModal } = useAuth();
  const { isCompleted, markCompleted, busy } = useContentProgress();
  const audioRef = useRef<HTMLAudioElement>(null);

  const [currentEpIndex, setCurrentEpIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [search, setSearch] = useState('');
  const [playbackError, setPlaybackError] = useState('');

  const currentEp = EPISODES[currentEpIndex];
  const markCurrentCompleted = async () => {
    if (!user) { openAuthModal('login'); return; }
    const saved = await markCompleted('podcast', currentEp.id, currentEp.title);
    if (!saved) setPlaybackError('Could not save listening progress. Check your connection and try again.');
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = isMuted ? 0 : volume;
    if (isPlaying && currentEp.audioUrl) audio.play().catch(() => { setIsPlaying(false); setPlaybackError('This stream could not be played here. Use “Open source” to listen on the publisher site.'); });
    else audio.pause();
  }, [isPlaying, currentEpIndex, volume, isMuted, currentEp.audioUrl]);

  const visibleEpisodes = EPISODES.filter(ep => `${ep.title} ${ep.host} ${ep.description}`.toLowerCase().includes(search.toLowerCase()));

  const togglePlay = () => {
    if (!currentEp.audioUrl) { window.open(currentEp.sourceUrl, '_blank', 'noopener,noreferrer'); return; }
    setPlaybackError('');
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    const nextIndex = (currentEpIndex + 1) % EPISODES.length;
    setCurrentEpIndex(nextIndex);
    setCurrentTime(0);
    setIsPlaying(Boolean(EPISODES[nextIndex].audioUrl));
    setPlaybackError('');
  };

  const handlePrev = () => {
    const nextIndex = (currentEpIndex - 1 + EPISODES.length) % EPISODES.length;
    setCurrentEpIndex(nextIndex);
    setCurrentTime(0);
    setIsPlaying(Boolean(EPISODES[nextIndex].audioUrl));
    setPlaybackError('');
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
          Balance Compass Audio Lounge
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
              max={currentEp.duration || 1}
              value={currentTime}
              disabled={!currentEp.audioUrl}
              onChange={(e) => { const next = Number(e.target.value); setCurrentTime(next); if (audioRef.current) audioRef.current.currentTime = next; }}
              className="w-full accent-sage-500 h-2 bg-sage-200/70 dark:bg-ink-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[11px] font-mono text-ink-700/60 dark:text-linen-200/60">
              <span>{formatTime(currentTime)}</span>
              <span>{currentEp.duration ? formatTime(currentEp.duration) : 'Publisher player'}</span>
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
                {!currentEp.audioUrl ? <ExternalLink className="w-5 h-5" /> : isPlaying ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-white ml-0.5" />}
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

      <audio ref={audioRef} src={currentEp.audioUrl} preload="metadata" onTimeUpdate={e => setCurrentTime(e.currentTarget.currentTime)} onEnded={() => { setIsPlaying(false); setCurrentTime(0); void markCurrentCompleted(); }} onError={() => { if (isPlaying) { setIsPlaying(false); setPlaybackError('Audio could not load. Check your connection or use the publisher link.'); } }} />
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-sage-200 bg-white p-4 dark:border-ink-700 dark:bg-ink-900"><p className="text-sm font-semibold text-ink-900 dark:text-linen-100">{isCompleted('podcast', currentEp.id) ? 'This episode is in your completed library.' : currentEp.audioUrl ? 'Finish the audio to mark it complete automatically.' : 'Listened on the publisher? Mark this episode complete.'}</p><button type="button" disabled={Boolean(currentEp.audioUrl && isPlaying)} onClick={() => void markCurrentCompleted()} className="rounded-xl bg-sage-700 px-4 py-2.5 text-xs font-bold text-white disabled:opacity-50">{isCompleted('podcast', currentEp.id) ? 'Completed ✓' : busy ? 'Saving…' : 'Mark listened'}</button></div>
      {playbackError && <p role="status" className="rounded-xl border border-amber-300 bg-amber-50 p-3 text-xs text-amber-900">{playbackError}</p>}

      {/* Episodes Directory */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3"><h3 className="font-heading font-bold text-lg text-ink-900 dark:text-linen-100">Audio library ({visibleEpisodes.length})</h3><div className="relative w-full sm:w-72"><Search className="absolute left-3 top-2.5 h-4 w-4 text-ink-700/50"/><input aria-label="Search audio" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search audio…" className="w-full rounded-xl border border-sage-200 bg-white py-2 pl-9 pr-3 text-xs dark:border-ink-700 dark:bg-ink-900 dark:text-white"/></div></div>

        <div className="space-y-3">
          {visibleEpisodes.map((ep) => {
            const idx = EPISODES.findIndex(item => item.id === ep.id);
            return (
            <div
              key={ep.id}
              onClick={() => {
                setCurrentEpIndex(idx);
                setCurrentTime(0);
                setIsPlaying(Boolean(ep.audioUrl));
                setPlaybackError('');
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
                    {ep.title}{isCompleted('podcast', ep.id) && <span className="ml-2 rounded-full bg-emerald-100 px-2 py-1 text-[9px] font-bold uppercase text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200">Complete</span>}
                  </h4>
                  <p className="text-[11px] text-ink-700/60 dark:text-linen-200/60 mt-0.5 line-clamp-1">
                    {ep.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="text-xs font-mono text-ink-700/60 dark:text-linen-200/60">{ep.duration ? formatTime(ep.duration) : 'Publisher'}</span>
                <a href={ep.sourceUrl} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()} aria-label={`Open ${ep.title} source`} className="grid h-8 w-8 place-items-center rounded-full bg-sage-100 text-sage-600 hover:bg-sage-500 hover:text-white dark:bg-sage-950"><ExternalLink className="h-3.5 w-3.5" /></a>
              </div>
            </div>
          );})}
        </div>
      </div>
    </div>
  );
};
