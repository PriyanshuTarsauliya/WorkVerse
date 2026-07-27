import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trophy, Users, Clock, Calendar, CheckCircle2, ChevronRight, Zap, Gift, ShieldAlert, Maximize2, Minimize2 } from 'lucide-react';

const HACKATHONS = [
  {
    id: 'razorpay-blitz',
    title: 'Razorpay Fintech Full-Stack Blitz 2025',
    organizer: 'Razorpay',
    prizePool: '₹5,00,000 + Direct PPI Calls',
    prizes: ['1st Place: ₹2,50,000', '2nd Place: ₹1,50,000', 'Direct Interview Shortlists for Top 20'],
    participants: 1420,
    deadline: 'Starts in 3 Days (March 1, 2025)',
    techStack: ['React', 'Node.js', 'Web3 / Payments API', 'System Architecture'],
    description: 'Build low-latency payment checkout tools or fraud detection microservices. Submissions are judged by Razorpay VP of Engineering.',
  },
  {
    id: 'flipkart-genai',
    title: 'Flipkart Catalog GenAI & Search Challenge',
    organizer: 'Flipkart AI Lab',
    prizePool: '₹7,50,000 + MacBooks',
    prizes: ['1st Place: ₹4,00,000 + M3 Max MacBook', 'Fast-track Interviews for Senior Data Scientist'],
    participants: 2890,
    deadline: 'Starts in 7 Days (March 5, 2025)',
    techStack: ['Python', 'PyTorch', 'Vector Databases', 'LLM Fine-Tuning'],
    description: 'Create multi-modal e-commerce search algorithms using open-source LLMs to index petabytes of catalog imagery.',
  },
  {
    id: 'swiggy-system-design',
    title: 'Swiggy Quick-Commerce System Design Challenge',
    organizer: 'Swiggy Tech',
    prizePool: '₹3,00,000 + Swag Kits',
    prizes: ['Top 10 receive guaranteed final round interviews at Swiggy Instamart'],
    participants: 940,
    deadline: 'Active Now (Ends March 10, 2025)',
    techStack: ['Go', 'Kafka', 'Redis', 'High-Scale Geo-Clustering'],
    description: 'Architect a dark-store inventory allocation engine capable of handling 50,000 orders per minute during peak IPL match hours.',
  }
];

export default function HiringChallengesModal({ isOpen, onClose }) {
  const [registeredChallenges, setRegisteredChallenges] = useState({});
  const [isFullScreen, setIsFullScreen] = useState(false);

  const handleRegister = (challengeId) => {
    setRegisteredChallenges((prev) => ({ ...prev, [challengeId]: true }));
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        className={`fixed inset-0 z-[60] flex items-center justify-center bg-black/65 backdrop-blur-md transition-all duration-300 ${
          isFullScreen ? 'p-0' : 'p-4'
        }`}
        data-testid="hiring-challenges-modal"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className={`relative bg-surface border border-borderStrong shadow-2xl overflow-hidden flex flex-col transition-all duration-300 ${
            isFullScreen
              ? 'w-full h-full max-w-none max-h-none rounded-none p-6 md:p-10'
              : 'w-full max-w-4xl max-h-[90vh] rounded-2xl p-6 md:p-8'
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-borderSubtle">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center text-white font-bold shadow-md">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-txtMain tracking-tight">Hiring Challenges & Hackathons</h2>
                <p className="text-xs text-txtMuted">Compete in company-sponsored coding contests to win cash prizes & direct interview calls</p>
              </div>
            </div>

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

          {/* List Content */}
          <div className="flex-1 overflow-y-auto pt-5 space-y-4 pr-1">
            {HACKATHONS.map((h) => {
              const isRegistered = registeredChallenges[h.id];
              return (
                <div key={h.id} className="bg-main border border-borderSubtle rounded-2xl p-5 space-y-4 hover:border-amber-500/30 transition-all">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-md border border-amber-500/20">
                        {h.organizer} Sponsored
                      </span>
                      <h3 className="text-lg font-bold text-txtMain mt-1">{h.title}</h3>
                    </div>

                    <div className="text-right sm:text-right shrink-0">
                      <span className="text-xs text-txtMuted block">Total Prize Pool</span>
                      <span className="text-base font-extrabold text-emerald-400">{h.prizePool}</span>
                    </div>
                  </div>

                  <p className="text-xs text-txtMuted leading-relaxed">{h.description}</p>

                  {/* Badges & Meta */}
                  <div className="flex flex-wrap gap-4 text-xs text-txtMuted border-y border-borderSubtle py-3">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Users className="w-4 h-4 text-accent" /> {h.participants} Registered Engineers
                    </span>
                    <span className="flex items-center gap-1.5 font-medium">
                      <Clock className="w-4 h-4 text-amber-400" /> {h.deadline}
                    </span>
                  </div>

                  {/* Tech Stack */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] font-semibold text-txtMuted">Tech Tags:</span>
                    {h.techStack.map((t, idx) => (
                      <span key={idx} className="bg-surface border border-borderSubtle px-2.5 py-0.5 rounded-md text-[11px] font-semibold text-txtMain">
                        {t}
                      </span>
                    ))}
                  </div>

                  {/* Register Button */}
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-1.5 text-xs text-txtMuted">
                      <Gift className="w-4 h-4 text-accent" /> Includes Certificate of Participation
                    </div>

                    {isRegistered ? (
                      <span className="px-4 py-2 text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-xl inline-flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" /> Registered & Confirmed
                      </span>
                    ) : (
                      <button
                        onClick={() => handleRegister(h.id)}
                        className="px-5 py-2 text-xs font-bold text-white bg-gradient-to-r from-amber-500 to-rose-500 hover:opacity-90 rounded-xl transition-all shadow-md inline-flex items-center gap-1.5"
                      >
                        Register for Challenge <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
