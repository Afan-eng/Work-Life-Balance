import React, { useState } from 'react';
import { Users, MessageSquare, ThumbsUp, Plus, Sparkles, X, CheckCircle2, Heart } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useStreak } from '../contexts/StreakContext';

interface Post {
  id: string;
  author: string;
  avatar: string;
  role: string;
  category: 'Grounding' | 'Deep Work' | 'Habit Wins' | 'Questions';
  title: string;
  body: string;
  upvotes: number;
  repliesCount: number;
  createdAt: string;
  hasUpvoted?: boolean;
}

const INITIAL_POSTS: Post[] = [
  {
    id: 'post_1',
    author: 'Elena Vance',
    avatar: '/assets/images/hero-focus.jpg',
    role: 'Studio Founder',
    category: 'Grounding',
    title: 'The "Two-Sigh Rule" before opening your inbox in the morning',
    body: 'Whenever I sit at my desk, before opening my email client or Slack, I practice two physiological sighs (double inhale, long mouth exhale). It prevents that automatic spike in cortisol. Anyone else tried this?',
    upvotes: 48,
    repliesCount: 14,
    createdAt: '2 hours ago',
  },
  {
    id: 'post_2',
    author: 'David Okafor',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    role: 'Engineering Lead',
    category: 'Habit Wins',
    title: 'Hit 21 days on the Phone-Free Bedroom habit! Here is what shifted',
    body: 'First 4 days were genuinely uncomfortable—I kept reflexively reaching for my nightstand. By day 10, my sleep latency dropped to under 15 minutes. Waking up feels peaceful instead of frantic.',
    upvotes: 62,
    repliesCount: 22,
    createdAt: '5 hours ago',
  },
  {
    id: 'post_3',
    author: 'Maya Lin',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    role: 'Product Designer',
    category: 'Deep Work',
    title: 'How do you protect your 90-minute Ultradian focus from urgent Slack pings?',
    body: 'I struggle with asynchronous boundaries. Colleagues mark things as urgent when they are merely convenient. What status messages or expectations have worked for you?',
    upvotes: 35,
    repliesCount: 19,
    createdAt: '1 day ago',
  },
];

export const Community: React.FC = () => {
  const { profile } = useAuth();
  const { recordActivity } = useStreak();

  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [selectedCat, setSelectedCat] = useState<string>('All');
  const [isNewPostModalOpen, setIsNewPostModalOpen] = useState(false);

  // New post fields
  const [newTitle, setNewTitle] = useState('');
  const [newBody, setNewBody] = useState('');
  const [newCat, setNewCat] = useState<'Grounding' | 'Deep Work' | 'Habit Wins' | 'Questions'>('Grounding');

  const handleUpvote = (id: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id === id) {
        const nextUpvoted = !p.hasUpvoted;
        return {
          ...p,
          upvotes: nextUpvoted ? p.upvotes + 1 : p.upvotes - 1,
          hasUpvoted: nextUpvoted,
        };
      }
      return p;
    }));
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newBody.trim()) return;

    const newPost: Post = {
      id: `p_${Date.now()}`,
      author: profile?.fullName || 'Mindful Seeker',
      avatar: profile?.avatarUrl || '/assets/images/hero-focus.jpg',
      role: 'Community Member',
      category: newCat,
      title: newTitle.trim(),
      body: newBody.trim(),
      upvotes: 1,
      repliesCount: 0,
      createdAt: 'Just now',
      hasUpvoted: true,
    };

    setPosts([newPost, ...posts]);
    recordActivity('habit', `Posted in Community: ${newTitle.substring(0, 20)}...`);
    setNewTitle('');
    setNewBody('');
    setIsNewPostModalOpen(false);
  };

  const filtered = selectedCat === 'All'
    ? posts
    : posts.filter(p => p.category === selectedCat);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sage-100 dark:bg-sage-950/60 text-sage-700 dark:text-sage-300 text-xs font-semibold mb-2">
            <Users className="w-3.5 h-3.5" />
            <span>Supportive Sanctuary Circle</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-ink-900 dark:text-linen-100">
            Community Discussions
          </h1>
          <p className="text-xs sm:text-sm text-ink-700/70 dark:text-linen-200/70 mt-1">
            Exchange authentic habit experiments, somatic wins, and question prompts with fellow explorers.
          </p>
        </div>

        <button
          onClick={() => setIsNewPostModalOpen(true)}
          className="px-5 py-2.5 rounded-2xl bg-sage-500 hover:bg-sage-600 text-white text-xs font-bold shadow-soft transition flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Start Discussion</span>
        </button>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {['All', 'Grounding', 'Deep Work', 'Habit Wins', 'Questions'].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCat(cat)}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              selectedCat === cat
                ? 'bg-sage-500 text-white shadow-soft'
                : 'bg-linen-100 dark:bg-ink-800 text-ink-800 dark:text-linen-200 border border-sage-200/60 hover:bg-sage-100'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Posts List */}
      <div className="space-y-4">
        {filtered.map((post) => (
          <div
            key={post.id}
            className="glass-card rounded-3xl p-6 sm:p-7 shadow-soft border border-sage-200/80 dark:border-ink-700 space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={post.avatar}
                  alt={post.author}
                  className="w-10 h-10 rounded-2xl object-cover ring-2 ring-sage-400/30"
                />
                <div>
                  <h4 className="font-heading font-bold text-xs sm:text-sm text-ink-900 dark:text-linen-100">
                    {post.author}
                  </h4>
                  <p className="text-[10px] text-ink-700/60 dark:text-linen-200/60">
                    {post.role} • {post.createdAt}
                  </p>
                </div>
              </div>

              <span className="px-2.5 py-0.5 rounded-full bg-sage-100 dark:bg-sage-950 text-sage-700 dark:text-sage-300 text-[10px] font-bold uppercase">
                {post.category}
              </span>
            </div>

            <div>
              <h3 className="font-heading font-bold text-base text-ink-900 dark:text-linen-100 mb-2 leading-snug">
                {post.title}
              </h3>
              <p className="text-xs sm:text-sm text-ink-700/80 dark:text-linen-200/80 leading-relaxed">
                {post.body}
              </p>
            </div>

            <div className="pt-3 border-t border-sage-100 dark:border-ink-800 flex items-center justify-between text-xs">
              <button
                onClick={() => handleUpvote(post.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition ${
                  post.hasUpvoted
                    ? 'bg-emerald-50 dark:bg-emerald-950 border-emerald-300 text-emerald-700 dark:text-emerald-300 font-bold'
                    : 'border-sage-200 dark:border-ink-700 hover:bg-linen-100 text-ink-700 dark:text-linen-200'
                }`}
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>{post.upvotes} Applaud</span>
              </button>

              <div className="flex items-center gap-1 text-ink-700/60 dark:text-linen-200/60">
                <MessageSquare className="w-3.5 h-3.5" />
                <span>{post.repliesCount} Reflections</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* New Post Modal */}
      {isNewPostModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-ink-900 border border-sage-200 dark:border-ink-700 rounded-3xl p-6 sm:p-7 shadow-lift relative">
            <button
              onClick={() => setIsNewPostModalOpen(false)}
              className="absolute top-5 right-5 p-2 text-ink-700/60 hover:text-ink-900 dark:text-linen-200/60 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold font-heading text-ink-900 dark:text-linen-100 mb-4">
              Start Community Discussion
            </h3>

            <form onSubmit={handleCreatePost} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1 text-ink-800 dark:text-linen-200">
                  Topic Category
                </label>
                <select
                  value={newCat}
                  onChange={(e: any) => setNewCat(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-linen-50 dark:bg-ink-800 border border-sage-200 dark:border-ink-700 rounded-xl text-sm text-ink-900 dark:text-linen-100 focus:outline-none focus:ring-2 focus:ring-sage-500"
                >
                  <option value="Grounding">Grounding & Somatic</option>
                  <option value="Deep Work">Deep Work & Focus</option>
                  <option value="Habit Wins">Habit Wins & Milestones</option>
                  <option value="Questions">Questions for Facilitators</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-ink-800 dark:text-linen-200">
                  Title
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. My experience with midday nature walks..."
                  className="w-full px-3.5 py-2.5 bg-linen-50 dark:bg-ink-800 border border-sage-200 dark:border-ink-700 rounded-xl text-sm text-ink-900 dark:text-linen-100 focus:outline-none focus:ring-2 focus:ring-sage-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-ink-800 dark:text-linen-200">
                  Reflection Details
                </label>
                <textarea
                  required
                  rows={4}
                  value={newBody}
                  onChange={(e) => setNewBody(e.target.value)}
                  placeholder="Share context, personal feelings, questions for the circle..."
                  className="w-full p-3.5 bg-linen-50 dark:bg-ink-800 border border-sage-200 dark:border-ink-700 rounded-xl text-sm text-ink-900 dark:text-linen-100 focus:outline-none focus:ring-2 focus:ring-sage-500 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-sage-500 hover:bg-sage-600 text-white font-bold rounded-xl text-sm shadow-soft transition"
              >
                Publish to Community
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
