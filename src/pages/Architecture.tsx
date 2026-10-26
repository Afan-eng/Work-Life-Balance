import React, { useState } from 'react';
import { 
  Network, Database, Cloud, CreditCard, Sparkles, Server, 
  ShieldCheck, CheckCircle2, Play, Code2, ArrowRight 
} from 'lucide-react';
import { N8N_WEBHOOKS, sendAiChatMessage } from '../lib/n8n';

export const Architecture: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<'n8n' | 'supabase' | 'razorpay' | 'cloudinary'>('n8n');
  const [testPayloadResult, setTestPayloadResult] = useState<string>('');
  const [isTesting, setIsTesting] = useState(false);

  const handleTestWebhook = async () => {
    setIsTesting(true);
    setTestPayloadResult('Dispatching HTTP POST to n8n webhook relay...');
    try {
      const res = await sendAiChatMessage({
        message: 'Community Program Evaluation Test Ping',
        history: [],
        userContext: {
          currentStreak: 7,
          currentRhythm: 'Morning Focus',
          recentMood: 'Centered',
        },
      });
      setTestPayloadResult(JSON.stringify(res, null, 2));
    } catch (err: any) {
      setTestPayloadResult(`Error: ${err.message}`);
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-semibold">
          <Network className="w-3.5 h-3.5" />
          <span>System Engineering & Cloud Workflow Architecture</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-ink-900 dark:text-linen-100">
          Balance Compass Architecture Visualizer
        </h1>
        <p className="text-xs sm:text-sm text-ink-700/70 dark:text-linen-200/70">
          Engineered strictly without a custom Express backend. All AI processing, business logic, payment signature validations, and scheduled syncs run serverlessly via n8n Cloud webhooks and Supabase PostgreSQL Row Level Security (RLS).
        </p>
      </div>

      {/* Interactive System Pipeline Map */}
      <div className="glass-card rounded-3xl p-6 sm:p-9 shadow-lift border border-sage-200/80 dark:border-ink-700 space-y-8">
        <h3 className="font-heading font-bold text-base text-ink-900 dark:text-linen-100 flex items-center gap-2">
          <Server className="w-4 h-4 text-sage-600" />
          <span>Interactive Component Nodes (Click to inspect protocol)</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <button
            onClick={() => setSelectedNode('n8n')}
            className={`p-4 rounded-2xl border text-left transition flex flex-col justify-between ${
              selectedNode === 'n8n'
                ? 'border-sage-500 bg-sage-50 dark:bg-sage-950/70 ring-2 ring-sage-500/20 shadow-soft'
                : 'border-sage-200 dark:border-ink-700 hover:bg-linen-50 dark:hover:bg-ink-800'
            }`}
          >
            <div>
              <span className="text-2xl mb-2 block">⚡</span>
              <h4 className="font-heading font-bold text-sm text-ink-900 dark:text-linen-100">n8n Cloud</h4>
              <p className="text-[11px] text-ink-700/60 dark:text-linen-200/60 mt-1">Backend Orchestrator</p>
            </div>
            <span className="text-[10px] font-mono text-sage-600 dark:text-sage-400 font-bold mt-3">6 Webhooks Active</span>
          </button>

          <button
            onClick={() => setSelectedNode('supabase')}
            className={`p-4 rounded-2xl border text-left transition flex flex-col justify-between ${
              selectedNode === 'supabase'
                ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/70 ring-2 ring-emerald-500/20 shadow-soft'
                : 'border-sage-200 dark:border-ink-700 hover:bg-linen-50 dark:hover:bg-ink-800'
            }`}
          >
            <div>
              <span className="text-2xl mb-2 block">🐘</span>
              <h4 className="font-heading font-bold text-sm text-ink-900 dark:text-linen-100">Supabase Auth & RLS</h4>
              <p className="text-[11px] text-ink-700/60 dark:text-linen-200/60 mt-1">PostgreSQL Database</p>
            </div>
            <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold mt-3">7 RLS Policies Enforced</span>
          </button>

          <button
            onClick={() => setSelectedNode('razorpay')}
            className={`p-4 rounded-2xl border text-left transition flex flex-col justify-between ${
              selectedNode === 'razorpay'
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/70 ring-2 ring-blue-500/20 shadow-soft'
                : 'border-sage-200 dark:border-ink-700 hover:bg-linen-50 dark:hover:bg-ink-800'
            }`}
          >
            <div>
              <span className="text-2xl mb-2 block">💳</span>
              <h4 className="font-heading font-bold text-sm text-ink-900 dark:text-linen-100">Razorpay Gateway</h4>
              <p className="text-[11px] text-ink-700/60 dark:text-linen-200/60 mt-1">Orders API & Checkout</p>
            </div>
            <span className="text-[10px] font-mono text-blue-600 dark:text-blue-400 font-bold mt-3">Signature Verification</span>
          </button>

          <button
            onClick={() => setSelectedNode('cloudinary')}
            className={`p-4 rounded-2xl border text-left transition flex flex-col justify-between ${
              selectedNode === 'cloudinary'
                ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/70 ring-2 ring-amber-500/20 shadow-soft'
                : 'border-sage-200 dark:border-ink-700 hover:bg-linen-50 dark:hover:bg-ink-800'
            }`}
          >
            <div>
              <span className="text-2xl mb-2 block">☁️</span>
              <h4 className="font-heading font-bold text-sm text-ink-900 dark:text-linen-100">Cloudinary CDN</h4>
              <p className="text-[11px] text-ink-700/60 dark:text-linen-200/60 mt-1">Media Storage</p>
            </div>
            <span className="text-[10px] font-mono text-amber-600 dark:text-amber-400 font-bold mt-3">Unsigned Preset Uploads</span>
          </button>
        </div>

        {/* Selected Node Details Box */}
        <div className="p-6 rounded-2xl bg-linen-50 dark:bg-ink-800/80 border border-sage-200/70 dark:border-ink-700 space-y-4">
          {selectedNode === 'n8n' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-heading font-bold text-base text-ink-900 dark:text-linen-100">
                  n8n Cloud Webhook Routing Matrix
                </h4>
                <button
                  onClick={handleTestWebhook}
                  disabled={isTesting}
                  className="px-3.5 py-1.5 bg-sage-500 hover:bg-sage-600 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-soft"
                >
                  <Play className="w-3 h-3 fill-white" />
                  <span>{isTesting ? 'Pinging Webhook...' : 'Test AI Webhook Payload'}</span>
                </button>
              </div>
              <p className="text-xs text-ink-700/80 dark:text-linen-200/80 leading-relaxed">
                n8n acts as the central headless nervous system of Balance Compass. It receives encrypted payloads from client events, injects system prompt instructions for compassionate mindfulness, queries third-party LLMs, and triggers automated updates.
              </p>
              <div className="p-3 bg-white dark:bg-ink-950 rounded-xl font-mono text-[11px] text-sage-800 dark:text-sage-200 border border-sage-200/60 space-y-1">
                <div>AI Chat Endpoint: <span className="text-amber-600">{N8N_WEBHOOKS.AI_CHAT}</span></div>
                <div>Razorpay Order Hook: <span className="text-amber-600">{N8N_WEBHOOKS.CREATE_RAZORPAY_ORDER}</span></div>
                <div>Payment Verify Hook: <span className="text-amber-600">{N8N_WEBHOOKS.VERIFY_RAZORPAY_PAYMENT}</span></div>
                <div>Crisis Support Hook: <span className="text-amber-600">{N8N_WEBHOOKS.CONTACT_INQUIRY}</span></div>
              </div>
              {testPayloadResult && (
                <div className="mt-3 p-3 bg-ink-950 text-emerald-400 font-mono text-xs rounded-xl overflow-x-auto">
                  <pre>{testPayloadResult}</pre>
                </div>
              )}
            </div>
          )}

          {selectedNode === 'supabase' && (
            <div className="space-y-3">
              <h4 className="font-heading font-bold text-base text-ink-900 dark:text-linen-100">
                Supabase PostgreSQL with Row Level Security (RLS)
              </h4>
              <p className="text-xs text-ink-700/80 dark:text-linen-200/80 leading-relaxed">
                Rather than trusting client-side logic for authorization, Supabase PostgreSQL RLS policies enforce access control at the database row level using cryptographic JWT tokens.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                <div className="p-2.5 rounded-lg bg-white dark:bg-ink-950 border border-sage-200/60">
                  <span className="font-bold text-sage-600">user_streaks</span>
                  <span className="block text-[10px] text-ink-700/60">RLS Active</span>
                </div>
                <div className="p-2.5 rounded-lg bg-white dark:bg-ink-950 border border-sage-200/60">
                  <span className="font-bold text-sage-600">user_habits</span>
                  <span className="block text-[10px] text-ink-700/60">RLS Active</span>
                </div>
                <div className="p-2.5 rounded-lg bg-white dark:bg-ink-950 border border-sage-200/60">
                  <span className="font-bold text-sage-600">user_goals</span>
                  <span className="block text-[10px] text-ink-700/60">RLS Active</span>
                </div>
                <div className="p-2.5 rounded-lg bg-white dark:bg-ink-950 border border-sage-200/60">
                  <span className="font-bold text-sage-600">user_mood_logs</span>
                  <span className="block text-[10px] text-ink-700/60">RLS Active</span>
                </div>
              </div>
            </div>
          )}

          {selectedNode === 'razorpay' && (
            <div className="space-y-3">
              <h4 className="font-heading font-bold text-base text-ink-900 dark:text-linen-100">
                Razorpay Checkout & Webhook Signature Cryptography
              </h4>
              <p className="text-xs text-ink-700/80 dark:text-linen-200/80 leading-relaxed">
                1. User requests workshop pass → 2. n8n webhook creates Razorpay Order ID → 3. Razorpay Standard Checkout opens → 4. On payment completion, n8n verifies cryptographic HMAC SHA256 signature → 5. Supabase updates membership tier to active.
              </p>
            </div>
          )}

          {selectedNode === 'cloudinary' && (
            <div className="space-y-3">
              <h4 className="font-heading font-bold text-base text-ink-900 dark:text-linen-100">
                Cloudinary Media Storage & CDN Distribution
              </h4>
              <p className="text-xs text-ink-700/80 dark:text-linen-200/80 leading-relaxed">
                Avatars and 21-Day Habit Challenge check-in photos are delivered directly to Cloudinary edge nodes using unsigned upload presets, reducing frontend bundle size and eliminating custom file storage servers.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
