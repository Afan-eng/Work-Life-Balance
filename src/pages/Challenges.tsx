import React, { useState } from 'react';
import { Trophy, Upload, Sparkles, CheckCircle2, Image as ImageIcon, Flame, Calendar, ArrowRight } from 'lucide-react';
import { uploadToCloudinary } from '../lib/cloudinary';
import { useStreak } from '../contexts/StreakContext';
import confetti from 'canvas-confetti';

interface DayCheckIn {
  day: number;
  title: string;
  completed: boolean;
  photoUrl?: string;
}

export const Challenges: React.FC = () => {
  const { recordActivity } = useStreak();

  const [days, setDays] = useState<DayCheckIn[]>(() => {
    return Array.from({ length: 21 }, (_, i) => {
      const dayNum = i + 1;
      return {
        day: dayNum,
        title: `Day ${dayNum}: ${
          dayNum <= 7 ? 'Somatic Breath & Hydration' :
          dayNum <= 14 ? 'Digital Sunset & Screen Curfew' : 'Deep Ultradian Monotasking'
        }`,
        completed: false,
        photoUrl: undefined,
      };
    });
  });

  const [selectedDayForUpload, setSelectedDayForUpload] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedPreview, setUploadedPreview] = useState<string | null>(null);

  const completedCount = days.filter((d) => d.completed).length;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, dayNum: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const secureUrl = await uploadToCloudinary(file, 'challenges');
      setDays((prev) =>
        prev.map((d) =>
          d.day === dayNum ? { ...d, completed: true, photoUrl: secureUrl } : d
        )
      );

      recordActivity('challenge', `Completed 21-Day Challenge Day ${dayNum} with Photo Proof`);

      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#2F9A5D', '#38B76E', '#FCD466'],
        });
      } catch (err) {}

      setSelectedDayForUpload(null);
    } catch (err) {
      alert('Photo upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Hero Banner */}
      <div className="glass-card rounded-3xl p-6 sm:p-10 shadow-lift border border-sage-200/80 dark:border-ink-700 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-3 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-xs font-semibold">
            <Trophy className="w-3.5 h-3.5" />
            <span>21-Day Transformation Engine</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-ink-900 dark:text-linen-100">
            21-Day Habit & Grounding Challenge
          </h1>
          <p className="text-xs sm:text-sm text-ink-700/70 dark:text-linen-200/70 leading-relaxed">
            Science proves that 21 days of continuous somatic reinforcement creates neuroplastic behavioral transformation. Upload daily visual proof via Cloudinary to earn the Sanctuary Key.
          </p>

          <div className="flex items-center gap-4 pt-2">
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
              <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
              Day {completedCount + 1} of 21 Active
            </span>
            <span className="text-xs text-ink-700/60 dark:text-linen-200/60">
              {completedCount} Days Completed ({Math.round((completedCount / 21) * 100)}%)
            </span>
          </div>
        </div>

        {/* Progress Gauge */}
        <div className="w-36 h-36 rounded-full border-8 border-sage-200 dark:border-ink-800 flex items-center justify-center relative shrink-0">
          <div
            className="absolute inset-0 rounded-full border-8 border-sage-500 transition-all duration-700"
            style={{
              clipPath: `polygon(50% 50%, -50% -50%, ${completedCount > 10 ? '150% -50%' : '50% -50%'}, 150% 150%, -50% 150%)`,
            }}
          />
          <div className="text-center z-10">
            <span className="font-heading font-extrabold text-3xl text-ink-900 dark:text-linen-100">
              {completedCount}
            </span>
            <span className="block text-[10px] uppercase font-bold text-ink-700/60 dark:text-linen-200/60">
              / 21 Days
            </span>
          </div>
        </div>
      </div>

      {/* 21-Day Matrix with Photo Uploads */}
      <div className="space-y-4">
        <h3 className="font-heading font-bold text-lg text-ink-900 dark:text-linen-100 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-sage-600" />
          <span>Challenge Check-In Matrix (Cloudinary Photo Verification)</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {days.map((d) => (
            <div
              key={d.day}
              className={`glass-card rounded-2xl p-5 border transition flex flex-col justify-between gap-3 ${
                d.completed
                  ? 'border-emerald-300 dark:border-emerald-800/80 bg-emerald-50/40 dark:bg-emerald-950/20'
                  : 'border-sage-200/70 dark:border-ink-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold font-mono px-2 py-0.5 rounded-md bg-sage-100 dark:bg-sage-950 text-sage-700 dark:text-sage-300">
                    Day {d.day}
                  </span>
                  {d.completed ? (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                    </span>
                  ) : (
                    <span className="text-[11px] text-ink-700/50">Pending</span>
                  )}
                </div>

                <h4 className="font-heading font-bold text-sm text-ink-900 dark:text-linen-100">
                  {d.title}
                </h4>

                {/* Photo Thumbnail if uploaded */}
                {d.photoUrl && (
                  <div className="mt-3 h-28 rounded-xl overflow-hidden border border-sage-200/60 relative">
                    <img
                      src={d.photoUrl}
                      alt={`Day ${d.day} Proof`}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-1 right-1 bg-ink-900/80 text-white text-[9px] px-1.5 py-0.5 rounded font-mono">
                      Cloudinary Verified
                    </span>
                  </div>
                )}
              </div>

              {/* Upload Action */}
              <div className="pt-2 border-t border-sage-100 dark:border-ink-800">
                {!d.completed ? (
                  <label className="w-full py-2 px-3 rounded-xl bg-sage-500 hover:bg-sage-600 text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-soft transition">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Proof Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, d.day)}
                    />
                  </label>
                ) : (
                  <label className="text-[11px] text-sage-600 dark:text-sage-400 font-bold hover:underline cursor-pointer flex items-center justify-center gap-1">
                    <ImageIcon className="w-3 h-3" />
                    <span>Update Check-in Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, d.day)}
                    />
                  </label>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
