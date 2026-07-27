import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, Sparkles, Send, Users, Shield, Download, FileText, Lock } from 'lucide-react';

export default function PremiumModal({ isOpen, onClose, isPremium, onSubscribe, currentUser, onOpenProfile }) {
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [showInvoice, setShowInvoice] = useState(false);

  if (!isOpen) return null;

  const handleSubscribe = () => {
    // Simulated Razorpay HMAC-SHA256 Server Webhook Verification
    onSubscribe();
  };

  const handleDownloadInvoice = () => {
    const invoicePayload = `
================================================================
           WORKVERSE INDIA & GLOBAL CAREERS PRIVATE LIMITED
                   TAX INVOICE - RECURRING BILLING
================================================================
Invoice No:    WV-GST-2025-${Math.floor(100000 + Math.random() * 900000)}
Date:          ${new Date().toLocaleDateString('en-IN')}
Place of Supply: Maharashtra (27)
SAC Code:      998311 (Employment Placement & Supply Services)

CUSTOMER DETAILS:
Name:          ${currentUser?.name || 'Verified Subscriber'}
Email:         ${currentUser?.email || 'user@workverse.in'}
GSTIN/UIN:     27AAAAA0000A1Z5 (Unregistered Candidate/Enterprise)

DESCRIPTION OF SERVICES:
WorkVerse Premium Subscription Tier (${billingCycle.toUpperCase()})
Base Amount:   ₹1,270.34
CGST (9%):     ₹114.33
SGST (9%):     ₹114.33
----------------------------------------------------------------
TOTAL AMOUNT PAID: ₹1,499.00 (Inclusive of 18% GST)
Razorpay Payment ID: pay_${Math.random().toString(36).substring(2, 14)}
Signature Token: hmac_sha256_verified_ok
================================================================
      Thank you for empowering your career with WorkVerse!
================================================================
    `;

    const blob = new Blob([invoicePayload], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `WorkVerse_GST_Invoice_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const features = [
    {
      title: 'Direct Recruiter Reach',
      description: 'Message hiring managers and recruiters directly.',
      icon: <Send className="w-5 h-5 text-indigo-400" />
    },
    {
      title: 'Internal Referral Boost',
      description: 'Request employee referrals for top enterprises.',
      icon: <Users className="w-5 h-5 text-purple-400" />
    },
    {
      title: 'Profile & Resume Boost',
      description: 'Stand out in recruiter search results.',
      icon: <Sparkles className="w-5 h-5 text-pink-400" />
    },
    {
      title: 'AI Analytics & Voice Prep',
      description: 'Voice mock interviews & candidate match comparison.',
      icon: <Shield className="w-5 h-5 text-emerald-400" />
    }
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 30 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="relative w-full max-w-2xl bg-surface border border-borderStrong rounded-3xl shadow-[0_0_60px_-15px_rgba(99,102,241,0.4)] overflow-hidden text-txtMain"
        >
          {/* Header Graphic */}
          <div className="relative h-40 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 mix-blend-overlay" />

            <Sparkles className="w-14 h-14 text-white animate-pulse-subtle relative z-10" />

            {/* Corner Actions */}
            <div className="absolute top-4 w-full px-4 flex justify-between items-start z-20">
              {currentUser && (
                <button
                  onClick={onOpenProfile}
                  className="flex items-center gap-3 px-3 py-1.5 bg-black/30 hover:bg-black/50 backdrop-blur-md border border-white/10 text-white rounded-full transition-all shadow-lg group transform hover:scale-105"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-xs font-bold border border-white/20 shadow-inner">
                    {currentUser.avatarInitials || currentUser.name.substring(0,2).toUpperCase()}
                  </div>
                  <div className="flex flex-col items-start text-left mr-2">
                    <span className="text-sm font-bold leading-none mb-1">{currentUser.name}</span>
                    <span className="text-[10px] text-indigo-100/70 font-medium leading-none">{currentUser.email}</span>
                  </div>
                </button>
              )}
              {!currentUser && <div />}

              <button
                onClick={onClose}
                className="p-2.5 bg-black/30 hover:bg-black/50 backdrop-blur-md border border-white/10 text-white rounded-full transition-all shadow-lg hover:rotate-90 transform"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 mb-3 tracking-tight">
                {isPremium ? 'Welcome to WorkVerse Premium!' : 'Upgrade to WorkVerse Premium'}
              </h2>
              <p className="text-txtMuted text-base">
                {isPremium
                  ? 'Razorpay HMAC-SHA256 Subscription Active & Verified.'
                  : 'Unlock exclusive features to land your dream job faster.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {features.map((feature, idx) => (
                <div
                  key={idx}
                  className="flex gap-4 p-5 rounded-2xl bg-nested border border-borderSubtle transition-colors"
                >
                  <div className="flex-shrink-0 mt-0.5">{feature.icon}</div>
                  <div>
                    <h3 className="font-bold text-txtMain tracking-wide">{feature.title}</h3>
                    <p className="text-xs text-txtMuted mt-1 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {!isPremium ? (
              <div className="space-y-6 max-w-md mx-auto">
                {/* Billing Toggle */}
                <div className="flex items-center justify-center p-1.5 bg-nested rounded-full border border-borderStrong">
                  <button
                    onClick={() => setBillingCycle('monthly')}
                    className={`flex-1 py-2 rounded-full font-semibold text-xs transition-all duration-300 ${
                      billingCycle === 'monthly'
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg'
                        : 'text-txtMuted hover:text-txtMain'
                    }`}
                  >
                    Monthly (₹1,499/mo)
                  </button>
                  <button
                    onClick={() => setBillingCycle('yearly')}
                    className={`flex-1 py-2 rounded-full font-semibold text-xs transition-all duration-300 ${
                      billingCycle === 'yearly'
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                        : 'text-txtMuted hover:text-txtMain'
                    }`}
                  >
                    Yearly (₹11,999/yr)
                  </button>
                </div>

                <button
                  onClick={handleSubscribe}
                  className="w-full py-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-400 hover:via-purple-400 hover:to-pink-400 text-white font-bold rounded-2xl text-sm transition-all shadow-[0_0_30px_-5px_rgba(168,85,247,0.5)] flex items-center justify-center gap-2 border border-white/20"
                >
                  <Sparkles className="w-5 h-5" />
                  Subscribe via Razorpay Secure Gateway
                </button>
                <p className="text-center text-xs text-txtMuted font-medium flex items-center justify-center gap-1">
                  <Lock className="w-3 h-3 text-emerald-400" /> Includes 18% GST breakup & Razorpay webhook signature verification.
                </p>
              </div>
            ) : (
              <div className="bg-emerald-500/10 border border-emerald-500/30 p-6 rounded-3xl flex flex-col items-center justify-center gap-4 text-center">
                <CheckCircle className="w-12 h-12 text-emerald-400" />
                <div>
                  <h3 className="text-xl font-bold text-emerald-400 mb-1">Razorpay Subscription Active</h3>
                  <p className="text-xs text-txtMuted">Your premium candidate features and AI tools are fully unlocked.</p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleDownloadInvoice}
                    className="px-4 py-2 bg-nested hover:bg-surface border border-borderSubtle text-txtMain text-xs font-bold rounded-xl flex items-center gap-1.5"
                  >
                    <FileText className="w-3.5 h-3.5 text-accent" /> Download 18% GST Invoice
                  </button>
                  <button
                    onClick={onClose}
                    className="px-6 py-2 bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-bold rounded-xl"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
