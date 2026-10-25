import React, { useState } from 'react';
import { Search, BookOpen, Clock, User, Tag, ArrowRight, X, Sparkles, Share2 } from 'lucide-react';

interface ArticleItem {
  id: string;
  title: string;
  category: string;
  readTime: string;
  author: string;
  authorRole: string;
  image: string;
  snippet: string;
  fullContent: string[];
}

const ARTICLES: ArticleItem[] = [
  {
    id: 'burnout-vs-stress',
    title: 'Burnout vs. Stress: The Neurobiology of Modern Overload',
    category: 'Mental Wellness',
    readTime: '6 min read',
    author: 'Dr. Soraya Kim, MD',
    authorRole: 'Integrative Neuroscientist',
    image: '/assets/images/outdoor-reset.jpg',
    snippet: 'Learn how chronic cortisol spikes decouple high performance from emotional safety—and three biological levers to reset.',
    fullContent: [
      'Stress is characterized by over-engagement. When we are stressed, our sympathetic nervous system operates in overdrive: adrenaline surges, our heart rate elevates, and our attention narrows onto immediate emergencies. In stress, there is still hope: the underlying belief that if we can just get through this week, relief will come.',
      'Burnout, conversely, is characterized by disengagement and emotional exhaustion. In full burnout, the adrenal cortex down-regulates cortisol receptors to protect organs from continuous toxicity. The result is a profound emotional flatline: chronic cynicism, depersonalization, and the chilling sensation that no amount of sleep restores your vitality.',
      'To reverse burnout, standard productivity tips (like making a tighter to-do list) actively backfire. The nervous system requires somatic safety signals: extended periods of unhurried peripheral vision, non-transactional human connection, circadian sun exposure, and completely unplugged rest cycles.',
      'Begin today by identifying one boundary you will defend tonight. Put away screens at 9:00 PM, drink mineral-rich water, and practice 60 seconds of gentle box breathing.',
    ],
  },
  {
    id: 'chronotype-focus',
    title: 'The Ultradian Rhythm: Why 90-Minute Sprints Dominate 8-Hour Grinds',
    category: 'Productivity',
    readTime: '5 min read',
    author: 'Marcus Vance',
    authorRole: 'Peak Performance Coach',
    image: '/assets/images/hero-focus.jpg',
    snippet: 'Harness your body natural energy crests and valleys to double cognitive yield while banishing 3 PM exhaustion.',
    fullContent: [
      'During sleep, our brains cycle through 90-minute REM and non-REM stages. What sleep researcher Nathaniel Kleitman discovered is that this 90-minute basic rest-activity cycle (BRAC) continues uninterrupted throughout our waking hours.',
      'For approximately 90 minutes, our prefrontal cortex operates at peak neurochemical efficiency. Dopamine and acetylcholine enable deep monotasking focus. After 90 minutes, our glycogen stores deplete and beta-wave fatigue sets in.',
      'If you push through this trough with artificial stimulants, you trigger compensatory adrenaline spikes. If instead you step away for 15 minutes of somatic rest, your brain replenishes its neurotransmitters, allowing you to launch a second clean focus sprint.',
    ],
  },
  {
    id: 'mindful-nutrition',
    title: 'Gut-Brain Harmony: Somatic Nutrition for Nervous System Restoration',
    category: 'Physical Health',
    readTime: '7 min read',
    author: 'Chef Amina Noor',
    authorRole: 'Holistic Nutritionist & Chef',
    image: '/assets/images/nutrition-mindful.jpg',
    snippet: 'Explore how whole ancestral foods, slow chewing, and vagal tone regulate mood and systemic inflammation.',
    fullContent: [
      'Over 90% of your body serotonin and 50% of its dopamine are synthesized along the enteric nervous system in the gut lining.',
      'Eating in a state of sympathetic fight-or-flight (such as eating lunch while answering urgent emails) inhibits stomach acid secretion and digestive enzyme output, leading to systemic endotoxemia and neuroinflammation.',
      'Transform eating into a sacred grounding ritual: chew each bite 20 times, enjoy foods rich in prebiotic fiber and polyphenol antioxidants, and sit in gratitude for 5 minutes after finishing.',
    ],
  },
  {
    id: 'digital-sovereignty',
    title: 'Reclaiming Your Attention Span: The 3-Step Notification Detox',
    category: 'Digital Wellbeing',
    readTime: '4 min read',
    author: 'Elena Vance',
    authorRole: 'Founder of Balance Studio',
    image: '/assets/images/serenity-work-banner.jpg',
    snippet: 'How subtle interface changes and phone-free bedrooms restore deep presence in an era of engineered distraction.',
    fullContent: [
      'Every ping, buzz, and red notification badge is intentionally engineered to hijack the orienting reflex of our mammalian brain.',
      'When your attention is fractured every 6 minutes, your prefrontal cortex never attains the alpha-theta state necessary for high-level creative synthesis.',
      'By turning your screen greyscale, silencing all non-human notifications, and keeping your smartphone out of arm reach during restorative sleep, you reclaim hundreds of hours of mental peace.',
    ],
  },
];

export const Articles: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeArticle, setActiveArticle] = useState<ArticleItem | null>(null);

  const filtered = ARTICLES.filter((art) => {
    const matchesSearch = art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.snippet.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'All' || art.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sage-100 dark:bg-sage-950/60 text-sage-700 dark:text-sage-300 text-xs font-semibold">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Evidence-Based Wisdom</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-ink-900 dark:text-linen-100">
          Editorial Sanctuary
        </h1>
        <p className="text-xs sm:text-sm text-ink-700/70 dark:text-linen-200/70">
          In-depth essays, neuroscience breakdowns, and practical rituals for living and working in sustainable balance.
        </p>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-ink-700/40 dark:text-linen-200/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search articles, authors, topics..."
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-ink-900 border border-sage-200 dark:border-ink-700 rounded-2xl text-xs sm:text-sm text-ink-900 dark:text-linen-100 focus:outline-none focus:ring-2 focus:ring-sage-500 shadow-soft"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 scrollbar-none">
          {['All', 'Mental Wellness', 'Productivity', 'Physical Health', 'Digital Wellbeing'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-sage-500 text-white shadow-soft'
                  : 'bg-linen-100 dark:bg-ink-800 text-ink-800 dark:text-linen-200 border border-sage-200/60 dark:border-ink-700 hover:bg-sage-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((art) => (
          <div
            key={art.id}
            onClick={() => setActiveArticle(art)}
            className="glass-card rounded-3xl overflow-hidden shadow-soft hover:shadow-lift border border-sage-200/80 dark:border-ink-700 cursor-pointer group transition flex flex-col justify-between"
          >
            <div>
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
              <div className="p-6">
                <div className="flex items-center gap-2 text-[11px] text-ink-700/60 dark:text-linen-200/60 mb-2">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{art.readTime}</span>
                  <span>•</span>
                  <span>{art.author}</span>
                </div>
                <h3 className="font-heading font-bold text-base text-ink-900 dark:text-linen-100 group-hover:text-sage-600 transition leading-snug">
                  {art.title}
                </h3>
                <p className="text-xs text-ink-700/70 dark:text-linen-200/70 mt-2 line-clamp-3">
                  {art.snippet}
                </p>
              </div>
            </div>

            <div className="p-6 pt-0 border-t border-sage-100/60 dark:border-ink-800 mt-4 flex items-center justify-between text-xs font-bold text-sage-600 dark:text-sage-400">
              <span>Read Full Essay</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>

      {/* Modal Article Reader */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-950/70 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-2xl max-h-[90vh] bg-white dark:bg-ink-900 border border-sage-200 dark:border-ink-700 rounded-3xl shadow-lift overflow-hidden flex flex-col">
            <div className="relative h-60 shrink-0">
              <img
                src={activeArticle.image}
                alt={activeArticle.title}
                className="w-full h-full object-cover brightness-[0.7]"
              />
              <button
                onClick={() => setActiveArticle(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-ink-900/60 text-white hover:bg-ink-900 transition"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-4 left-6 right-6 text-white">
                <span className="px-2.5 py-0.5 rounded-full bg-sage-500 text-[10px] font-bold uppercase mb-2 inline-block">
                  {activeArticle.category}
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold font-heading leading-tight">
                  {activeArticle.title}
                </h2>
              </div>
            </div>

            <div className="p-6 sm:p-8 overflow-y-auto space-y-4">
              <div className="flex items-center justify-between text-xs text-ink-700/60 dark:text-linen-200/60 pb-3 border-b border-sage-100 dark:border-ink-800">
                <div>
                  <span className="font-bold text-ink-900 dark:text-linen-100">{activeArticle.author}</span>
                  <span className="block text-[10px]">{activeArticle.authorRole}</span>
                </div>
                <span>{activeArticle.readTime}</span>
              </div>

              {activeArticle.fullContent.map((p, idx) => (
                <p key={idx} className="text-xs sm:text-sm text-ink-800/90 dark:text-linen-200/90 leading-relaxed">
                  {p}
                </p>
              ))}

              <div className="mt-8 pt-4 border-t border-sage-100 dark:border-ink-800 flex items-center justify-between">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    alert('Article link copied to clipboard!');
                  }}
                  className="px-4 py-2 rounded-xl bg-linen-100 dark:bg-ink-800 text-xs font-bold text-ink-800 dark:text-linen-200 flex items-center gap-1.5"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share Article</span>
                </button>
                <button
                  onClick={() => setActiveArticle(null)}
                  className="px-5 py-2 rounded-xl bg-sage-500 hover:bg-sage-600 text-white text-xs font-bold transition"
                >
                  Done Reading
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
