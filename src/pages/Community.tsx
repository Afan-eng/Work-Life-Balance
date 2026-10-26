import React, { useState, useEffect } from 'react';
import { Users, MessageSquare, ThumbsUp, Plus, Sparkles, X, CheckCircle2, Heart } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface Post {
  id: string;
  user_id: string;
  author_name: string;
  author_avatar: string;
  author_role: string;
  category: 'Grounding' | 'Deep Work' | 'Habit Wins' | 'Questions';
  title: string;
  body: string;
  upvotes: number;
  replies_count: number;
  created_at: string;
  hasUpvoted?: boolean;
}

export const Community: React.FC = () => {
  const { user, profile, openAuthModal } = useAuth();

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCat, setSelectedCat] = useState<string>('All');
  const [isNewPostModalOpen, setIsNewPostModalOpen] = useState(false);

  // New post fields
  const [newTitle, setNewTitle] = useState('');
  const [newBody, setNewBody] = useState('');
  const [newCat, setNewCat] = useState<'Grounding' | 'Deep Work' | 'Habit Wins' | 'Questions'>('Grounding');

  // Fetch posts from Supabase
  useEffect(() => {
    const fetchPosts = async () => {
      if (isSupabaseConfigured) {
        const { data, error } = await supabase
          .from('community_posts')
          .select('*, community_upvotes(user_id)')
          .order('created_at', { ascending: false });

        if (!error && data) {
          const formattedPosts = data.map((p: any) => ({
            ...p,
            hasUpvoted: p.community_upvotes?.some((v: any) => v.user_id === user?.id)
          }));
          setPosts(formattedPosts);
        }
      } else {
        try { setPosts(JSON.parse(localStorage.getItem('balance_community_posts') || '[]')); }
        catch { setPosts([]); }
      }
      setLoading(false);
    };

    fetchPosts();
  }, [user]);

  const handleUpvote = async (postId: string) => {
    if (!user) { openAuthModal('login'); return; }

    const post = posts.find(p => p.id === postId);
    if (!post) return;

    const nextUpvoted = !post.hasUpvoted;

    // Optimistic UI update
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          upvotes: nextUpvoted ? p.upvotes + 1 : p.upvotes - 1,
          hasUpvoted: nextUpvoted,
        };
      }
      return p;
    }));

    if (isSupabaseConfigured) {
      if (nextUpvoted) {
        await supabase.from('community_upvotes').insert({ post_id: postId, user_id: user.id });
        await supabase.rpc('increment_upvotes', { post_id: postId });
      } else {
        await supabase.from('community_upvotes').delete().eq('post_id', postId).eq('user_id', user.id);
        await supabase.rpc('decrement_upvotes', { post_id: postId });
      }
    }
  };

  const startDiscussion = () => {
    if (!user) { openAuthModal('login'); return; }
    setIsNewPostModalOpen(true);
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newBody.trim() || !user) return;

    const newPostData = {
      user_id: user.id,
      author_name: profile?.fullName || 'Mindful Seeker',
      author_avatar: profile?.avatarUrl || '/assets/images/hero-focus.jpg',
      author_role: 'Community Member',
      category: newCat,
      title: newTitle.trim(),
      body: newBody.trim(),
      upvotes: 0,
      replies_count: 0,
    };

    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('community_posts')
        .insert(newPostData)
        .select()
        .single();

      if (!error && data) {
        setPosts([{ ...data, hasUpvoted: false }, ...posts]);
      }
    } else {
      const demoPost = { ...newPostData, id: `p_${Date.now()}`, created_at: new Date().toISOString() } as Post;
      const next = [demoPost, ...posts];
      setPosts(next);
      localStorage.setItem('balance_community_posts', JSON.stringify(next));
    }

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
          onClick={startDiscussion}
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
        {loading ? (
          <div className="text-center py-20 animate-pulse">
            <Users className="w-10 h-10 text-sage-300 mx-auto mb-4" />
            <p className="text-sm text-ink-700/60 dark:text-linen-200/60">Gathering community insights...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 glass-card rounded-3xl border border-sage-200/60">
            <Users className="w-10 h-10 text-sage-200 mx-auto mb-4" />
            <p className="text-sm text-ink-900 dark:text-linen-100 font-bold">No discussions in this category yet.</p>
            <button
              onClick={startDiscussion}
              className="text-xs text-sage-600 font-bold mt-2 hover:underline"
            >
              + Start the first conversation
            </button>
          </div>
        ) : (
          filtered.map((post) => (
            <div
              key={post.id}
              className="glass-card rounded-3xl p-6 sm:p-7 shadow-soft border border-sage-200/80 dark:border-ink-700 space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={post.author_avatar}
                    alt={post.author_name}
                    className="w-10 h-10 rounded-2xl object-cover ring-2 ring-sage-400/30"
                  />
                  <div>
                    <h4 className="font-heading font-bold text-xs sm:text-sm text-ink-900 dark:text-linen-100">
                      {post.author_name}
                    </h4>
                    <p className="text-[10px] text-ink-700/60 dark:text-linen-200/60">
                      {post.author_role} • {new Date(post.created_at).toLocaleDateString()}
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
                  <span>{post.replies_count} Reflections</span>
                </div>
              </div>
            </div>
          ))
        )}
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
