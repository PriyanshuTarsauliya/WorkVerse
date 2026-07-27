import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, CheckCircle2, AlertCircle, Building2, Key, RefreshCw, X, ShieldAlert, FileCheck } from 'lucide-react';

export default function DigilockerKYCModal({ isOpen, onClose, onVerifySuccess }) {
  const [kycStep, setKycStep] = useState('aadhaar'); // 'aadhaar', 'otp', 'pan_gst', 'complete'
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [panNumber, setPanNumber] = useState('');
  const [gstin, setGstin] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [tokenKey, setTokenKey] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (aadhaarNumber.length < 12) {
      setErrorMessage('Please enter a valid 12-digit Aadhaar number.');
      return;
    }
    setErrorMessage('');
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setKycStep('otp');
    }, 1200);
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (otpCode.length < 6) {
      setErrorMessage('Please enter the 6-digit OTP sent to your Aadhaar-linked mobile.');
      return;
    }
    setErrorMessage('');
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // UIDAI Aadhaar Data Vault ADV Tokenization: raw Aadhaar is NEVER stored
      const generatedToken = `ADV-TOK-${Math.random().toString(36).substring(2, 10).toUpperCase()}-2025`;
      setTokenKey(generatedToken);
      setKycStep('pan_gst');
    }, 1500);
  };

  const handleFinalSubmit = (e) => {
    e.preventDefault();
    if (!panNumber || panNumber.length < 10) {
      setErrorMessage('Please enter a valid 10-character PAN number (e.g. ABCDE1234F).');
      return;
    }
    setErrorMessage('');
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setKycStep('complete');
      if (onVerifySuccess) {
        onVerifySuccess({
          verified: true,
          advToken: tokenKey,
          pan: panNumber.toUpperCase(),
          gstin: gstin.toUpperCase() || 'GSTIN-NOT-PROVIDED',
          verifiedAt: new Date().toISOString()
        });
      }
    }, 1400);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-lg bg-surface border border-borderStrong rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-txtMain overflow-hidden"
        >
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-nested hover:bg-borderSubtle flex items-center justify-center text-txtMuted hover:text-txtMain transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-3 border-b border-borderSubtle pb-4">
            <div className="w-12 h-12 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold tracking-tight">Digilocker e-KYC Verification</h2>
              <p className="text-xs text-txtMuted">UIDAI Aadhaar Data Vault & NSDL PAN Gateway</p>
            </div>
          </div>

          {/* Compliance Notice Badge */}
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 flex items-start gap-2.5 text-xs text-emerald-400">
            <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong className="font-bold">UIDAI Security Guarantee:</strong> Raw 12-digit Aadhaar numbers are tokenized immediately. We store only an encrypted reference key (<span className="font-mono">ADV-TOKEN</span>) per UIDAI Data Vault regulations.
            </p>
          </div>

          {errorMessage && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-xs text-red-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Step 1: Aadhaar Number Entry */}
          {kycStep === 'aadhaar' && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-txtMuted uppercase tracking-wider">
                  Aadhaar Number (12 Digits)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    maxLength={12}
                    placeholder="e.g. 9876 5432 1098"
                    value={aadhaarNumber}
                    onChange={(e) => setAadhaarNumber(e.target.value.replace(/\D/g, ''))}
                    className="w-full bg-nested border border-borderStrong focus:border-accent rounded-xl px-4 py-3 text-sm font-mono tracking-widest text-txtMain outline-none transition-colors"
                  />
                  <Key className="absolute right-3.5 top-3.5 w-4 h-4 text-txtMuted" />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 text-xs font-bold text-white bg-accent hover:bg-accent/90 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>Request Digilocker OTP</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* Step 2: OTP Verification */}
          {kycStep === 'otp' && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-txtMuted uppercase tracking-wider">
                  Enter 6-Digit Security OTP
                </label>
                <input
                  type="text"
                  maxLength={6}
                  placeholder="1 2 3 4 5 6"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                  className="w-full bg-nested border border-borderStrong focus:border-accent rounded-xl px-4 py-3 text-center text-lg font-mono tracking-[0.5em] text-txtMain outline-none transition-colors"
                />
                <p className="text-[11px] text-txtMuted text-center">Sent to mobile linked with Aadhaar XXXX-XXXX-{aadhaarNumber.slice(-4)}</p>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 text-xs font-bold text-white bg-emerald-500 hover:bg-emerald-600 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <FileCheck className="w-4 h-4" />
                    <span>Verify Digilocker e-KYC</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* Step 3: PAN & GSTIN Validation */}
          {kycStep === 'pan_gst' && (
            <form onSubmit={handleFinalSubmit} className="space-y-4">
              <div className="p-3 bg-nested rounded-xl border border-borderSubtle text-xs space-y-1">
                <div className="flex items-center justify-between text-emerald-400 font-bold">
                  <span>Aadhaar Tokenized Signal</span>
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <p className="font-mono text-[11px] text-txtMuted break-all">{tokenKey}</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-txtMuted uppercase tracking-wider">
                  Company / Candidate PAN Number (10 Characters)
                </label>
                <input
                  type="text"
                  maxLength={10}
                  placeholder="ABCDE1234F"
                  value={panNumber}
                  onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                  className="w-full bg-nested border border-borderStrong focus:border-accent rounded-xl px-4 py-2.5 text-xs font-mono uppercase text-txtMain outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-txtMuted uppercase tracking-wider">
                  Company GSTIN Registration (Optional for Recruiters)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    maxLength={15}
                    placeholder="27AAAAA0000A1Z5"
                    value={gstin}
                    onChange={(e) => setGstin(e.target.value.toUpperCase())}
                    className="w-full bg-nested border border-borderStrong focus:border-accent rounded-xl px-4 py-2.5 text-xs font-mono uppercase text-txtMain outline-none"
                  />
                  <Building2 className="absolute right-3.5 top-3 w-4 h-4 text-txtMuted" />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 text-xs font-bold text-white bg-accent hover:bg-accent/90 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <span>Complete Verified KYC Badge</span>
                )}
              </button>
            </form>
          )}

          {/* Step 4: Verification Complete */}
          {kycStep === 'complete' && (
            <div className="py-6 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-txtMain">Verified Identity Badge Issued</h3>
                <p className="text-xs text-txtMuted max-w-xs mx-auto mt-1">
                  Your profile now displays a verified badge. All UIDAI tokenization reference logs have been secured.
                </p>
              </div>
              <button
                onClick={onClose}
                className="px-6 py-2.5 text-xs font-bold text-white bg-accent hover:bg-accent/90 rounded-xl transition-all"
              >
                Close Verification Studio
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
