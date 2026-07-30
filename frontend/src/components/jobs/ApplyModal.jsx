import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, FileText, Check, ExternalLink } from 'lucide-react';

export default function ApplyModal({ job, isOpen, onClose, onSubmitSuccess, applications, candidateProfile, onOpenReferral, onBoostSkill }) {
  const [formData, setFormData] = useState({
    applicantName: '',
    applicantEmail: '',
    resumeUrl: '',
    coverLetter: '',
  });

  const [resumeFile, setResumeFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen || !job) return null;

  const validate = () => {
    const errs = {};
    if (!formData.applicantName.trim()) errs.applicantName = 'Full name is required';
    if (!formData.applicantEmail.trim()) {
      errs.applicantEmail = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.applicantEmail)) {
      errs.applicantEmail = 'Invalid email format';
    }
    if (!resumeFile && !formData.resumeUrl.trim() && !candidateProfile?.hasResume) {
      errs.resume = 'Please upload a resume or provide a portfolio link';
    }
    return errs;
  };

  const handleFileChange = (file) => {
    if (file && (file.name.endsWith('.pdf') || file.name.endsWith('.docx'))) {
      setResumeFile(file);
      setErrors((prev) => ({ ...prev, resume: null }));
    } else {
      setErrors((prev) => ({ ...prev, resume: 'Only PDF or DOCX files accepted' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const valErrs = validate();
    if (Object.keys(valErrs).length > 0) { setErrors(valErrs); return; }

    setIsSubmitting(true);
    setErrors({});

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      onSubmitSuccess?.(job.id, { ...formData, resumeFile });
    }, 1200);
  };

  const resetAndClose = () => {
    setIsSubmitted(false);
    setResumeFile(null);
    setFormData({ applicantName: '', applicantEmail: '', resumeUrl: '', coverLetter: '' });
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          data-testid="apply-modal"
          className="relative w-full max-w-lg bg-navy-950 border border-navy-750 rounded-2xl p-6 md:p-8 shadow-2xl z-10"
        >
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-white">Apply for {job.title}</h2>
              <p className="text-xs text-txt-secondary mt-1">{job.company} · {job.location}</p>
            </div>
            <button
              onClick={resetAndClose}
              className="p-1 rounded-lg text-txt-tertiary hover:text-white hover:bg-navy-900 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {job.externalUrl && (
            <div className="mb-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between text-xs gap-3">
              <div>
                <p className="font-bold text-amber-400">Official Employer Careers Portal</p>
                <p className="text-[11px] text-slate-300">Live job listing from {job.company}. Direct redirect available.</p>
              </div>
              <a
                href={job.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold flex items-center gap-1 shrink-0 text-xs shadow-sm transition-all"
              >
                <span>Direct Apply</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}

          {!isSubmitted ? (
            <div>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-txt-secondary mb-1.5">Full Name *</label>
                  <input
                    type="text"
                    data-testid="applicant-name-input"
                    value={formData.applicantName}
                    onChange={(e) => setFormData({ ...formData, applicantName: e.target.value })}
                    placeholder="Alex Morgan"
                    className={`w-full bg-navy-900 border rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none transition-colors ${
                      errors.applicantName ? 'border-rose-500' : 'border-navy-750 focus:border-brand'
                    }`}
                  />
                  {errors.applicantName && <p className="text-rose-400 text-xs mt-1">{errors.applicantName}</p>}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-txt-secondary mb-1.5">Email Address *</label>
                  <input
                    type="email"
                    data-testid="applicant-email-input"
                    value={formData.applicantEmail}
                    onChange={(e) => setFormData({ ...formData, applicantEmail: e.target.value })}
                    placeholder="alex@example.com"
                    className={`w-full bg-navy-900 border rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none transition-colors ${
                      errors.applicantEmail ? 'border-rose-500' : 'border-navy-750 focus:border-brand'
                    }`}
                  />
                  {errors.applicantEmail && <p className="text-rose-400 text-xs mt-1">{errors.applicantEmail}</p>}
                </div>

                {/* Resume upload */}
                <div>
                  <label className="block text-sm font-medium text-txt-secondary mb-1.5">Resume / CV *</label>
                  
                  {candidateProfile?.hasResume ? (
                    <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                        <Check className="w-5 h-5 text-emerald-400" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">Using Saved Resume</p>
                        <p className="text-xs text-emerald-400 mt-0.5">ATS Score: {candidateProfile.resumeScore}% • 1-Click Apply Ready</p>
                      </div>
                    </div>
                  ) : (
                    <div
                      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                      onDragLeave={() => setIsDragging(false)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setIsDragging(false);
                        if (e.dataTransfer.files?.[0]) handleFileChange(e.dataTransfer.files[0]);
                      }}
                      className={`border border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
                        isDragging
                          ? 'border-brand bg-brand-muted/30'
                          : resumeFile
                          ? 'border-emerald-500/40 bg-emerald-500/5'
                          : 'border-navy-700 bg-navy-900 hover:border-navy-600'
                      }`}
                    >
                      <input
                        type="file"
                        id="resume-upload"
                        accept=".pdf,.docx"
                        onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
                        className="hidden"
                      />
                      <label htmlFor="resume-upload" className="cursor-pointer block">
                        {resumeFile ? (
                          <div className="flex items-center justify-center gap-2 text-emerald-400 text-sm font-medium">
                            <FileText className="w-4 h-4" />
                            {resumeFile.name}
                            <span className="text-xs text-txt-tertiary">({(resumeFile.size / 1024).toFixed(0)} KB)</span>
                          </div>
                        ) : (
                          <div className="space-y-1">
                            <Upload className="w-5 h-5 text-txt-tertiary mx-auto" />
                            <p className="text-sm text-txt-secondary">
                              Drop your resume here or <span className="text-brand">browse</span>
                            </p>
                            <p className="text-xs text-txt-tertiary">PDF or DOCX, max 5MB</p>
                          </div>
                        )}
                      </label>
                    </div>
                  )}
                  {errors.resume && <p className="text-rose-400 text-xs mt-1">{errors.resume}</p>}
                </div>

                {/* Portfolio */}
                <div>
                  <label className="block text-sm font-medium text-txt-secondary mb-1.5">Portfolio / LinkedIn URL</label>
                  <input
                    type="url"
                    value={formData.resumeUrl}
                    onChange={(e) => setFormData({ ...formData, resumeUrl: e.target.value })}
                    placeholder="https://github.com/alexmorgan"
                    className="w-full bg-navy-900 border border-navy-750 focus:border-brand rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none transition-colors"
                  />
                </div>

                {/* Actions */}
                <div className="pt-3 flex items-center justify-end gap-3">
                  <button type="button" onClick={resetAndClose} className="px-4 py-2 text-sm font-medium text-txt-secondary hover:text-white transition-colors">
                    Cancel
                  </button>
                  <button
                    type="submit"
                    data-testid="apply-submit-button"
                    disabled={isSubmitting}
                    className="px-5 py-2.5 text-sm font-semibold text-white bg-brand hover:bg-brand-light rounded-lg transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Application'}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="text-center py-6 space-y-5" data-testid="apply-success-container">
              <div className="w-14 h-14 bg-emerald-500/15 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto">
                <Check className="w-7 h-7 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Application Submitted!</h3>
                <p className="text-xs text-txt-secondary mt-1">
                  Thanks, <span className="text-white font-medium">{formData.applicantName}</span>. Your application for <span className="text-white font-medium">{job.title}</span> at {job.company} has been sent.
                </p>
              </div>

              {/* Post-Apply Gamification Cards */}
              <div className="space-y-3 pt-2 text-left">
                {/* 1. Referral Card */}
                <div className="p-3.5 rounded-xl bg-navy-900/80 border border-brand/30 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                      Ask for a Referral
                    </p>
                    <p className="text-[11px] text-txt-secondary mt-0.5">3 connections work at {job.company}</p>
                  </div>
                  <button
                    onClick={() => { onOpenReferral?.(job); resetAndClose(); }}
                    className="px-3 py-1.5 text-xs font-bold text-brand bg-brand-muted hover:bg-brand/20 border border-brand/40 rounded-lg transition-colors shrink-0"
                  >
                    Request
                  </button>
                </div>

                {/* 2. Skill Boost Card */}
                {job.techStack?.[0] && (
                  <div className="p-3.5 rounded-xl bg-navy-900/80 border border-purple-500/30 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold text-white">Boost your Match Score to 95%</p>
                      <p className="text-[11px] text-txt-secondary mt-0.5">Add "{job.techStack[0]}" to your profile skills</p>
                    </div>
                    <button
                      onClick={() => { onBoostSkill?.(job.techStack[0]); resetAndClose(); }}
                      className="px-3 py-1.5 text-xs font-bold text-purple-300 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 rounded-lg transition-colors shrink-0"
                    >
                      + Add Skill
                    </button>
                  </div>
                )}
              </div>

              <button onClick={resetAndClose} className="w-full py-2.5 text-xs font-bold text-white bg-navy-800 hover:bg-navy-750 border border-navy-700 rounded-lg transition-colors mt-2">
                Done
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
