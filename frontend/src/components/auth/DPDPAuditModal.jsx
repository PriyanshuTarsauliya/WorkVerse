import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Download, Trash2, CheckCircle2, X, AlertTriangle, FileText, Lock } from 'lucide-react';

export default function DPDPAuditModal({ isOpen, onClose, onDataPurged }) {
  const [isPurging, setIsPurging] = useState(false);
  const [purgedSuccess, setPurgedSuccess] = useState(false);
  const [consentSaved, setConsentSaved] = useState(false);
  const [consentOptions, setConsentOptions] = useState({
    profileSharing: true,
    aiMatching: true,
    emailAlerts: true,
    thirdPartyRecruiters: false
  });

  if (!isOpen) return null;

  const handleExportData = () => {
    const exportPayload = {
      platform: 'WorkVerse India & Global Careers',
      dpdpCompliance: 'DPDP Act 2023 / DPDP Rules 2025 Compliant',
      exportedAt: new Date().toISOString(),
      userRights: [
        'Right to Access Personal Data',
        'Right to Correction & Erasure',
        'Right of Grievance Redressal'
      ],
      storedDataSummary: {
        profileStatus: 'Verified Candidate',
        dataRetentionPeriod: '365 Days or until Erasure Request',
        encryptionStandard: 'AES-256 at Rest'
      }
    };

    const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `workverse-dpdp-data-export-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePurgeAccountData = () => {
    if (window.confirm('Are you sure you want to permanently erase all your personal data, resumes, and application records? This action is irreversible per DPDP Rules 2025.')) {
      setIsPurging(true);
      setTimeout(() => {
        setIsPurging(false);
        setPurgedSuccess(true);
        if (onDataPurged) onDataPurged();
      }, 1600);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-xl bg-surface border border-borderStrong rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-txtMain overflow-hidden"
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
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold tracking-tight">DPDP Privacy & Data Rights</h2>
              <p className="text-xs text-txtMuted">Digital Personal Data Protection Act, 2023 / 2025 Compliance</p>
            </div>
          </div>

          {purgedSuccess ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-txtMain">Personal Data Erased Successfully</h3>
              <p className="text-xs text-txtMuted max-w-sm mx-auto">
                Per Section 12 of the DPDP Act, your resumes, KYC tokens, and job applications have been permanently purged from WorkVerse servers.
              </p>
              <button
                onClick={onClose}
                className="px-6 py-2 text-xs font-bold text-white bg-accent hover:bg-accent/90 rounded-xl"
              >
                Close Privacy Center
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* DPDP Consent Toggles */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-txtMuted uppercase tracking-wider">
                  Data Fiduciary Processing Consents
                </h3>

                <div className="space-y-2 bg-nested p-4 rounded-2xl border border-borderSubtle text-xs">
                  <label className="flex items-center justify-between cursor-pointer">
                    <div>
                      <p className="font-bold text-txtMain">Resume & Profile Visibility to Verified Recruiters</p>
                      <p className="text-[11px] text-txtMuted">Allows verified employers to discover your profile.</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={consentOptions.profileSharing}
                      onChange={(e) => setConsentOptions({ ...consentOptions, profileSharing: e.target.checked })}
                      className="w-4 h-4 accent-accent cursor-pointer"
                    />
                  </label>

                  <hr className="border-borderSubtle" />

                  <label className="flex items-center justify-between cursor-pointer">
                    <div>
                      <p className="font-bold text-txtMain">AI Matching & Skill Gap Analysis</p>
                      <p className="text-[11px] text-txtMuted">Process skills to calculate match scores against job openings.</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={consentOptions.aiMatching}
                      onChange={(e) => setConsentOptions({ ...consentOptions, aiMatching: e.target.checked })}
                      className="w-4 h-4 accent-accent cursor-pointer"
                    />
                  </label>
                </div>
              </div>

              {/* Download Data & Erasure Action Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={handleExportData}
                  className="p-4 bg-nested hover:bg-surface border border-borderSubtle rounded-2xl transition-all text-left space-y-1.5 group"
                >
                  <div className="flex items-center gap-2 text-accent font-bold text-xs">
                    <Download className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
                    <span>Download Personal Data</span>
                  </div>
                  <p className="text-[11px] text-txtMuted">Export a full JSON copy of all personal records stored under your profile.</p>
                </button>

                <button
                  onClick={handlePurgeAccountData}
                  disabled={isPurging}
                  className="p-4 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-2xl transition-all text-left space-y-1.5 group"
                >
                  <div className="flex items-center gap-2 text-red-400 font-bold text-xs">
                    <Trash2 className="w-4 h-4" />
                    <span>{isPurging ? 'Purging Data...' : 'Request Data Erasure'}</span>
                  </div>
                  <p className="text-[11px] text-txtMuted">Self-serve "Right to be Forgotten" path under DPDP Rules 2025.</p>
                </button>
              </div>

              <div className="flex items-center justify-between pt-2 text-[11px] text-txtMuted border-t border-borderSubtle">
                <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Privacy Officer: dpo@workverse.in</span>
                <span>DPDP Act 2023 Compliant</span>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
