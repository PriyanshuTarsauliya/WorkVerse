import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, ShieldAlert, CheckCircle2, X, AlertTriangle, Building2, UserCheck, BarChart3, Trash2, Eye } from 'lucide-react';

const INITIAL_REVIEW_QUEUE = [
  { id: 'rev-1', title: 'Senior Backend Engineer', company: 'Apex Global Tech', type: 'Full-time', panStatus: 'VERIFIED', flagCount: 0, status: 'PENDING' },
  { id: 'rev-2', title: 'High Yield Crypto Trader (Work From Home)', company: 'FastPay Crypto Pvt', type: 'Remote', panStatus: 'UNVERIFIED', flagCount: 4, status: 'FLAGGED' },
  { id: 'rev-3', title: 'Lead Product Designer', company: 'Swiggy India', type: 'Hybrid', panStatus: 'VERIFIED', flagCount: 0, status: 'APPROVED' },
];

export default function AdminModerationModal({ isOpen, onClose }) {
  const [queue, setQueue] = useState(INITIAL_REVIEW_QUEUE);
  const [activeFilter, setActiveFilter] = useState('ALL');

  if (!isOpen) return null;

  const handleAction = (id, newStatus) => {
    setQueue((prev) => prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item)));
  };

  const filtered = queue.filter(
    (item) => activeFilter === 'ALL' || item.status === activeFilter
  );

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-4xl bg-surface border border-borderStrong rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-txtMain flex flex-col overflow-hidden max-h-[85vh]"
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
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold tracking-tight">Platform Admin & Moderation Panel</h2>
              <p className="text-xs text-txtMuted">Approve employer job listings, review flagged jobs & audit KYC verification</p>
            </div>
          </div>

          {/* Status Tabs */}
          <div className="flex items-center gap-2 border-b border-borderSubtle pb-2 shrink-0">
            {['ALL', 'PENDING', 'FLAGGED', 'APPROVED'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveFilter(tab)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeFilter === tab
                    ? 'bg-accent text-white'
                    : 'bg-nested text-txtMuted hover:text-txtMain'
                }`}
              >
                {tab} ({queue.filter((q) => tab === 'ALL' || q.status === tab).length})
              </button>
            ))}
          </div>

          {/* List */}
          <div className="space-y-3 overflow-y-auto flex-1 pr-1">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="p-4 bg-nested rounded-2xl border border-borderSubtle flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-txtMain">{item.title}</h4>
                    {item.flagCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 text-[10px] font-bold border border-red-500/20">
                        {item.flagCount} Scam Flags
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-txtMuted flex items-center gap-2">
                    <span>{item.company}</span>
                    <span>•</span>
                    <span className="font-mono text-[11px] text-emerald-400">KYC: {item.panStatus}</span>
                  </p>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                  {item.status !== 'APPROVED' && (
                    <button
                      onClick={() => handleAction(item.id, 'APPROVED')}
                      className="flex-1 sm:flex-none px-3.5 py-1.5 text-xs font-bold text-white bg-emerald-500 hover:bg-emerald-600 rounded-xl transition-all flex items-center justify-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Approve Listing
                    </button>
                  )}
                  {item.status !== 'REJECTED' && (
                    <button
                      onClick={() => handleAction(item.id, 'REJECTED')}
                      className="flex-1 sm:flex-none px-3.5 py-1.5 text-xs font-bold text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-xl transition-all flex items-center justify-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Reject / Ban
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
