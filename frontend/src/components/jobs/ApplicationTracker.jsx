import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GripVertical, Clock, MapPin, Building2, CheckCircle2, MoreVertical, SearchX,
  IndianRupee, Sparkles, MoveRight, ArrowUpRight, TrendingUp, Layers, HelpCircle
} from 'lucide-react';
import { useToast } from '../Toast';

const STAGES = [
  {
    id: 'saved',
    label: 'Saved',
    accentColor: 'from-slate-500 to-indigo-500',
    borderColor: 'border-slate-500/30',
    badgeStyle: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
    dropHint: 'Saved for later review'
  },
  {
    id: 'applied',
    label: 'Applied',
    accentColor: 'from-blue-500 to-cyan-500',
    borderColor: 'border-blue-500/30',
    badgeStyle: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    dropHint: 'Drop here when submitted'
  },
  {
    id: 'in_review',
    label: 'Under Review',
    accentColor: 'from-amber-500 to-orange-500',
    borderColor: 'border-amber-500/30',
    badgeStyle: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    dropHint: 'Application under review'
  },
  {
    id: 'interview',
    label: 'Interview',
    accentColor: 'from-purple-500 to-pink-500',
    borderColor: 'border-purple-500/30',
    badgeStyle: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    dropHint: 'Interview scheduled'
  },
  {
    id: 'offer_rejected',
    label: 'Offered / Decided',
    accentColor: 'from-emerald-500 to-teal-500',
    borderColor: 'border-emerald-500/30',
    badgeStyle: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    dropHint: 'Final decision stage'
  }
];

const TIMELINE_STEPS = [
  { key: 'APPLIED', label: 'Application Received', description: 'Your application was successfully submitted to the employer.' },
  { key: 'UNDER_REVIEW', label: 'Under Review', description: 'Recruiters are reviewing your resume and profile experience.' },
  { key: 'SHORTLISTED', label: 'Shortlisted', description: 'Great news! You passed initial screening and were shortlisted.' },
  { key: 'INTERVIEW_SCHEDULED', label: 'Interview Scheduled', description: 'Technical and cultural interviews are currently scheduled.' },
  { key: 'OFFERED', label: 'Offer Extended', description: 'Congratulations! An official job offer has been issued.' },
];

const formatSalaryRupees = (min, max) => {
  if (!min) return null;
  const minLakhs = (min / 100000).toFixed(min % 100000 === 0 ? 0 : 1);
  const maxLakhs = max ? (max / 100000).toFixed(max % 100000 === 0 ? 0 : 1) : null;
  return maxLakhs ? `₹${minLakhs}–${maxLakhs}L` : `₹${minLakhs}L+`;
};

export default function ApplicationTracker({ applications = {}, allJobs = [], onUpdateStage, onOpenDetail }) {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState('saved');
  const [draggedOverStage, setDraggedOverStage] = useState(null);
  const [backendApps, setBackendApps] = useState([]);

  React.useEffect(() => {
    const fetchBackendApplications = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
        const res = await fetch(`${baseUrl}/api/v1/jobs/applications/mine`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setBackendApps(data);
        }
      } catch (err) {
        console.warn('Could not fetch backend applications:', err);
      }
    };
    fetchBackendApplications();
  }, []);

  // Group jobs by stage
  const groupedJobs = STAGES.reduce((acc, stage) => {
    acc[stage.id] = [];
    return acc;
  }, {});

  Object.entries(applications).forEach(([jobId, stage]) => {
    const job = allJobs.find(j => j.id.toString() === jobId.toString());
    if (job && groupedJobs[stage]) {
      groupedJobs[stage].push(job);
    }
  });

  const totalTracked = Object.keys(applications).length;
  const totalApplied = (groupedJobs['applied']?.length || 0) + (groupedJobs['in_review']?.length || 0);
  const totalInterviews = groupedJobs['interview']?.length || 0;
  const totalOffers = groupedJobs['offer_rejected']?.length || 0;

  const handleDragStart = (e, jobId, currentStage) => {
    e.dataTransfer.setData('jobId', jobId);
    e.dataTransfer.setData('sourceStage', currentStage);
  };

  const handleDrop = (e, targetStage) => {
    e.preventDefault();
    setDraggedOverStage(null);
    const jobId = e.dataTransfer.getData('jobId');
    const sourceStage = e.dataTransfer.getData('sourceStage');

    if (sourceStage !== targetStage) {
      onUpdateStage(jobId, targetStage);
      const stageName = STAGES.find(s => s.id === targetStage)?.label;
      toast(`Moved to ${stageName}`, 'success');
    }
  };

  const handleDragOver = (e, stageId) => {
    e.preventDefault();
    if (draggedOverStage !== stageId) {
      setDraggedOverStage(stageId);
    }
  };

  const handleDragLeave = (e, stageId) => {
    if (draggedOverStage === stageId) {
      setDraggedOverStage(null);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Analytics Summary Banner */}
      <div className="bg-surface border border-borderSubtle rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold text-txtMain">Application Tracker</h2>
              <span className="px-2.5 py-0.5 text-xs font-extrabold text-accent bg-accent/10 border border-accent/20 rounded-full">
                Pipeline View
              </span>
            </div>
            <p className="text-xs text-txtMuted mt-1">
              Drag and drop job cards across columns to keep your hiring status synchronized.
            </p>
          </div>

          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full md:w-auto">
            <div className="bg-nested/60 border border-borderSubtle p-2.5 rounded-xl text-center">
              <p className="text-[10px] font-bold text-txtMuted uppercase tracking-wider">Total</p>
              <p className="text-lg font-black text-txtMain">{totalTracked}</p>
            </div>
            <div className="bg-nested/60 border border-borderSubtle p-2.5 rounded-xl text-center">
              <p className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">In Flight</p>
              <p className="text-lg font-black text-blue-400">{totalApplied}</p>
            </div>
            <div className="bg-nested/60 border border-borderSubtle p-2.5 rounded-xl text-center">
              <p className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">Interviews</p>
              <p className="text-lg font-black text-purple-400">{totalInterviews}</p>
            </div>
            <div className="bg-nested/60 border border-borderSubtle p-2.5 rounded-xl text-center">
              <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Offers</p>
              <p className="text-lg font-black text-emerald-400">{totalOffers}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Tab View */}
      <div className="lg:hidden space-y-4">
        <div className="flex overflow-x-auto pb-2 gap-2 hide-scrollbar">
          {STAGES.map(stage => (
            <button
              key={stage.id}
              onClick={() => setActiveTab(stage.id)}
              className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-extrabold transition-all border ${
                activeTab === stage.id
                  ? 'bg-accent/15 border-accent/40 text-accent shadow-sm'
                  : 'bg-nested border-borderSubtle text-txtMuted hover:text-txtMain'
              }`}
            >
              {stage.label} <span className="ml-1 opacity-70">({groupedJobs[stage.id].length})</span>
            </button>
          ))}
        </div>

        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {groupedJobs[activeTab].map(job => (
              <TrackerCard key={job.id} job={job} stageId={activeTab} onUpdateStage={onUpdateStage} onOpenDetail={onOpenDetail} isMobile />
            ))}
            {groupedJobs[activeTab].length === 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-12 text-center border-2 border-dashed border-borderSubtle rounded-2xl bg-nested/40">
                <SearchX className="w-8 h-8 text-txtMuted mx-auto mb-2 opacity-50" />
                <p className="text-sm font-semibold text-txtMuted">No applications in this stage</p>
                <p className="text-xs text-txtMuted/70 mt-1">Bookmark or apply to jobs to track them here.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Desktop Kanban Board - Full Width Grid */}
      <div className="hidden lg:grid grid-cols-5 gap-4 min-h-[620px] w-full" data-testid="application-tracker-board">
        {STAGES.map((stage) => {
          const stageJobs = groupedJobs[stage.id] || [];
          const isOver = draggedOverStage === stage.id;

          return (
            <div
              key={stage.id}
              data-testid={`kanban-column-${stage.id}`}
              className={`flex flex-col bg-surface border rounded-2xl overflow-hidden transition-all duration-200 shadow-sm ${
                isOver ? `border-accent shadow-lg bg-accent/5` : `border-borderSubtle`
              }`}
              onDrop={(e) => handleDrop(e, stage.id)}
              onDragOver={(e) => handleDragOver(e, stage.id)}
              onDragLeave={(e) => handleDragLeave(e, stage.id)}
            >
              {/* Header Accent Bar */}
              <div className={`h-1.5 w-full bg-gradient-to-r ${stage.accentColor}`} />

              {/* Column Header */}
              <div className="px-4 py-3 border-b border-borderSubtle bg-nested/50 flex items-center justify-between">
                <span className="font-bold text-xs text-txtMain uppercase tracking-wider">{stage.label}</span>
                <span className="text-xs font-black text-txtMain bg-surface px-2.5 py-0.5 rounded-full border border-borderSubtle shadow-2xs">
                  {stageJobs.length}
                </span>
              </div>

              {/* Column Body / Drop Zone */}
              <div className="flex-1 p-3 overflow-y-auto space-y-3 custom-scrollbar min-h-[450px]">
                <AnimatePresence mode="popLayout">
                  {stageJobs.map(job => (
                    <TrackerCard
                      key={job.id}
                      job={job}
                      stageId={stage.id}
                      onDragStart={(e) => handleDragStart(e, job.id, stage.id)}
                      onOpenDetail={onOpenDetail}
                    />
                  ))}
                </AnimatePresence>

                {/* Empty State Drop Zone Prompt */}
                {stageJobs.length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center py-16 px-4 text-center border-2 border-dashed border-borderSubtle/60 rounded-xl bg-nested/20">
                    <div className="w-10 h-10 rounded-full bg-nested flex items-center justify-center text-txtMuted mb-2 opacity-60">
                      <Layers className="w-5 h-5" />
                    </div>
                    <p className="text-xs font-semibold text-txtMuted">{stage.dropHint}</p>
                    <p className="text-[10px] text-txtMuted/60 mt-1">Drag card here</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Subcomponent: Rich Card in Kanban
function TrackerCard({ job, stageId, onDragStart, onUpdateStage, isMobile, onOpenDetail }) {
  const stageInfo = STAGES.find(s => s.id === stageId);
  const formattedSalary = formatSalaryRupees(job.salaryMin, job.salaryMax);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95, y: 5 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 450, damping: 28 }}
      draggable={!isMobile}
      onDragStart={onDragStart}
      onClick={() => onOpenDetail(job)}
      data-testid={`tracker-card-${job.id}`}
      className="group relative bg-nested/80 border border-borderSubtle hover:border-accent/40 rounded-xl p-3.5 cursor-grab active:cursor-grabbing shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between"
    >
      {/* Top Header: Company Avatar + Title + Drag Icon */}
      <div>
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-black shadow-xs shrink-0">
              {(job.company || 'W').charAt(0)}
            </div>
            <div className="min-w-0">
              <h4 className="font-bold text-xs text-txtMain line-clamp-1 group-hover:text-accent transition-colors">
                {job.title}
              </h4>
              <p className="text-[11px] font-semibold text-txtMuted line-clamp-1">{job.company}</p>
            </div>
          </div>

          {isMobile ? (
            <div className="relative shrink-0">
              <select
                value={stageId}
                onChange={(e) => onUpdateStage(job.id, e.target.value)}
                onClick={(e) => e.stopPropagation()}
                className="opacity-0 absolute inset-0 w-full h-full cursor-pointer z-10"
              >
                {STAGES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
              </select>
              <div className="p-1 rounded bg-surface hover:bg-borderSubtle text-txtMuted transition-colors">
                <MoreVertical className="w-3.5 h-3.5" />
              </div>
            </div>
          ) : (
            <div className="opacity-0 group-hover:opacity-100 p-1 text-txtMuted cursor-grab transition-opacity shrink-0">
              <GripVertical className="w-3.5 h-3.5" />
            </div>
          )}
        </div>

        {/* Location & Salary */}
        <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-semibold mb-3">
          <span className="flex items-center gap-0.5 text-txtMuted bg-surface px-2 py-0.5 rounded-md border border-borderSubtle">
            <MapPin className="w-2.5 h-2.5" /> {job.location}
          </span>
          {formattedSalary && (
            <span className="flex items-center gap-0.5 text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20 font-bold">
              {formattedSalary}
            </span>
          )}
        </div>
      </div>

      {/* Footer Details: Stage Tag + Days ago */}
      <div className="flex items-center justify-between gap-2 pt-2 border-t border-borderSubtle/60 mt-2">
        <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold border ${stageInfo?.badgeStyle}`}>
          {stageInfo?.label}
        </span>
        <span className="text-[10px] font-semibold text-txtMuted flex items-center gap-1">
          <Clock className="w-2.5 h-2.5" /> {job.postedDaysAgo ? `${job.postedDaysAgo}d ago` : 'Today'}
        </span>
      </div>
    </motion.div>
  );
}
