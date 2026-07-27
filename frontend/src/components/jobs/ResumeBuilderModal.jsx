import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Upload, FileText, CheckCircle2, ChevronRight, ChevronLeft,
  Briefcase, GraduationCap, Code2, AlertTriangle, Play, Sparkles, Maximize2, Minimize2
} from 'lucide-react';
import { useToast } from '../Toast';

// Framer motion variants
const slideUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', damping: 25, stiffness: 400 } },
  exit: { opacity: 0, y: -20 }
};

export default function ResumeBuilderModal({ isOpen, onClose, onSaveResume }) {
  const toast = useToast();
  const [step, setStep] = useState('CHOICE'); // CHOICE, UPLOAD, BUILD, ANALYZING, SCORE
  const [targetRole, setTargetRole] = useState('Software Engineer');
  const [isFullScreen, setIsFullScreen] = useState(false);
  
  // Builder state
  const [resumeData, setResumeData] = useState({
    name: '', email: '',
    experience: [], education: [], skills: ''
  });

  // Mock Analysis Data
  const [score, setScore] = useState(0);
  const targetScore = 86;

  // Reset state on open
  useEffect(() => {
    if (isOpen) {
      setStep('CHOICE');
      setScore(0);
      setIsFullScreen(false);
      setResumeData({ name: '', email: '', experience: [], education: [], skills: '' });
    }
  }, [isOpen]);

  // Score counter animation
  useEffect(() => {
    if (step === 'SCORE') {
      const duration = 1500;
      const steps = 60;
      const stepTime = duration / steps;
      let current = 0;
      const timer = setInterval(() => {
        current += targetScore / steps;
        if (current >= targetScore) {
          setScore(targetScore);
          clearInterval(timer);
        } else {
          setScore(Math.floor(current));
        }
      }, stepTime);
      return () => clearInterval(timer);
    }
  }, [step]);

  if (!isOpen) return null;

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setStep('ANALYZING');
      setTimeout(() => {
        setStep('SCORE');
        toast('Resume parsed successfully!', 'success');
      }, 3000);
    }
  };

  const handleSaveAndFinish = () => {
    onSaveResume({ ...resumeData, score: targetScore, hasResume: true });
    toast('Resume saved to your profile!', 'success');
    onClose();
  };

  return (
    <AnimatePresence>
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-300 ${
          isFullScreen ? 'p-0' : 'p-4 sm:p-6'
        }`}
      >
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="absolute inset-0 bg-main/80 backdrop-blur-sm"
          onClick={onClose}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className={`relative z-10 bg-surface border border-borderStrong shadow-2xl overflow-hidden flex flex-col transition-all duration-300 ${
            isFullScreen
              ? 'w-full h-full max-w-none max-h-none rounded-none p-6 md:p-10'
              : 'w-full max-w-3xl max-h-[90vh] rounded-2xl'
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-borderSubtle bg-nested/50">
            <h2 className="text-xl font-bold text-txtMain flex items-center gap-2">
              <FileText className="w-5 h-5 text-accent" />
              Resume Builder & ATS Parser
            </h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsFullScreen(!isFullScreen)}
                className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-all ${
                  isFullScreen
                    ? 'bg-accent/20 border-accent/40 text-accent'
                    : 'bg-nested hover:bg-surface border-borderSubtle text-txtMuted hover:text-txtMain'
                }`}
                title={isFullScreen ? 'Exit Full Screen' : 'Full Screen / Full Page Mode'}
              >
                {isFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>

              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg bg-nested hover:bg-surface border border-borderSubtle flex items-center justify-center text-txtMuted hover:text-txtMain transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-6">
            <AnimatePresence mode="wait">
              {/* STEP 1: CHOICE */}
              {step === 'CHOICE' && (
                <motion.div key="choice" variants={slideUp} initial="hidden" animate="visible" exit="exit" className="flex flex-col items-center text-center py-10">
                  <h3 className="text-2xl font-extrabold text-txtMain mb-2">How would you like to start?</h3>
                  <p className="text-txtMuted mb-8 max-w-md">Upload an existing resume to get an instant ATS score, or build a new one from scratch to guarantee perfect formatting.</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl">
                    <button
                      onClick={() => document.getElementById('resume-upload').click()}
                      className="flex flex-col items-center justify-center p-8 bg-nested border-2 border-dashed border-borderStrong hover:border-accent hover:bg-accent/5 rounded-xl transition-all group"
                    >
                      <div className="w-16 h-16 rounded-full bg-surface border border-borderSubtle flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Upload className="w-8 h-8 text-accent" />
                      </div>
                      <span className="text-lg font-bold text-txtMain mb-1">Upload Resume</span>
                      <span className="text-sm text-txtMuted">PDF, DOCX up to 5MB</span>
                      <input id="resume-upload" type="file" accept=".pdf,.docx" className="hidden" onChange={handleFileUpload} />
                    </button>

                    <button
                      onClick={() => setStep('BUILD')}
                      className="flex flex-col items-center justify-center p-8 bg-nested border-2 border-transparent hover:border-accent hover:bg-accent/5 rounded-xl transition-all shadow-sm group"
                    >
                      <div className="w-16 h-16 rounded-full bg-surface border border-borderSubtle flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Code2 className="w-8 h-8 text-indigo-500" />
                      </div>
                      <span className="text-lg font-bold text-txtMain mb-1">Build from Scratch</span>
                      <span className="text-sm text-txtMuted">Guided step-by-step creator</span>
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: BUILD */}
              {step === 'BUILD' && (
                <motion.div key="build" variants={slideUp} initial="hidden" animate="visible" exit="exit" className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-txtMain mb-1">Full Name</label>
                      <input type="text" className="w-full bg-nested border border-borderSubtle rounded-lg px-4 py-2.5 text-txtMain focus:border-accent focus:ring-1 focus:ring-accent outline-none" placeholder="John Doe" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-txtMain mb-1">Target Role</label>
                      <input type="text" value={targetRole} onChange={(e) => setTargetRole(e.target.value)} className="w-full bg-nested border border-borderSubtle rounded-lg px-4 py-2.5 text-txtMain focus:border-accent focus:ring-1 focus:ring-accent outline-none" placeholder="e.g. Frontend Engineer" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-txtMain mb-1">Experience (Markdown)</label>
                    <textarea rows={4} className="w-full bg-nested border border-borderSubtle rounded-lg px-4 py-2.5 text-txtMain focus:border-accent focus:ring-1 focus:ring-accent outline-none" placeholder="- Senior Developer at TechCorp..."></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-txtMain mb-1">Skills (Comma separated)</label>
                    <input type="text" className="w-full bg-nested border border-borderSubtle rounded-lg px-4 py-2.5 text-txtMain focus:border-accent focus:ring-1 focus:ring-accent outline-none" placeholder="React, TypeScript, Node.js" />
                  </div>
                  <div className="flex justify-end gap-3 mt-8">
                    <button onClick={() => setStep('CHOICE')} className="px-5 py-2.5 text-sm font-semibold text-txtMain bg-nested hover:bg-surface border border-borderSubtle rounded-xl transition-colors">
                      Back
                    </button>
                    <button onClick={() => { setStep('ANALYZING'); setTimeout(() => setStep('SCORE'), 3000); }} className="px-5 py-2.5 text-sm font-semibold text-white bg-accent hover:opacity-90 rounded-xl transition-opacity flex items-center gap-2">
                      Generate & Analyze <Play className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: ANALYZING (LOADING STATE) */}
              {step === 'ANALYZING' && (
                <motion.div key="analyzing" variants={slideUp} initial="hidden" animate="visible" exit="exit" className="flex flex-col items-center justify-center py-20">
                  <div className="w-16 h-16 rounded-full border-4 border-nested border-t-accent animate-spin mb-6"></div>
                  <h3 className="text-xl font-bold text-txtMain mb-2">Analyzing against ATS...</h3>
                  <p className="text-txtMuted">Checking keywords, formatting, and impact for "{targetRole}"</p>
                </motion.div>
              )}

              {/* STEP 4: SCORE REVEAL */}
              {step === 'SCORE' && (
                <motion.div key="score" variants={slideUp} initial="hidden" animate="visible" exit="exit" className="space-y-8">
                  
                  {/* Score Header */}
                  <div className="flex flex-col md:flex-row items-center gap-8 bg-nested/50 p-6 rounded-2xl border border-borderSubtle">
                    {/* Circular Score Widget */}
                    <div className="relative w-32 h-32 flex items-center justify-center shrink-0">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="40" className="stroke-borderSubtle fill-none" strokeWidth="8" />
                        <motion.circle
                          cx="50" cy="50" r="40" className="stroke-success fill-none" strokeWidth="8" strokeLinecap="round"
                          initial={{ strokeDasharray: 251, strokeDashoffset: 251 }}
                          animate={{ strokeDashoffset: 251 - (251 * score) / 100 }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-4xl font-extrabold text-txtMain">{score}</span>
                        <span className="text-[10px] font-bold text-success uppercase tracking-widest">Great</span>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-2xl font-bold text-txtMain mb-2 flex items-center gap-2">
                        ATS Compatibility Score <Sparkles className="w-5 h-5 text-amber-400" />
                      </h3>
                      <p className="text-txtMuted">Your resume is highly optimized for <strong>{targetRole}</strong> roles. It passes standard ATS parsers cleanly.</p>
                    </div>
                  </div>

                  {/* Breakdown */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl border border-borderSubtle bg-surface">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle2 className="w-5 h-5 text-success" />
                        <h4 className="font-bold text-txtMain">Keyword Match</h4>
                      </div>
                      <p className="text-sm text-txtMuted">92% match with standard requirements. Detected: React, Node, SQL.</p>
                    </div>
                    <div className="p-4 rounded-xl border border-borderSubtle bg-surface">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle2 className="w-5 h-5 text-success" />
                        <h4 className="font-bold text-txtMain">Structure & Parsing</h4>
                      </div>
                      <p className="text-sm text-txtMuted">Clean text extraction. No tables or complex columns blocking ATS.</p>
                    </div>
                    <div className="p-4 rounded-xl border border-borderSubtle bg-surface">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle2 className="w-5 h-5 text-success" />
                        <h4 className="font-bold text-txtMain">Action Verbs</h4>
                      </div>
                      <p className="text-sm text-txtMuted">Strong impact phrasing used in 80% of bullet points.</p>
                    </div>
                    <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/5">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="w-5 h-5 text-amber-500" />
                        <h4 className="font-bold text-amber-500">Length Optimization</h4>
                      </div>
                      <p className="text-sm text-amber-500/80">Slightly long. Consider trimming experience older than 10 years.</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end gap-3 pt-4 border-t border-borderSubtle">
                    <button onClick={() => setStep('CHOICE')} className="px-5 py-2.5 text-sm font-semibold text-txtMain bg-nested hover:bg-surface border border-borderSubtle rounded-xl transition-colors">
                      Start Over
                    </button>
                    <button onClick={handleSaveAndFinish} className="px-5 py-2.5 text-sm font-semibold text-white bg-accent hover:opacity-90 rounded-xl transition-opacity">
                      Save & Finish
                    </button>
                  </div>

                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
