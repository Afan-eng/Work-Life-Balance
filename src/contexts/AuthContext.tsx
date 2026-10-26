import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { User, Session } from '@supabase/supabase-js';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  avatarUrl: string;
  tier: 'free' | 'premium';
  tierExpiry?: string;
  billingHistory: {
    id: string;
    date: string;
    amount: number;
    description: string;
    status: 'paid' | 'pending';
  }[];
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  loading: boolean;
  isAuthModalOpen: boolean;
  authModalTab: 'login' | 'signup' | 'forgot';
  openAuthModal: (tab?: 'login' | 'signup' | 'forgot') => void;
  closeAuthModal: () => void;
  signInWithEmail: (email: string, password: string) => Promise<{ error?: string }>;
  signUpWithEmail: (email: string, password: string, fullName: string) => Promise<{ error?: string }>;
  signInWithGoogle: () => Promise<{ error?: string }>;
  resetPassword: (email: string) => Promise<{ error?: string; success?: boolean }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  upgradeMembership: (planName: string, orderId: string, amount: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_USER_KEY = 'balance_demo_user_profile';

const EMPTY_PROFILE = (id: string, email: string, fullName?: string): UserProfile => ({
  id,
  email,
  fullName: fullName || email.split('@')[0],
  avatarUrl: '/assets/images/hero-focus.jpg',
  tier: 'free',
  billingHistory: [],
});

const readProfile = (): UserProfile | null => {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
    return saved ? JSON.parse(saved) as UserProfile : null;
  } catch {
    localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
    return null;
  }
};

const makeDemoUser = (profile: UserProfile): User => ({
  id: profile.id,
  app_metadata: { provider: 'email', providers: ['email'] },
  user_metadata: { full_name: profile.fullName },
  aud: 'authenticated',
  created_at: new Date().toISOString(),
  email: profile.email,
} as User);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'signup' | 'forgot'>('login');

  useEffect(() => {
    if (isSupabaseConfigured) {
      supabase.auth.getSession().then(async ({ data: { session } }) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) await loadAccountProfile(session.user);
        setLoading(false);
      });

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) void loadAccountProfile(session.user);
        else { setProfile(null); setLoading(false); }
      });

      return () => subscription.unsubscribe();
    } else {
      const cachedProfile = readProfile();
      setProfile(cachedProfile);
      setUser(cachedProfile ? makeDemoUser(cachedProfile) : null);
      setLoading(false);
    }
  }, []);

  const loadAccountProfile = async (account: User) => {
    const userMeta = account.user_metadata;
    const cached = readProfile();
    let billingHistory = cached?.id === account.id ? cached.billingHistory : [];
    let tier: UserProfile['tier'] = cached?.id === account.id ? cached.tier : 'free';
    let tierExpiry = cached?.id === account.id ? cached.tierExpiry : undefined;
    const { data: payments } = await supabase.from('payments').select('*').eq('user_id', account.id).eq('status', 'paid').order('created_at', { ascending: false });
    if (payments) {
      billingHistory = payments.map((payment: any) => ({ id: payment.id, date: payment.created_at.slice(0, 10), amount: Number(payment.amount), description: payment.item_name, status: 'paid' as const }));
      if (payments.some((payment: any) => payment.item_type === 'subscription')) tier = 'premium';
    }
    setProfile({ id: account.id, email: account.email || '', fullName: userMeta?.full_name || cached?.fullName || account.email?.split('@')[0] || 'Mindful Member', avatarUrl: userMeta?.avatar_url || cached?.avatarUrl || '/assets/images/hero-focus.jpg', tier, tierExpiry, billingHistory });
    setLoading(false);
  };

  // Save profile changes locally for offline/demo sessions.
  useEffect(() => {
    if (profile && !isSupabaseConfigured) {
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(profile));
    } else if (!isSupabaseConfigured) {
      localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
    }
  }, [profile]);

  const openAuthModal = (tab: 'login' | 'signup' | 'forgot' = 'login') => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const signInWithEmail = async (email: string, password: string): Promise<{ error?: string }> => {
    if (isSupabaseConfigured) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { error: error.message };
      closeAuthModal();
      return {};
    }

    // Demo sign in simulation
    const savedProfiles = JSON.parse(localStorage.getItem('balance_demo_profiles') || '{}') as Record<string, UserProfile>;
    const simulatedProfile = savedProfiles[email.toLowerCase()] || EMPTY_PROFILE(`usr_${email.toLowerCase()}`, email, email.split('@')[0].replace(/[._]/g, ' '));
    savedProfiles[email.toLowerCase()] = simulatedProfile;
    localStorage.setItem('balance_demo_profiles', JSON.stringify(savedProfiles));
    setProfile(simulatedProfile);
    setUser(makeDemoUser(simulatedProfile));
    closeAuthModal();
    return {};
  };

  const signUpWithEmail = async (email: string, password: string, fullName: string): Promise<{ error?: string }> => {
    if (isSupabaseConfigured) {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } },
      });
      if (error) return { error: error.message };
      closeAuthModal();
      return {};
    }

    // Demo sign up
    const savedProfiles = JSON.parse(localStorage.getItem('balance_demo_profiles') || '{}') as Record<string, UserProfile>;
    if (savedProfiles[email.toLowerCase()]) return { error: 'An account with this email already exists. Please sign in.' };
    const newProfile = EMPTY_PROFILE(`usr_${email.toLowerCase()}`, email, fullName);
    savedProfiles[email.toLowerCase()] = newProfile;
    localStorage.setItem('balance_demo_profiles', JSON.stringify(savedProfiles));
    setProfile(newProfile);
    setUser(makeDemoUser(newProfile));
    closeAuthModal();
    return {};
  };

  const signInWithGoogle = async (): Promise<{ error?: string }> => {
    if (isSupabaseConfigured) {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin },
      });
      if (error) return { error: error.message };
      return {};
    }

    // Demo Google sign in simulation
    const savedProfiles = JSON.parse(localStorage.getItem('balance_demo_profiles') || '{}') as Record<string, UserProfile>;
    const googleProfile = savedProfiles['alex.rivers@gmail.com'] || EMPTY_PROFILE('usr_google_mindful_42', 'alex.rivers@gmail.com', 'Alex Rivers');
    savedProfiles['alex.rivers@gmail.com'] = googleProfile;
    localStorage.setItem('balance_demo_profiles', JSON.stringify(savedProfiles));
    setProfile(googleProfile);
    setUser(makeDemoUser(googleProfile));
    closeAuthModal();
    return {};
  };

  const resetPassword = async (email: string): Promise<{ error?: string; success?: boolean }> => {
    if (isSupabaseConfigured) {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) return { error: error.message };
      return { success: true };
    }
    return { success: true };
  };

  const signOut = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    setProfile(null);
    setUser(null);
    setSession(null);
    localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (profile) {
      const updated = { ...profile, ...updates };
      setProfile(updated);
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(updated));
    }
  };

  const upgradeMembership = (planName: string, orderId: string, amount: number) => {
    if (!profile) return;
    const newInvoice = {
      id: `inv_${orderId.slice(-4) || '9999'}`,
      date: new Date().toISOString().split('T')[0],
      amount: amount,
      description: `${planName} (Razorpay ID: ${orderId})`,
      status: 'paid' as const,
    };
    const updated: UserProfile = {
      ...profile,
      tier: 'premium',
      tierExpiry: '2027-10-25',
      billingHistory: [newInvoice, ...(profile.billingHistory || [])],
    };
    setProfile(updated);
    localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        session,
        loading,
        isAuthModalOpen,
        authModalTab,
        openAuthModal,
        closeAuthModal,
        signInWithEmail,
        signUpWithEmail,
        signInWithGoogle,
        resetPassword,
        signOut,
        updateProfile,
        upgradeMembership,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
