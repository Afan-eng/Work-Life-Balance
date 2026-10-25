import React from 'react';
import { CreditCard, FileText, CheckCircle2 } from 'lucide-react';

export const Terms: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold font-heading text-ink-900 dark:text-linen-100">
          Terms of Service & Sanctuary Agreement
        </h1>
        <p className="text-xs text-ink-700/60 dark:text-linen-200/60 mt-1">
          Effective October 2026 • Governing member participation, subscriptions, and Razorpay passes
        </p>
      </div>

      <div className="glass-card rounded-3xl p-8 shadow-soft border border-sage-200/80 dark:border-ink-700 space-y-6 text-xs sm:text-sm text-ink-800/80 dark:text-linen-200/80 leading-relaxed">
        <section className="space-y-2">
          <h2 className="font-heading font-bold text-base text-ink-900 dark:text-linen-100 flex items-center gap-2">
            <FileText className="w-4 h-4 text-sage-600" />
            1. Informational & Educational Nature
          </h2>
          <p>
            The somatic protocols, Box Breathing guides, and AI coaching dialogues provided by Balance Studio are intended strictly for educational, mindful wellness, and habit self-regulation purposes. They do not constitute licensed medical diagnosis, clinical psychiatric therapy, or emergency psychiatric intervention.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-heading font-bold text-base text-ink-900 dark:text-linen-100 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-emerald-600" />
            2. Razorpay Billing & Workshop Passes
          </h2>
          <p>
            All paid passes and annual memberships are authorized through Razorpay Checkout. Webhook signatures generated upon successful transactions immediately provision user entitlements in our Supabase records. If you are unsatisfied with a live masterclass pass, refund requests submitted within 48 hours of purchase will be processed promptly.
          </p>
        </section>
      </div>
    </div>
  );
};
