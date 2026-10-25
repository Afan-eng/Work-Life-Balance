import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, Activity, Smile, Target, Clock, Brain, Zap, 
  Heart, Smartphone, BookOpen, Headphones, Video, Calendar, 
  Users, Trophy, Network, User, Mail, Award, Flame, X, 
  ChevronRight, Sparkles, Building, ChevronLeft, BarChart3, FileCheck, PanelLeftClose, Globe 
} from 'lucide-react';
import { useStreak } from '../contexts/StreakContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  name: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  highlight?: boolean;
}

interface NavSection {
  title: string;
  badge?: string;
  items: NavItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { currentStreak, freezeTokens } = useStreak();

  const navSections: NavSection[] = [
    {
      title: 'Global Insights',
      badge: 'Community',
      items: [
        { name: 'Global Dashboard', path: '/global-dashboard', icon: Globe, highlight: true },
        { name: 'Community Wellness Survey', path: '/community-survey', icon: BarChart3, highlight: true },
        { name: 'Program Evaluation', path: '/evaluation', icon: FileCheck, highlight: true },
        { name: 'System Architecture', path: '/architecture', icon: Network, highlight: true },
      ],
    },
    {
      title: 'Core Sanctuaries',
      items: [
        { name: 'Home Sanctuary', path: '/', icon: Home },
        { name: 'My Dashboard', path: '/dashboard', icon: Activity },
      ],
    },
    {
      title: 'Specialized Trackers',
      items: [
        { name: 'Mood & Emotion Journal', path: '/mood-tracker', icon: Smile },
        { name: 'Daily Habit Matrix', path: '/habit-tracker', icon: Target },
        { name: 'Goal Trajectory', path: '/goal-tracker', icon: Trophy },
        { name: 'Health & Pomodoro/Breath', path: '/health-tracker', icon: Clock },
      ],
    },
    {
      title: 'Wellness Pillars',
      items: [
        { name: 'Mental Wellness (5m Reset)', path: '/mental-wellness', icon: Brain },
        { name: 'Mindful Productivity', path: '/productivity', icon: Zap },
        { name: 'Physical Health & Movement', path: '/physical-health', icon: Heart },
        { name: 'Digital Sovereignty', path: '/digital-wellbeing', icon: Smartphone },
      ],
    },
    {
      title: 'Media & Knowledge Lounge',
      items: [
        { name: 'Articles & Essays', path: '/articles', icon: BookOpen },
        { name: 'Podcasts Lounge', path: '/podcasts', icon: Headphones },
        { name: 'Video Masterclasses', path: '/videos', icon: Video },
      ],
    },
    {
      title: 'Community & Engagement',
      items: [
        { name: 'Workshops & Circles', path: '/events', icon: Calendar },
        { name: 'Community Discussions', path: '/community', icon: Users },
        { name: '21-Day Habit Challenge', path: '/challenges', icon: Award },
      ],
    },
    {
      title: 'Account & Concierge',
      items: [
        { name: 'My Profile & Billing', path: '/profile', icon: User },
        { name: 'Crisis Support & Contact', path: '/contact', icon: Mail },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-ink-950/60 backdrop-blur-xs lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Dynamic Collapsible Sidebar (Works seamlessly on desktop & mobile) */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-linen-50 dark:bg-ink-950 border-r border-sage-200/80 dark:border-ink-800 flex flex-col transition-all duration-300 ease-in-out shadow-lift ${
          isOpen ? 'translate-x-0 opacity-100 pointer-events-auto' : '-translate-x-full opacity-0 pointer-events-none'
        }`}
      >
        {/* Brand Top & Collapse Trigger */}
        <div className="h-16 px-4 sm:px-5 border-b border-sage-200/60 dark:border-ink-800 flex items-center justify-between shrink-0">
          <Link to="/" onClick={onClose} className="flex items-center gap-2.5 group truncate">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-sage-500 to-sage-700 flex items-center justify-center text-white shadow-soft group-hover:scale-105 transition-transform shrink-0">
              <svg className="w-4 h-4 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="2">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeDasharray="4 2" />
                <path d="M12 3a9 9 0 0 1 9 9c0 4.97-4.03 9-9 9" stroke="currentColor" />
                <circle cx="12" cy="12" r="1.5" fill="currentColor" />
              </svg>
            </div>
            <div className="truncate">
              <span className="font-heading font-extrabold text-sm tracking-tight text-ink-900 dark:text-linen-100 block leading-tight">
                Balance Studio
              </span>
              <span className="text-[9px] text-amber-700 dark:text-amber-400 font-bold tracking-wider uppercase block">
                Your Daily Wellness Hub
              </span>
            </div>
          </Link>

          {/* Desktop & Mobile Collapse Button */}
          <button
            onClick={onClose}
            className="p-1.5 text-ink-700/60 hover:text-ink-900 dark:text-linen-200/60 dark:hover:text-white rounded-xl hover:bg-sage-100 dark:hover:bg-ink-800 transition flex items-center gap-1"
            title="Collapse Sidebar (Ctrl + B)"
            aria-label="Collapse Sidebar"
          >
            <PanelLeftClose className="w-4 h-4 text-sage-600 dark:text-sage-400" />
          </button>
        </div>

        {/* Scrollable Navigation Sections */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          {navSections.map((sec) => (
            <div key={sec.title} className="space-y-1">
              <div className="flex items-center justify-between px-3 py-1">
                <span className="text-[10px] uppercase font-bold tracking-wider text-ink-700/60 dark:text-linen-200/50">
                  {sec.title}
                </span>
                {sec.badge && (
                  <span className="text-[9px] bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold px-1.5 py-0.2 rounded font-mono">
                    {sec.badge}
                  </span>
                )}
              </div>

              <div className="space-y-0.5">
                {sec.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => {
                        // On small mobile screens auto-close, on desktop leave open unless user toggled
                        if (window.innerWidth < 1024) {
                          onClose();
                        }
                      }}
                      className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition group ${
                        isActive
                          ? 'bg-sage-500 text-white font-bold shadow-soft'
                          : item.highlight
                          ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 hover:bg-amber-100 border border-amber-200/60 dark:border-amber-900/60'
                          : 'text-ink-800 dark:text-linen-200 hover:bg-sage-100/60 dark:hover:bg-ink-800'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : item.highlight ? 'text-amber-600' : 'text-sage-600 dark:text-sage-400'}`} />
                        <span className="truncate">{item.name}</span>
                      </div>
                      {isActive && <ChevronRight className="w-3.5 h-3.5 shrink-0" />}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Streak & Wellness Footer */}
        <div className="p-3.5 border-t border-sage-200/60 dark:border-ink-800 bg-linen-100/50 dark:bg-ink-900/50 shrink-0">
          <div className="flex items-center justify-between p-2.5 rounded-2xl bg-white dark:bg-ink-800 border border-sage-200/70 dark:border-ink-700 shadow-soft">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-600 flex items-center justify-center font-bold">
                <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              </div>
              <div>
                <span className="text-xs font-bold text-ink-900 dark:text-linen-100 block leading-tight">
                  {currentStreak}d Streak
                </span>
                <span className="text-[9px] text-teal-600 dark:text-teal-400 font-medium">
                  {freezeTokens} Freezes Protected
                </span>
              </div>
            </div>
            <Link
              to="/global-dashboard"
              onClick={() => {
                if (window.innerWidth < 1024) onClose();
              }}
              className="text-[10px] font-bold text-sage-600 dark:text-sage-400 hover:underline"
            >
              View Stats →
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
};
