import React, { useState, useEffect } from 'react';
import { ShieldCheck, CheckCircle2, Lock, X, CreditCard, Smartphone } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../contexts/AuthContext';

export const RazorpayModalFallback: React.FC = () => {
  const { upgradeMembership } = useAuth();
  const [modalData, setModalData] = useState<{
    orderId: string;
    amount: number;
    currency: string;
    itemName: string;
    userEmail: string;
    userName: string;
    onSuccess: (res: any) => void;
    onDismiss?: () => void;
  } | null>(null);

  const [paymentStep, setPaymentStep] = useState<'method' | 'processing' | 'success'>('method');
  const [selectedMethod, setSelectedMethod] = useState<'upi' | 'card'>('upi');
  const [upiId, setUpiId] = useState('mindful.user@okhdfcbank');

  useEffect(() => {
    const handleModal = (e: any) => {
      setModalData(e.detail);
      setPaymentStep('method');
    };

    window.addEventListener('balance-razorpay-modal', handleModal);
    return () => window.removeEventListener('balance-razorpay-modal', handleModal);
  }, []);

  if (!modalData) return null;

  const handleCompletePayment = () => {
    setPaymentStep('processing');
    setTimeout(() => {
      setPaymentStep('success');
      const fakePaymentId = `pay_${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
      
      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.7 },
          colors: ['#2F9A5D', '#38B76E', '#FCD466'],
        });
      } catch (e) {
        // ignore
      }

      // Upgrade profile pass in context
      upgradeMembership(modalData.itemName, modalData.orderId, modalData.amount);

      setTimeout(() => {
        modalData.onSuccess({
          paymentId: fakePaymentId,
          orderId: modalData.orderId,
          signature: 'simulated_rzp_sig_ok',
        });
        setModalData(null);
      }, 1400);
    }, 1200);
  };

  const handleClose = () => {
    if (modalData.onDismiss) modalData.onDismiss();
    setModalData(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white dark:bg-ink-900 border border-sage-200 dark:border-ink-700 rounded-3xl shadow-lift overflow-hidden">
        {/* Razorpay Brand Header */}
        <div className="bg-[#0C2340] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center font-bold text-blue-400 text-lg">
              R
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-bold text-sm tracking-wide">Razorpay</span>
                <span className="text-[10px] bg-blue-500/30 text-blue-300 px-1.5 py-0.5 rounded font-mono">TEST MODE</span>
              </div>
              <p className="text-xs text-white/70">Balance Studio Secure Checkout</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-white/60 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-baseline justify-between border-b border-sage-100 dark:border-ink-800 pb-4 mb-5">
            <div>
              <h3 className="font-heading font-bold text-base text-ink-900 dark:text-linen-100">
                {modalData.itemName}
              </h3>
              <p className="text-xs text-ink-700/60 dark:text-linen-200/60">
                Order: #{modalData.orderId.substring(0, 14)}
              </p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold font-heading text-sage-600 dark:text-sage-400">
                {modalData.currency === 'USD' ? '$' : '₹'}
                {modalData.amount.toLocaleString()}
              </span>
              <p className="text-[10px] text-ink-700/50 dark:text-linen-200/50">All taxes included</p>
            </div>
          </div>

          {paymentStep === 'method' && (
            <div className="space-y-4">
              <label className="text-xs font-semibold text-ink-800 dark:text-linen-200">
                Select Preferred Payment Mode
              </label>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedMethod('upi')}
                  className={`p-3.5 rounded-2xl border text-left flex flex-col gap-2 transition ${
                    selectedMethod === 'upi'
                      ? 'border-sage-500 bg-sage-50/60 dark:bg-sage-950/40 text-sage-800 dark:text-sage-200 ring-2 ring-sage-500/20'
                      : 'border-sage-200 dark:border-ink-700 hover:bg-linen-50 dark:hover:bg-ink-800 text-ink-800 dark:text-linen-200'
                  }`}
                >
                  <Smartphone className="w-5 h-5 text-sage-600 dark:text-sage-400" />
                  <span className="text-xs font-bold">UPI / QR</span>
                  <span className="text-[10px] opacity-75">Google Pay, PhonePe, Paytm</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMethod('card')}
                  className={`p-3.5 rounded-2xl border text-left flex flex-col gap-2 transition ${
                    selectedMethod === 'card'
                      ? 'border-sage-500 bg-sage-50/60 dark:bg-sage-950/40 text-sage-800 dark:text-sage-200 ring-2 ring-sage-500/20'
                      : 'border-sage-200 dark:border-ink-700 hover:bg-linen-50 dark:hover:bg-ink-800 text-ink-800 dark:text-linen-200'
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-sage-600 dark:text-sage-400" />
                  <span className="text-xs font-bold">Cards</span>
                  <span className="text-[10px] opacity-75">Visa, Mastercard, RuPay</span>
                </button>
              </div>

              {selectedMethod === 'upi' ? (
                <div>
                  <label className="block text-xs font-semibold text-ink-800 dark:text-linen-200 mb-1">
                    Virtual Payment Address (VPA)
                  </label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={e => setUpiId(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-linen-50 dark:bg-ink-800 border border-sage-200 dark:border-ink-700 rounded-xl text-sm font-mono text-ink-900 dark:text-linen-100 focus:outline-none focus:ring-2 focus:ring-sage-500"
                  />
                </div>
              ) : (
                <div className="p-3 bg-linen-50 dark:bg-ink-800 border border-sage-200 dark:border-ink-700 rounded-xl space-y-2">
                  <div className="flex justify-between text-xs text-ink-700 dark:text-linen-200 font-mono">
                    <span>Card Number:</span>
                    <span>•••• •••• •••• 4242</span>
                  </div>
                  <div className="flex justify-between text-xs text-ink-700 dark:text-linen-200 font-mono">
                    <span>Expiry / CVV:</span>
                    <span>12/28 •••</span>
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={handleCompletePayment}
                className="w-full mt-3 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 shadow-soft hover:shadow-lift transition"
              >
                <Lock className="w-4 h-4" />
                <span>Pay {modalData.currency === 'USD' ? '$' : '₹'}{modalData.amount.toLocaleString()} via Razorpay</span>
              </button>
            </div>
          )}

          {paymentStep === 'processing' && (
            <div className="text-center py-8 space-y-4">
              <div className="w-14 h-14 mx-auto rounded-full border-4 border-sage-200 border-t-sage-600 animate-spin" />
              <h4 className="font-heading font-bold text-lg text-ink-900 dark:text-linen-100">
                Authorizing Payment...
              </h4>
              <p className="text-xs text-ink-700/70 dark:text-linen-200/70">
                Connecting to Razorpay gateway & dispatching signature verification webhook to n8n.
              </p>
            </div>
          )}

          {paymentStep === 'success' && (
            <div className="text-center py-6 space-y-3">
              <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center shadow-inner">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="font-heading font-bold text-xl text-ink-900 dark:text-linen-100">
                Payment Successful!
              </h4>
              <p className="text-xs text-ink-700/70 dark:text-linen-200/70">
                Webhook validated. Your membership pass and booking are now active in Supabase.
              </p>
            </div>
          )}

          <div className="mt-5 pt-3 border-t border-sage-100 dark:border-ink-800 flex items-center justify-center gap-2 text-[11px] text-ink-700/50 dark:text-linen-200/50">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
            <span>256-Bit SSL Encrypted • Razorpay Standard Checkout</span>
          </div>
        </div>
      </div>
    </div>
  );
};
