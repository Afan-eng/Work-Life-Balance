import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, ArrowRight, Flame, Heart, BookOpen, Calendar, 
  Users, ChevronDown, CheckCircle2, ShieldCheck, Play, Award, 
  Compass, Clock, HelpCircle, Star, Quote, Headphones, Video
} from 'lucide-react';
import { StreakCard } from '../components/StreakCard';
import { PersonalBalanceHub } from '../components/PersonalBalanceHub';
import { QuickBreathModal } from '../components/QuickBreathModal';
import { openRazorpayCheckout } from '../lib/razorpay';
import { useAuth } from '../contexts/AuthContext';

export const Home: React.FC = () => {
  const { user, profile, openAuthModal } = useAuth();
  const [isBreathModalOpen, setIsBreathModalOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  // Dynamic current date for CTA e.g., "Start October 25 Reset"
  const now = new Date();
  const monthName = now.toLocaleString('default', { month: 'long' });
  const dayNumber = now.getDate();
  const resetCtaText = `Start ${monthName} ${dayNumber} Reset`;

  // Featured Articles
  const featuredArticles = [
    {
      id: 'burnout-vs-stress',
      title: 'Burnout vs. Stress: The Neurobiology of Modern Overload',
      category: 'Mental Wellness',
      readTime: '6 min read',
      author: 'Dr. Soraya Kim, MD',
      image: '/assets/images/outdoor-reset.jpg',
      snippet: 'Learn how chronic cortisol spikes decouple high performance from emotional safety—and three biological levers to reset.',
    },
    {
      id: 'chronotype-focus',
      title: 'The Ultradian Rhythm: Why 90-Minute Sprints Dominate 8-Hour Grinds',
      category: 'Mindful Productivity',
      readTime: '5 min read',
      author: 'Marcus Vance',
      image: '/assets/images/hero-focus.jpg',
      snippet: 'Harness your body natural energy crests and valleys to double cognitive yield while banishing 3 PM exhaustion.',
    },
    {
      id: 'mindful-nutrition',
      title: 'Gut-Brain Harmony: Somatic Nutrition for Nervous System Restoration',
      category: 'Physical Health',
      readTime: '7 min read',
      author: 'Chef Amina Noor',
      image: '/assets/images/nutrition-mindful.jpg',
      snippet: 'Explore how whole ancestral foods, slow chewing, and vagal tone regulate mood and systemic inflammation.',
    },
  ];

  // Weekly Events
  const upcomingEvents = [
    {
      id: 'evt_1',
      title: 'Somatic Breathwork & Deep Nervous System Release',
      date: 'This Thursday • 7:00 PM EST',
      host: 'Elena Vance & Dr. Soraya',
      price: 499,
      currency: 'INR',
      spotsLeft: 4,
      image: '/assets/images/outdoor-reset.jpg',
    },
    {
      id: 'evt_2',
      title: 'Digital Minimalism: The 7-Day Screen Time Audit Masterclass',
      date: 'Saturday • 11:00 AM EST',
      host: 'Marcus Vance',
      price: 699,
      currency: 'INR',
      spotsLeft: 8,
      image: '/assets/images/serenity-work-banner.jpg',
    },
    {
      id: 'evt_3',
      title: 'Communal Dinner & Grounding Circle',
      date: 'Sunday • 6:00 PM EST',
      host: 'Chef Amina & Community',
      price: 299,
      currency: 'INR',
      spotsLeft: 12,
      image: '/assets/images/community-family.jpg',
    },
  ];

  // Testimonials
  const testimonials = [
    {
      name: 'Dr. Aris Thorne',
      role: 'Emergency Physician',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      quote: 'Balance Compass transformed how I transition out of intense 12-hour hospital shifts. The Box Breathing and Feeling Picker are now non-negotiable anchors in my day.',
    },
    {
      name: 'Maya Lin',
      role: 'Staff Product Designer',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      quote: 'The 21-Day Habit Challenge helped me reclaim my mornings from phone notifications. The community discussions feel like an honest breath of fresh air.',
    },
    {
      name: 'David Okafor',
      role: 'Founder & Engineering Leader',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
      quote: 'I used to wear burnout like a badge of honor. Tracking my Ultradian energy rhythms in the Global Dashboard showed me that rest is actually the highest leverage work.',
    },
  ];

  // FAQ Items
  const faqs = [
    {
      q: 'How does Balance Compass differ from standard productivity tools?',
      a: 'Most productivity apps focus on cramming more tasks into less time. Balance Compass is engineered around somatic calibration, nervous system regulation, and sustainable human rhythms. We measure energy and restorative recovery alongside habit completion.',
    },
    {
      q: 'Is n8n required to use Balance Compass?',
      a: 'No. Supabase handles accounts, private tracker data, and streak verification. n8n is an optional tool for connecting additional automations or external services.',
    },
    {
      q: 'Are my reflections and mood logs private?',
      a: 'Yes. All data stored in Supabase is strictly protected by PostgreSQL Row Level Security (RLS) policies tied to your cryptographic user UUID. Nobody else in the studio can access your private journals.',
    },
    {
      q: 'Can I use the trackers without an account?',
      a: 'Public articles and media are open to explore. Sign in before using personal trackers so your entries and streak history are attached to your account.',
    },
    {
      q: 'How does the Razorpay checkout integration operate?',
      a: 'Payments require a trusted server-side order and signature-verification endpoint. That backend can use a Supabase Edge Function, your own server, or an optional n8n workflow; a browser message alone never confirms payment.',
    },
  ];

  const handleBookWorkshop = (eventItem: typeof upcomingEvents[0]) => {
    openRazorpayCheckout({
      amount: eventItem.price,
      currency: eventItem.currency,
      itemName: eventItem.title,
      itemType: 'workshop_pass',
      userEmail: profile?.email || 'guest@balance.studio',
      userName: profile?.fullName || 'Valued Member',
      onSuccess: (res) => {
        alert(`Pass confirmed! Razorpay ID: ${res.paymentId}. You are registered for "${eventItem.title}".`);
      },
    });
  };

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      {/* 1. HERO BANNER SECTION */}
      <section className="relative min-h-[580px] lg:min-h-[660px] flex items-center justify-center overflow-hidden rounded-b-[2.5rem] sm:rounded-b-[3.5rem] shadow-lift">
        {/* Immersive Photography Background */}
        <img
          src="/assets/images/hero-focus.jpg"
          alt="Serene mindful workspace with houseplants"
          className="absolute inset-0 w-full h-full object-cover object-center scale-105 filter brightness-[0.85] contrast-[1.05]"
        />

        {/* Ink Gradient Overlay with botanical warmth */}
        <div className="absolute inset-0 bg-gradient-to-r from-ink-950/90 via-ink-900/80 to-ink-950/60 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950/95 via-transparent to-ink-950/40" />

        {/* Ambient botanical floating glow */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-sage-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center text-white space-y-7">
          {/* Top Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold tracking-wide text-sage-200 shadow-soft">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Community Engagement & Life-in-Balance Platform</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold font-heading tracking-tight leading-[1.1] max-w-4xl mx-auto text-balance">
            Life works better in{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sage-300 via-emerald-200 to-warmAmber-200">
              balance.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-xl text-linen-200/90 max-w-2xl mx-auto font-light leading-relaxed">
            Reclaim your calm, synchronize your daily habits, and restore your nervous system in a mindful digital sanctuary.
          </p>

          {/* Dual CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-3">
            <button
              onClick={() => user ? setIsBreathModalOpen(true) : openAuthModal('login')}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-sage-500 to-sage-600 hover:from-sage-600 hover:to-sage-700 text-white font-heading font-bold text-sm tracking-wide shadow-lift hover:scale-105 transition flex items-center justify-center gap-2.5 group"
            >
              <Sparkles className="w-4 h-4 text-warmAmber-300 group-hover:rotate-12 transition-transform" />
              <span>{resetCtaText}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <Link
              to="/community"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/25 text-white font-heading font-bold text-sm tracking-wide shadow-soft transition flex items-center justify-center gap-2"
            >
              <Users className="w-4 h-4 text-sage-300" />
              <span>Join Community</span>
            </Link>
          </div>

          {/* Micro trust stats */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-6 sm:gap-12 text-xs text-linen-300/80 border-t border-white/10 max-w-2xl mx-auto">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Account-based tracker privacy</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Streaks lock at local midnight</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Curated wellness library</span>
            </div>
          </div>
        </div>
      </section>

      {/* Personal tracker activity is private to signed-in accounts. */}
      {user ? <>
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 sm:-mt-14 relative z-20"><StreakCard /></section>
        <PersonalBalanceHub />
      </> : <section className="mx-auto -mt-10 w-[calc(100%-2rem)] max-w-5xl rounded-3xl border border-white/30 bg-white/95 p-6 text-center shadow-lift backdrop-blur-xl dark:border-ink-700 dark:bg-ink-900 sm:p-8"><div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"><Flame className="h-6 w-6"/></div><h2 className="mt-4 font-heading text-xl font-extrabold text-ink-900 dark:text-linen-100">Build a streak that’s yours.</h2><p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-ink-700/70 dark:text-linen-200/70">Sign in to use your private wellness trackers and earn contribution days. Your day is verified when your local calendar reaches midnight.</p><button onClick={() => openAuthModal('login')} className="mt-5 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-800">Sign in or create account</button></section>}

      {/* 4. FEATURED WELLNESS PILLARS TEASER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="text-xs font-bold font-heading uppercase tracking-widest text-sage-600 dark:text-sage-400">
            Four Core Pillars
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-ink-900 dark:text-linen-100">
            Engineered for the Whole Human
          </h2>
          <p className="text-sm text-ink-700/70 dark:text-linen-200/70">
            Explore dedicated spaces crafted to support cognitive clarity, energetic resilience, somatic vitality, and healthy tech boundaries.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Mental Wellness */}
          <Link
            to="/mental-wellness"
            className="group glass-card rounded-3xl p-6 shadow-soft hover:shadow-lift border border-sage-200/70 dark:border-ink-700 transition flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-300 flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition-transform">
                🧠
              </div>
              <h3 className="font-heading font-bold text-lg text-ink-900 dark:text-linen-100 group-hover:text-sage-600 transition">
                Mental Wellness
              </h3>
              <p className="text-xs text-ink-700/70 dark:text-linen-200/70 mt-2 leading-relaxed">
                5-minute reset protocols, nervous system grounding soundscapes, and stress relief guides.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-1 text-xs font-bold text-sage-600 dark:text-sage-400">
              <span>Explore Reset Protocol</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Productivity */}
          <Link
            to="/productivity"
            className="group glass-card rounded-3xl p-6 shadow-soft hover:shadow-lift border border-sage-200/70 dark:border-ink-700 transition flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-300 flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition-transform">
                ⚡
              </div>
              <h3 className="font-heading font-bold text-lg text-ink-900 dark:text-linen-100 group-hover:text-sage-600 transition">
                Mindful Productivity
              </h3>
              <p className="text-xs text-ink-700/70 dark:text-linen-200/70 mt-2 leading-relaxed">
                Chronotype energy timelines, 90-minute ultradian cycles, and single-tasking flow states.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-1 text-xs font-bold text-sage-600 dark:text-sage-400">
              <span>View Energy Timeline</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Physical Health */}
          <Link
            to="/physical-health"
            className="group glass-card rounded-3xl p-6 shadow-soft hover:shadow-lift border border-sage-200/70 dark:border-ink-700 transition flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-teal-100 dark:bg-teal-950/60 text-teal-600 dark:text-teal-300 flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition-transform">
                🌿
              </div>
              <h3 className="font-heading font-bold text-lg text-ink-900 dark:text-linen-100 group-hover:text-sage-600 transition">
                Physical Health
              </h3>
              <p className="text-xs text-ink-700/70 dark:text-linen-200/70 mt-2 leading-relaxed">
                Step checklists, ergonomic desk setups, spinal decompression, and circadian sun tracking.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-1 text-xs font-bold text-sage-600 dark:text-sage-400">
              <span>Check Movement Goals</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Digital Wellbeing */}
          <Link
            to="/digital-wellbeing"
            className="group glass-card rounded-3xl p-6 shadow-soft hover:shadow-lift border border-sage-200/70 dark:border-ink-700 transition flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300 flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition-transform">
                📱
              </div>
              <h3 className="font-heading font-bold text-lg text-ink-900 dark:text-linen-100 group-hover:text-sage-600 transition">
                Digital Wellbeing
              </h3>
              <p className="text-xs text-ink-700/70 dark:text-linen-200/70 mt-2 leading-relaxed">
                Screen time detox audits, notification hygiene rules, and evening boundary agreements.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-1 text-xs font-bold text-sage-600 dark:text-sage-400">
              <span>Audit Screen Hygiene</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </section>

      {/* 5. FEATURED ARTICLES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold font-heading uppercase tracking-widest text-sage-600 dark:text-sage-400">
              Editorial Sanctuary
            </span>
            <h2 className="text-3xl font-extrabold font-heading text-ink-900 dark:text-linen-100">
              Featured Articles & Insights
            </h2>
          </div>
          <Link
            to="/articles"
            className="text-xs font-bold text-sage-600 dark:text-sage-400 hover:underline flex items-center gap-1"
          >
            <span>View Full Article Library</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredArticles.map((art) => (
            <Link
              key={art.id}
              to={`/articles#${art.id}`}
              className="glass-card rounded-3xl overflow-hidden shadow-soft hover:shadow-lift border border-sage-200/70 dark:border-ink-700 group transition flex flex-col"
            >
              <div className="h-48 overflow-hidden relative">
                <img
                  src={art.image}
                  alt={art.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                <span className="absolute top-3 left-3 bg-white/90 dark:bg-ink-900/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-[10px] font-bold text-sage-700 dark:text-sage-300 uppercase">
                  {art.category}
                </span>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-[11px] text-ink-700/60 dark:text-linen-200/60 mb-2 font-medium">
                    <span>{art.readTime}</span>
                    <span>•</span>
                    <span>{art.author}</span>
                  </div>
                  <h3 className="font-heading font-bold text-base text-ink-900 dark:text-linen-100 group-hover:text-sage-600 transition leading-snug">
                    {art.title}
                  </h3>
                  <p className="text-xs text-ink-700/70 dark:text-linen-200/70 mt-2 line-clamp-2">
                    {art.snippet}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-sage-100 dark:border-ink-800 flex items-center justify-between text-xs font-bold text-sage-600 dark:text-sage-400">
                  <span>Read Article</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 5.5 AUDIO PODCASTS & VIDEO MASTERCLASSES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Podcasts Card Banner */}
          <div className="glass-card rounded-3xl p-7 sm:p-8 shadow-soft border border-sage-200/80 dark:border-ink-700 flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-36 h-36 bg-sage-400/10 rounded-full blur-2xl pointer-events-none" />
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="w-12 h-12 rounded-2xl bg-sage-100 dark:bg-sage-950/60 text-sage-600 dark:text-sage-300 flex items-center justify-center">
                  <Headphones className="w-6 h-6" />
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider text-sage-700 dark:text-sage-300 bg-sage-100 dark:bg-sage-950 px-2.5 py-1 rounded-full">
                  Audio Lounge • 4 Episodes
                </span>
              </div>
              <h3 className="font-heading font-extrabold text-2xl text-ink-900 dark:text-linen-100 group-hover:text-sage-600 transition">
                Balance Compass Podcasts
              </h3>
              <p className="text-xs sm:text-sm text-ink-700/70 dark:text-linen-200/70 leading-relaxed">
                Functional HTML5 audio player with scrubbers and volume controls. Tune in to conversations with integrative neuroscientists on somatic anchors, digital minimalism, and restorative sleep.
              </p>
            </div>
            <div className="pt-6 mt-4 border-t border-sage-100 dark:border-ink-800 flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-ink-700/60 dark:text-linen-200/60">
                Latest: Ep. 42 (30 mins)
              </span>
              <Link
                to="/podcasts"
                className="px-5 py-2.5 rounded-xl bg-sage-500 hover:bg-sage-600 text-white font-bold text-xs shadow-soft transition flex items-center gap-2"
              >
                <span>Listen to Podcasts</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Videos Card Banner */}
          <div className="glass-card rounded-3xl p-7 sm:p-8 shadow-soft border border-sage-200/80 dark:border-ink-700 flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-36 h-36 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-300 flex items-center justify-center">
                  <Video className="w-6 h-6" />
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-950 px-2.5 py-1 rounded-full">
                  Video Masterclasses
                </span>
              </div>
              <h3 className="font-heading font-extrabold text-2xl text-ink-900 dark:text-linen-100 group-hover:text-amber-600 transition">
                Masterclass Video Series
              </h3>
              <p className="text-xs sm:text-sm text-ink-700/70 dark:text-linen-200/70 leading-relaxed">
                Visual guided movement sessions, ergonomic workspace teardowns, and somatic breathwork tutorials featuring interactive modal video players and timestamps.
              </p>
            </div>
            <div className="pt-6 mt-4 border-t border-sage-100 dark:border-ink-800 flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-ink-700/60 dark:text-linen-200/60">
                Featured: Somatic Grounding (15m)
              </span>
              <Link
                to="/videos"
                className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-soft transition flex items-center gap-2"
              >
                <span>Watch Masterclasses</span>
                <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. WEEKLY WORKSHOPS & EVENTS WITH RAZORPAY CHECKOUT */}
      <section className="bg-linen-200/40 dark:bg-ink-900/40 py-16 border-y border-sage-200/60 dark:border-ink-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-bold font-heading uppercase tracking-widest text-sage-600 dark:text-sage-400">
                Live Experiences
              </span>
              <h2 className="text-3xl font-extrabold font-heading text-ink-900 dark:text-linen-100">
                Weekly Masterclasses & Circles
              </h2>
              <p className="text-xs text-ink-700/70 dark:text-linen-200/70 mt-1">
                Direct Razorpay pass checkout with instant calendar invite confirmation.
              </p>
            </div>
            <Link
              to="/events"
              className="text-xs font-bold text-sage-600 dark:text-sage-400 hover:underline flex items-center gap-1"
            >
              <span>Explore All Events</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {upcomingEvents.map((evt) => (
              <div
                key={evt.id}
                className="glass-card rounded-3xl overflow-hidden shadow-soft border border-sage-200/70 dark:border-ink-700 flex flex-col justify-between"
              >
                <div className="h-44 relative overflow-hidden">
                  <img
                    src={evt.image}
                    alt={evt.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3 bg-ink-900/80 backdrop-blur-sm text-white px-2.5 py-1 rounded-full text-[11px] font-bold">
                    ₹{evt.price}
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <span className="inline-block px-2.5 py-0.5 rounded-md bg-sage-100 dark:bg-sage-950 text-sage-700 dark:text-sage-300 text-[10px] font-bold uppercase mb-2">
                      {evt.date}
                    </span>
                    <h3 className="font-heading font-bold text-base text-ink-900 dark:text-linen-100 leading-snug">
                      {evt.title}
                    </h3>
                    <p className="text-xs text-ink-700/70 dark:text-linen-200/70 mt-1">
                      Guided by {evt.host}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-sage-100 dark:border-ink-800 flex items-center justify-between">
                    <span className="text-[11px] text-amber-600 dark:text-amber-400 font-bold">
                      🔥 Only {evt.spotsLeft} passes left
                    </span>
                    <button
                      onClick={() => handleBookWorkshop(evt)}
                      className="px-4 py-2 bg-sage-500 hover:bg-sage-600 text-white rounded-xl text-xs font-bold shadow-soft transition"
                    >
                      Book with Razorpay
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. COMMUNITY TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-bold font-heading uppercase tracking-widest text-sage-600 dark:text-sage-400">
            Sanctuary Voices
          </span>
          <h2 className="text-3xl font-extrabold font-heading text-ink-900 dark:text-linen-100">
            Real Stories of Renewal
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="glass-card rounded-3xl p-6 sm:p-7 shadow-soft border border-sage-200/70 dark:border-ink-700 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <Quote className="w-8 h-8 text-sage-300 dark:text-sage-700" />
                <p className="text-xs sm:text-sm text-ink-800/90 dark:text-linen-200/90 leading-relaxed italic">
                  "{t.quote}"
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-sage-100 dark:border-ink-800 flex items-center gap-3">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-sage-400/40"
                />
                <div>
                  <h4 className="font-heading font-bold text-xs text-ink-900 dark:text-linen-100">
                    {t.name}
                  </h4>
                  <p className="text-[11px] text-ink-700/60 dark:text-linen-200/60">
                    {t.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. FAQ ACCORDION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 space-y-2">
          <span className="text-xs font-bold font-heading uppercase tracking-widest text-sage-600 dark:text-sage-400">
            Clear Answers
          </span>
          <h2 className="text-3xl font-extrabold font-heading text-ink-900 dark:text-linen-100">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div
                key={idx}
                className="glass-card rounded-2xl border border-sage-200/70 dark:border-ink-700 overflow-hidden shadow-soft transition"
              >
                <button
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4"
                >
                  <span className="font-heading font-bold text-sm text-ink-900 dark:text-linen-100">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-sage-600 dark:text-sage-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs text-ink-700/80 dark:text-linen-200/80 leading-relaxed border-t border-sage-100/60 dark:border-ink-800 animate-in fade-in">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Quick Box Breathing Modal */}
      {user && <QuickBreathModal isOpen={isBreathModalOpen} onClose={() => setIsBreathModalOpen(false)} />}
    </div>
  );
};
