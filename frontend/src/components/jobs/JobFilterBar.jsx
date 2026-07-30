import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Bookmark, RotateCcw, ChevronDown, Sparkles, SlidersHorizontal, LayoutGrid, Layers, MapPin, Bell, Clock, Trash2 } from 'lucide-react';
import { useToast } from '../Toast';

export default function JobFilterBar({
  filters,
  onFilterChange,
  onResetFilters,
  totalJobsCount = 0,
  totalAllCount = 0,
  savedCount = 0,
  viewMode = 'grid',
  onViewModeChange,
  onOpenJobAlerts,
  totalNewAlerts = 0,
}) {
  const toast = useToast();
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('workverse_recent_searches') || '[]');
    } catch { return []; }
  });

  const saveRecentSearch = (query) => {
    if (!query.trim()) return;
    setRecentSearches((prev) => {
      const updated = [query, ...prev.filter((q) => q !== query)].slice(0, 5);
      localStorage.setItem('workverse_recent_searches', JSON.stringify(updated));
      return updated;
    });
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('workverse_recent_searches');
  };

  const handleChange = (field, value) => {
    onFilterChange({ ...filters, [field]: value });
  };

  const handleArrayToggle = (field, item) => {
    const list = filters[field] || [];
    const updated = list.includes(item) ? list.filter((i) => i !== item) : [...list, item];
    onFilterChange({ ...filters, [field]: updated });
  };

  const categories = ['Engineering', 'Product & Data', 'Finance & Banking', 'Marketing & Sales', 'Design & UX', 'Operations & HR', 'Internships'];
  const jobTypes = ['FULL_TIME', 'PART_TIME', 'CONTRACT', 'REMOTE', 'HYBRID'];
  const expLevels = ['Entry Level', 'Mid Level', 'Senior Level', 'Lead / Staff'];

  const activeCount =
    (filters.search ? 1 : 0) +
    (filters.location ? 1 : 0) +
    (filters.jobTypes?.length || 0) +
    (filters.categories?.length || 0) +
    (filters.experienceLevels?.length || 0) +
    (filters.remoteOnly ? 1 : 0) +
    (filters.minSalary > 0 ? 1 : 0) +
    (filters.savedOnly ? 1 : 0) +
    (filters.recommendedOnly ? 1 : 0);

  const currentSalaryLpa = ((filters.minSalary || 0) / 100000).toFixed(0);

  // Active view segment
  const activeSegment = filters.recommendedOnly ? 'recommended' : filters.savedOnly ? 'saved' : 'all';

  const setSegment = (mode) => {
    if (mode === 'all') {
      onFilterChange({ ...filters, recommendedOnly: false, savedOnly: false });
    } else if (mode === 'recommended') {
      onFilterChange({ ...filters, recommendedOnly: true, savedOnly: false });
    } else if (mode === 'saved') {
      onFilterChange({ ...filters, recommendedOnly: false, savedOnly: true });
    }
  };

  const segments = [
    { key: 'all', label: 'All Jobs', icon: null },
    { key: 'recommended', label: 'For You', icon: <Sparkles className="w-3 h-3" /> },
    { key: 'saved', label: `Tracker${savedCount > 0 ? ` (${savedCount})` : ''}`, icon: <Bookmark className="w-3 h-3" /> },
  ];

  return (
    <div className="space-y-3">
      {/* ── Single Clean Row: Search + Location + Segments + View Toggle + Filter ── */}
      <div className="flex items-center gap-2">
        {/* Combined Search Bar: Role | Location */}
        <div className="relative flex flex-1 min-w-0 bg-nested border border-borderSubtle rounded-lg focus-within:border-accent transition-colors z-30">
          {/* Role / Skill Search */}
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-txtMuted pointer-events-none" />
            <input
              type="text"
              data-testid="search-input"
              value={filters.search || ''}
              onChange={(e) => handleChange('search', e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') saveRecentSearch(filters.search);
              }}
              placeholder="Job title, skill, or company"
              className="w-full bg-transparent pl-9 pr-2 py-2 text-sm text-txtMain placeholder-txtMuted focus:outline-none rounded-l-lg"
            />
          </div>

          {/* Divider */}
          <div className="w-px bg-borderSubtle my-1.5 shrink-0" />

          {/* Location Search */}
          <div className="relative w-24 sm:w-44 shrink-0">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-txtMuted pointer-events-none" />
            <input
              type="text"
              data-testid="location-input"
              value={filters.location || ''}
              onChange={(e) => handleChange('location', e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && filters.location) saveRecentSearch(filters.location);
              }}
              placeholder="City or Remote"
              className="w-full bg-transparent pl-8 pr-2 py-2 text-sm text-txtMain placeholder-txtMuted focus:outline-none rounded-r-lg"
            />
          </div>

          {/* Clear All */}
          {(filters.search || filters.location) && (
            <button
              onClick={() => onFilterChange({ ...filters, search: '', location: '' })}
              className="px-2 flex items-center text-txtMuted hover:text-txtMain shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Recent Searches Dropdown */}
          <AnimatePresence>
            {isSearchFocused && recentSearches.length > 0 && !filters.search && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                className="absolute top-full left-0 w-full md:w-80 mt-1 bg-surface border border-borderSubtle rounded-xl shadow-xl overflow-hidden"
              >
                <div className="flex items-center justify-between px-3 py-2 border-b border-borderSubtle bg-nested">
                  <span className="text-[11px] font-semibold text-txtMuted uppercase tracking-wider">Recent Searches</span>
                  <button onClick={clearRecentSearches} className="text-xs text-txtMuted hover:text-red-500 flex items-center gap-1">
                    <Trash2 className="w-3 h-3" /> Clear
                  </button>
                </div>
                <div>
                  {recentSearches.map((query, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleChange('search', query)}
                      className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-txtMain hover:bg-nested transition-colors text-left"
                    >
                      <Clock className="w-3.5 h-3.5 text-txtMuted shrink-0" />
                      <span className="truncate">{query}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Segments */}
        <div className="hidden sm:flex items-center bg-nested border border-borderSubtle rounded-lg p-0.5 gap-0.5 shrink-0">
          {segments.map((seg) => (
            <button
              key={seg.key}
              data-testid={`segment-${seg.key}`}
              onClick={() => setSegment(seg.key)}
              className={`relative px-3 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1 ${
                activeSegment === seg.key
                  ? 'text-txtMain'
                  : 'text-txtMuted hover:text-txtMain'
              }`}
            >
              {activeSegment === seg.key && (
                <motion.div
                  layoutId="seg-pill"
                  className="absolute inset-0 bg-surface border border-borderSubtle rounded-md shadow-sm -z-10"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}
              {seg.icon}
              {seg.label}
            </button>
          ))}
        </div>

        {/* View Toggle */}
        {onViewModeChange && (
          <div className="hidden sm:flex items-center bg-nested border border-borderSubtle rounded-lg p-0.5 gap-0.5 shrink-0">
            {[
              { key: 'grid', icon: <LayoutGrid className="w-3.5 h-3.5" />, label: 'Grid' },
              { key: 'deck', icon: <Layers className="w-3.5 h-3.5" />, label: 'Deck' },
            ].map((v) => (
              <button
                key={v.key}
                data-testid={`view-mode-${v.key}`}
                onClick={() => onViewModeChange(v.key)}
                className={`relative px-2 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1 ${
                  viewMode === v.key ? 'text-txtMain' : 'text-txtMuted hover:text-txtMain'
                }`}
                title={`${v.label} view`}
              >
                {viewMode === v.key && (
                  <motion.div
                    layoutId="view-pill"
                    className="absolute inset-0 bg-surface border border-borderSubtle rounded-md shadow-sm -z-10"
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  />
                )}
                {v.icon}
              </button>
            ))}
          </div>
        )}

        {/* Filter Toggle */}
        <button
          onClick={() => setIsFiltersOpen(!isFiltersOpen)}
          className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border transition-colors shrink-0 ${
            isFiltersOpen || activeCount > 0
              ? 'bg-accent/10 border-accent/30 text-accent'
              : 'bg-nested border-borderSubtle text-txtMuted hover:text-txtMain hover:border-accent/30'
          }`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          Filters
          {activeCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-accent text-white text-[10px] font-bold flex items-center justify-center">
              {activeCount}
            </span>
          )}
        </button>

        {/* Clear */}
        {activeCount > 0 && (
          <button
            onClick={onResetFilters}
            className="p-2 text-txtMuted hover:text-accent transition-colors shrink-0"
            title="Clear all filters"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Quick Company Filters Bar (Naukri/Indeed Style Multi-Company Aggregator) */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 text-xs">
        <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 shrink-0 uppercase tracking-wider">Top Employers:</span>
        {['All Companies', 'Google', 'Microsoft', 'Flipkart', 'Swiggy', 'PhonePe', 'Razorpay', 'Goldman Sachs', 'Zomato', 'Postman', 'CRED', 'Oracle', 'Atlassian'].map((comp) => {
          const isSelected = comp === 'All Companies' ? !filters.search : filters.search?.toLowerCase() === comp.toLowerCase();
          return (
            <button
              key={comp}
              onClick={() => handleChange('search', comp === 'All Companies' ? '' : comp)}
              className={`px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 transition-all border ${
                isSelected
                  ? 'bg-amber-500 text-slate-950 border-amber-400 font-extrabold shadow-sm'
                  : 'bg-surface/80 dark:bg-slate-900/60 text-slate-700 dark:text-slate-200 border-borderSubtle hover:border-accent/40'
              }`}
            >
              {comp}
            </button>
          );
        })}
      </div>

      {/* Results count & Job Alert */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
          {totalJobsCount < totalAllCount ? (
            <>Showing <span className="font-bold text-slate-900 dark:text-slate-100">{totalJobsCount}</span> matching roles out of <span className="font-semibold text-slate-900 dark:text-slate-100">{totalAllCount}</span> active listings</>
          ) : (
            <>Showing <span className="font-bold text-slate-900 dark:text-slate-100">{totalJobsCount}</span> active openings <span className="text-slate-600 dark:text-slate-400 font-normal">(10,000+ verified roles available)</span></>
          )}
        </p>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => onOpenJobAlerts('manage')} 
            className="relative p-1.5 text-txtMuted hover:text-txtMain hover:bg-nested rounded-lg transition-colors"
            title="Manage Job Alerts"
          >
            <Bell className="w-4 h-4" />
            {totalNewAlerts > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-accent border border-surface shadow-sm animate-pulse-subtle"></span>
            )}
          </button>
          <button 
            onClick={() => onOpenJobAlerts('create')} 
            className="text-xs font-semibold text-accent flex items-center gap-1.5 px-2 py-1 hover:bg-accent/10 rounded-md transition-colors"
          >
            <span className="hidden sm:inline">Create Job Alert</span>
            <span className="sm:hidden">Alert</span>
          </button>
        </div>
      </div>

      {/* ── Collapsible Filter Drawer ── */}
      <AnimatePresence>
        {isFiltersOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="bg-surface border border-borderSubtle rounded-xl p-4 space-y-4">
              {/* Categories */}
              <div>
                <p className="text-[11px] font-semibold text-txtMuted uppercase tracking-wider mb-2">Category</p>
                <div className="flex flex-wrap gap-1.5">
                  {categories.map((cat) => {
                    const active = (filters.categories || []).includes(cat);
                    return (
                      <button
                        key={cat}
                        onClick={() => handleArrayToggle('categories', cat)}
                        className={`px-2.5 py-1 text-xs font-medium rounded-md border transition-colors ${
                          active
                            ? 'bg-accent text-white border-accent'
                            : 'bg-nested border-borderSubtle text-txtMuted hover:text-txtMain hover:border-accent/30'
                        }`}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Row: Job Type + Experience + Salary + Remote */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Job Type */}
                <div>
                  <p className="text-[11px] font-semibold text-txtMuted uppercase tracking-wider mb-2">Type</p>
                  <div className="flex flex-wrap gap-1.5">
                    {jobTypes.map((type) => {
                      const active = (filters.jobTypes || []).includes(type);
                      return (
                        <button
                          key={type}
                          onClick={() => handleArrayToggle('jobTypes', type)}
                          className={`px-2.5 py-1 text-xs font-medium rounded-md border transition-colors ${
                            active
                              ? 'bg-accent/15 border-accent/40 text-accent font-bold'
                              : 'bg-nested border-borderSubtle text-txtMuted hover:text-txtMain'
                          }`}
                        >
                          {type.replace('_', ' ')}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Experience */}
                <div>
                  <p className="text-[11px] font-semibold text-txtMuted uppercase tracking-wider mb-2">Experience</p>
                  <div className="flex flex-wrap gap-1.5">
                    {expLevels.map((exp) => {
                      const active = (filters.experienceLevels || []).includes(exp);
                      return (
                        <button
                          key={exp}
                          onClick={() => handleArrayToggle('experienceLevels', exp)}
                          className={`px-2.5 py-1 text-xs font-medium rounded-md border transition-colors ${
                            active
                              ? 'bg-accent/15 border-accent/40 text-accent font-bold'
                              : 'bg-nested border-borderSubtle text-txtMuted hover:text-txtMain'
                          }`}
                        >
                          {exp}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Salary */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[11px] font-semibold text-txtMuted uppercase tracking-wider">Min Salary</p>
                    <span className="text-[11px] font-bold text-success">₹{currentSalaryLpa} LPA</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="5000000"
                    step="200000"
                    value={filters.minSalary || 0}
                    onChange={(e) => handleChange('minSalary', Number(e.target.value))}
                    className="w-full h-1.5 bg-nested rounded-full appearance-none cursor-pointer accent-accent"
                  />
                  <div className="flex justify-between text-[10px] text-txtMuted mt-1">
                    <span>₹0</span>
                    <span>₹50+ LPA</span>
                  </div>
                </div>

                {/* Remote */}
                <div>
                  <p className="text-[11px] font-semibold text-txtMuted uppercase tracking-wider mb-2">Location</p>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.remoteOnly || false}
                      onChange={(e) => handleChange('remoteOnly', e.target.checked)}
                      className="w-4 h-4 rounded border-borderSubtle text-accent focus:ring-accent/30 bg-nested"
                    />
                    <span className="text-xs font-medium text-txtMain">Remote / Hybrid only</span>
                  </label>
                </div>
              </div>

              {/* Sort */}
              <div className="flex items-center gap-2 pt-1 border-t border-borderSubtle">
                <span className="text-[11px] font-semibold text-txtMuted uppercase tracking-wider">Sort by</span>
                <select
                  value={filters.sortBy || 'match'}
                  onChange={(e) => handleChange('sortBy', e.target.value)}
                  className="bg-nested border border-borderSubtle rounded-md px-2 py-1 text-xs font-medium text-txtMain focus:outline-none cursor-pointer"
                >
                  <option value="match">Best Match</option>
                  <option value="newest">Newest</option>
                  <option value="salary">Highest Salary</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
