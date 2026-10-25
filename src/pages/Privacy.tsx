import React from 'react';
import { ShieldCheck, Lock, Database, EyeOff } from 'lucide-react';

export const Privacy: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold font-heading text-ink-900 dark:text-linen-100">
          Privacy Policy & Data Sanctuary
        </h1>
        <p className="text-xs text-ink-700/60 dark:text-linen-200/60 mt-1">
          Last revised: October 2026 • Strict compliance with Supabase PostgreSQL Row Level Security (RLS)
        </p>
      </div>

      <div className="glass-card rounded-3xl p-8 shadow-soft border border-sage-200/80 dark:border-ink-700 space-y-6 text-xs sm:text-sm text-ink-800/80 dark:text-linen-200/80 leading-relaxed">
        <section className="space-y-2">
          <h2 className="font-heading font-bold text-base text-ink-900 dark:text-linen-100 flex items-center gap-2">
            <Lock className="w-4 h-4 text-sage-600" />
            1. Cryptographic User Isolation via Row Level Security (RLS)
          </h2>
          <p>
            Every mood journal entry, private reflection, habit record, and chat transcript in Balance Studio is anchored to your cryptographic Supabase Auth user UUID. All tables (`chat_threads`, `chat_messages`, `user_streaks`, `user_habits`, `user_goals`, `user_mood_logs`, `payments`) enforce PostgreSQL RLS policies ensuring that neither other members nor unauthorized clients can access your private records.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-heading font-bold text-base text-ink-900 dark:text-linen-100 flex items-center gap-2">
            <Database className="w-4 h-4 text-teal-600" />
            2. n8n Cloud Automation & AI Processing Relays
          </h2>
          <p>
            When interacting with the Balance Guide AI or requesting automated streak synchronization, data is routed via TLS 1.3 encrypted webhooks directly to our isolated n8n Cloud instance. Third-party LLM queries do not store or use your personal identity for foundational training.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-heading font-bold text-base text-ink-900 dark:text-linen-100 flex items-center gap-2">
            <EyeOff className="w-4 h-4 text-emerald-600" />
            3. Zero Advertising or Data Brokering
          </h2>
          <p>
            Balance Studio never sells, rents, monetizes, or shares member data with third-party advertising exchanges. Our revenue model is entirely supported by transparent community memberships and masterclass passes processed via Razorpay.
          </p>
        </section>
      </div>
    </div>
  );
};
