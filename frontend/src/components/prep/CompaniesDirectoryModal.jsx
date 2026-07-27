import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Building2, Search, Star, Users, MapPin, ExternalLink, Briefcase, ChevronRight, Award, CheckCircle2, Maximize2, Minimize2 } from 'lucide-react';

const COMPANIES_DATABASE = [
  {
    id: 'razorpay',
    name: 'Razorpay',
    category: 'Fintech / Payments',
    rating: 4.8,
    reviewCount: 1420,
    headquarters: 'Bengaluru, India',
    size: '2,500+ employees',
    funding: '$370M Series F (Unicorn)',
    avgTenure: '2.4 yrs',
    techStack: ['React', 'TypeScript', 'Node.js', 'Go', 'PHP/Laravel', 'Kubernetes'],
    description: 'Razorpay is India\'s leading payments and financial technology platform empowering over 8M businesses to accept, process, and disburse payments.',
    benefits: ['Flexible WFH / Hybrid', 'Comprehensive Health Cover', 'Annual Learning Allowance', 'Stock Options (ESOPs)'],
    openJobsCount: 14,
    featuredJobs: [
      { id: 1, title: 'Senior Frontend Engineer', location: 'Bengaluru, India', salary: '₹22 - ₹35 LPA' },
      { id: 101, title: 'Staff Backend Architect (Go/Distributed)', location: 'Bengaluru, India', salary: '₹35 - ₹55 LPA' },
    ]
  },
  {
    id: 'swiggy',
    name: 'Swiggy',
    category: 'Consumer Tech / Logistics',
    rating: 4.6,
    reviewCount: 980,
    headquarters: 'Bengaluru, India',
    size: '5,000+ employees',
    funding: 'Publicly Traded (NSE/BSE)',
    avgTenure: '2.1 yrs',
    techStack: ['Java', 'Go', 'React Native', 'Python', 'Kafka', 'AWS'],
    description: 'Swiggy is India\'s premier on-demand convenience platform, delivering food, groceries (Instamart), and packages across 500+ cities.',
    benefits: ['4-Day Work Month Perks', 'Generous ESOP Vesting', 'Wellness & Gym Stipend', 'Relocation Assistance'],
    openJobsCount: 22,
    featuredJobs: [
      { id: 2, title: 'Product Manager — Growth & Retention', location: 'Bengaluru, India', salary: '₹28 - ₹42 LPA' },
      { id: 102, title: 'Lead Data Scientist (Quick-Commerce Logistics)', location: 'Bengaluru, India', salary: '₹32 - ₹50 LPA' },
    ]
  },
  {
    id: 'postman',
    name: 'Postman',
    category: 'SaaS / Developer Tools',
    rating: 4.9,
    reviewCount: 430,
    headquarters: 'San Francisco & Bengaluru',
    size: '1,000+ employees',
    funding: '$225M Series D ($5.6B Valuation)',
    avgTenure: '2.8 yrs',
    techStack: ['Next.js', 'React', 'Python', 'FastAPI', 'PostgreSQL', 'Electron'],
    description: 'Postman is the world\'s leading API collaboration platform used by over 25 million developers and 500,000 organizations globally.',
    benefits: ['100% Remote First', 'Unlimited PTO Policy', '$1,500 Home Office Setup', 'Parental Support'],
    openJobsCount: 9,
    featuredJobs: [
      { id: 4, title: 'Full Stack Developer (Next.js & Python)', location: 'Remote — India', salary: '₹20 - ₹32 LPA' },
      { id: 103, title: 'Senior API Protocol Engineer', location: 'Remote — India', salary: '₹28 - ₹40 LPA' },
    ]
  },
  {
    id: 'flipkart',
    name: 'Flipkart',
    category: 'E-commerce & AI',
    rating: 4.7,
    reviewCount: 2400,
    headquarters: 'Bengaluru, India',
    size: '15,000+ employees',
    funding: 'Walmart Enterprise Subsidiary',
    avgTenure: '3.1 yrs',
    techStack: ['Java', 'Python', 'PyTorch', 'Spark', 'Hadoop', 'Cassandra'],
    description: 'Flipkart is India\'s largest e-commerce marketplace leading innovation in supply chain, GenAI catalog search, and fintech.',
    benefits: ['Top-tier Health Insurance', 'Subsidized Higher Education', 'On-site Daycare & Gym', 'Annual Bonus'],
    openJobsCount: 35,
    featuredJobs: [
      { id: 5, title: 'Senior Data Scientist (LLMs & Search)', location: 'Bengaluru, India', salary: '₹32 - ₹50 LPA' },
      { id: 104, title: 'Principal Supply Chain Architect', location: 'Bengaluru, India', salary: '₹40 - ₹65 LPA' },
    ]
  },
  {
    id: 'cred',
    name: 'CRED',
    category: 'Fintech / Premium Lifestyle',
    rating: 4.8,
    reviewCount: 610,
    headquarters: 'Bengaluru, India',
    size: '800+ employees',
    funding: '$140M Series F ($6.4B Valuation)',
    avgTenure: '2.0 yrs',
    techStack: ['Kotlin', 'Swift', 'React', 'Java', 'PostgreSQL', 'Kafka'],
    description: 'CRED is a high-trust community of creditworthy individuals offering premium rewards, credit management, and luxury commerce.',
    benefits: ['Uncapped Wellness Budget', 'Personalized Laptop Setup', 'Liquid ESOP Buyback Program'],
    openJobsCount: 11,
    featuredJobs: [
      { id: 6, title: 'Lead Brand & Growth Marketing Manager', location: 'Bengaluru, India', salary: '₹25 - ₹38 LPA' },
      { id: 105, title: 'Staff iOS Mobile Engineer', location: 'Bengaluru, India', salary: '₹35 - ₹52 LPA' },
    ]
  },
  {
    id: 'google_india',
    name: 'Google India',
    category: 'Big Tech / Cloud & Search',
    rating: 4.9,
    reviewCount: 4500,
    headquarters: 'Hyderabad & Bengaluru',
    size: '10,000+ employees (India)',
    funding: 'Public (NASDAQ: GOOGL)',
    avgTenure: '4.5 yrs',
    techStack: ['C++', 'Java', 'Python', 'Borg', 'TensorFlow', 'Angular'],
    description: 'Google India develops planetary-scale computing products across Search, Cloud, Android, and YouTube, impacting billions of users.',
    benefits: ['World-class On-site Gourmet Meals', '20% Innovation Time', 'Global Mobility Options'],
    openJobsCount: 48,
    featuredJobs: [
      { id: 9, title: 'Summer Software Engineering Intern 2025', location: 'Hyderabad / Bengaluru', salary: '₹12 - ₹15 LPA' },
      { id: 106, title: 'Staff Cloud Infrastructure Engineer', location: 'Bengaluru, India', salary: '₹45 - ₹75 LPA' },
    ]
  }
];

export default function CompaniesDirectoryModal({ isOpen, onClose, onSelectJob }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [activeCompany, setActiveCompany] = useState(null);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const filteredCompanies = useMemo(() => {
    return COMPANIES_DATABASE.filter((comp) => {
      if (selectedCategory !== 'ALL' && !comp.category.toLowerCase().includes(selectedCategory.toLowerCase())) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        return (
          comp.name.toLowerCase().includes(q) ||
          comp.category.toLowerCase().includes(q) ||
          comp.techStack.some((t) => t.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [searchQuery, selectedCategory]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        className={`fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-md transition-all duration-300 ${
          isFullScreen ? 'p-0' : 'p-4'
        }`}
        data-testid="companies-modal"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className={`relative bg-surface border border-borderStrong shadow-2xl overflow-hidden flex flex-col transition-all duration-300 ${
            isFullScreen
              ? 'w-full h-full max-w-none max-h-none rounded-none p-6 md:p-10'
              : 'w-full max-w-5xl max-h-[90vh] rounded-2xl p-6 md:p-8'
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-borderSubtle">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-md">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-txtMain tracking-tight">Top Companies Directory</h2>
                <p className="text-xs text-txtMuted">Explore verified employee ratings, tech stacks & open positions at top hiring employers</p>
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

          {/* Search & Filters Bar */}
          <div className="flex flex-col sm:flex-row gap-3 py-4 border-b border-borderSubtle bg-nested/30 -mx-6 px-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-txtMuted" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search companies by name, category or tech stack (e.g. Razorpay, Fintech, React)..."
                className="w-full bg-main border border-borderStrong focus:border-accent rounded-xl pl-9 pr-3 py-2 text-xs text-txtMain placeholder-txtMuted focus:outline-none"
              />
            </div>

            <div className="flex gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {[
                { id: 'ALL', label: 'All Industries' },
                { id: 'Fintech', label: 'Fintech' },
                { id: 'SaaS', label: 'SaaS / DevTools' },
                { id: 'Consumer', label: 'Consumer & Logistics' },
                { id: 'Big Tech', label: 'Big Tech' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap transition-all ${selectedCategory === cat.id ? 'bg-accent text-white shadow-sm' : 'bg-main text-txtMuted border border-borderSubtle hover:text-txtMain'}`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Main Grid Content */}
          <div className="flex-1 overflow-y-auto pt-5 pr-1">
            {activeCompany ? (
              /* Expanded Company View */
              <div className="space-y-6">
                <button
                  onClick={() => setActiveCompany(null)}
                  className="text-xs text-accent font-semibold flex items-center gap-1 hover:underline"
                >
                  ← Back to all companies
                </button>

                <div className="bg-main border border-borderSubtle rounded-2xl p-6 space-y-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-borderSubtle pb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-accent/20 to-purple-500/20 border border-accent/30 text-accent font-bold text-2xl flex items-center justify-center">
                        {activeCompany.name[0]}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-txtMain">{activeCompany.name}</h3>
                        <p className="text-xs text-txtMuted">{activeCompany.category} · {activeCompany.headquarters}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-xl flex items-center gap-1.5 text-amber-400 font-bold text-sm">
                        <Star className="w-4 h-4 fill-amber-400" />
                        {activeCompany.rating} ({activeCompany.reviewCount} reviews)
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-txtMuted leading-relaxed">{activeCompany.description}</p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-2">
                    <div className="bg-surface border border-borderSubtle p-3 rounded-xl">
                      <span className="text-[10px] text-txtMuted block">Funding / Stage</span>
                      <span className="text-xs font-bold text-txtMain">{activeCompany.funding}</span>
                    </div>
                    <div className="bg-surface border border-borderSubtle p-3 rounded-xl">
                      <span className="text-[10px] text-txtMuted block">Company Size</span>
                      <span className="text-xs font-bold text-txtMain">{activeCompany.size}</span>
                    </div>
                    <div className="bg-surface border border-borderSubtle p-3 rounded-xl">
                      <span className="text-[10px] text-txtMuted block">Average Tenure</span>
                      <span className="text-xs font-bold text-txtMain">{activeCompany.avgTenure}</span>
                    </div>
                    <div className="bg-surface border border-borderSubtle p-3 rounded-xl">
                      <span className="text-[10px] text-txtMuted block">Open Positions</span>
                      <span className="text-xs font-bold text-emerald-400">{activeCompany.openJobsCount} Active Roles</span>
                    </div>
                  </div>

                  {/* Tech Stack */}
                  <div>
                    <h4 className="text-xs font-bold text-txtMuted uppercase tracking-wider mb-2">Tech Stack & Infrastructure</h4>
                    <div className="flex flex-wrap gap-2">
                      {activeCompany.techStack.map((tech, idx) => (
                        <span key={idx} className="bg-surface border border-borderSubtle px-3 py-1 rounded-lg text-xs font-semibold text-txtMain">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Benefits */}
                  <div>
                    <h4 className="text-xs font-bold text-txtMuted uppercase tracking-wider mb-2">Perks & Company Culture</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {activeCompany.benefits.map((b, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-txtMain bg-surface p-2.5 rounded-xl border border-borderSubtle">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          {b}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Featured Open Jobs */}
                  <div className="pt-2">
                    <h4 className="text-sm font-bold text-txtMain mb-3">Open Positions at {activeCompany.name}</h4>
                    <div className="space-y-2">
                      {activeCompany.featuredJobs.map((job) => (
                        <div key={job.id} className="flex items-center justify-between p-3.5 rounded-xl bg-surface border border-borderSubtle hover:border-accent/40 transition-all">
                          <div>
                            <p className="text-xs font-bold text-txtMain">{job.title}</p>
                            <p className="text-[11px] text-txtMuted">{job.location} · <span className="text-emerald-400 font-medium">{job.salary}</span></p>
                          </div>
                          <button
                            onClick={() => {
                              onClose?.();
                              onSelectJob?.(job);
                            }}
                            className="px-3 py-1.5 text-xs font-bold text-white bg-accent hover:opacity-90 rounded-lg transition-opacity flex items-center gap-1 shadow-sm"
                          >
                            Apply Now <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Companies Grid */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCompanies.map((comp) => (
                  <motion.div
                    key={comp.id}
                    whileHover={{ y: -3 }}
                    onClick={() => setActiveCompany(comp)}
                    className="bg-main border border-borderSubtle hover:border-accent/50 rounded-2xl p-5 cursor-pointer transition-all space-y-3 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between mb-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-accent/20 to-indigo-500/20 border border-accent/30 text-accent font-bold text-xl flex items-center justify-center">
                          {comp.name[0]}
                        </div>
                        <span className="bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-lg text-amber-400 font-bold text-xs flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          {comp.rating}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-txtMain leading-tight">{comp.name}</h3>
                      <p className="text-xs text-txtMuted mt-0.5">{comp.category}</p>

                      <div className="flex items-center gap-2 mt-2 text-[11px] text-txtMuted">
                        <MapPin className="w-3.5 h-3.5 text-txtMuted/70" />
                        <span>{comp.headquarters}</span>
                      </div>

                      <p className="text-xs text-txtMuted line-clamp-2 mt-2.5 leading-relaxed">
                        {comp.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-borderSubtle flex items-center justify-between">
                      <span className="text-xs font-semibold text-emerald-400">
                        {comp.openJobsCount} Open Jobs
                      </span>
                      <span className="text-xs font-bold text-accent flex items-center gap-1 hover:underline">
                        View Profile <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
