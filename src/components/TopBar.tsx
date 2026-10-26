import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Menu, Sun, Moon, Wind, Flame, User, LogOut, 
  CreditCard, Sparkles, ChevronDown, Award 
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useStreak } from '../contexts/StreakContext';
import { getCurrentRhythmBadge } from '../lib/utils';
import { AmbientSoundscape } from './AmbientSoundscape';
import { QuickBreathModal } from './QuickBreathModal';

interface TopBarProps {
  onToggleSidebar: () => void;
  isSidebarOpen?: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({ onToggleSidebar, isSidebarOpen }) => {
  const { user, profile, openAuthModal, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { currentStreak } = useStreak();

  const [time, setTime] = useState(new Date());
  const [isBreathOpen, setIsBreathOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const rhythm = getCurrentRhythmBadge(time.getHours());

  return (
    <>
      <header className="sticky top-0 z-30 w-full bg-linen-100/90 dark:bg-ink-950/90 backdrop-blur-md border-b border-sage-200/60 dark:border-ink-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Item 1: Sidebar Toggle & Brand Identity */}
          <div className="flex items-center gap-3">
            <button
              onClick={onToggleSidebar}
              className="p-2 rounded-2xl bg-white/80 dark:bg-ink-900/80 border border-sage-200/70 dark:border-ink-700 text-ink-800 dark:text-linen-200 hover:bg-sage-50 dark:hover:bg-ink-800 transition shadow-soft"
              aria-label="Toggle Navigation Sidebar"
              title="Open Content Sidebar"
            >
              <Menu className="w-5 h-5 text-sage-600 dark:text-sage-400" />
            </button>

            <Link to="/" className="flex items-center gap-2.5">
              <span className="font-heading font-extrabold text-lg sm:text-xl text-ink-900 dark:text-linen-100 tracking-tight">
                Balance<span className="text-sage-600 dark:text-sage-400 font-light">Compass</span>
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 text-[10px] font-bold border border-amber-300 dark:border-amber-800">
                <Award className="w-3 h-3 text-amber-600" />
                <span>Global Wellness</span>
              </span>
            </Link>
          </div>

          {/* Item 2: Real-Time Live Clock & Circadian Rhythm */}
          <div className="hidden md:flex items-center gap-2 bg-white/70 dark:bg-ink-900/70 px-3 py-1.5 rounded-2xl border border-sage-200/60 dark:border-ink-700 shadow-soft">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-mono text-xs font-bold text-ink-900 dark:text-linen-100">
              {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
            <span className="text-ink-700/30 dark:text-linen-200/30">|</span>
            <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${rhythm.color}`}>
              {rhythm.label}
            </span>
          </div>

          {/* Item 3 & 4: Mindful Quick Tools + User Profile Pill */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Box Breath */}
            <button
              onClick={() => setIsBreathOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-200 border border-teal-200 dark:border-teal-800 text-xs font-semibold hover:bg-teal-100 transition shadow-soft"
              title="60s Box Breathing Reset"
            >
              <Wind className="w-3.5 h-3.5 text-teal-600" />
              <span>Box Breath</span>
            </button>

            {/* Ambient Soundscapes */}
            <AmbientSoundscape />

            {/* Dark/Light Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl border border-sage-200/70 dark:border-ink-700 text-ink-800 dark:text-linen-200 hover:bg-sage-50 dark:hover:bg-ink-900 transition"
              aria-label="Toggle Theme"
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-400" />}
            </button>

            {/* Item 4: Live Auth Avatar Bar */}
            {profile ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center gap-2 p-1 pl-2 pr-2 rounded-2xl bg-white dark:bg-ink-900 border border-sage-200/70 dark:border-ink-700 shadow-soft hover:shadow-lift transition"
                >
                  <img
                    src={profile.avatarUrl}
                    alt={profile.fullName}
                    className="w-7 h-7 rounded-xl object-cover ring-2 ring-sage-400/40"
                  />
                  <div className="hidden sm:block text-left pr-1">
                    <span className="block text-xs font-bold text-ink-900 dark:text-linen-100 leading-tight">
                      {profile.fullName.split(' ')[0]}
                    </span>
                    <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold flex items-center gap-0.5">
                      <Flame className="w-2.5 h-2.5 fill-amber-500" />
                      {currentStreak}d
                    </span>
                  </div>
                  <ChevronDown className="w-3 h-3 text-ink-700/60 dark:text-linen-200/60" />
                </button>

                {isProfileMenuOpen && (
                  <div
                    className="absolute right-0 mt-2 w-60 py-2 bg-white dark:bg-ink-900 rounded-2xl shadow-lift border border-sage-200 dark:border-ink-700 z-50 animate-in fade-in"
                    onMouseLeave={() => setIsProfileMenuOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-sage-100 dark:border-ink-800">
                      <p className="text-xs font-bold text-ink-900 dark:text-linen-100">{profile.fullName}</p>
                      <p className="text-[10px] text-ink-700/60 dark:text-linen-200/60 truncate">{profile.email}</p>
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setIsProfileMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold hover:bg-sage-50 dark:hover:bg-ink-800 text-ink-800 dark:text-linen-200"
                    >
                      <User className="w-4 h-4 text-sage-500" />
                      <span>My Account & Cloudinary</span>
                    </Link>

                    <Link
                      to="/global-dashboard"
                      onClick={() => setIsProfileMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold hover:bg-amber-50 dark:hover:bg-amber-950/40 text-amber-900 dark:text-amber-200"
                    >
                      <Award className="w-4 h-4 text-amber-600" />
                      <span>Community Insights</span>
                    </Link>

                    <Link
                      to="/architecture"
                      onClick={() => setIsProfileMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold hover:bg-sage-50 dark:hover:bg-ink-800 text-ink-800 dark:text-linen-200"
                    >
                      <Sparkles className="w-4 h-4 text-emerald-500" />
                      <span>Architecture Inspector</span>
                    </Link>

                    <div className="border-t border-sage-100 dark:border-ink-800 my-1" />

                    <button
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        signOut();
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Log Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => openAuthModal('login')}
                className="px-4 py-2 rounded-xl bg-sage-500 hover:bg-sage-600 text-white text-xs font-bold shadow-soft transition flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>
      </header>

      <QuickBreathModal isOpen={isBreathOpen} onClose={() => setIsBreathOpen(false)} />
    </>
  );
};
