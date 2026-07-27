import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, MapPin, DollarSign, Clock, Briefcase, ExternalLink, Share2, Star, Users, CheckCircle,
  ChevronDown, ChevronUp, Sparkles, Building2, ShieldCheck, Zap
} from 'lucide-react';
import JobPostingSchema from '../seo/JobPostingSchema';

const formatSalary = (min, max) => {
  if (!min) return 'Competitive';
  const minLakhs = (min / 100000).toFixed(min % 100000 === 0 ? 0 : 1);
  const maxLakhs = max ? (max / 100000).toFixed(max % 100000 === 0 ? 0 : 1) : null;
  return maxLakhs ? `₹${minLakhs} – ₹${maxLakhs} LPA` : `₹${minLakhs}+ LPA`;
};

export default function JobDetailModal({ job, isOpen, onClose, onOpenApply, onShareJob, applications, allJobs = [], onStartMockInterview }) {
  const [showInsights, setShowInsights] = useState(false);

  if (!isOpen || !job) return null;

  const responsibilities = [
    'Design, develop, and deploy scalable cloud microservices using modern architecture.',
    'Collaborate closely with product, design, and engineering teams to ship features.',
    'Write clean, well-tested code adhering to industry best practices.',
    'Optimize system performance, reducing latency and improving throughput.',
  ];

  const requirements = [
    `${job.experienceYears || '3+'} years of professional software development experience.`,
    `Proficiency in ${(job.techStack || []).slice(0, 3).join(', ')} or equivalent technologies.`,
    'Strong problem-solving skills and passion for building great products.',
    'Excellent communication skills and experience in collaborative development.',
  ];

  const perks = [
    { icon: '🌐', label: 'Remote / Flexible' },
    { icon: '📈', label: 'Equity Package' },
    { icon: '🏥', label: 'Health & Dental' },
    { icon: '📚', label: 'Learning Budget' },
    { icon: '🏖️', label: 'Generous PTO' },
  ];

  // Similar jobs: same job type or overlapping tech, excluding current
  const similarJobs = allJobs
    .filter((j) => j.id !== job.id)
    .filter((j) => j.jobType === job.jobType || (job.techStack || []).some((t) => (j.techStack || []).includes(t)))
    .slice(0, 3);

  const hasApplied = applications?.[job?.id] === 'applied';

  return (
    <AnimatePresence>
      <JobPostingSchema job={job} />
      <div className="fixed inset-0 z-50 flex items-center justify-end">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Drawer */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 220 }}
          data-testid="job-detail-modal"
          className="relative z-10 w-full max-w-2xl h-full bg-surface border-l border-borderSubtle flex flex-col overflow-y-auto theme-transition shadow-2xl"
        >
          {/* Header */}
          <div className="p-6 bg-surface-nested border-b border-borderSubtle">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 border border-borderSubtle flex items-center justify-center text-white text-lg font-bold shadow-md">
                  {(job.company || 'T').charAt(0)}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-txtMain" data-testid="job-detail-title">{job.title}</h2>
                  <div className="flex items-center gap-2 mt-1 text-sm text-txtMuted">
                    <span className="font-semibold text-txtMain" data-testid="job-detail-company">{job.company}</span>
                    <span className="flex items-center gap-0.5 text-amber-500 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-500" />
                      {job.companyRating}
                    </span>
                    <span className="text-xs">({job.companyReviewCount || 450} reviews)</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onShareJob?.(job)}
                  className="w-8 h-8 rounded-lg bg-nested hover:bg-borderSubtle flex items-center justify-center text-txtMuted hover:text-txtMain transition-colors border border-borderSubtle"
                  title="Share this job"
                >
                  <Share2 className="w-4 h-4" />
                </button>
                <button
                  onClick={onClose}
                  data-testid="job-detail-close-button"
                  className="w-8 h-8 rounded-lg bg-nested hover:bg-borderSubtle flex items-center justify-center text-txtMuted hover:text-txtMain transition-colors border border-borderSubtle"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick info */}
            <div className="flex flex-wrap gap-2">
              <span className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-accent bg-accent/15 border border-accent/30 rounded-md">
                <Briefcase className="w-3.5 h-3.5" />
                {(job.jobType || 'FULL_TIME').replace('_', ' ')}
              </span>
              <span className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-txtMuted bg-nested border border-borderSubtle rounded-md">
                <MapPin className="w-3.5 h-3.5" />
                {job.location}
              </span>
              <span className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-success bg-success-bg border border-success/30 rounded-md" data-testid="job-detail-salary">
                {formatSalary(job.salaryMin, job.salaryMax)}
              </span>
              {job.postedDaysAgo != null && (
                <span className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-txtMuted bg-nested border border-borderSubtle rounded-md">
                  <Clock className="w-3.5 h-3.5" />
                  {job.postedDaysAgo === 0 ? 'Today' : `${job.postedDaysAgo}d ago`}
                </span>
              )}
              <span className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-txtMuted bg-nested border border-borderSubtle rounded-md">
                <Users className="w-3.5 h-3.5" />
                {job.applicationCount || 0} applicants
              </span>
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 p-6 space-y-8">
            {/* Company Insights Snippet & Drawer */}
            {job.companyInsights && (
              <div className="bg-nested/60 border border-borderSubtle rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-accent" />
                    <h3 className="text-xs font-bold text-txtMain uppercase tracking-wider">Company Insights</h3>
                  </div>
                  <button
                    onClick={() => setShowInsights(!showInsights)}
                    className="text-xs font-semibold text-accent flex items-center gap-1 hover:underline"
                  >
                    {showInsights ? 'Less info' : 'More insights'}
                    {showInsights ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <p className="text-xs text-txtMuted mt-1.5 font-medium">{job.companyInsights.summary}</p>

                <AnimatePresence>
                  {showInsights && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden pt-3 border-t border-borderSubtle mt-3 space-y-2.5 text-xs"
                    >
                      <div>
                        <span className="font-bold text-txtMain">Funding & Growth: </span>
                        <span className="text-txtMuted">{job.companyInsights.funding} — {job.companyInsights.growth}</span>
                      </div>
                      <div>
                        <span className="font-bold text-txtMain">Work Culture: </span>
                        <span className="text-txtMuted">{job.companyInsights.culture}</span>
                      </div>
                      <div>
                        <span className="font-bold text-txtMain">Salary Transparency: </span>
                        <span className="text-txtMuted">{job.companyInsights.salaryTransparency}</span>
                      </div>
                      <div>
                        <span className="font-bold text-txtMain">Tech Maturity: </span>
                        <span className="text-txtMuted">{job.companyInsights.techMaturity}</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Overview */}
            <div>
              <h3 className="text-sm font-semibold text-txtMain mb-2">About this role</h3>
              <p className="text-sm text-txtMuted leading-relaxed">{job.description}</p>
            </div>

            {/* Tech */}
            <div>
              <h3 className="text-sm font-semibold text-txtMain mb-3">Tech stack</h3>
              <div className="flex flex-wrap gap-2">
                {(job.techStack || []).map((tech, i) => (
                  <span key={i} className="px-2.5 py-1 text-xs font-medium text-txtMuted bg-nested border border-borderSubtle rounded-md">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Responsibilities */}
            <div>
              <h3 className="text-sm font-semibold text-txtMain mb-3">Key responsibilities</h3>
              <ul className="space-y-2">
                {responsibilities.map((r, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-txtMuted">
                    <CheckCircle className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Requirements */}
            <div>
              <h3 className="text-sm font-semibold text-txtMain mb-3">Requirements</h3>
              <ul className="space-y-2">
                {requirements.map((r, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-txtMuted">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0 mt-2" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Perks */}
            <div>
              <h3 className="text-sm font-semibold text-txtMain mb-3">Perks & benefits</h3>
              <div className="flex flex-wrap gap-2">
                {perks.map((p, i) => (
                  <span key={i} className="px-3 py-1.5 text-xs font-medium text-txtMuted bg-nested border border-borderSubtle rounded-lg">
                    {p.icon} {p.label}
                  </span>
                ))}
              </div>
            </div>

            {/* Similar Jobs */}
            {similarJobs.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-txtMain mb-3">Similar roles you might like</h3>
                <div className="space-y-2">
                  {similarJobs.map((sj) => (
                    <div key={sj.id} className="flex items-center justify-between p-3 bg-nested border border-borderSubtle rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-txtMain">{sj.title}</p>
                        <p className="text-xs text-txtMuted">{sj.company} · {sj.location}</p>
                      </div>
                      <span className="text-xs font-bold text-success">
                        {sj.salaryMin ? formatSalary(sj.salaryMin, sj.salaryMax) : ''}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer CTA */}
          <div className="p-5 bg-surface-nested border-t border-borderSubtle flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold text-accent">
                {(job.applicationCount || 0) < 10 ? '🚀 Be among the first 10 applicants!' : `🔥 ${job.applicationCount} applied in last 2 hours`}
              </p>
              <p className="text-sm font-semibold text-txtMain">{job.company}</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  onClose();
                  onStartMockInterview?.(job);
                }}
                className="px-4 py-2.5 text-xs font-bold text-accent bg-accent/10 border border-accent/20 hover:bg-accent/20 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap"
              >
                <Sparkles className="w-3.5 h-3.5" /> Start Mock Interview
              </button>

              {hasApplied ? (
                <div className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 dark:bg-emerald-900/30 dark:border-emerald-700/50 dark:text-emerald-300 rounded-xl" data-testid="job-detail-applied-badge">
                  <CheckCircle className="w-4 h-4" />
                  Applied
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      onClose();
                      onOpenApply(job, true);
                    }}
                    data-testid="job-detail-quick-apply-button"
                    className="px-5 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 rounded-xl transition-all shadow-md flex items-center gap-1.5"
                  >
                    <Zap className="w-4 h-4 fill-white text-white animate-pulse" />
                    1-Click Apply
                  </button>

                  <button
                    onClick={() => {
                      onClose();
                      onOpenApply(job, false);
                    }}
                    data-testid="job-detail-apply-button"
                    className="px-5 py-2.5 text-sm font-bold text-txtMain bg-nested hover:bg-borderSubtle border border-borderSubtle rounded-xl transition-all"
                  >
                    Apply Now
                  </button>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
