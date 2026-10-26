import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { X, Sparkles, Mail, Lock, User, ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';
import { isSupabaseConfigured } from '../lib/supabase';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, authModalTab, openAuthModal, signInWithEmail, signUpWithEmail, signInWithGoogle, resetPassword } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successNotice, setSuccessNotice] = useState('');

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessNotice('');
    setLoading(true);

    try {
      if (authModalTab === 'login') {
        const res = await signInWithEmail(email, password);
        if (res.error) setErrorMsg(res.error);
      } else if (authModalTab === 'signup') {
        const res = await signUpWithEmail(email, password, fullName);
        if (res.error) {
          setErrorMsg(res.error);
        } else {
          setSuccessNotice('Account created! Your personal dashboard is ready.');
        }
      } else if (authModalTab === 'forgot') {
        const res = await resetPassword(email);
        if (res.error) {
          setErrorMsg(res.error);
        } else {
          setSuccessNotice('Password recovery email link dispatched via Supabase Auth.');
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred during authentication');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setErrorMsg('');
    const res = await signInWithGoogle();
    if (res.error) setErrorMsg(res.error);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white dark:bg-ink-900 border border-sage-200 dark:border-ink-700 rounded-3xl shadow-lift overflow-hidden">
        {/* Top botanical accent */}
        <div className="h-2 bg-gradient-to-r from-sage-400 via-sage-500 to-warmAmber-400" />

        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 p-2 text-ink-700/60 hover:text-ink-900 dark:text-linen-200/60 dark:hover:text-white rounded-full hover:bg-sage-100 dark:hover:bg-ink-800 transition"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-7">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-sage-100 dark:bg-sage-900/60 text-sage-600 dark:text-sage-300 mb-3 shadow-inner">
              <Sparkles className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold font-heading text-ink-900 dark:text-linen-100">
              {authModalTab === 'login' && 'Welcome Back to Balance'}
              {authModalTab === 'signup' && 'Begin Your Grounding Journey'}
              {authModalTab === 'forgot' && 'Reset Your Sanctuary Key'}
            </h2>
            <p className="text-sm text-ink-700/70 dark:text-linen-200/70 mt-1">
              {authModalTab === 'login' && 'Log in to sync your streaks, habits & AI coach sessions.'}
              {authModalTab === 'signup' && (isSupabaseConfigured ? 'Create your free account with Supabase Auth.' : 'Create a browser-only preview profile for this demo.')}
              {authModalTab === 'forgot' && 'Enter your email to receive recovery instructions.'}
            </p>
          </div>

          {/* Social Google OAuth Button */}
          {authModalTab !== 'forgot' && (
            <div className="mb-5">
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 py-2.5 px-4 bg-linen-50 dark:bg-ink-800 hover:bg-linen-100 dark:hover:bg-ink-700 border border-sage-200 dark:border-ink-700 rounded-xl text-sm font-semibold text-ink-900 dark:text-linen-100 transition shadow-sm"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#EA4335"
                    d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
                  />
                  <path
                    fill="#4285F4"
                    d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3 0-.8.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15.2s.7 5.5 1.9 7.9l3.7-2.9z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16.5C3.7 20.2 7.5 23.5 12 23.5z"
                  />
                </svg>
                {isSupabaseConfigured ? 'Continue with Google OAuth' : 'Continue with demo profile'}
              </button>
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-sage-200 dark:border-ink-800" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white dark:bg-ink-900 px-3 text-ink-700/50 dark:text-linen-200/50">
                    or continue with email
                  </span>
                </div>
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-xl text-xs text-red-700 dark:text-red-300">
              {errorMsg}
            </div>
          )}

          {successNotice && (
            <div className="mb-4 p-3 bg-sage-50 dark:bg-sage-950/40 border border-sage-200 dark:border-sage-800 rounded-xl text-xs text-sage-800 dark:text-sage-200 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-sage-600" />
              <span>{successNotice}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {authModalTab === 'signup' && (
              <div>
                <label className="block text-xs font-semibold text-ink-800 dark:text-linen-200 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 w-4 h-4 text-ink-700/40 dark:text-linen-200/40" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    placeholder="e.g. Maya Lin"
                    className="w-full pl-10 pr-4 py-2.5 bg-linen-50 dark:bg-ink-800 border border-sage-200 dark:border-ink-700 rounded-xl text-sm text-ink-900 dark:text-linen-100 focus:outline-none focus:ring-2 focus:ring-sage-500 transition"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-ink-800 dark:text-linen-200 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-ink-700/40 dark:text-linen-200/40" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-linen-50 dark:bg-ink-800 border border-sage-200 dark:border-ink-700 rounded-xl text-sm text-ink-900 dark:text-linen-100 focus:outline-none focus:ring-2 focus:ring-sage-500 transition"
                />
              </div>
            </div>

            {authModalTab !== 'forgot' && (
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-semibold text-ink-800 dark:text-linen-200">
                    Password
                  </label>
                  {authModalTab === 'login' && (
                    <button
                      type="button"
                      onClick={() => openAuthModal('forgot')}
                      className="text-xs text-sage-600 hover:text-sage-700 dark:text-sage-400 hover:underline"
                    >
                      Forgot?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 w-4 h-4 text-ink-700/40 dark:text-linen-200/40" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 bg-linen-50 dark:bg-ink-800 border border-sage-200 dark:border-ink-700 rounded-xl text-sm text-ink-900 dark:text-linen-100 focus:outline-none focus:ring-2 focus:ring-sage-500 transition"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-sage-500 hover:bg-sage-600 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 shadow-soft hover:shadow-lift transition disabled:opacity-50 mt-2"
            >
              {loading ? (
                <span>Working...</span>
              ) : (
                <>
                  <span>
                    {authModalTab === 'login' && 'Sign In to Studio'}
                    {authModalTab === 'signup' && 'Create Free Account'}
                    {authModalTab === 'forgot' && 'Send Recovery Instructions'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Toggle between login / signup */}
          <div className="mt-6 text-center text-xs text-ink-700/70 dark:text-linen-200/70 border-t border-sage-100 dark:border-ink-800 pt-4">
            {authModalTab === 'login' ? (
              <p>
                Don't have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => openAuthModal('signup')}
                  className="font-bold text-sage-600 dark:text-sage-400 hover:underline"
                >
                  Sign up for free
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => openAuthModal('login')}
                  className="font-bold text-sage-600 dark:text-sage-400 hover:underline"
                >
                  Log in here
                </button>
              </p>
            )}
          </div>

          {!isSupabaseConfigured && authModalTab !== 'forgot' && <p className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">Preview mode: profiles and wellness data stay in this browser. Passwords are not verified and Google sign-in is simulated. Configure Supabase Auth before using real customer accounts.</p>}

          <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-ink-700/50 dark:text-linen-200/50">
            <ShieldCheck className="w-3.5 h-3.5 text-sage-500" />
            <span>Secured by Supabase JWT & Row Level Security</span>
          </div>
        </div>
      </div>
    </div>
  );
};
