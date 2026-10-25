import React from 'react';
import { BarChart3, Users, Globe, TrendingUp, Heart, MessageCircle, Star, ArrowRight } from 'lucide-react';

export const CommunitySurvey: React.FC = () => {
  const surveyTopics = [
    { title: 'Daily Stress Levels', responses: 12847, trend: '+5.2%', icon: TrendingUp, color: 'text-rose-500' },
    { title: 'Sleep Quality Index', responses: 9234, trend: '+3.1%', icon: Heart, color: 'text-blue-500' },
    { title: 'Social Connection Score', responses: 7891, trend: '+8.7%', icon: Users, color: 'text-emerald-500' },
    { title: 'Digital Wellness Rating', responses: 6543, trend: '-2.4%', icon: Globe, color: 'text-purple-500' },
  ];

  const recentFeedback = [
    { user: 'Anonymous User', location: 'Tokyo, Japan', message: 'The breathing exercises really helped me manage exam stress.', rating: 5 },
    { user: 'Anonymous User', location: 'Berlin, Germany', message: 'I love the community challenges — they keep me motivated!', rating: 4 },
    { user: 'Anonymous User', location: 'São Paulo, Brazil', message: 'The mood tracker insights are incredibly accurate.', rating: 5 },
    { user: 'Anonymous User', location: 'Mumbai, India', message: 'Great platform for building healthy daily habits.', rating: 4 },
  ];

  return (
    <div className="min-h-screen bg-linen-100 dark:bg-ink-950">
      {/* Hero */}
      <section className="relative px-6 py-16 md:py-20 text-center bg-gradient-to-br from-sage-50 via-linen-100 to-amber-50 dark:from-ink-950 dark:via-ink-900 dark:to-ink-950">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-sage-100 dark:bg-sage-900/40 text-sage-700 dark:text-sage-300 rounded-full text-sm font-semibold mb-6">
            <BarChart3 className="w-4 h-4" />
            Community Wellness Survey
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-extrabold text-ink-900 dark:text-linen-100 mb-4">
            Global Wellness Pulse
          </h1>
          <p className="text-lg text-ink-600 dark:text-linen-300 max-w-2xl mx-auto">
            Real-time insights from our global community. See how people worldwide are tracking their wellness journey and contributing to collective well-being.
          </p>
        </div>
      </section>

      {/* Survey Stats Grid */}
      <section className="max-w-6xl mx-auto px-6 -mt-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {surveyTopics.map((topic) => {
            const Icon = topic.icon;
            return (
              <div key={topic.title} className="bg-white dark:bg-ink-900 rounded-2xl p-5 shadow-soft border border-sage-200/60 dark:border-ink-800 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-sage-50 dark:bg-ink-800 flex items-center justify-center">
                    <Icon className={`w-5 h-5 ${topic.color}`} />
                  </div>
                  <span className="text-xs font-bold text-sage-600 dark:text-sage-400 bg-sage-50 dark:bg-ink-800 px-2 py-0.5 rounded-full">
                    {topic.trend}
                  </span>
                </div>
                <h3 className="font-bold text-ink-900 dark:text-linen-100 text-sm mb-1">{topic.title}</h3>
                <p className="text-2xl font-extrabold text-ink-900 dark:text-linen-100">
                  {topic.responses.toLocaleString()}
                </p>
                <p className="text-xs text-ink-500 dark:text-linen-400 mt-1">total responses</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Take Survey CTA */}
      <section className="max-w-6xl mx-auto px-6 mt-12">
        <div className="bg-gradient-to-r from-sage-500 to-sage-700 rounded-2xl p-8 text-white text-center shadow-lift">
          <h2 className="text-2xl font-bold mb-2">Share Your Voice</h2>
          <p className="text-sage-100 mb-6 max-w-lg mx-auto">
            Take our 5-minute wellness survey and help shape global insights on mental health, productivity, and community well-being.
          </p>
          <button className="inline-flex items-center gap-2 bg-white text-sage-700 font-bold px-6 py-3 rounded-xl hover:bg-sage-50 transition-colors shadow-soft">
            Take the Survey
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Community Feedback */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold text-ink-900 dark:text-linen-100 mb-6 flex items-center gap-2">
          <MessageCircle className="w-6 h-6 text-sage-500" />
          Community Feedback
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {recentFeedback.map((fb, i) => (
            <div key={i} className="bg-white dark:bg-ink-900 rounded-2xl p-5 shadow-soft border border-sage-200/60 dark:border-ink-800">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-semibold text-ink-900 dark:text-linen-100 text-sm">{fb.user}</p>
                  <p className="text-xs text-ink-500 dark:text-linen-400">{fb.location}</p>
                </div>
                <div className="flex gap-0.5">
                  {[...Array(fb.rating)].map((_, j) => (
                    <Star key={j} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
              </div>
              <p className="text-sm text-ink-700 dark:text-linen-200 leading-relaxed">"{fb.message}"</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default CommunitySurvey;
