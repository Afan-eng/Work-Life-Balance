import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Sparkles, Send, ShieldCheck, PhoneCall, ArrowUpRight } from 'lucide-react';
import { sendContactInquiryViaN8n } from '../lib/n8n';

export const Footer: React.FC = () => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    await sendContactInquiryViaN8n({
      name: 'Newsletter Subscriber',
      email: newsletterEmail,
      category: 'Newsletter Subscription',
      message: 'Subscribed to weekly mindful dispatch.',
    });
    setSubscribed(true);
    setNewsletterEmail('');
  };

  return (
    <footer className="bg-linen-200/60 dark:bg-ink-950 border-t border-sage-200/70 dark:border-ink-800 text-ink-800 dark:text-linen-200 transition-colors">
      {/* 24/7 Crisis Support Bar */}
      <div className="bg-sage-600 text-white px-4 py-2.5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <PhoneCall className="w-4 h-4 shrink-0 text-warmAmber-300" />
            <span className="font-semibold">Need urgent emotional support?</span>
            <span className="hidden md:inline text-white/80">You are never alone. Confidential crisis resources are available 24/7.</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-mono bg-white/20 px-2 py-0.5 rounded font-bold">Call / Text 988 (Lifeline)</span>
            <Link to="/contact" className="underline hover:text-warmAmber-200 flex items-center gap-0.5 font-medium">
              View International Lines <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-sage-500 to-sage-700 flex items-center justify-center text-white shadow-soft">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="font-heading font-extrabold text-2xl tracking-tight text-ink-900 dark:text-linen-100">
                Balance <span className="font-light text-sage-600 dark:text-sage-400">Studio</span>
              </span>
            </Link>
            <p className="text-sm text-ink-700/80 dark:text-linen-200/70 leading-relaxed max-w-sm">
              A community engagement & holistic life-in-balance platform engineered for serene focus, somatic grounding, habit consistency, and human connection.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs text-ink-700/60 dark:text-linen-200/60">
              <ShieldCheck className="w-4 h-4 text-sage-500" />
              <span>Built on Supabase Auth, n8n Automation & Cloudinary</span>
            </div>
          </div>

          {/* Pillars Links */}
          <div className="space-y-3">
            <h4 className="font-heading font-bold text-sm text-ink-900 dark:text-linen-100 uppercase tracking-wider">
              Wellness Pillars
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/mental-wellness" className="hover:text-sage-600 dark:hover:text-sage-400 transition">
                  Mental Wellness & Reset
                </Link>
              </li>
              <li>
                <Link to="/productivity" className="hover:text-sage-600 dark:hover:text-sage-400 transition">
                  Mindful Productivity
                </Link>
              </li>
              <li>
                <Link to="/physical-health" className="hover:text-sage-600 dark:hover:text-sage-400 transition">
                  Physical Health & Movement
                </Link>
              </li>
              <li>
                <Link to="/digital-wellbeing" className="hover:text-sage-600 dark:hover:text-sage-400 transition">
                  Digital Wellbeing & Screen Hygiene
                </Link>
              </li>
              <li>
                <Link to="/challenges" className="hover:text-sage-600 dark:hover:text-sage-400 transition font-bold text-sage-600 dark:text-sage-300">
                  21-Day Habit Challenge
                </Link>
              </li>
            </ul>
          </div>

          {/* Trackers & Explore */}
          <div className="space-y-3">
            <h4 className="font-heading font-bold text-sm text-ink-900 dark:text-linen-100 uppercase tracking-wider">
              Trackers & Content
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/dashboard" className="hover:text-sage-600 dark:hover:text-sage-400 transition">
                  Global Dashboard
                </Link>
              </li>
              <li>
                <Link to="/mood-tracker" className="hover:text-sage-600 dark:hover:text-sage-400 transition">
                  Mood Selector & Journal
                </Link>
              </li>
              <li>
                <Link to="/habit-tracker" className="hover:text-sage-600 dark:hover:text-sage-400 transition">
                  Habit Consistency Matrix
                </Link>
              </li>
              <li>
                <Link to="/health-tracker" className="hover:text-sage-600 dark:hover:text-sage-400 transition">
                  Pomodoro & BreathBox
                </Link>
              </li>
              <li>
                <Link to="/podcasts" className="hover:text-sage-600 dark:hover:text-sage-400 transition">
                  Audio Podcasts & Scrubber
                </Link>
              </li>
              <li>
                <Link to="/videos" className="hover:text-sage-600 dark:hover:text-sage-400 transition">
                  Masterclass Videos
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Box */}
          <div className="space-y-3">
            <h4 className="font-heading font-bold text-sm text-ink-900 dark:text-linen-100 uppercase tracking-wider">
              Weekly Sanctuary
            </h4>
            <p className="text-xs text-ink-700/70 dark:text-linen-200/70">
              One calming reflection, science-backed habit prompt, and community meetup invitation every Sunday.
            </p>
            {subscribed ? (
              <div className="p-3 bg-sage-100 dark:bg-sage-950/60 rounded-xl text-xs text-sage-700 dark:text-sage-300 font-semibold flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-sage-500" />
                <span>You're on the sanctuary list. Welcome!</span>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-3 py-2 bg-white dark:bg-ink-900 border border-sage-200 dark:border-ink-700 rounded-xl text-xs text-ink-900 dark:text-linen-100 focus:outline-none focus:ring-2 focus:ring-sage-500"
                  />
                  <button
                    type="submit"
                    className="absolute right-1 top-1 bottom-1 px-3 bg-sage-500 hover:bg-sage-600 text-white rounded-lg flex items-center justify-center transition"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Legal & Copyright */}
        <div className="mt-12 pt-6 border-t border-sage-200/60 dark:border-ink-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-ink-700/60 dark:text-linen-200/60">
          <p>© {new Date().getFullYear()} Balance Studio Inc. Life works better in balance.</p>
          <div className="flex items-center gap-4">
            <Link to="/about" className="hover:underline">About</Link>
            <Link to="/privacy" className="hover:underline">Privacy Policy</Link>
            <Link to="/terms" className="hover:underline">Terms of Service</Link>
            <Link to="/accessibility" className="hover:underline">Accessibility</Link>
            <Link to="/contact" className="hover:underline">Help & FAQ</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
