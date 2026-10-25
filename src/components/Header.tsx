import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Sun, Moon, Flame, CheckCircle, Circle, Copy, Shuffle, Bookmark, 
  ChevronDown, User as UserIcon, LogOut, CreditCard, Sparkles, Wind,
  Smile, Trophy, HelpCircle, Menu, X
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useStreak } from '../contexts/StreakContext';
import { getCurrentRhythmBadge } from '../lib/utils';
import { QuickBreathModal } from './QuickBreathModal';

const DAILY_THOUGHTS = [
  { text: "Almost everything will work again if you unplug it for a few minutes, including you.", author: "Anne Lamott" },
  { text: "Simplicity is about subtracting the obvious and adding the meaningful.", author: "John Maeda" },
  { text: "In the midst of movement and chaos, keep stillness inside of you.", author: "Deepak Chopra" },
  { text: "You can't do a good job if your job is all you do.", author: "Katie Thurmes" },
  { text: "Smile, breathe, and go slowly. There is nowhere to arrive except right here.", author: "Thich Nhat Hanh" },
];

export const Header: React.FC = () => {
  const location = useLocation();
  const { user, profile, openAuthModal, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { currentStreak, dailyGoals, toggleDailyGoal, remainingGoalsCount } = useStreak();

  // Real-Time Clock State
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = time.getHours();
  const rhythmBadge = getCurrentRhythmBadge(hours);

  // Daily Thought Widget State
  const [thoughtIndex, setThoughtIndex] = useState(0);
  const [copiedThought, setCopiedThought] = useState(false);
  const [savedThought, setSavedThought] = useState(false);

  // Quick Modals & Dropdowns
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isGoalsMenuOpen, setIsGoalsMenuOpen] = useState(false);
  const [isBreathModalOpen, setIsBreathModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const currentThought = DAILY_THOUGHTS[thoughtIndex];

  const handleShuffleThought = () => {
    setThoughtIndex((prev) => (prev + 1) % DAILY_THOUGHTS.length);
    setCopiedThought(false);
    setSavedThought(false);
  };

  const handleCopyThought = () => {
    navigator.clipboard.writeText(`"${currentThought.text}" — ${currentThought.author}`);
    setCopiedThought(true);
    setTimeout(() => setCopiedThought(false), 2000);
  };

  const handleSaveThought = () => {
    setSavedThought(true);
    setTimeout(() => setSavedThought(false), 2500);
  };

  const navLinks = [
    { name: 'Wellness Pillars', path: '/mental-wellness', hasDropdown: true },
    { name: 'Articles', path: '/articles' },
    { name: 'Podcasts', path: '/podcasts' },
    { name: 'Videos', path: '/videos' },
    { name: 'Events', path: '/events' },
    { name: 'Community', path: '/community' },
    { name: 'Global Dashboard', path: '/dashboard' },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-linen-100/85 dark:bg-ink-950/85 backdrop-blur-md border-b border-sage-200/60 dark:border-ink-800 transition-colors">
        {/* Tier 1: Top Navigation Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Brand Logo & Wordmark */}
          <Link to="/" className="flex items-center gap-3 shrink-0 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-sage-500 to-sage-700 flex items-center justify-center text-white shadow-soft group-hover:scale-105 transition-transform">
              <svg className="w-6 h-6 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="2">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeDasharray="4 2" />
                <path d="M12 3a9 9 0 0 1 9 9c0 4.97-4.03 9-9 9" stroke="currentColor" />
                <path d="M8 12a4 4 0 0 1 8 0" stroke="currentColor" />
                <circle cx="12" cy="12" r="1.5" fill="currentColor" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-heading font-extrabold text-xl tracking-tight text-ink-900 dark:text-linen-100">
                  Balance
                </span>
                <span className="font-heading font-light text-xl text-sage-600 dark:text-sage-400">
                  Studio
                </span>
              </div>
              <p className="text-[10px] uppercase font-bold tracking-widest text-ink-700/60 dark:text-linen-200/50 -mt-0.5">
                Life in balance
              </p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path || (link.hasDropdown && location.pathname.includes('-wellness'));
              return (
                <div key={link.name} className="relative group/nav">
                  <Link
                    to={link.path}
                    className={`px-3 py-1.5 rounded-xl text-sm font-medium transition flex items-center gap-1 ${
                      isActive
                        ? 'bg-sage-100 dark:bg-sage-950/60 text-sage-700 dark:text-sage-300 font-bold'
                        : 'text-ink-800/80 hover:text-ink-900 dark:text-linen-200/80 dark:hover:text-white hover:bg-sage-50/60 dark:hover:bg-ink-900'
                    }`}
                  >
                    {link.name}
                    {link.hasDropdown && <ChevronDown className="w-3.5 h-3.5 opacity-60" />}
                  </Link>

                  {link.hasDropdown && (
                    <div className="absolute top-full left-0 mt-1 w-52 py-2 bg-white dark:bg-ink-900 rounded-2xl shadow-lift border border-sage-200/60 dark:border-ink-700 hidden group-hover/nav:block animate-in fade-in slide-in-from-top-1 duration-150">
                      <Link
                        to="/mental-wellness"
                        className="block px-4 py-2 text-xs font-semibold hover:bg-sage-50 dark:hover:bg-ink-800 text-ink-800 dark:text-linen-200"
                      >
                        🧠 Mental Wellness
                      </Link>
                      <Link
                        to="/productivity"
                        className="block px-4 py-2 text-xs font-semibold hover:bg-sage-50 dark:hover:bg-ink-800 text-ink-800 dark:text-linen-200"
                      >
                        ⚡ Mindful Productivity
                      </Link>
                      <Link
                        to="/physical-health"
                        className="block px-4 py-2 text-xs font-semibold hover:bg-sage-50 dark:hover:bg-ink-800 text-ink-800 dark:text-linen-200"
                      >
                        🌿 Physical Health
                      </Link>
                      <Link
                        to="/digital-wellbeing"
                        className="block px-4 py-2 text-xs font-semibold hover:bg-sage-50 dark:hover:bg-ink-800 text-ink-800 dark:text-linen-200"
                      >
                        📱 Digital Wellbeing
                      </Link>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Right Action Icons & Live Auth Bar */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl border border-sage-200/70 dark:border-ink-700 text-ink-800 dark:text-linen-200 hover:bg-sage-50 dark:hover:bg-ink-900 transition"
              aria-label="Toggle Theme"
              title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-warmAmber-400" />}
            </button>

            {/* Contact Us CTA */}
            <Link
              to="/contact"
              className="hidden sm:inline-flex items-center px-3.5 py-1.5 rounded-xl border border-sage-300 dark:border-sage-800 text-xs font-semibold text-ink-800 dark:text-linen-200 hover:bg-sage-100/50 dark:hover:bg-ink-900 transition"
            >
              Contact Us
            </Link>

            {/* Supabase Live Auth Bar */}
            {profile ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center gap-2.5 p-1 pl-2.5 pr-2 rounded-2xl bg-white dark:bg-ink-900 border border-sage-200/70 dark:border-ink-700 shadow-soft hover:shadow-lift transition"
                >
                  <img
                    src={profile.avatarUrl}
                    alt={profile.fullName}
                    className="w-7 h-7 rounded-xl object-cover ring-2 ring-sage-400/40"
                  />
                  <div className="hidden md:block text-left">
                    <span className="block text-xs font-bold leading-none text-ink-900 dark:text-linen-100">
                      {profile.fullName}
                    </span>
                    <span className="text-[10px] text-sage-600 dark:text-sage-400 font-medium">
                      {profile.tier === 'premium' ? 'Sanctuary Pass' : 'Explorer'}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-ink-700/60 dark:text-linen-200/60" />
                </button>

                {isProfileMenuOpen && (
                  <div
                    className="absolute right-0 mt-2 w-60 py-2 bg-white dark:bg-ink-900 rounded-2xl shadow-lift border border-sage-200 dark:border-ink-700 animate-in fade-in duration-150 z-50"
                    onMouseLeave={() => setIsProfileMenuOpen(false)}
                  >
                    <div className="px-4 py-2.5 border-b border-sage-100 dark:border-ink-800">
                      <p className="text-xs font-bold text-ink-900 dark:text-linen-100">{profile.fullName}</p>
                      <p className="text-[11px] text-ink-700/60 dark:text-linen-200/60 truncate">{profile.email}</p>
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setIsProfileMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold hover:bg-sage-50 dark:hover:bg-ink-800 text-ink-800 dark:text-linen-200"
                    >
                      <UserIcon className="w-4 h-4 text-sage-500" />
                      <span>My Account & Cloudinary Profile</span>
                    </Link>

                    <Link
                      to="/dashboard"
                      onClick={() => setIsProfileMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold hover:bg-sage-50 dark:hover:bg-ink-800 text-ink-800 dark:text-linen-200"
                    >
                      <Flame className="w-4 h-4 text-warmAmber-500" />
                      <span>Streaks Cockpit ({currentStreak} Days)</span>
                    </Link>

                    <Link
                      to="/profile#billing"
                      onClick={() => setIsProfileMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold hover:bg-sage-50 dark:hover:bg-ink-800 text-ink-800 dark:text-linen-200"
                    >
                      <CreditCard className="w-4 h-4 text-emerald-500" />
                      <span>Razorpay Billing History</span>
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
                className="px-4 py-2 rounded-xl bg-sage-500 hover:bg-sage-600 text-white text-xs font-bold shadow-soft hover:shadow-lift transition flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl border border-sage-200 text-ink-800 dark:text-linen-200"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav Dropdown Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden px-4 py-4 bg-white dark:bg-ink-900 border-t border-sage-200 dark:border-ink-800 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-sm font-semibold text-ink-800 dark:text-linen-200 hover:bg-sage-50 dark:hover:bg-ink-800"
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-sm font-semibold text-sage-600 dark:text-sage-400 hover:bg-sage-50"
            >
              Contact Support & Crisis Line
            </Link>
          </div>
        )}

        {/* Tier 2: Secondary Rail */}
        <div className="bg-linen-200/50 dark:bg-ink-900/60 border-t border-sage-200/40 dark:border-ink-800/80 px-4 sm:px-6 lg:px-8 py-2">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
            {/* Left: Real-Time Live Clock & Rhythm Badge */}
            <div className="flex items-center gap-2.5">
              <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-ink-900 dark:text-linen-100 bg-white/70 dark:bg-ink-800/80 px-2.5 py-1 rounded-lg border border-sage-200/50 dark:border-ink-700">
                <span className="w-2 h-2 rounded-full bg-sage-500 animate-pulse" />
                <span>{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}</span>
              </div>
              <span className={`px-2 py-0.5 rounded-md text-[11px] font-semibold border ${rhythmBadge.color}`}>
                {rhythmBadge.label}
              </span>
            </div>

            {/* Center: Interactive Daily Thought Widget */}
            <div className="hidden md:flex items-center gap-2 bg-white/60 dark:bg-ink-800/60 px-3 py-1 rounded-xl border border-sage-200/40 dark:border-ink-700/60 max-w-md lg:max-w-lg xl:max-w-xl truncate">
              <span className="text-sage-600 dark:text-sage-400 font-bold shrink-0">Daily Thought:</span>
              <span className="italic text-ink-800/90 dark:text-linen-200/90 truncate text-[11px]" title={currentThought.text}>
                "{currentThought.text}"
              </span>
              <div className="flex items-center gap-1 shrink-0 ml-auto border-l border-sage-200/60 dark:border-ink-700 pl-2">
                <button
                  onClick={handleShuffleThought}
                  className="p-1 hover:text-sage-600 dark:hover:text-sage-300 text-ink-700/60 transition"
                  title="Shuffle quote"
                >
                  <Shuffle className="w-3 h-3" />
                </button>
                <button
                  onClick={handleCopyThought}
                  className="p-1 hover:text-sage-600 dark:hover:text-sage-300 text-ink-700/60 transition"
                  title="Copy quote"
                >
                  {copiedThought ? <CheckCircle className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                </button>
                <button
                  onClick={handleSaveThought}
                  className="p-1 hover:text-sage-600 dark:hover:text-sage-300 text-ink-700/60 transition"
                  title="Save quote"
                >
                  <Bookmark className={`w-3 h-3 ${savedThought ? 'fill-warmAmber-500 text-warmAmber-500' : ''}`} />
                </button>
              </div>
            </div>

            {/* Right: Today's Goals & Quick Shortcut Pills */}
            <div className="flex items-center gap-2 ml-auto">
              {/* Today's Goals Widget */}
              <div className="relative">
                <button
                  onClick={() => setIsGoalsMenuOpen(!isGoalsMenuOpen)}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/70 dark:bg-ink-800/80 hover:bg-white dark:hover:bg-ink-800 border border-sage-200/60 dark:border-ink-700 transition"
                >
                  <span className="flex items-center gap-1 font-bold text-ink-900 dark:text-linen-100">
                    <Flame className="w-3.5 h-3.5 text-warmAmber-500 fill-warmAmber-500" />
                    <span>{currentStreak}d</span>
                  </span>
                  <span className="text-ink-700/40 dark:text-linen-200/40">|</span>
                  <span className="text-[11px] font-medium text-ink-800 dark:text-linen-200">
                    Today: {3 - remainingGoalsCount}/3
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-sage-500" />
                </button>

                {isGoalsMenuOpen && (
                  <div
                    className="absolute right-0 mt-2 w-72 p-4 bg-white dark:bg-ink-900 rounded-2xl shadow-lift border border-sage-200 dark:border-ink-700 z-50 animate-in fade-in"
                    onMouseLeave={() => setIsGoalsMenuOpen(false)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold font-heading text-ink-900 dark:text-linen-100">
                        Today's 3 Micro-Goals
                      </span>
                      <span className="text-[10px] bg-sage-100 dark:bg-sage-950 text-sage-700 dark:text-sage-300 px-2 py-0.5 rounded-full font-bold">
                        {remainingGoalsCount === 0 ? 'All Done! 🔥' : `${remainingGoalsCount} Remaining`}
                      </span>
                    </div>

                    <div className="space-y-2">
                      {dailyGoals.map((g) => (
                        <div
                          key={g.id}
                          onClick={() => toggleDailyGoal(g.id)}
                          className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-sage-50 dark:hover:bg-ink-800 cursor-pointer transition text-left"
                        >
                          {g.completed ? (
                            <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                          ) : (
                            <Circle className="w-4 h-4 text-ink-700/40 shrink-0" />
                          )}
                          <span
                            className={`text-xs ${
                              g.completed
                                ? 'line-through text-ink-700/40 dark:text-linen-200/40'
                                : 'text-ink-800 dark:text-linen-200 font-medium'
                            }`}
                          >
                            {g.title}
                          </span>
                        </div>
                      ))}
                    </div>

                    <Link
                      to="/habit-tracker"
                      onClick={() => setIsGoalsMenuOpen(false)}
                      className="block text-center text-[11px] font-bold text-sage-600 dark:text-sage-400 mt-3 pt-2 border-t border-sage-100 dark:border-ink-800 hover:underline"
                    >
                      Manage Full Habit Matrix →
                    </Link>
                  </div>
                )}
              </div>

              {/* Quick Shortcut Pills */}
              <div className="hidden sm:flex items-center gap-1.5">
                <Link
                  to="/mood-tracker"
                  className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 border border-emerald-200/60 dark:border-emerald-800 text-[11px] font-bold flex items-center gap-1 transition"
                >
                  <Smile className="w-3 h-3" />
                  <span>Mood</span>
                </Link>

                <Link
                  to="/challenges"
                  className="px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 hover:bg-amber-100 border border-amber-200/60 dark:border-amber-800 text-[11px] font-bold flex items-center gap-1 transition"
                >
                  <Trophy className="w-3 h-3" />
                  <span>21-Day</span>
                </Link>

                <button
                  onClick={() => setIsBreathModalOpen(true)}
                  className="px-2.5 py-1 rounded-lg bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 hover:bg-teal-100 border border-teal-200/60 dark:border-teal-800 text-[11px] font-bold flex items-center gap-1 transition"
                >
                  <Wind className="w-3 h-3" />
                  <span>Box Breath</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Global Quick Box Breathing Modal */}
      <QuickBreathModal isOpen={isBreathModalOpen} onClose={() => setIsBreathModalOpen(false)} />
    </>
  );
};
