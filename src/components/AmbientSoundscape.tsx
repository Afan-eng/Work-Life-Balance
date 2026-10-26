import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Sparkles, Music, Waves, CloudRain, Bell } from 'lucide-react';

type SoundscapeType = 'none' | 'monsoon' | 'tone528' | 'bowl' | 'stream';

export const AmbientSoundscape: React.FC = () => {
  const [activeSound, setActiveSound] = useState<SoundscapeType>('none');
  const [volume, setVolume] = useState(0.4);
  const [isOpen, setIsOpen] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const noiseSourceRef = useRef<AudioNode | null>(null);

  const initAudio = () => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      audioCtxRef.current = new AudioCtx();
      const gain = audioCtxRef.current.createGain();
      gain.gain.value = volume;
      gain.connect(audioCtxRef.current.destination);
      gainNodeRef.current = gain;
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  };

  const stopAllSound = () => {
    try {
      if (oscRef.current) {
        oscRef.current.stop();
        oscRef.current.disconnect();
        oscRef.current = null;
      }
      if (noiseSourceRef.current) {
        (noiseSourceRef.current as any).stop?.();
        noiseSourceRef.current.disconnect();
        noiseSourceRef.current = null;
      }
    } catch (e) {
      // ignore
    }
  };

  const playSound = (type: SoundscapeType) => {
    initAudio();
    stopAllSound();

    if (type === 'none') {
      setActiveSound('none');
      return;
    }

    if (!audioCtxRef.current || !gainNodeRef.current) return;
    const ctx = audioCtxRef.current;
    const masterGain = gainNodeRef.current;

    if (type === 'tone528') {
      // 528 Hz Solfeggio "Transformation & DNA Repair" tone
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(528, ctx.currentTime);
      osc.connect(masterGain);
      osc.start();
      oscRef.current = osc;
    } else if (type === 'bowl') {
      // 432 Hz Grounding Tibetan Singing Bowl with subtle binaural beat
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      osc1.type = 'sine';
      osc2.type = 'sine';
      osc1.frequency.setValueAtTime(432, ctx.currentTime);
      osc2.frequency.setValueAtTime(436, ctx.currentTime); // 4Hz delta beat

      const subGain = ctx.createGain();
      subGain.gain.setValueAtTime(0.6, ctx.currentTime);
      osc1.connect(subGain);
      osc2.connect(subGain);
      subGain.connect(masterGain);

      osc1.start();
      osc2.start();
      oscRef.current = osc1;
    } else if (type === 'monsoon' || type === 'stream') {
      // Synthesized soft natural pink noise simulating rain/stream
      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
        b6 = white * 0.115926;
      }
      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = type === 'monsoon' ? 'lowpass' : 'bandpass';
      filter.frequency.setValueAtTime(type === 'monsoon' ? 800 : 500, ctx.currentTime);

      whiteNoise.connect(filter);
      filter.connect(masterGain);
      whiteNoise.start();
      noiseSourceRef.current = whiteNoise;
    }

    setActiveSound(type);
  };

  useEffect(() => {
    if (gainNodeRef.current && audioCtxRef.current) {
      gainNodeRef.current.gain.setValueAtTime(volume, audioCtxRef.current.currentTime);
    }
  }, [volume]);

  useEffect(() => {
    return () => {
      stopAllSound();
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition ${
          activeSound !== 'none'
            ? 'bg-sage-100 dark:bg-sage-950/80 border-sage-500 text-sage-800 dark:text-sage-200 ring-2 ring-sage-500/20'
            : 'border-sage-200/70 dark:border-ink-700 bg-white/70 dark:bg-ink-900/70 hover:bg-linen-100 text-ink-800 dark:text-linen-200'
        }`}
        title="Mindful Bio-Soundscapes"
      >
        <Music className={`w-3.5 h-3.5 ${activeSound !== 'none' ? 'animate-bounce text-sage-600' : 'text-ink-700/60'}`} />
        <span className="hidden sm:inline">
          {activeSound === 'none' ? 'Sound Healing' : activeSound.toUpperCase()}
        </span>
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-72 p-4 bg-white dark:bg-ink-900 rounded-2xl shadow-lift border border-sage-200 dark:border-ink-700 z-50 animate-in fade-in"
          onMouseLeave={() => setIsOpen(false)}
        >
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-sage-100 dark:border-ink-800">
            <span className="text-xs font-heading font-bold text-ink-900 dark:text-linen-100 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Somatic Bio-Acoustics
            </span>
            <span className="text-[10px] text-sage-600 dark:text-sage-400 font-mono">
              WebAudio API
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-4">
            <button
              onClick={() => playSound('tone528')}
              className={`p-2 rounded-xl border text-left flex flex-col gap-1 transition ${
                activeSound === 'tone528'
                  ? 'bg-sage-500 text-white border-sage-500 font-bold'
                  : 'bg-linen-50 dark:bg-ink-800 text-ink-800 dark:text-linen-200 border-sage-200 dark:border-ink-700 hover:bg-sage-50'
              }`}
            >
              <span className="text-xs">✨ 528 Hz Tone</span>
              <span className="text-[9px] opacity-75">Solfeggio Frequency</span>
            </button>

            <button
              onClick={() => playSound('bowl')}
              className={`p-2 rounded-xl border text-left flex flex-col gap-1 transition ${
                activeSound === 'bowl'
                  ? 'bg-sage-500 text-white border-sage-500 font-bold'
                  : 'bg-linen-50 dark:bg-ink-800 text-ink-800 dark:text-linen-200 border-sage-200 dark:border-ink-700 hover:bg-sage-50'
              }`}
            >
              <span className="text-xs">🧘 432 Hz Bowl</span>
              <span className="text-[9px] opacity-75">Delta Binaural Beat</span>
            </button>

            <button
              onClick={() => playSound('monsoon')}
              className={`p-2 rounded-xl border text-left flex flex-col gap-1 transition ${
                activeSound === 'monsoon'
                  ? 'bg-sage-500 text-white border-sage-500 font-bold'
                  : 'bg-linen-50 dark:bg-ink-800 text-ink-800 dark:text-linen-200 border-sage-200 dark:border-ink-700 hover:bg-sage-50'
              }`}
            >
              <span className="text-xs">🌧️ Pune Monsoon</span>
              <span className="text-[9px] opacity-75">Pink Noise Rain</span>
            </button>

            <button
              onClick={() => playSound('stream')}
              className={`p-2 rounded-xl border text-left flex flex-col gap-1 transition ${
                activeSound === 'stream'
                  ? 'bg-sage-500 text-white border-sage-500 font-bold'
                  : 'bg-linen-50 dark:bg-ink-800 text-ink-800 dark:text-linen-200 border-sage-200 dark:border-ink-700 hover:bg-sage-50'
              }`}
            >
              <span className="text-xs">🌿 Forest Stream</span>
              <span className="text-[9px] opacity-75">Grounding Brook</span>
            </button>
          </div>

          <div className="space-y-1 mb-3">
            <div className="flex justify-between text-[10px] text-ink-700/60 dark:text-linen-200/60">
              <span>Volume</span>
              <span>{Math.round(volume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="w-full accent-sage-500 h-1.5 bg-sage-200 dark:bg-ink-800 rounded-lg cursor-pointer"
            />
          </div>

          {activeSound !== 'none' && (
            <button
              onClick={() => playSound('none')}
              className="w-full py-1.5 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition font-semibold"
            >
              Mute Background Audio
            </button>
          )}
        </div>
      )}
    </div>
  );
};
