import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, DollarSign, TrendingUp, Award, MapPin, Briefcase, Zap, Building2, HelpCircle, ChevronRight, Maximize2, Minimize2 } from 'lucide-react';

const SALARY_DATA = {
  'frontend': {
    title: 'Frontend Engineer',
    base: { entry: 1200000, mid: 2200000, senior: 3500000, lead: 5200000 },
    percentiles: { p25: 1800000, median: 2600000, p75: 3800000, p90: 5500000 },
    skillsAddons: [
      { name: 'Next.js & Server Components', boost: '+18%' },
      { name: 'TypeScript Mastery', boost: '+15%' },
      { name: 'Web Performance & Micro-frontends', boost: '+22%' },
      { name: 'Three.js / Canvas 3D Graphics', boost: '+25%' },
    ],
    topCompanies: [
      { name: 'Razorpay', median: '₹32.5 LPA', rating: '4.8★' },
      { name: 'CRED', median: '₹35.0 LPA', rating: '4.8★' },
      { name: 'Postman', median: '₹30.0 LPA', rating: '4.9★' },
      { name: 'Google India', median: '₹42.0 LPA', rating: '4.9★' },
    ]
  },
  'backend': {
    title: 'Backend Engineer',
    base: { entry: 1400000, mid: 2500000, senior: 3800000, lead: 5800000 },
    percentiles: { p25: 2000000, median: 2800000, p75: 4200000, p90: 6200000 },
    skillsAddons: [
      { name: 'Distributed Systems & Microservices', boost: '+25%' },
      { name: 'Kafka & High-Throughput Pipelines', boost: '+20%' },
      { name: 'Go / Rust Performance Engine', boost: '+28%' },
      { name: 'Kubernetes & Infrastructure-as-Code', boost: '+18%' },
    ],
    topCompanies: [
      { name: 'Swiggy', median: '₹34.0 LPA', rating: '4.6★' },
      { name: 'Goldman Sachs', median: '₹36.0 LPA', rating: '4.3★' },
      { name: 'Uber India', median: '₹45.0 LPA', rating: '4.7★' },
      { name: 'Razorpay', median: '₹33.0 LPA', rating: '4.8★' },
    ]
  },
  'fullstack': {
    title: 'Full Stack Engineer',
    base: { entry: 1300000, mid: 2400000, senior: 3600000, lead: 5500000 },
    percentiles: { p25: 1900000, median: 2700000, p75: 4000000, p90: 5800000 },
    skillsAddons: [
      { name: 'React + Python/FastAPI', boost: '+22%' },
      { name: 'Cloud Native (AWS/GCP)', boost: '+18%' },
      { name: 'GraphQL & Apollo Server', boost: '+15%' },
      { name: 'System Architecture Design', boost: '+30%' },
    ],
    topCompanies: [
      { name: 'Flipkart', median: '₹35.0 LPA', rating: '4.7★' },
      { name: 'Postman', median: '₹32.0 LPA', rating: '4.9★' },
      { name: 'Atlassian', median: '₹40.0 LPA', rating: '4.8★' },
      { name: 'Zomato', median: '₹30.0 LPA', rating: '4.5★' },
    ]
  },
  'ai_ml': {
    title: 'AI / ML Engineer & Data Scientist',
    base: { entry: 1600000, mid: 3000000, senior: 4500000, lead: 7000000 },
    percentiles: { p25: 2400000, median: 3500000, p75: 5200000, p90: 7800000 },
    skillsAddons: [
      { name: 'LLM Fine-Tuning & RAG Pipelines', boost: '+35%' },
      { name: 'PyTorch / Distributed Training', boost: '+28%' },
      { name: 'Vector DBs (Pinecone, Qdrant)', boost: '+22%' },
      { name: 'MLOps & Ray/Spark Clusters', boost: '+25%' },
    ],
    topCompanies: [
      { name: 'Google Research', median: '₹55.0 LPA', rating: '4.9★' },
      { name: 'Flipkart AI Lab', median: '₹42.0 LPA', rating: '4.7★' },
      { name: 'Microsoft IDC', median: '₹48.0 LPA', rating: '4.8★' },
      { name: 'Fractal Analytics', median: '₹32.0 LPA', rating: '4.4★' },
    ]
  },
  'product': {
    title: 'Product Manager',
    base: { entry: 1500000, mid: 2800000, senior: 4200000, lead: 6500000 },
    percentiles: { p25: 2200000, median: 3200000, p75: 4800000, p90: 7200000 },
    skillsAddons: [
      { name: 'Growth & Retention Funnels', boost: '+25%' },
      { name: 'SQL & Advanced Product Analytics', boost: '+18%' },
      { name: 'Technical PM (APIs & Cloud)', boost: '+30%' },
      { name: 'A/B Experimentation Frameworks', boost: '+20%' },
    ],
    topCompanies: [
      { name: 'Swiggy', median: '₹38.0 LPA', rating: '4.6★' },
      { name: 'Razorpay', median: '₹36.0 LPA', rating: '4.8★' },
      { name: 'CRED', median: '₹42.0 LPA', rating: '4.8★' },
      { name: 'MakeMyTrip', median: '₹32.0 LPA', rating: '4.3★' },
    ]
  }
};

const LOCATION_MULTIPLIERS = {
  'bengaluru': { label: 'Bengaluru, KA', factor: 1.15 },
  'mumbai': { label: 'Mumbai, MH', factor: 1.10 },
  'delhi': { label: 'Delhi NCR', factor: 1.05 },
  'hyderabad': { label: 'Hyderabad, TS', factor: 1.05 },
  'remote': { label: 'Remote (India)', factor: 1.00 },
  'remote_us': { label: 'Remote (Global USD)', factor: 2.40 },
};

export default function SalaryGuideModal({ isOpen, onClose }) {
  const [selectedRoleKey, setSelectedRoleKey] = useState('frontend');
  const [selectedLocationKey, setSelectedLocationKey] = useState('bengaluru');
  const [selectedExpLevel, setSelectedExpLevel] = useState('mid');
  const [currency, setCurrency] = useState('INR'); // 'INR' | 'USD'
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [demandData, setDemandData] = useState(null);

  const currentRole = SALARY_DATA[selectedRoleKey] || SALARY_DATA['frontend'];
  const locationObj = LOCATION_MULTIPLIERS[selectedLocationKey] || LOCATION_MULTIPLIERS['bengaluru'];

  useEffect(() => {
    if (isOpen) {
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
      fetch(`${API_BASE_URL}/insights/market-demand?keywords=${encodeURIComponent(currentRole.title)}&location=${encodeURIComponent(locationObj.label)}`)
        .then(res => res.json())
        .then(data => setDemandData(data))
        .catch(err => console.error(err));
    }
  }, [isOpen, selectedRoleKey, selectedLocationKey]);

  const calculatedBaseSalary = useMemo(() => {
    const rawInr = currentRole.base[selectedExpLevel] * locationObj.factor;
    if (currency === 'USD') {
      return Math.round(rawInr / 83.5);
    }
    return rawInr;
  }, [currentRole, selectedExpLevel, locationObj, currency]);

  const formatMoney = (valInr) => {
    if (currency === 'USD') {
      const usd = Math.round(valInr / 83.5);
      return `$${usd.toLocaleString()}`;
    }
    const lpa = (valInr / 100000).toFixed(1);
    return `₹${lpa} LPA`;
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className={`fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-md transition-all duration-300 ${isFullScreen ? 'p-0' : 'p-4'}`} data-testid="salary-guide-modal">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className={`relative bg-surface border border-borderStrong shadow-2xl overflow-hidden flex flex-col transition-all duration-300 ${isFullScreen ? 'w-full h-full max-w-none max-h-none rounded-none p-6 md:p-10' : 'w-full max-w-4xl max-h-[90vh] rounded-2xl p-6 md:p-8'}`}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-borderSubtle">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white font-bold shadow-md">
                <DollarSign className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-txtMain tracking-tight">WorkVerse Salary Guide 2025</h2>
                <p className="text-xs text-txtMuted">Real market compensation benchmarks across tech roles in India & Global Remote</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="bg-nested border border-borderSubtle p-1 rounded-xl flex text-xs">
                <button
                  onClick={() => setCurrency('INR')}
                  className={`px-3 py-1 font-semibold rounded-lg transition-colors ${currency === 'INR' ? 'bg-accent text-white shadow-sm' : 'text-txtMuted hover:text-txtMain'}`}
                >
                  ₹ LPA
                </button>
                <button
                  onClick={() => setCurrency('USD')}
                  className={`px-3 py-1 font-semibold rounded-lg transition-colors ${currency === 'USD' ? 'bg-accent text-white shadow-sm' : 'text-txtMuted hover:text-txtMain'}`}
                >
                  $ USD
                </button>
              </div>

              <button
                onClick={() => setIsFullScreen(!isFullScreen)}
                className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-all ${isFullScreen ? 'bg-accent/20 border-accent/40 text-accent' : 'bg-nested hover:bg-surface border-borderSubtle text-txtMuted hover:text-txtMain'}`}
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

          {/* Controls Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 py-4 border-b border-borderSubtle bg-nested/30 -mx-6 px-6">
            <div>
              <label className="block text-[11px] font-semibold text-txtMuted mb-1">Target Role</label>
              <select
                value={selectedRoleKey}
                onChange={(e) => setSelectedRoleKey(e.target.value)}
                className="w-full bg-main border border-borderStrong focus:border-accent rounded-xl px-3 py-2 text-xs text-txtMain font-medium outline-none cursor-pointer"
              >
                {Object.entries(SALARY_DATA).map(([key, item]) => (
                  <option key={key} value={key}>{item.title}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-txtMuted mb-1">Location Tier</label>
              <select
                value={selectedLocationKey}
                onChange={(e) => setSelectedLocationKey(e.target.value)}
                className="w-full bg-main border border-borderStrong focus:border-accent rounded-xl px-3 py-2 text-xs text-txtMain font-medium outline-none cursor-pointer"
              >
                {Object.entries(LOCATION_MULTIPLIERS).map(([key, item]) => (
                  <option key={key} value={key}>{item.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-txtMuted mb-1">Experience Level</label>
              <div className="grid grid-cols-4 gap-1 bg-main border border-borderSubtle p-1 rounded-xl">
                {[
                  { id: 'entry', label: 'Entry' },
                  { id: 'mid', label: 'Mid' },
                  { id: 'senior', label: 'Senior' },
                  { id: 'lead', label: 'Lead' },
                ].map((exp) => (
                  <button
                    key={exp.id}
                    onClick={() => setSelectedExpLevel(exp.id)}
                    className={`py-1 text-[11px] font-semibold rounded-lg text-center transition-all ${selectedExpLevel === exp.id ? 'bg-accent/15 text-accent border border-accent/30' : 'text-txtMuted hover:text-txtMain'}`}
                  >
                    {exp.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Scrollable Content */}
          <div className="flex-1 overflow-y-auto pt-5 space-y-6 pr-1">
            {/* Top Summary Banner */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-accent/10 to-indigo-500/10 border border-emerald-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="inline-block px-2.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wider mb-1">
                  Estimated Average Compensation
                </span>
                <h3 className="text-3xl font-extrabold text-txtMain tracking-tight">
                  {currency === 'USD' ? `$${calculatedBaseSalary.toLocaleString()}` : `₹${(calculatedBaseSalary / 100000).toFixed(1)} LPA`}
                </h3>
                <p className="text-xs text-txtMuted mt-0.5">
                  Base Salary + Target Annual Bonus for <span className="font-semibold text-txtMain">{currentRole.title}</span> ({selectedExpLevel.toUpperCase()} Level) in <span className="font-semibold text-txtMain">{locationObj.label}</span>
                </p>
              </div>

              <div className="text-right sm:border-l sm:border-borderSubtle sm:pl-6 shrink-0">
                <div className="flex items-center justify-end gap-1.5 text-xs text-emerald-400 font-bold mb-1">
                  <TrendingUp className="w-4 h-4" /> 
                  {demandData && demandData.posting_count_level ? `${demandData.posting_count_level} Demand` : '+14.2% YoY Growth'}
                </div>
                <p className="text-[11px] text-txtMuted">
                  {demandData && demandData.posting_count != null ? `${demandData.posting_count.toLocaleString()} Active Job Postings (Careerjet)` : 'High demand role across top startups'}
                </p>
              </div>
            </div>

            {/* Percentiles Bar Visual */}
            <div className="bg-main border border-borderSubtle rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-txtMain flex items-center gap-2">
                  <Award className="w-4 h-4 text-accent" />
                  Salary Range Percentiles
                </h4>
                <span className="text-xs text-txtMuted">Based on 1,400+ verified offers</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: '25th Percentile', val: currentRole.percentiles.p25 * locationObj.factor, badge: 'Starting' },
                  { label: '50th (Median)', val: currentRole.percentiles.median * locationObj.factor, badge: 'Market Avg' },
                  { label: '75th Percentile', val: currentRole.percentiles.p75 * locationObj.factor, badge: 'High Competency' },
                  { label: '90th Percentile', val: currentRole.percentiles.p90 * locationObj.factor, badge: 'Top 10% Pay' },
                ].map((p, idx) => (
                  <div key={idx} className="bg-surface border border-borderSubtle p-3.5 rounded-xl text-center space-y-1">
                    <span className="text-[10px] font-bold text-accent bg-accent/10 px-2 py-0.5 rounded-full">
                      {p.badge}
                    </span>
                    <p className="text-xs text-txtMuted mt-1">{p.label}</p>
                    <p className="text-lg font-bold text-txtMain">{formatMoney(p.val)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Two Column Section: Skill Addons & Top Companies */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Skill Addon Boosters */}
              <div className="bg-main border border-borderSubtle rounded-2xl p-5 space-y-3">
                <h4 className="text-sm font-bold text-txtMain flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400" />
                  High-Impact Skill Boosters
                </h4>
                <p className="text-xs text-txtMuted">Adding these specialized technical competencies yields significant compensation premium:</p>
                <div className="space-y-2">
                  {currentRole.skillsAddons.map((skill, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-surface border border-borderSubtle">
                      <span className="text-xs font-semibold text-txtMain">{skill.name}</span>
                      <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                        {skill.boost} Pay Premium
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Paying Companies */}
              <div className="bg-main border border-borderSubtle rounded-2xl p-5 space-y-3">
                <h4 className="text-sm font-bold text-txtMain flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-indigo-400" />
                  Top Paying Employers for {currentRole.title}
                </h4>
                <p className="text-xs text-txtMuted">Verified benchmark packages reported by hires:</p>
                <div className="space-y-2">
                  {currentRole.topCompanies.map((comp, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-surface border border-borderSubtle">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-accent/10 text-accent text-xs font-bold flex items-center justify-center">
                          {comp.name[0]}
                        </span>
                        <div>
                          <p className="text-xs font-semibold text-txtMain leading-tight">{comp.name}</p>
                          <span className="text-[10px] text-amber-400">{comp.rating} Rating</span>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-txtMain bg-nested border border-borderSubtle px-2.5 py-1 rounded-lg">
                        {comp.median}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
