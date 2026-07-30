import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, DollarSign, Clock, Users, Star, Share2, Zap, TrendingUp, Bookmark, Sparkles, IndianRupee, CheckCircle, Eye, Flame
} from 'lucide-react';
import SpotlightCard from '../ui/SpotlightCard';

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
  
  // Simulated live viewers
  const [liveViewers] = React.useState(() => Math.floor(Math.random() * 18) + 3);
  
  // Urgency level
  const isUrgent = job.urgency === 'Actively Hiring' || (job.postedDaysAgo && job.postedDaysAgo <= 2);
  const isFewApplicants = (job.applicationCount || 0) < 10;
  const isTrending = (job.applicationCount || 0) > 100;

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
      className={`group relative rounded-xl cursor-pointer theme-transition shadow-md hover:shadow-xl bg-surface border ${
        isTopRecommended
          ? 'border-amber-500/50 bg-amber-500/5 dark:bg-amber-500/10'
          : 'border-borderSubtle hover:border-borderStrong'
      }`}
    >
      <SpotlightCard className="h-full p-5 flex flex-col justify-between rounded-xl bg-surface">
      <div className="flex flex-col h-full justify-between relative z-10">
        {/* Header row */}
        <div>
          {/* Top Badges & Actions Row */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-1.5 flex-wrap min-w-0">
              {isTopRecommended && (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 flex items-center gap-1 shrink-0 shadow-sm">
                  <Sparkles className="w-3 h-3 fill-amber-500 dark:fill-amber-400" />
                  Top Recommendation
                </span>
              )}
              {!isTopRecommended && isUrgent && (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30 flex items-center gap-1 shrink-0 shadow-sm">
                  <Flame className="w-3 h-3 fill-rose-500 dark:fill-rose-400" />
                  Closing Soon
                </span>
              )}
              <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-nested border border-borderStrong text-[10px] text-slate-700 dark:text-slate-200 font-semibold shrink-0">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                </span>
                <Eye className="w-2.5 h-2.5 text-slate-500 dark:text-slate-300" />
                {liveViewers} viewing
              </span>
            </div>

            {/* Bookmark Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => { e.stopPropagation(); onToggleBookmark(job.id); }}
              data-testid={`bookmark-button-${job.id}`}
              className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                isSaved
                  ? 'bg-rose-500/20 text-rose-600 dark:text-rose-400 shadow-sm border border-rose-500/40'
                  : 'bg-nested text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-borderSubtle border border-borderStrong'
              }`}
              aria-label="Bookmark Job"
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-rose-500 dark:fill-rose-400' : ''}`} />
            </motion.button>
          </div>

          {/* Company & Title Row */}
          <div className="flex items-start gap-3 mb-3">
            {job.companyLogo ? (
              <div className="w-10 h-10 rounded-lg bg-white shrink-0 shadow-md flex items-center justify-center border border-borderSubtle overflow-hidden relative">
                <img 
                  src={job.companyLogo} 
                  alt={job.company} 
                  className="w-full h-full object-contain p-1" 
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }} 
                />
                <div className={`hidden absolute inset-0 bg-gradient-to-br ${COMPANY_COLORS[colorIdx]} items-center justify-center text-white text-sm font-bold w-full h-full`}>
                  {(job.company || 'W').charAt(0)}
                </div>
              </div>
            ) : (
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${COMPANY_COLORS[colorIdx]} flex items-center justify-center text-white text-sm font-bold shrink-0 shadow-md`}>
                {(job.company || 'W').charAt(0)}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <h3 className="text-[16px] font-bold text-slate-900 dark:text-slate-100 leading-snug group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors line-clamp-2" data-testid={`job-title-${job.id}`}>
                {job.title}
              </h3>
              <div className="flex items-center gap-2 mt-1 text-sm">
                <span className="font-semibold text-slate-700 dark:text-slate-200 truncate" data-testid={`job-company-${job.id}`}>{job.company}</span>
                <span className="flex items-center gap-0.5 text-amber-600 dark:text-amber-400 font-bold shrink-0">
                  <Star className="w-3.5 h-3.5 fill-amber-500" />
                  {job.companyRating}
                </span>
                <span className="text-slate-500 dark:text-slate-400 text-xs shrink-0 font-medium">({job.companyReviewCount})</span>
              </div>
            </div>
          </div>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm font-medium mb-3">
            <span className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              {job.location}
            </span>
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-extrabold" data-testid={`job-salary-${job.id}`}>
              {job.customSalaryString ? (
                <>
                  <DollarSign className="w-3.5 h-3.5" />
                  <span className="truncate max-w-[150px]" title={job.customSalaryString}>{job.customSalaryString}</span>
                </>
              ) : (
                <>
                  <IndianRupee className="w-3.5 h-3.5" />
                  {formatSalaryRupees(job.salaryMin, job.salaryMax)}
                </>
              )}
            </span>
          </div>

          {/* Badges row */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {matchScore != null && (
              <span className="flex items-center gap-1 px-2.5 py-0.5 text-xs font-mono font-bold rounded-md bg-amber-500/15 border border-amber-500/30 text-amber-700 dark:text-amber-300 shadow-sm">
                <TrendingUp className="w-3 h-3" />
                {matchScore}% Match
              </span>
            )}
            <span className="px-2.5 py-0.5 text-xs font-semibold text-slate-800 dark:text-slate-200 bg-nested border border-borderStrong rounded-md">
              {(job.jobType || 'FULL_TIME').replace('_', ' ')}
            </span>
            {job.experienceYears && (
              <span className="px-2 py-0.5 text-xs font-medium text-slate-600 dark:text-slate-300 bg-nested border border-borderStrong rounded-md">
                {job.experienceYears} yrs
              </span>
            )}
            <span className="flex items-center gap-1 px-2 py-0.5 text-xs text-slate-500 dark:text-slate-400 bg-nested border border-borderStrong rounded-md font-medium">
              <Clock className="w-3 h-3" />
              {formatPostedDate(job.postedDaysAgo)}
            </span>
          </div>

          {/* Company Insight Snippet */}
          {job.companyInsights?.summary && (
            <div className="mb-3 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-[11px] font-semibold text-amber-800 dark:text-amber-200 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
              <span className="truncate">{job.companyInsights.summary}</span>
            </div>
          )}

          {/* Description */}
          <p className="text-sm text-slate-700 dark:text-slate-300 line-clamp-2 mb-4 leading-relaxed font-normal">
            {job.description}
          </p>

          {/* Tech Stack Skill Diff Chips */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {(job.techStack || []).slice(0, 4).map((tech, i) => (
              <span
                key={i}
                className="px-2.5 py-0.5 text-xs font-mono font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 rounded-md flex items-center gap-0.5"
              >
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">+</span> {tech}
              </span>
            ))}
            {(job.gapSkills || ['Kubernetes']).slice(0, 1).map((gap, i) => (
              <span
                key={`gap-${i}`}
                className="px-2 py-0.5 text-xs font-mono font-medium text-slate-500 dark:text-slate-400 bg-nested border border-dashed border-borderStrong rounded-md flex items-center gap-0.5"
              >
                <span className="text-slate-400 font-bold">–</span> {gap}
              </span>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-borderSubtle space-y-3">
          {/* Row 1: Competition badge + Share */}
          <div className="flex items-center justify-between">
            {(job.applicationCount || 0) < 10 ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 rounded-md">
                🚀 First 10 applicants!
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-amber-700 dark:text-amber-300 bg-amber-500/15 border border-amber-500/30 px-2.5 py-0.5 rounded-md">
                🔥 {job.applicationCount} applied
              </span>
            )}

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => { e.stopPropagation(); onShareJob?.(job); }}
              className="w-8 h-8 rounded-lg bg-nested hover:bg-borderSubtle border border-borderStrong flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
              title="Share this job"
            >
              <Share2 className="w-3.5 h-3.5" />
            </motion.button>
          </div>

          {/* Row 2: Action buttons — full width */}
          {hasApplied ? (
            <div className="flex items-center justify-center gap-1.5 w-full py-2.5 text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 rounded-lg" data-testid={`applied-badge-${job.id}`}>
              <CheckCircle className="w-3.5 h-3.5" />
              Applied
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={(e) => { 
                  e.stopPropagation(); 
                  if (job.applyUrl) window.open(job.applyUrl, '_blank');
                  else onApply(job, true); 
                }}
                data-testid={`quick-apply-button-${job.id}`}
                className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold text-black bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 hover:from-amber-500 hover:via-orange-500 hover:to-red-500 rounded-lg transition-all shadow-md shadow-amber-500/30 cursor-pointer relative overflow-hidden group/btn"
                title="Apply instantly with saved resume"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/25 to-white/0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
                <Zap className="w-3.5 h-3.5" />
                Quick Apply
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={(e) => { e.stopPropagation(); onApply(job, false); }}
                data-testid={`view-details-button-${job.id}`}
                className="flex-1 inline-flex items-center justify-center py-2.5 text-xs font-bold text-txtMain bg-nested hover:bg-borderSubtle border border-borderStrong rounded-lg transition-all cursor-pointer"
              >
                View Details
              </motion.button>
            </div>
          )}
        </div>
      </div>
      </SpotlightCard>
    </motion.div>
  );
}

// Jobs Grid Component
export default function JobsGrid({ jobs = [], isLoading = false, onApply, onToggleBookmark, onShareJob, applications, isPremium }) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 w-full">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
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
        className="text-center py-16 bg-surface border border-borderSubtle rounded-xl w-full"
      >
        <p className="text-txtMain text-base font-semibold">No jobs match your filters.</p>
        <p className="text-txtMuted text-sm mt-1">Try adjusting your search query or clearing domain filters.</p>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 w-full">
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
