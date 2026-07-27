import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, DollarSign, Clock, Users, Star, Share2, Zap, TrendingUp, Bookmark, Sparkles, IndianRupee, CheckCircle
} from 'lucide-react';

const formatSalaryRupees = (min, max) => {
  const minLakhs = (min / 100000).toFixed(min % 100000 === 0 ? 0 : 1);
  const maxLakhs = max ? (max / 100000).toFixed(max % 100000 === 0 ? 0 : 1) : null;
  return maxLakhs ? `₹${minLakhs} – ₹${maxLakhs} LPA` : `₹${minLakhs}+ LPA`;
};

const formatPostedDate = (days) => {
  if (!days || days === 0) return 'Today';
  if (days === 1) return '1d ago';
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
};

const COMPANY_COLORS = [
  'from-blue-600 to-indigo-700',
  'from-violet-600 to-purple-700',
  'from-emerald-600 to-teal-700',
  'from-orange-500 to-red-600',
  'from-pink-500 to-rose-600',
  'from-cyan-600 to-blue-700',
  'from-amber-500 to-orange-600',
  'from-green-600 to-emerald-700',
];

export function JobCardSkeleton() {
  return (
    <div className="relative bg-surface border border-borderSubtle rounded-xl p-5 overflow-hidden theme-transition shadow-sm">
      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-var(--shimmer-from) via-var(--shimmer-via) to-var(--shimmer-to) animate-shimmer" />
      <div className="flex flex-col h-full justify-between space-y-4">
        <div>
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-start gap-3 w-full">
              <div className="w-10 h-10 rounded-lg bg-nested shrink-0" />
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-nested rounded w-3/4" />
                <div className="h-3 bg-nested rounded w-1/2" />
              </div>
            </div>
            <div className="w-8 h-8 rounded-lg bg-nested shrink-0" />
          </div>
          <div className="flex gap-3 mb-3">
            <div className="h-3 bg-nested rounded w-1/4" />
            <div className="h-3 bg-nested rounded w-1/3" />
          </div>
          <div className="flex gap-2 mb-3">
            <div className="h-5 bg-nested rounded w-16" />
            <div className="h-5 bg-nested rounded w-20" />
            <div className="h-5 bg-nested rounded w-14" />
          </div>
          <div className="h-10 bg-nested rounded w-full mb-3" />
        </div>
        <div className="pt-3 border-t border-borderSubtle flex items-center justify-between">
          <div className="h-4 bg-nested rounded w-1/4" />
          <div className="flex gap-2">
            <div className="h-8 bg-nested rounded w-16" />
            <div className="h-8 bg-nested rounded w-20" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function JobCard({ job, index, onApply, onToggleBookmark, onShareJob, applications, isPremium }) {
  const colorIdx = (job.company || '').charCodeAt(0) % COMPANY_COLORS.length;
  const matchScore = job.matchScore || job.matchPct;
  const isTopRecommended = matchScore && matchScore >= 80;
  const hasApplied = applications?.[job.id] === 'applied';
  const isSaved = applications?.[job.id] === 'saved';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
      onClick={() => onApply(job)}
      data-testid={`job-card-${job.id}`}
      className={`group relative bg-surface border rounded-xl p-5 cursor-pointer theme-transition shadow-sm hover:shadow-md ${
        isTopRecommended
          ? 'border-accent/40 bg-accent/5 dark:bg-accent/10'
          : 'border-borderSubtle hover:border-borderStrong'
      }`}
    >
      {/* Top Recommendation Badge */}
      {isTopRecommended && (
        <div className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-accent text-white shadow-lg flex items-center gap-1">
          <Sparkles className="w-3 h-3 fill-white animate-pulse-subtle" />
          Top Recommendation
        </div>
      )}

      <div className="flex flex-col h-full justify-between">
        {/* Header row */}
        <div>
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-start gap-3">
              {/* Company logo */}
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${COMPANY_COLORS[colorIdx]} flex items-center justify-center text-white text-sm font-bold shrink-0 shadow-md`}>
                {(job.company || 'W').charAt(0)}
              </div>
              <div className="min-w-0">
                <h3 className="text-[15px] font-semibold text-txtMain leading-snug group-hover:text-accent transition-colors line-clamp-2" data-testid={`job-title-${job.id}`}>
                  {job.title}
                </h3>
                <div className="flex items-center gap-2 mt-1 text-sm text-txtMuted">
                  <span className="font-medium text-txtMain/90" data-testid={`job-company-${job.id}`}>{job.company}</span>
                  <span className="flex items-center gap-0.5 text-amber-500 font-semibold">
                    <Star className="w-3 h-3 fill-amber-500" />
                    {job.companyRating}
                  </span>
                  <span className="text-txtMuted text-xs">({job.companyReviewCount})</span>
                </div>
              </div>
            </div>

            {/* Bookmark Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => { e.stopPropagation(); onToggleBookmark(job.id); }}
              data-testid={`bookmark-button-${job.id}`}
              className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                isSaved
                  ? 'bg-rose-500/20 text-rose-500 shadow-sm border border-rose-500/30'
                  : 'bg-nested text-txtMuted hover:text-txtMain hover:bg-borderSubtle border border-borderStrong'
              }`}
              aria-label="Bookmark Job"
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-rose-500' : ''}`} />
            </motion.button>
          </div>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-txtMuted mb-3">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-txtMuted" />
              {job.location}
            </span>
            <span className="flex items-center gap-1 text-success font-bold" data-testid={`job-salary-${job.id}`}>
              <IndianRupee className="w-3.5 h-3.5" />
              {formatSalaryRupees(job.salaryMin, job.salaryMax)}
            </span>
          </div>

          {/* Badges row */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {matchScore != null && (
              <span className={`flex items-center gap-1 px-2.5 py-0.5 text-xs font-bold rounded-md border ${
                matchScore >= 80
                  ? 'bg-success-bg border-success/30 text-success'
                  : matchScore >= 60
                  ? 'bg-accent/15 border-accent/30 text-accent'
                  : 'bg-amber-500/15 border-amber-500/30 text-amber-500'
              }`}>
                <TrendingUp className="w-3 h-3" />
                {matchScore}% Match
              </span>
            )}
            <span className="px-2 py-0.5 text-xs font-semibold text-accent bg-accent/15 border border-accent/30 rounded-md">
              {(job.jobType || 'FULL_TIME').replace('_', ' ')}
            </span>
            {job.experienceYears && (
              <span className="px-2 py-0.5 text-xs font-medium text-txtMuted bg-nested border border-borderStrong rounded-md">
                {job.experienceYears} yrs
              </span>
            )}
            <span className="flex items-center gap-1 px-2 py-0.5 text-xs text-txtMuted bg-nested border border-borderStrong rounded-md">
              <Clock className="w-3 h-3" />
              {formatPostedDate(job.postedDaysAgo)}
            </span>
          </div>

          {/* Company Insight Snippet */}
          {job.companyInsights?.summary && (
            <div className="mb-3 px-2.5 py-1.5 rounded-lg bg-accent/5 border border-accent/20 text-[11px] font-medium text-txtMuted flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-accent shrink-0" />
              <span className="truncate">{job.companyInsights.summary}</span>
            </div>
          )}

          {/* Description */}
          <p className="text-sm text-txtMuted line-clamp-2 mb-4 leading-relaxed">
            {job.description}
          </p>

          {/* Tech Stack Pills */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {(job.techStack || []).map((tech, i) => (
              <span
                key={i}
                className="px-2 py-0.5 text-xs font-medium text-txtMuted bg-nested border border-borderStrong rounded-md"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Footer row */}
        <div className="pt-3 border-t border-borderSubtle flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Competition Badge */}
            {(job.applicationCount || 0) < 10 ? (
              <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md">
                🚀 First 10 applicants!
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[11px] font-bold text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md">
                🔥 {job.applicationCount} applied recently
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => { e.stopPropagation(); onShareJob?.(job); }}
              className="w-8 h-8 rounded-lg bg-nested hover:bg-borderSubtle border border-borderStrong flex items-center justify-center text-txtMuted hover:text-txtMain transition-colors"
              title="Share this job"
            >
              <Share2 className="w-3.5 h-3.5" />
            </motion.button>

            {hasApplied ? (
              <div className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 dark:bg-emerald-900/30 dark:border-emerald-700/50 dark:text-emerald-300 rounded-lg" data-testid={`applied-badge-${job.id}`}>
                <CheckCircle className="w-3.5 h-3.5" />
                Applied
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={(e) => { e.stopPropagation(); onApply(job, true); }}
                  data-testid={`quick-apply-button-${job.id}`}
                  className="px-3 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 rounded-lg transition-all duration-150 shadow-sm flex items-center gap-1"
                  title="Apply instantly with 1 click using saved resume & profile"
                >
                  <Zap className="w-3.5 h-3.5 fill-white text-white animate-pulse" />
                  Quick Apply
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={(e) => { e.stopPropagation(); onApply(job, false); }}
                  data-testid={`view-details-button-${job.id}`}
                  className="px-2.5 py-1.5 text-xs font-semibold text-txtMain bg-nested hover:bg-borderSubtle border border-borderStrong rounded-lg transition-all duration-150"
                >
                  Details
                </motion.button>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Jobs Grid Component
export default function JobsGrid({ jobs = [], isLoading = false, onApply, onToggleBookmark, onShareJob, applications, isPremium }) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-5">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <JobCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!jobs || jobs.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-16 bg-surface border border-borderSubtle rounded-xl"
      >
        <p className="text-txtMain text-base font-semibold">No jobs match your filters.</p>
        <p className="text-txtMuted text-sm mt-1">Try adjusting your search query or clearing domain filters.</p>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-5">
      <AnimatePresence>
        {jobs.map((job, index) => (
          <JobCard
            key={job.id || index}
            job={job}
            index={index}
            onApply={onApply}
            onToggleBookmark={onToggleBookmark}
            onShareJob={onShareJob}
            applications={applications}
            isPremium={isPremium}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
