import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertTriangle, TrendingUp, Plus } from 'lucide-react';

export default function ProfileAnalysisModal({ job, isOpen, onClose }) {
  const [candidateProfile, setCandidateProfile] = useState({
    name: 'Alex Morgan',
    role: 'Senior Full Stack Engineer',
    skills: ['React', 'Spring Boot', 'PostgreSQL', 'Java', 'TypeScript', 'Docker'],
    experienceYears: 5,
  });

  const [newSkillInput, setNewSkillInput] = useState('');

  if (!isOpen || !job) return null;

  const jobSkills = job.techStack || ['React', 'TypeScript', 'Node.js'];

  const matchedSkills = jobSkills.filter((skill) =>
    candidateProfile.skills.some((us) =>
      us.toLowerCase().includes(skill.toLowerCase()) || skill.toLowerCase().includes(us.toLowerCase())
    )
  );

  const missingSkills = jobSkills.filter((s) => !matchedSkills.includes(s));
  const matchPct = Math.round((matchedSkills.length / Math.max(jobSkills.length, 1)) * 100);

  const handleAddSkill = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const skill = newSkillInput.trim();
      if (skill && !candidateProfile.skills.includes(skill)) {
        setCandidateProfile({ ...candidateProfile, skills: [...candidateProfile.skills, skill] });
        setNewSkillInput('');
      }
    }
  };

  const handleRemoveSkill = (s) => {
    setCandidateProfile({ ...candidateProfile, skills: candidateProfile.skills.filter((x) => x !== s) });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 12 }}
          className="relative w-full max-w-2xl bg-navy-950 border border-navy-750 rounded-xl p-6 shadow-2xl my-6"
        >
          <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-navy-800 hover:bg-navy-700 flex items-center justify-center text-txt-tertiary hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>

          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-brand" />
              <p className="text-xs font-medium text-brand">ATS Match Analysis</p>
            </div>
            <h2 className="text-lg font-bold text-white">
              Profile match for {job.title}
            </h2>
            <p className="text-sm text-txt-secondary mt-1">
              {job.company} · {job.location}
            </p>
          </div>

          {/* Score gauge */}
          <div className="bg-navy-900 border border-navy-750 rounded-xl p-5 mb-6 flex flex-col sm:flex-row items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              {/* Radial gauge */}
              <div className="relative w-16 h-16 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="32" cy="32" r="26" stroke="#1E2A3A" strokeWidth="5" fill="transparent" />
                  <circle
                    cx="32" cy="32" r="26"
                    stroke={matchPct >= 75 ? '#34D399' : matchPct >= 50 ? '#FBBF24' : '#FB7185'}
                    strokeWidth="5"
                    strokeDasharray={163}
                    strokeDashoffset={163 - (163 * matchPct) / 100}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-700"
                  />
                </svg>
                <span className="absolute text-sm font-bold text-white">{matchPct}%</span>
              </div>

              <div>
                <p className="text-sm font-semibold text-white">
                  {matchPct >= 75 ? 'Strong Match' : matchPct >= 50 ? 'Moderate Match' : 'Low Match'}
                </p>
                <p className="text-xs text-txt-secondary mt-0.5">
                  {matchedSkills.length} of {jobSkills.length} required skills matched
                </p>
              </div>
            </div>

            <span className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
              matchPct >= 70
                ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                : 'bg-amber-500/10 border border-amber-500/20 text-amber-400'
            }`}>
              {matchPct >= 70 ? 'High callback probability' : 'Consider upskilling'}
            </span>
          </div>

          {/* Skill breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Matched */}
            <div className="bg-navy-900 border border-emerald-500/15 p-4 rounded-xl">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <p className="text-xs font-medium text-emerald-400">Matched skills ({matchedSkills.length})</p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {matchedSkills.length > 0 ? matchedSkills.map((s, i) => (
                  <span key={i} className="px-2.5 py-1 text-xs font-medium bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-md">
                    {s}
                  </span>
                )) : (
                  <p className="text-xs text-txt-tertiary">No matching skills yet.</p>
                )}
              </div>
            </div>

            {/* Missing */}
            <div className="bg-navy-900 border border-amber-500/15 p-4 rounded-xl">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <p className="text-xs font-medium text-amber-400">Skill gaps ({missingSkills.length})</p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {missingSkills.length > 0 ? missingSkills.map((s, i) => (
                  <span key={i} className="px-2.5 py-1 text-xs font-medium bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-md flex items-center gap-1">
                    <Plus className="w-3 h-3" /> {s}
                  </span>
                )) : (
                  <p className="text-xs text-emerald-400 font-medium">Perfect skill overlap!</p>
                )}
              </div>
            </div>
          </div>

          {/* Edit skills */}
          <div className="border-t border-navy-750 pt-5">
            <p className="text-sm font-medium text-txt-secondary mb-2">Your skills (edit to recalculate)</p>
            <div className="flex flex-wrap items-center gap-2 bg-navy-900 border border-navy-750 p-2.5 rounded-lg">
              {candidateProfile.skills.map((skill, i) => (
                <span key={i} className="flex items-center gap-1.5 bg-navy-800 border border-navy-700 text-txt-secondary text-xs px-2.5 py-1 rounded-md">
                  {skill}
                  <button onClick={() => handleRemoveSkill(skill)} className="hover:text-rose-400">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              <input
                type="text"
                value={newSkillInput}
                onChange={(e) => setNewSkillInput(e.target.value)}
                onKeyDown={handleAddSkill}
                placeholder="Add skill, press Enter"
                className="flex-1 bg-transparent text-sm text-white focus:outline-none px-1 py-0.5 min-w-[140px]"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="pt-5 mt-5 border-t border-navy-750 flex items-center justify-between">
            <span className="text-xs text-txt-tertiary">Score updates automatically as you edit.</span>
            <button onClick={onClose} className="px-5 py-2 text-sm font-semibold text-white bg-brand hover:bg-brand-light rounded-lg transition-colors">
              Done
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
