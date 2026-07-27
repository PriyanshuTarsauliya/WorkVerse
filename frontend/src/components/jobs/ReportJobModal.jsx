import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, CheckCircle2, X, AlertTriangle, Send } from 'lucide-react';

export default function ReportJobModal({ isOpen, onClose, job }) {
  const [reason, setReason] = useState('fake_scam');
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmitReport = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1200);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-md bg-surface border border-borderStrong rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-txtMain overflow-hidden"
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
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 shrink-0">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold tracking-tight">Report Suspicious Job</h2>
              <p className="text-xs text-txtMuted">{job?.title || 'Job Listing Moderation'}</p>
            </div>
          </div>

          {isSubmitted ? (
            <div className="py-6 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-txtMain">Report Queued for Moderation Review</h3>
              <p className="text-xs text-txtMuted max-w-xs mx-auto">
                Thank you for helping keep WorkVerse safe. Our Trust & Safety team will audit this job posting within 24 hours.
              </p>
              <button
                onClick={onClose}
                className="px-6 py-2.5 text-xs font-bold text-white bg-accent hover:bg-accent/90 rounded-xl"
              >
                Close Window
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmitReport} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-txtMuted uppercase tracking-wider">
                  Reason for Flagging
                </label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full bg-nested border border-borderStrong focus:border-accent rounded-xl px-4 py-2.5 text-xs font-semibold text-txtMain outline-none"
                >
                  <option value="fake_scam">Fraudulent or Phishing Listing</option>
                  <option value="pay_to_work">Recruiter Asking Money for Offer Letter</option>
                  <option value="misleading_salary">Misleading Compensation / Fake Package</option>
                  <option value="duplicate_spam">Duplicate Spam Posting</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-txtMuted uppercase tracking-wider">
                  Additional Details
                </label>
                <textarea
                  rows={3}
                  placeholder="Provide context or email text sent by recruiter..."
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  className="w-full bg-nested border border-borderStrong focus:border-accent rounded-xl p-3 text-xs text-txtMain outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 text-xs font-bold text-white bg-red-500 hover:bg-red-600 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Submitting Report...' : 'Submit to Moderation Team'}</span>
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
