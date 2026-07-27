'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Job } from '../src/types/job';

interface JobDetailDrawerProps {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenApply: (job: Job) => void;
}

export default function JobDetailDrawer({ job, isOpen, onClose, onOpenApply }: JobDetailDrawerProps) {
  if (!isOpen || !job) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-end overflow-hidden">
        {/* Backdrop Fade In */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
        />

        {/* Slide-Over Drawer with Spring Physics */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 220 }}
          className="relative z-10 w-full max-w-2xl h-full bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col justify-between overflow-y-auto"
        >
          {/* Header Banner */}
          <div>
            <div className="relative h-44 bg-gradient-to-r from-slate-950 via-slate-900 to-cyan-950 p-6 flex flex-col justify-between border-b border-slate-800">
              <button
                onClick={onClose}
                className="self-end w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 flex items-center justify-center text-sm font-bold transition active:scale-90"
              >
                ✕
              </button>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-2xl font-bold text-cyan-400 shadow-xl">
                  {job.company ? job.company.charAt(0) : 'T'}
                </div>
                <div>
                  <h2 className="text-2xl font-extrabold text-white">{job.title}</h2>
                  <p className="text-slate-400 text-sm font-medium">{job.company} • 📍 {job.location}</p>
                </div>
              </div>
            </div>

            {/* Role Details Body */}
            <div className="p-8 space-y-8">
              <div className="flex flex-wrap gap-3">
                <span className="px-3.5 py-1.5 text-xs font-semibold text-cyan-400 bg-cyan-950/80 border border-cyan-500/30 rounded-xl">
                  {job.jobType ? job.jobType.replace('_', ' ') : 'FULL TIME'}
                </span>
                <span className="px-3.5 py-1.5 text-xs font-semibold text-emerald-400 bg-emerald-950/80 border border-emerald-500/30 rounded-xl">
                  💰 ${job.salaryMin ? job.salaryMin.toLocaleString() : '120,000'}+ USD
                </span>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-2">
                  Role Overview
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  {job.description}
                </p>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-3">
                  Tech Stack & Skills Required
                </h3>
                <div className="flex flex-wrap gap-2">
                  {(job.techStack || ['React', 'Three.js', 'Spring Boot']).map((tech, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 text-xs font-medium text-slate-200 bg-slate-800 border border-slate-700 rounded-lg"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sticky Bottom Bar */}
          <div className="p-6 bg-slate-950/90 border-t border-slate-800 flex items-center justify-between sticky bottom-0">
            <div>
              <p className="text-xs text-slate-400">Apply for position</p>
              <p className="text-sm font-bold text-white">{job.title}</p>
            </div>
            <button
              onClick={() => onOpenApply(job)}
              className="px-6 py-3 text-sm font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-2xl shadow-lg shadow-cyan-500/20 transition active:scale-95"
            >
              Apply Now →
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
