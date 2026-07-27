'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Job } from '../src/types/job';

interface JobListProps {
  jobs: Job[];
  isLoading?: boolean;
  onSelectJob: (job: Job) => void;
  onApplyJob: (job: Job) => void;
}

// Container variants with stagger Children physics
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

// Child Card variants
const cardVariants = {
  hidden: { opacity: 0, y: 25, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 24,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.94,
    transition: { duration: 0.2 },
  },
};

export default function JobList({ jobs, isLoading = false, onSelectJob, onApplyJob }: JobListProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-8">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-64 bg-slate-900/60 border border-slate-800 rounded-3xl p-6 animate-pulse" />
        ))}
      </div>
    );
  }

  if (!jobs || jobs.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        className="text-center py-20 bg-slate-900/40 border border-slate-800/80 rounded-3xl my-8 backdrop-blur-md"
      >
        <div className="w-14 h-14 bg-slate-800 text-slate-400 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
          🔍
        </div>
        <h3 className="text-xl font-bold text-white">No jobs found matching your criteria</h3>
        <p className="text-slate-400 text-sm mt-1 max-w-md mx-auto">
          Try broadening your search keywords or resetting active filter tags.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-8"
    >
      <AnimatePresence mode="popLayout">
        {jobs.map((job) => (
          <motion.div
            key={job.id}
            layout
            variants={cardVariants}
            whileHover={{
              scale: 1.02,
              y: -4,
              transition: { duration: 0.2, ease: 'easeOut' },
            }}
            onClick={() => onSelectJob(job)}
            className="group relative bg-slate-900/80 border border-slate-800 hover:border-cyan-500/50 rounded-3xl p-6 shadow-xl hover:shadow-2xl hover:shadow-cyan-500/10 backdrop-blur-xl transition-colors duration-300 cursor-pointer flex flex-col justify-between"
          >
            {/* Glowing Border Glow Overlay */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-3xl opacity-0 group-hover:opacity-20 blur transition duration-500 pointer-events-none" />

            <div className="relative z-10">
              {/* Header */}
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-cyan-400 text-lg shadow-inner">
                    {job.company ? job.company.charAt(0) : 'T'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">
                        {job.title}
                      </h3>
                      {job.isNew && (
                        <span className="px-2 py-0.5 text-[9px] font-black uppercase text-slate-950 bg-cyan-400 rounded-md animate-pulse">
                          NEW
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-medium text-slate-400">{job.company}</p>
                  </div>
                </div>

                <span className="px-3 py-1 text-[11px] font-semibold text-cyan-300 bg-cyan-950/80 border border-cyan-500/30 rounded-full whitespace-nowrap">
                  {job.jobType ? job.jobType.replace('_', ' ') : 'FULL TIME'}
                </span>
              </div>

              {/* Location & Salary */}
              <div className="flex items-center gap-4 text-xs text-slate-400 mb-4">
                <span>📍 {job.location}</span>
                <span className="font-semibold text-emerald-400">
                  💰 ${job.salaryMin ? job.salaryMin.toLocaleString() : '120,000'}+
                </span>
              </div>

              <p className="text-slate-300 text-xs line-clamp-2 mb-5 leading-relaxed">
                {job.description}
              </p>

              {/* Tech Badges */}
              <div className="flex flex-wrap gap-1.5 mb-6">
                {job.techStack &&
                  job.techStack.map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 text-[10px] font-medium text-slate-300 bg-slate-800/80 border border-slate-700/60 rounded-lg"
                    >
                      {tech}
                    </span>
                  ))}
              </div>
            </div>

            {/* Footer Action */}
            <div className="relative z-10 pt-4 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">
                {job.applicationCount ? `${job.applicationCount} applicants` : 'Be an early applicant'}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onApplyJob(job);
                }}
                className="px-4 py-2 text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-xl transition shadow-md shadow-cyan-400/20 active:scale-95"
              >
                Apply Now →
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
