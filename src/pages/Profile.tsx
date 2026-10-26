import React, { useState } from 'react';
import { 
  User, Mail, ShieldCheck, Flame, CreditCard, Download, 
  Upload, Sparkles, CheckCircle2, ArrowRight 
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useStreak } from '../contexts/StreakContext';
import { uploadToCloudinary } from '../lib/cloudinary';
import { openRazorpayCheckout } from '../lib/razorpay';

export const Profile: React.FC = () => {
  const { profile, updateProfile, signOut } = useAuth();
  const { currentStreak, projectedStreak, bestStreak, todayCompleted, dailyGoals } = useStreak();

  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [editingName, setEditingName] = useState(profile?.fullName || 'Elena Vance');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingAvatar(true);
    try {
      const url = await uploadToCloudinary(file, 'avatars');
      await updateProfile({ avatarUrl: url });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    } catch (err) {
      alert('Avatar upload failed. Please try again.');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({ fullName: editingName });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleExportData = () => {
    const exportPayload = {
      userProfile: profile,
      streakMetrics: { currentStreak, bestStreak },
      goals: dailyGoals,
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `balance_studio_export_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleUpgradeSanctuary = () => {
    openRazorpayCheckout({
      amount: 1499,
      currency: 'INR',
      itemName: 'Annual Balance Sanctuary Pass',
      itemType: 'subscription',
      userEmail: profile?.email || 'user@balance.studio',
      userName: profile?.fullName || 'Valued Member',
      onSuccess: (res) => {
        alert(`Membership Upgraded! Razorpay ID: ${res.paymentId}. Enjoy full sanctuary benefits.`);
      },
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold font-heading text-ink-900 dark:text-linen-100">
          Account & Sanctuary Profile
        </h1>
        <p className="text-xs sm:text-sm text-ink-700/70 dark:text-linen-200/70 mt-1">
          Manage your credentials, Cloudinary avatar media, Supabase sync, and Razorpay billing passes.
        </p>
      </div>

      {/* Main Profile Info Card */}
      <div className="glass-card rounded-3xl p-6 sm:p-9 shadow-soft border border-sage-200/80 dark:border-ink-700 space-y-8">
        <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-sage-100 dark:border-ink-800">
          {/* Avatar with Cloudinary upload */}
          <div className="relative group">
            <img
              src={profile?.avatarUrl || '/assets/images/hero-focus.jpg'}
              alt={profile?.fullName}
              className="w-24 h-24 rounded-3xl object-cover ring-4 ring-sage-400/40 shadow-soft"
            />
            <label className="absolute inset-0 bg-ink-950/50 rounded-3xl opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center text-white cursor-pointer text-xs font-bold gap-1">
              <Upload className="w-4 h-4" />
              <span>{uploadingAvatar ? 'Uploading...' : 'Change'}</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
                disabled={uploadingAvatar}
              />
            </label>
          </div>

          <div className="text-center sm:text-left space-y-1">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h2 className="text-2xl font-bold font-heading text-ink-900 dark:text-linen-100">
                {profile?.fullName || 'Mindful Member'}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                {profile?.tier === 'premium' ? 'Sanctuary Pass' : 'Explorer Tier'}
              </span>
            </div>
            <p className="text-xs text-ink-700/60 dark:text-linen-200/60">{profile?.email}</p>
            <div className="pt-2 flex items-center gap-2 text-[11px] text-sage-600 dark:text-sage-400 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Protected by Supabase Auth JWT Session</span>
            </div>
          </div>
        </div>

        {/* Edit Name Form */}
        <form onSubmit={handleSaveProfile} className="space-y-4 max-w-md">
          <div>
            <label className="block text-xs font-semibold mb-1 text-ink-800 dark:text-linen-200">
              Full Display Name
            </label>
            <input
              type="text"
              value={editingName}
              onChange={(e) => setEditingName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-linen-50 dark:bg-ink-800 border border-sage-200 dark:border-ink-700 rounded-xl text-sm text-ink-900 dark:text-linen-100 focus:outline-none focus:ring-2 focus:ring-sage-500"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-sage-500 hover:bg-sage-600 text-white font-bold text-xs shadow-soft transition"
            >
              Update Name
            </button>
            {savedSuccess && (
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Saved!
              </span>
            )}
          </div>
        </form>
      </div>

      {/* Streaks Synced Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card rounded-2xl p-5 border border-sage-200/70 dark:border-ink-700 text-center space-y-1">
          <Flame className="w-6 h-6 text-warmAmber-500 mx-auto fill-warmAmber-500" />
          <span className="block text-2xl font-extrabold font-heading text-ink-900 dark:text-linen-100">
            {todayCompleted ? projectedStreak : currentStreak} Days
          </span>
          <span className="text-xs text-ink-700/60 dark:text-linen-200/60">Current Active Streak</span>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-sage-200/70 dark:border-ink-700 text-center space-y-1">
          <Sparkles className="w-6 h-6 text-emerald-500 mx-auto" />
          <span className="block text-2xl font-extrabold font-heading text-ink-900 dark:text-linen-100">
            {bestStreak} Days
          </span>
          <span className="text-xs text-ink-700/60 dark:text-linen-200/60">Longest Streak Record</span>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-sage-200/70 dark:border-ink-700 text-center space-y-1">
          <ShieldCheck className="w-6 h-6 text-teal-500 mx-auto" />
          <span className="block text-2xl font-extrabold font-heading text-ink-900 dark:text-linen-100">
            {todayCompleted ? 'Recorded' : 'Not yet'}
          </span>
          <span className="text-xs text-ink-700/60 dark:text-linen-200/60">Today's tracker status</span>
        </div>
      </div>

      {/* Razorpay Billing & Invoices */}
      <div id="billing" className="glass-card rounded-3xl p-6 sm:p-8 shadow-soft border border-sage-200/80 dark:border-ink-700 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-heading font-bold text-lg text-ink-900 dark:text-linen-100 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-emerald-600" />
              Razorpay Passes & Billing History
            </h3>
            <p className="text-xs text-ink-700/70 dark:text-linen-200/70 mt-1">
              Active Tier: {profile?.tier === 'premium' ? 'Annual Balance Sanctuary (₹1,499/yr)' : 'Free Community Explorer'}
            </p>
          </div>

          {profile?.tier !== 'premium' ? (
            <button
              onClick={handleUpgradeSanctuary}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-soft transition flex items-center gap-1.5"
            >
              <span>Upgrade to Sanctuary Pass (₹1,499)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <span className="px-3 py-1.5 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Active Sanctuary Pass
            </span>
          )}
        </div>

        {/* Billing Table */}
        <div className="space-y-2">
          {profile?.billingHistory && profile.billingHistory.length > 0 ? (
            profile.billingHistory.map((inv) => (
              <div
                key={inv.id}
                className="p-3.5 rounded-xl bg-linen-50/80 dark:bg-ink-800/60 border border-sage-200/60 dark:border-ink-700 flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-bold text-ink-900 dark:text-linen-100">{inv.description}</span>
                  <span className="block text-[10px] text-ink-700/60 dark:text-linen-200/60">{inv.date} • #{inv.id}</span>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-ink-900 dark:text-linen-100">₹{inv.amount}</span>
                  <span className="block text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase">PAID</span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-xs text-ink-700/60 dark:text-linen-200/60 italic py-2">
              No previous Razorpay billing invoices on this session.
            </p>
          )}
        </div>
      </div>

      {/* Export & Privacy Data Control */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 shadow-soft border border-sage-200/80 dark:border-ink-700 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="font-heading font-bold text-base text-ink-900 dark:text-linen-100">
            Export My Sanctuary Data
          </h4>
          <p className="text-xs text-ink-700/70 dark:text-linen-200/70 mt-1">
            Download your full Supabase habit logs, streak records, and profile details as a clean JSON archive.
          </p>
        </div>

        <button
          onClick={handleExportData}
          className="px-5 py-2.5 rounded-xl border border-sage-300 dark:border-ink-700 hover:bg-linen-100 dark:hover:bg-ink-800 text-ink-800 dark:text-linen-200 text-xs font-bold transition flex items-center gap-2"
        >
          <Download className="w-4 h-4 text-sage-600" />
          <span>Download JSON Archive</span>
        </button>
      </div>
    </div>
  );
};
