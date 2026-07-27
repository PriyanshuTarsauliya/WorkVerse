import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Filter, CheckCircle2, X, ChevronRight, MessageSquare, Download, Sparkles, Building2, UserCheck, UserX, Clock } from 'lucide-react';

const INITIAL_APPLICANTS = [
  { id: 'app-1', name: 'Aarav Sharma', role: 'Senior Full Stack Engineer', score: 96, stage: 'Applied', experience: '5 yrs', location: 'Bengaluru', notes: 'Strong React & Node.js backend experience.' },
  { id: 'app-2', name: 'Priya Sundaram', role: 'Backend Lead (Java/Spring)', score: 92, stage: 'Screened', experience: '6 yrs', location: 'Hyderabad', notes: 'Cleared preliminary technical resume screening.' },
  { id: 'app-3', name: 'Rohan Verma', role: 'Frontend Architect', score: 88, stage: 'Interview Scheduled', experience: '7 yrs', location: 'Gurugram', notes: 'System design interview scheduled for Tuesday at 3 PM.' },
  { id: 'app-4', name: 'Ananya Patel', role: 'Product Manager', score: 94, stage: 'Offered', experience: '4 yrs', location: 'Mumbai', notes: 'Offer letter dispatched with 24 LPA package.' },
  { id: 'app-5', name: 'Vikram Malhotra', role: 'DevOps & Cloud Engineer', score: 79, stage: 'Rejected', experience: '3 yrs', location: 'Pune', notes: 'Skill gaps in Kubernetes cluster deployment.' },
];

const STAGES = ['Applied', 'Screened', 'Interview Scheduled', 'Offered', 'Rejected'];

export default function EmployerATSModal({ isOpen, onClose }) {
  const [applicants, setApplicants] = useState(INITIAL_APPLICANTS);
  const [activeTab, setActiveTab] = useState('All');
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [noteInput, setNoteInput] = useState('');

  if (!isOpen) return null;

  const handleUpdateStage = (applicantId, newStage) => {
    setApplicants((prev) =>
      prev.map((item) => (item.id === applicantId ? { ...item, stage: newStage } : item))
    );
  };

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!noteInput.trim() || !selectedApplicant) return;
    setApplicants((prev) =>
      prev.map((item) =>
        item.id === selectedApplicant.id
          ? { ...item, notes: item.notes + ` | Note: ${noteInput}` }
          : item
      )
    );
    setSelectedApplicant((prev) => ({ ...prev, notes: prev.notes + ` | Note: ${noteInput}` }));
    setNoteInput('');
  };

  const filteredApplicants = applicants.filter(
    (item) => activeTab === 'All' || item.stage === activeTab
  );

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-5xl bg-surface border border-borderStrong rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-txtMain max-h-[90vh] flex flex-col overflow-hidden"
        >
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-nested hover:bg-borderSubtle flex items-center justify-center text-txtMuted hover:text-txtMain transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-3 border-b border-borderSubtle pb-4 shrink-0">
            <div className="w-12 h-12 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold tracking-tight">Employer Candidate ATS Pipeline</h2>
              <p className="text-xs text-txtMuted">Manage applicant stages, recruiter notes, and hiring offers</p>
            </div>
          </div>

          {/* Stage Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 shrink-0 border-b border-borderSubtle">
            <button
              onClick={() => setActiveTab('All')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
                activeTab === 'All'
                  ? 'bg-accent text-white'
                  : 'bg-nested text-txtMuted hover:text-txtMain'
              }`}
            >
              All Candidates ({applicants.length})
            </button>
            {STAGES.map((stg) => {
              const count = applicants.filter((a) => a.stage === stg).length;
              return (
                <button
                  key={stg}
                  onClick={() => setActiveTab(stg)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
                    activeTab === stg
                      ? 'bg-accent text-white'
                      : 'bg-nested text-txtMuted hover:text-txtMain'
                  }`}
                >
                  {stg} ({count})
                </button>
              );
            })}
          </div>

          {/* Main Grid: Applicants List + Candidate Detail Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 flex-1 min-h-0 overflow-y-auto">
            {/* Left Applicants List Column */}
            <div className="lg:col-span-7 space-y-3">
              {filteredApplicants.map((app) => (
                <motion.div
                  key={app.id}
                  onClick={() => setSelectedApplicant(app)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                    selectedApplicant?.id === app.id
                      ? 'bg-accent/10 border-accent'
                      : 'bg-nested/60 border-borderSubtle hover:border-borderStrong'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-txtMain">{app.name}</h4>
                      <p className="text-xs text-txtMuted">{app.role} • {app.experience} • {app.location}</p>
                    </div>
                    <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {app.score}% Match
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="px-2 py-0.5 rounded-lg bg-surface border border-borderSubtle text-[11px] font-semibold text-txtMuted">
                      Stage: <strong className="text-txtMain">{app.stage}</strong>
                    </span>
                    <span className="text-[11px] text-accent font-semibold flex items-center gap-1">
                      View Notes & Pipeline <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Right Candidate Detail Column */}
            <div className="lg:col-span-5 bg-nested p-5 rounded-2xl border border-borderSubtle flex flex-col justify-between space-y-4">
              {selectedApplicant ? (
                <>
                  <div className="space-y-3">
                    <div className="border-b border-borderSubtle pb-3">
                      <h3 className="text-base font-bold text-txtMain">{selectedApplicant.name}</h3>
                      <p className="text-xs text-txtMuted">{selectedApplicant.role}</p>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-txtMuted uppercase tracking-wider">
                        Update Hiring Stage
                      </label>
                      <select
                        value={selectedApplicant.stage}
                        onChange={(e) => handleUpdateStage(selectedApplicant.id, e.target.value)}
                        className="w-full bg-surface border border-borderStrong focus:border-accent rounded-xl px-3 py-2 text-xs font-semibold text-txtMain outline-none"
                      >
                        {STAGES.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-txtMuted uppercase tracking-wider">
                        Recruiter Internal Notes
                      </label>
                      <p className="p-3 bg-surface rounded-xl border border-borderSubtle text-xs text-txtMuted leading-relaxed">
                        {selectedApplicant.notes}
                      </p>
                    </div>

                    <form onSubmit={handleAddNote} className="space-y-2">
                      <input
                        type="text"
                        placeholder="Add internal hiring note..."
                        value={noteInput}
                        onChange={(e) => setNoteInput(e.target.value)}
                        className="w-full bg-surface border border-borderStrong focus:border-accent rounded-xl px-3 py-2 text-xs text-txtMain outline-none"
                      />
                      <button
                        type="submit"
                        className="w-full py-2 text-xs font-bold text-white bg-accent hover:bg-accent/90 rounded-xl transition-all"
                      >
                        Save Recruiter Note
                      </button>
                    </form>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                  <Users className="w-8 h-8 text-txtMuted mb-2" />
                  <p className="text-xs text-txtMuted">Select an applicant to update recruitment pipeline stage and recruiter notes.</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
