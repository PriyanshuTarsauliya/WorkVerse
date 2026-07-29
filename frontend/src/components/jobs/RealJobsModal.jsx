import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Search, ExternalLink, Briefcase, MapPin, Clock, Building2,
  Loader2, AlertCircle, RotateCcw, Globe, Sparkles, ChevronRight,
  Code2, Palette, BarChart3, Megaphone, Server, Package, Users,
  Headphones, PenTool, GraduationCap, Heart
} from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL : 'http://localhost:8080';

// ── Category Mappings ──
const CATEGORIES = [
  { key: 'all', label: 'All Jobs', icon: Briefcase },
  { key: 'software-dev', label: 'Software Dev', icon: Code2 },
  { key: 'design', label: 'Design', icon: Palette },
  { key: 'data', label: 'Data', icon: BarChart3 },
  { key: 'marketing', label: 'Marketing', icon: Megaphone },
  { key: 'devops', label: 'DevOps / Infra', icon: Server },
  { key: 'product', label: 'Product', icon: Package },
  { key: 'customer-support', label: 'Support', icon: Headphones },
  { key: 'writing', label: 'Writing', icon: PenTool },
  { key: 'hr', label: 'HR', icon: Users },
  { key: 'teaching', label: 'Teaching', icon: GraduationCap },
  { key: 'qa', label: 'QA', icon: Heart },
];

// ── Helpers ──
function timeAgo(dateStr) {
  if (!dateStr) return '';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

// ── Skeleton Card ──
function SkeletonCard() {
  return (
    <div className="bg-nested/60 border border-borderSubtle rounded-2xl p-5 animate-pulse space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-borderSubtle" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-3/4 bg-borderSubtle rounded-lg" />
          <div className="h-3 w-1/2 bg-borderSubtle rounded-lg" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3 w-full bg-borderSubtle rounded-lg" />
        <div className="h-3 w-5/6 bg-borderSubtle rounded-lg" />
      </div>
      <div className="flex gap-2">
        <div className="h-6 w-16 bg-borderSubtle rounded-full" />
        <div className="h-6 w-20 bg-borderSubtle rounded-full" />
        <div className="h-6 w-14 bg-borderSubtle rounded-full" />
      </div>
      <div className="h-9 w-full bg-borderSubtle rounded-xl" />
    </div>
  );
}

// ── Main Component ──
export default function RealJobsModal({ isOpen, onClose, candidateProfile }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(18);

  // Fetch jobs from backend
  const fetchJobs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/api/recommendations/real-jobs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(candidateProfile || {})
      });
      if (!res.ok) throw new Error(`API error ${res.status}`);
      const json = await res.json();
      
      const mappedJobs = json.map(item => ({
        ...item.job,
        matchScore: item.matchScore,
        matchedSkills: item.matchedSkills,
        missingSkills: item.missingSkills
      }));
      
      setJobs(mappedJobs);
    } catch (err) {
      setError(err.message || 'Failed to fetch recommended jobs');
    } finally {
      setLoading(false);
    }
  }, [candidateProfile]);

  // Fetch when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchJobs();
      setVisibleCount(18);
    }
  }, [isOpen, fetchJobs]);

  // Filter logic
  const filteredJobs = useMemo(() => {
    let result = jobs;

    // Category filter
    if (activeCategory !== 'all') {
      result = result.filter((j) => {
        const cat = (j.category || '').toLowerCase().replace(/\s+/g, '-');
        return cat.includes(activeCategory);
      });
    }

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((j) => {
        const fields = [
          j.title || '',
          j.company_name || '',
          ...(j.tags || []),
          j.candidate_required_location || '',
        ];
        return fields.some((f) => f.toLowerCase().includes(q));
      });
    }

    return result;
  }, [jobs, activeCategory, searchQuery]);

  const paginatedJobs = useMemo(() => filteredJobs.slice(0, visibleCount), [filteredJobs, visibleCount]);
  const hasMore = visibleCount < filteredJobs.length;

  // Reset filters when category changes
  useEffect(() => {
    setVisibleCount(18);
  }, [activeCategory, searchQuery]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/70 backdrop-blur-md"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          className="relative z-10 w-full max-w-6xl h-[92vh] bg-main border border-borderSubtle rounded-3xl flex flex-col overflow-hidden shadow-2xl mx-4"
        >
          {/* ── Header ── */}
          <div className="shrink-0 bg-surface/90 backdrop-blur-lg border-b border-borderSubtle px-6 py-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/25">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-txtMain tracking-tight flex items-center gap-2">
                    Real Jobs
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full uppercase">
                      Live
                    </span>
                  </h2>
                  <p className="text-xs text-txtMuted mt-0.5">
                    Browse {filteredJobs.length.toLocaleString()} real remote openings from top companies worldwide
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-txtMuted hover:text-txtMain hover:bg-nested transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search Bar */}
            <div className="relative mb-4">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-txtMuted" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by job title, company, skill, or location..."
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-nested border border-borderSubtle focus:border-emerald-500/50 rounded-xl text-txtMain placeholder-txtMuted outline-none transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-md text-txtMuted hover:text-txtMain"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Category Tabs */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const isActive = activeCategory === cat.key;
                return (
                  <button
                    key={cat.key}
                    onClick={() => setActiveCategory(cat.key)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all shrink-0 ${
                      isActive
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm'
                        : 'text-txtMuted hover:text-txtMain hover:bg-nested border border-transparent'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Body ── */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Loading State */}
            {loading && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 9 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            )}

            {/* Error State */}
            {error && !loading && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4">
                  <AlertCircle className="w-7 h-7 text-red-400" />
                </div>
                <h3 className="text-lg font-bold text-txtMain mb-1">Failed to load jobs</h3>
                <p className="text-sm text-txtMuted max-w-sm mb-4">{error}</p>
                <button
                  onClick={fetchJobs}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-lg hover:bg-emerald-500/20 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Retry
                </button>
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && filteredJobs.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 rounded-2xl bg-nested border border-borderSubtle flex items-center justify-center mb-4">
                  <Search className="w-7 h-7 text-txtMuted" />
                </div>
                <h3 className="text-lg font-bold text-txtMain mb-1">No jobs found</h3>
                <p className="text-sm text-txtMuted max-w-sm mb-4">
                  Try a different category or adjust your search query.
                </p>
                <button
                  onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-lg hover:bg-emerald-500/20 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Clear filters
                </button>
              </div>
            )}

            {/* Jobs Grid */}
            {!loading && !error && filteredJobs.length > 0 && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {paginatedJobs.map((job) => (
                    <motion.div
                      key={job.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="group bg-nested/60 hover:bg-nested border border-borderSubtle hover:border-emerald-500/30 rounded-2xl p-5 transition-all duration-200 flex flex-col"
                    >
                      {/* Company Header */}
                      <div className="flex items-start gap-3 mb-3">
                        {job.company_logo ? (
                          <img
                            src={job.company_logo}
                            alt={job.company_name}
                            className="w-11 h-11 rounded-xl object-contain bg-white border border-borderSubtle shrink-0"
                            onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                          />
                        ) : null}
                        <div
                          className={`w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 border border-borderSubtle items-center justify-center text-white text-sm font-bold shrink-0 ${job.company_logo ? 'hidden' : 'flex'}`}
                        >
                          {(job.company_name || 'C').charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-bold text-txtMain leading-snug line-clamp-2 group-hover:text-emerald-400 transition-colors">
                            {job.title}
                          </h3>
                          <p className="text-xs text-txtMuted mt-0.5 flex items-center gap-1">
                            <Building2 className="w-3 h-3 shrink-0" />
                            <span className="truncate">{job.company_name}</span>
                          </p>
                        </div>
                      </div>

                      {/* Location & Time */}
                      <div className="flex flex-wrap items-center gap-2 mb-3 text-[11px] text-txtMuted">
                        {job.candidate_required_location && (
                          <span className="flex items-center gap-1 bg-surface px-2 py-0.5 rounded-md border border-borderSubtle">
                            <MapPin className="w-3 h-3" />
                            <span className="truncate max-w-[120px]">{job.candidate_required_location}</span>
                          </span>
                        )}
                        <span className="flex items-center gap-1 bg-surface px-2 py-0.5 rounded-md border border-borderSubtle">
                          <Clock className="w-3 h-3" />
                          {timeAgo(job.publication_date)}
                        </span>
                        {job.job_type && (
                          <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-md font-semibold">
                            {job.job_type.replace(/_/g, ' ')}
                          </span>
                        )}
                      </div>

                      {/* Tags */}
                      {job.tags && job.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {job.tags.slice(0, 4).map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-0.5 text-[10px] font-semibold text-txtMuted bg-surface border border-borderSubtle rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                          {job.tags.length > 4 && (
                            <span className="px-2 py-0.5 text-[10px] font-semibold text-txtMuted bg-surface border border-borderSubtle rounded-full">
                              +{job.tags.length - 4}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Salary (if present) */}
                      {job.salary && job.salary.trim() && (
                        <p className="text-xs font-semibold text-emerald-400 mb-3">
                          💰 {job.salary}
                        </p>
                      )}

                      {/* Match Score */}
                      {job.matchScore !== undefined && (
                        <div className="mb-4 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-semibold text-txtMuted uppercase tracking-wider">
                              AI Match Score
                            </span>
                            <span className={`text-xs font-bold ${job.matchScore >= 80 ? 'text-emerald-400' : job.matchScore >= 60 ? 'text-amber-400' : 'text-txtMuted'}`}>
                              {job.matchScore}%
                            </span>
                          </div>
                          <div className="h-1.5 w-full bg-surface rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full transition-all duration-1000 ${job.matchScore >= 80 ? 'bg-gradient-to-r from-emerald-400 to-teal-400' : job.matchScore >= 60 ? 'bg-gradient-to-r from-amber-400 to-orange-400' : 'bg-borderStrong'}`}
                              style={{ width: `${Math.max(0, job.matchScore)}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Spacer */}
                      <div className="flex-1" />

                      {/* Apply Button */}
                      <a
                        href={job.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 rounded-xl transition-all shadow-md shadow-emerald-500/15 group-hover:shadow-lg group-hover:shadow-emerald-500/25"
                      >
                        Apply on Company Site
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </motion.div>
                  ))}
                </div>

                {/* Load More */}
                {hasMore && (
                  <div className="flex justify-center pt-6">
                    <button
                      onClick={() => setVisibleCount((v) => v + 18)}
                      className="px-6 py-2.5 text-sm font-semibold text-txtMain bg-nested border border-borderSubtle rounded-xl hover:border-emerald-500/40 transition-colors flex items-center gap-2"
                    >
                      Load More ({filteredJobs.length - visibleCount} remaining)
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* ── Footer Attribution ── */}
          <div className="shrink-0 bg-surface/80 backdrop-blur-lg border-t border-borderSubtle px-6 py-3 flex items-center justify-between">
            <p className="text-[11px] text-txtMuted flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-emerald-400" />
              Powered by{' '}
              <a
                href="https://remotive.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-400 hover:underline font-semibold"
              >
                Remotive
              </a>
              {' '}— Real remote jobs from real companies
            </p>
            <p className="text-[10px] text-txtMuted">
              {jobs.length > 0 && `${jobs.length} jobs cached • `}
              Data refreshes every 6 hours
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
