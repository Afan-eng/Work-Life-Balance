import React, { useState } from 'react';
import { Mail, PhoneCall, Send, ShieldAlert, CheckCircle2, Sparkles, MessageSquare, Clock } from 'lucide-react';
import { sendContactInquiryViaN8n } from '../lib/n8n';

export const Contact: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState('General Sanctuary Inquiry');
  const [message, setMessage] = useState('');
  const [isUrgent, setIsUrgent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const [statusError, setStatusError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatusMsg('');
    setStatusError(false);

    try {
      const res = await sendContactInquiryViaN8n({
        name,
        email,
        category,
        message,
        isUrgentSupport: isUrgent,
      });

      setStatusMsg(res.message);
      setStatusError(!res.success);
      if (res.success) {
        setName('');
        setEmail('');
        setMessage('');
        setIsUrgent(false);
      }
    } catch (err: any) {
      setStatusError(true);
      setStatusMsg('We could not send this message right now. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sage-100 dark:bg-sage-950/60 text-sage-700 dark:text-sage-300 text-xs font-semibold">
          <Mail className="w-3.5 h-3.5" />
          <span>Concierge & Support</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-ink-900 dark:text-linen-100">
          We are here with you.
        </h1>
        <p className="text-xs sm:text-sm text-ink-700/70 dark:text-linen-200/70">
          Reach our wellness team, report technical feedback, or request custom retreat information.
        </p>
      </div>

      {/* 24/7 Crisis Assistance Notice */}
      <div className="p-6 rounded-3xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-soft">
        <div className="flex items-start gap-3">
          <PhoneCall className="w-6 h-6 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-heading font-bold text-sm text-amber-900 dark:text-amber-200">
              Support in India
            </h3>
            <p className="text-xs text-amber-800/80 dark:text-amber-300/80 mt-1">
              For mental health support, call Tele-MANAS at <a className="font-bold underline" href="tel:14416">14416</a> or <a className="font-bold underline" href="tel:18008914416">1800-89-14416</a>. For an immediate emergency in India, call <a className="font-bold underline" href="tel:112">112</a>. This website is not an emergency service.
            </p>
          </div>
        </div>

        <span className="font-mono text-xs font-bold bg-amber-200/80 dark:bg-amber-900 px-3 py-1 rounded-xl text-amber-950 dark:text-amber-100 shrink-0">
          Tele-MANAS · 14416
        </span>
      </div>

      {/* Contact Form with n8n Webhook Relay */}
      <div className="glass-card rounded-3xl p-6 sm:p-9 shadow-lift border border-sage-200/80 dark:border-ink-700">
        <h2 className="text-xl font-bold font-heading text-ink-900 dark:text-linen-100 mb-6 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-sage-600" />
          Send a Message to the Concierge
        </h2>

        {statusMsg && (
          <div role={statusError ? 'alert' : 'status'} className={`mb-6 p-4 rounded-2xl border text-xs sm:text-sm flex items-center gap-2 ${statusError ? 'bg-rose-50 border-rose-200 text-rose-900 dark:bg-rose-950 dark:border-rose-800 dark:text-rose-200' : 'bg-sage-50 dark:bg-sage-950/60 border-sage-200 dark:border-sage-800 text-sage-800 dark:text-sage-200'}`}>
            {statusError ? <ShieldAlert className="w-5 h-5 shrink-0" /> : <CheckCircle2 className="w-5 h-5 text-sage-600 shrink-0" />}
            <span>{statusMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1 text-ink-800 dark:text-linen-200">
                Your Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Elena Vance"
                className="w-full px-3.5 py-2.5 bg-linen-50 dark:bg-ink-800 border border-sage-200 dark:border-ink-700 rounded-xl text-sm text-ink-900 dark:text-linen-100 focus:outline-none focus:ring-2 focus:ring-sage-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1 text-ink-800 dark:text-linen-200">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="elena@example.com"
                className="w-full px-3.5 py-2.5 bg-linen-50 dark:bg-ink-800 border border-sage-200 dark:border-ink-700 rounded-xl text-sm text-ink-900 dark:text-linen-100 focus:outline-none focus:ring-2 focus:ring-sage-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1 text-ink-800 dark:text-linen-200">
              Topic Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-linen-50 dark:bg-ink-800 border border-sage-200 dark:border-ink-700 rounded-xl text-sm text-ink-900 dark:text-linen-100 focus:outline-none focus:ring-2 focus:ring-sage-500"
            >
              <option value="General Sanctuary Inquiry">General Sanctuary Inquiry</option>
              <option value="Workshop Passes & Razorpay">Workshop Passes & Razorpay Billing</option>
              <option value="Supabase Account & Data">Supabase Account & Data Request</option>
              <option value="Facilitator Partnership">Facilitator / Speaker Partnership</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1 text-ink-800 dark:text-linen-200">
              How can we support your journey?
            </label>
            <textarea
              required
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell us what is on your mind or how we can assist..."
              className="w-full p-3.5 bg-linen-50 dark:bg-ink-800 border border-sage-200 dark:border-ink-700 rounded-xl text-sm text-ink-900 dark:text-linen-100 focus:outline-none focus:ring-2 focus:ring-sage-500 resize-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="urgent"
              checked={isUrgent}
              onChange={(e) => setIsUrgent(e.target.checked)}
              className="w-4 h-4 accent-sage-600 rounded cursor-pointer"
            />
            <label htmlFor="urgent" className="text-xs text-ink-700 dark:text-linen-200 cursor-pointer">
              Mark as priority response (routes via instant n8n notification trigger)
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-8 py-3 bg-sage-500 hover:bg-sage-600 text-white font-bold text-xs sm:text-sm rounded-xl shadow-soft hover:shadow-lift transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <span>Relaying to n8n Webhook...</span>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Send Message</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
