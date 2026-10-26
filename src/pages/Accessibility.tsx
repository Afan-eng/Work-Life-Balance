import React from 'react';
import { Eye, Heart, CheckCircle2 } from 'lucide-react';

export const Accessibility: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold font-heading text-ink-900 dark:text-linen-100">
          Accessibility Statement
        </h1>
        <p className="text-xs text-ink-700/60 dark:text-linen-200/60 mt-1">
          Commitment to WCAG 2.1 Level AA digital inclusion & neurodivergent comfort
        </p>
      </div>

      <div className="glass-card rounded-3xl p-8 shadow-soft border border-sage-200/80 dark:border-ink-700 space-y-6 text-xs sm:text-sm text-ink-800/80 dark:text-linen-200/80 leading-relaxed">
        <p>
          At Balance Compass, accessibility is foundational to our philosophy of universal somatic peace. We are continuously engineering our application to conform to Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards.
        </p>

        <div className="space-y-3">
          <h3 className="font-heading font-bold text-sm text-ink-900 dark:text-linen-100">
            Key Accessibility Features:
          </h3>
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Full Light / Dark Mode support tailored with high-contrast text ratios exceeding 4.5:1.</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Reduced motion consideration: Box Breathing visual animations honor system vestibular preferences.</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Full keyboard navigability across all modal dialogs, drawer menus, and habit checklists.</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Explicit ARIA labels and semantic heading hierarchies for screen reader users.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
