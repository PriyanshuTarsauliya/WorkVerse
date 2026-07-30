import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Building2, Search, Star, Users, MapPin, ExternalLink, Briefcase, ChevronRight, Award, CheckCircle2, Maximize2, Minimize2 } from 'lucide-react';

import { fetchApi } from '../../utils/api';

// Static fallbacks for missing backend properties
const MOCK_BENEFITS = ['Flexible WFH / Hybrid', 'Comprehensive Health Cover', 'Annual Learning Allowance', 'Stock Options (ESOPs)'];

const DEFAULT_COMPANIES = [
  { id: 1, name: 'Razorpay', category: 'Fintech / Payments', rating: 4.8, reviewCount: 1420, headquarters: 'Bengaluru, India', size: 'Enterprise', funding: 'Unicorn ($370M Series F)', avgTenure: '2.4 yrs', techStack: ['React', 'TypeScript', 'Go', 'PHP', 'AWS'], description: "India's leading full-stack financial services platform powering payments for over 8 million businesses.", benefits: MOCK_BENEFITS, openJobsCount: 12 },
  { id: 2, name: 'Swiggy', category: 'Consumer Tech / Quick Commerce', rating: 4.6, reviewCount: 980, headquarters: 'Bengaluru, India', size: 'Enterprise', funding: 'Public (NSE/BSE Listed)', avgTenure: '2.1 yrs', techStack: ['Java', 'Go', 'React Native', 'Kafka', 'Redis'], description: 'Hyperlocal food delivery and quick commerce leader connecting 50M+ users across 500+ Indian cities.', benefits: MOCK_BENEFITS, openJobsCount: 18 },
  { id: 3, name: 'CRED', category: 'Fintech / Premium Rewards', rating: 4.8, reviewCount: 610, headquarters: 'Bengaluru, India', size: 'Mid-Size', funding: 'Unicorn ($140M Series F)', avgTenure: '2.0 yrs', techStack: ['Flutter', 'Kotlin', 'Spring Boot', 'AWS', 'Figma'], description: 'Members-only credit card bill payment platform rewarding high-trust individuals in India.', benefits: MOCK_BENEFITS, openJobsCount: 8 },
  { id: 4, name: 'Postman', category: 'Developer Tools / SaaS', rating: 4.9, reviewCount: 430, headquarters: 'Remote — India', size: 'Mid-Size', funding: 'Unicorn ($225M Series D)', avgTenure: '2.8 yrs', techStack: ['Next.js', 'Node.js', 'Python', 'GraphQL', 'PostgreSQL'], description: "The world's leading API platform used by over 25 million developers and 98% of Fortune 500 companies.", benefits: MOCK_BENEFITS, openJobsCount: 15 },
  { id: 5, name: 'Flipkart', category: 'E-Commerce / GenAI', rating: 4.7, reviewCount: 2400, headquarters: 'Bengaluru, India', size: 'Enterprise', funding: 'Walmart Enterprise', avgTenure: '3.1 yrs', techStack: ['Python', 'PyTorch', 'Spark', 'React', 'Java'], description: 'India’s leading e-commerce ecosystem processing petabytes of consumer and catalog data.', benefits: MOCK_BENEFITS, openJobsCount: 24 },
  { id: 6, name: 'Google India', category: 'Big Tech / Cloud & AI', rating: 4.9, reviewCount: 4500, headquarters: 'Bengaluru / Hyderabad', size: 'Enterprise', funding: 'Alphabet (NASDAQ)', avgTenure: '4.5 yrs', techStack: ['C++', 'Java', 'Python', 'Go', 'TensorFlow'], description: 'Global tech leader shaping Search, Android, Cloud, and Next Billion Users products.', benefits: MOCK_BENEFITS, openJobsCount: 30 },
  { id: 7, name: 'Goldman Sachs', category: 'Investment Banking / Fintech', rating: 4.3, reviewCount: 3100, headquarters: 'Hyderabad, India', size: 'Enterprise', funding: 'Public (NYSE: GS)', avgTenure: '3.8 yrs', techStack: ['Java 21', 'Spring Boot', 'Kafka', 'PostgreSQL', 'Docker'], description: 'Global financial institution building high-frequency quantitative trading & risk platforms.', benefits: MOCK_BENEFITS, openJobsCount: 14 },
  { id: 8, name: 'Zomato', category: 'FoodTech / Operations', rating: 4.5, reviewCount: 1800, headquarters: 'Delhi NCR, India', size: 'Enterprise', funding: 'Public (NSE: ZOMATO)', avgTenure: '2.2 yrs', techStack: ['Python', 'React Native', 'Node.js', 'GeoSpatial', 'SQL'], description: 'Food ordering, restaurant discovery, and quick-commerce pioneer in India.', benefits: MOCK_BENEFITS, openJobsCount: 10 },
  { id: 9, name: 'Microsoft', category: 'Big Tech / Azure AI', rating: 4.8, reviewCount: 5200, headquarters: 'Hyderabad, India', size: 'Enterprise', funding: 'Public (NASDAQ: MSFT)', avgTenure: '4.1 yrs', techStack: ['Azure', 'C#', 'TypeScript', 'Python', 'OpenAI'], description: 'Empowering every person and organization with Azure Cloud and Copilot AI technologies.', benefits: MOCK_BENEFITS, openJobsCount: 35 },
  { id: 10, name: 'PhonePe', category: 'Fintech / UPI Payments', rating: 4.7, reviewCount: 1600, headquarters: 'Bengaluru, India', size: 'Enterprise', funding: '$12B+ Valuation', avgTenure: '2.9 yrs', techStack: ['Java', 'Go', 'Cassandra', 'Kafka', 'Microservices'], description: "India's largest digital payments app processing over 100 million daily UPI transactions.", benefits: MOCK_BENEFITS, openJobsCount: 16 },
  { id: 11, name: 'Atlassian', category: 'Enterprise SaaS / Collaboration', rating: 4.8, reviewCount: 1200, headquarters: 'Bengaluru, India', size: 'Enterprise', funding: 'Public (NASDAQ: TEAM)', avgTenure: '3.5 yrs', techStack: ['React', 'Java', 'AWS', 'Terraform', 'GraphQL'], description: 'Building team collaboration software like Jira, Confluence, and Trello.', benefits: MOCK_BENEFITS, openJobsCount: 9 },
  { id: 12, name: 'Oracle', category: 'Database Cloud & Systems', rating: 4.3, reviewCount: 3800, headquarters: 'Bengaluru, India', size: 'Enterprise', funding: 'Public (NYSE: ORCL)', avgTenure: '4.0 yrs', techStack: ['C', 'C++', 'Java', 'OCI Cloud', 'Linux'], description: 'Enterprise database software and cloud infrastructure giant powering Fortune 500 tech.', benefits: MOCK_BENEFITS, openJobsCount: 22 }
];

export default function CompaniesDirectoryModal({ isOpen, onClose, onSelectJob }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [activeCompany, setActiveCompany] = useState(null);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const [companies, setCompanies] = useState(DEFAULT_COMPANIES);
  const [isLoading, setIsLoading] = useState(false);

  React.useEffect(() => {
    if (!isOpen) return;
    const loadCompanies = async () => {
      setIsLoading(true);
      try {
        const data = await fetchApi('/api/v1/companies');
        if (data && data.content && data.content.length > 0) {
          const mapped = data.content.map(c => ({
            id: c.id,
            name: c.name,
            category: c.industry || 'Tech',
            rating: c.rating || 4.5,
            reviewCount: c.reviewCount || 100,
            headquarters: c.location || 'Remote',
            size: c.companySize ? c.companySize.replace('_', ' ') : 'Startup',
            funding: c.fundingStage || 'Unknown',
            avgTenure: '2.5 yrs',
            techStack: c.techStack || [],
            description: c.description || '',
            benefits: MOCK_BENEFITS,
            openJobsCount: Math.floor(Math.random() * 20) + 1,
            featuredJobs: []
          }));
          setCompanies(mapped);
        } else {
          setCompanies(DEFAULT_COMPANIES);
        }
      } catch (err) {
        console.error('Failed to load companies:', err);
        setCompanies(DEFAULT_COMPANIES);
      } finally {
        setIsLoading(false);
      }
    };
    loadCompanies();
  }, [isOpen]);

  const filteredCompanies = useMemo(() => {
    return companies.filter((comp) => {
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
  }, [companies, searchQuery, selectedCategory]);

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
