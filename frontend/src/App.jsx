import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Briefcase, Globe, Rss, Share, Mail, Sparkles, Sun, Moon, SearchX, RotateCcw,
  Building2, Award, Zap, CheckCircle2, ArrowRight, ShieldCheck, FileText, Cpu,
  ChevronRight, Send, Users, TrendingUp, Check, Star
} from 'lucide-react';
import { ToastProvider, useToast } from './components/Toast';
import JobFilterBar from './components/jobs/JobFilterBar';
import JobsGrid from './components/jobs/JobCard';
import JobDetailModal from './components/jobs/JobDetailModal';
import ApplyModal from './components/jobs/ApplyModal';
import PostJobModal from './components/jobs/PostJobModal';
import ProfileAnalysisModal from './components/jobs/ProfileAnalysisModal';
import ProfileModal from './components/jobs/ProfileModal';
import ResumeBuilderModal from './components/jobs/ResumeBuilderModal';
import AIChatbotWidget from './components/jobs/AIChatbotWidget';
import AuthModal from './components/auth/AuthModal';
import OnboardingWizard from './components/auth/OnboardingWizard';
import LocationPermissionBanner from './components/jobs/LocationPermissionBanner';
import PrepHubModal from './components/prep/PrepHubModal';
import SalaryGuideModal from './components/prep/SalaryGuideModal';
import CompaniesDirectoryModal from './components/prep/CompaniesDirectoryModal';
import CodingPlaygroundModal from './components/prep/CodingPlaygroundModal';
import AIMockInterviewModal from './components/prep/AIMockInterviewModal';
import HiringChallengesModal from './components/prep/HiringChallengesModal';
import PremiumModal from './components/jobs/PremiumModal';
import DeckView from './components/jobs/DeckView';
import ApplicationTracker from './components/jobs/ApplicationTracker';
import RealJobsModal from './components/jobs/RealJobsModal';
import JobAlertsModal from './components/jobs/JobAlertsModal';
import ReferralModal from './components/jobs/ReferralModal';
import DigilockerKYCModal from './components/auth/DigilockerKYCModal';
import DPDPAuditModal from './components/auth/DPDPAuditModal';
import EmployerATSModal from './components/jobs/EmployerATSModal';
import ReportJobModal from './components/jobs/ReportJobModal';
import AdminModerationModal from './components/jobs/AdminModerationModal';

import { DEFAULT_CANDIDATE_PROFILE, calculateJobMatchScore, generateProfileSuggestions } from './utils/recommendationEngine';
import { getInitialTheme, applyTheme, saveThemeChoice, initThemeListener } from './utils/theme';

const JOBS_PER_PAGE = 6;

const MOCK_WORKVERSE_JOBS = [
  {
    id: 1, title: 'Senior Frontend Engineer', company: 'Razorpay',
    companyRating: 4.8, companyReviewCount: 1420, location: 'Bengaluru, India',
    jobType: 'FULL_TIME', category: 'Engineering', salaryMin: 2200000, salaryMax: 3500000, currency: 'INR',
    description: 'Build low-latency payment checkout experiences for over 8M merchants across India. Work with React 18, TypeScript, and micro-frontend architecture.',
    techStack: ['React', 'TypeScript', 'Redux', 'Node.js', 'Tailwind CSS'],
    experienceLevel: 'Senior Level', experienceYears: '4-7',
    remoteOnly: false, isBookmarked: false, applicationCount: 8, postedDaysAgo: 2, urgency: 'Actively Hiring',
    companyInsights: {
      summary: 'Series F ($370M) • High Growth (200+ hires) • Avg Tenure 2.4 yrs',
      funding: '$370M Series F (Unicorn)',
      growth: 'High Growth (200+ engineering hires in 2024)',
      avgTenure: '2.4 yrs',
      glassdoorRating: '4.8★',
      culture: 'Engineering-driven, high autonomy, product craftsmanship.',
      salaryTransparency: 'Competitive market benchmarks with annual stock grants.',
      techMaturity: 'High — Micro-services, automated CI/CD, 99.999% payment uptime.'
    }
  },
  {
    id: 2, title: 'Product Manager — Growth & Retention', company: 'Swiggy',
    companyRating: 4.6, companyReviewCount: 980, location: 'Bengaluru, India',
    jobType: 'FULL_TIME', category: 'Product & Data', salaryMin: 2800000, salaryMax: 4200000, currency: 'INR',
    description: 'Lead product strategy and conversion rate optimization for Swiggy Instamart. Analyze user funnels, conduct A/B tests, and scale daily active users.',
    techStack: ['Product Strategy', 'Mixpanel', 'SQL', 'A/B Testing', 'Agile'],
    experienceLevel: 'Mid Level', experienceYears: '3-6',
    remoteOnly: false, isBookmarked: false, applicationCount: 64, postedDaysAgo: 1, urgency: 'Few Applicants',
    companyInsights: {
      summary: 'Public (IPO) • Hyper-scale (50M+ MAUs) • Avg Tenure 2.1 yrs',
      funding: 'Publicly Traded (NSE/BSE)',
      growth: 'Hyper-scale quick commerce expansion',
      avgTenure: '2.1 yrs',
      glassdoorRating: '4.6★',
      culture: 'Customer first, fast experiment iteration, data-backed decisions.',
      salaryTransparency: 'Transparent ESOP vesting & clear promotion cycles.',
      techMaturity: 'High — ML-driven dispatch routing, real-time analytics.'
    }
  },
  {
    id: 3, title: 'Senior Investment Analyst', company: 'HDFC Securities',
    companyRating: 4.5, companyReviewCount: 1120, location: 'Mumbai, India',
    jobType: 'FULL_TIME', category: 'Finance & Banking', salaryMin: 1800000, salaryMax: 2800000, currency: 'INR',
    description: 'Perform equity research, financial modeling, and risk assessments for institutional portfolios in Indian equity and capital markets.',
    techStack: ['Financial Modeling', 'Equity Research', 'Valuation', 'Excel', 'Bloomberg'],
    experienceLevel: 'Senior Level', experienceYears: '5-8',
    remoteOnly: false, isBookmarked: true, applicationCount: 5, postedDaysAgo: 3,
    companyInsights: {
      summary: 'Enterprise • Stable Growth • Avg Tenure 4.2 yrs',
      funding: 'HDFC Group Subsidiary',
      growth: 'Steady annual expansion in wealth management',
      avgTenure: '4.2 yrs',
      glassdoorRating: '4.5★',
      culture: 'Structured corporate environment, work-life stability, robust compliance.',
      salaryTransparency: 'Standardized banking salary bands & performance bonuses.',
      techMaturity: 'Moderate — Legacy core systems transitioning to modern cloud API architecture.'
    }
  },
  {
    id: 4, title: 'Full Stack Developer (Next.js & Python)', company: 'Postman',
    companyRating: 4.9, companyReviewCount: 430, location: 'Remote — India',
    jobType: 'REMOTE', category: 'Engineering', salaryMin: 2000000, salaryMax: 3200000, currency: 'INR',
    description: 'Work on Postman\'s API collaboration platform used by 25M+ developers worldwide. Ship features across frontend and high-throughput backend services.',
    techStack: ['Next.js', 'React', 'Python', 'FastAPI', 'PostgreSQL'],
    experienceLevel: 'Mid Level', experienceYears: '3-5',
    remoteOnly: true, isBookmarked: false, applicationCount: 156, postedDaysAgo: 4,
    companyInsights: {
      summary: 'Series D ($225M) • Remote-First • Avg Tenure 2.8 yrs',
      funding: '$225M Series D ($5.6B Valuation)',
      growth: 'Global scaling across 25M+ API developers',
      avgTenure: '2.8 yrs',
      glassdoorRating: '4.9★',
      culture: 'Fully remote, async-first, open-source friendly.',
      salaryTransparency: 'Global benchmark pay bands + generous learning allowance.',
      techMaturity: 'Exceptional — Modern developer toolchain, automated canary releases.'
    }
  },
  {
    id: 5, title: 'Senior Data Scientist (LLMs & Search)', company: 'Flipkart',
    companyRating: 4.7, companyReviewCount: 2400, location: 'Bengaluru, India',
    jobType: 'FULL_TIME', category: 'Product & Data', salaryMin: 3200000, salaryMax: 5000000, currency: 'INR',
    description: 'Develop state-of-the-art recommendation models and LLM-powered search algorithms processing petabytes of e-commerce catalog data.',
    techStack: ['Python', 'PyTorch', 'Transformers', 'Spark', 'Vector DB'],
    experienceLevel: 'Senior Level', experienceYears: '4-8',
    remoteOnly: false, isBookmarked: false, applicationCount: 6, postedDaysAgo: 5, urgency: 'Actively Hiring',
    companyInsights: {
      summary: 'Walmart Enterprise • Deep R&D • Avg Tenure 3.1 yrs',
      funding: 'Walmart Majority Owned',
      growth: 'Massive AI & GenAI catalog search investment',
      avgTenure: '3.1 yrs',
      glassdoorRating: '4.7★',
      culture: 'High intellectual rigor, research-to-production pipeline.',
      salaryTransparency: 'Top-of-market compensation with quarterly performance incentives.',
      techMaturity: 'High — Custom GPU clusters, petabyte-scale distributed processing.'
    }
  },
  {
    id: 6, title: 'Lead Brand & Growth Marketing Manager', company: 'CRED',
    companyRating: 4.8, companyReviewCount: 610, location: 'Bengaluru, India',
    jobType: 'HYBRID', category: 'Marketing & Sales', salaryMin: 2500000, salaryMax: 3800000, currency: 'INR',
    description: 'Design and execute multi-channel performance marketing campaigns, influencer strategies, and viral growth initiatives for premium CRED members.',
    techStack: ['Performance Marketing', 'SEO/SEM', 'Brand Strategy', 'Analytics'],
    experienceLevel: 'Lead / Staff', experienceYears: '6+',
    remoteOnly: false, isBookmarked: false, applicationCount: 38, postedDaysAgo: 2,
    companyInsights: {
      summary: 'Series F ($140M) • High Design Standard • Avg Tenure 2.0 yrs',
      funding: '$140M Series F ($6.4B Valuation)',
      growth: 'Rapid fintech ecosystem product launches',
      avgTenure: '2.0 yrs',
      glassdoorRating: '4.8★',
      culture: 'Obsessive visual perfection, high speed, premium brand ethos.',
      salaryTransparency: 'Direct stock options with flexible ESOP liquidation events.',
      techMaturity: 'High — Custom design systems, real-time analytics engines.'
    }
  },
  {
    id: 7, title: 'UI/UX Product Designer', company: 'Unacademy',
    companyRating: 4.4, companyReviewCount: 890, location: 'Remote — India',
    jobType: 'REMOTE', category: 'Design & UX', salaryMin: 1500000, salaryMax: 2400000, currency: 'INR',
    description: 'Create intuitive, accessible learning experiences for millions of students. Conduct user research, design wireframes, and craft polished UI components in Figma.',
    techStack: ['Figma', 'User Research', 'Wireframing', 'Prototyping', 'Design Systems'],
    experienceLevel: 'Mid Level', experienceYears: '2-5',
    remoteOnly: true, isBookmarked: false, applicationCount: 78, postedDaysAgo: 6,
    companyInsights: {
      summary: 'Series H ($440M) • EdTech Leader • Avg Tenure 1.9 yrs',
      funding: '$440M Series H',
      growth: 'Expanding hybrid offline-online learning centers',
      avgTenure: '1.9 yrs',
      glassdoorRating: '4.4★',
      culture: 'Fast-paced, high impact on student outcomes, collaborative.',
      salaryTransparency: 'Standardized bands across design tiers.',
      techMaturity: 'Moderate to High — Component-driven design tokens.'
    }
  },
  {
    id: 8, title: 'Java Microservices Backend Developer', company: 'Goldman Sachs',
    companyRating: 4.3, companyReviewCount: 3100, location: 'Hyderabad, India',
    jobType: 'FULL_TIME', category: 'Engineering', salaryMin: 2400000, salaryMax: 3600000, currency: 'INR',
    description: 'Build low-latency trading engines and risk management services using Spring Boot 3 and Java 21. Optimize DB queries and event-driven Kafka pipelines.',
    techStack: ['Java 21', 'Spring Boot', 'Kafka', 'PostgreSQL', 'Docker'],
    experienceLevel: 'Senior Level', experienceYears: '4-7',
    remoteOnly: false, isBookmarked: false, applicationCount: 4, postedDaysAgo: 3,
    companyInsights: {
      summary: 'Global Investment Bank • Ultra-low Latency • Avg Tenure 3.8 yrs',
      funding: 'Public (NYSE: GS)',
      growth: 'Institutional technology platform expansion in Asia',
      avgTenure: '3.8 yrs',
      glassdoorRating: '4.3★',
      culture: 'Rigorous engineering standards, global collaboration, meritocratic.',
      salaryTransparency: 'Tiered global banking compensation + annual performance bonus.',
      techMaturity: 'High — Dedicated hardware acceleration, microsecond latency requirements.'
    }
  },
  {
    id: 9, title: 'Summer Software Engineering Intern 2025', company: 'Google India',
    companyRating: 4.9, companyReviewCount: 4500, location: 'Hyderabad / Bengaluru',
    jobType: 'CONTRACT', category: 'Internships', salaryMin: 1200000, salaryMax: 1500000, currency: 'INR',
    description: 'Work directly alongside Google software engineers on real production code for Search, Cloud, or Android. Paid 3-month internship with PPO opportunities.',
    techStack: ['C++', 'Java', 'Python', 'Algorithms', 'Data Structures'],
    experienceLevel: 'Entry Level', experienceYears: '0-1',
    remoteOnly: false, isBookmarked: false, applicationCount: 420, postedDaysAgo: 1, urgency: 'Actively Hiring',
    companyInsights: {
      summary: 'Alphabet (Big Tech) • World-class Mentorship • Avg Tenure 4.5 yrs',
      funding: 'Public (NASDAQ: GOOGL)',
      growth: 'Continued infrastructure & Search AI expansion',
      avgTenure: '4.5 yrs',
      glassdoorRating: '4.9★',
      culture: '20% innovation time, world-class perks, psychological safety.',
      salaryTransparency: 'Industry gold-standard intern stipends & relocation benefits.',
      techMaturity: 'Industry Benchmark — Borg, Blaze, Monorepo, custom TPU accelerators.'
    }
  },
  {
    id: 10, title: 'Operations & Business Strategy Lead', company: 'Zomato',
    companyRating: 4.5, companyReviewCount: 1800, location: 'Delhi NCR, India',
    jobType: 'FULL_TIME', category: 'Operations & HR', salaryMin: 2200000, salaryMax: 3200000, currency: 'INR',
    description: 'Optimize quick-commerce supply chain logistics and partner rider efficiency across tier 1 & 2 cities in India.',
    techStack: ['Supply Chain', 'Operations', 'SQL', 'Data Analytics', 'Vendor Mgmt'],
    experienceLevel: 'Mid Level', experienceYears: '3-6',
    remoteOnly: false, isBookmarked: false, applicationCount: 52, postedDaysAgo: 2,
    companyInsights: {
      summary: 'Public (Blinkit Parent) • High Growth • Avg Tenure 2.2 yrs',
      funding: 'Publicly Traded (NSE: ZOMATO)',
      growth: 'Blinkit quick-commerce dark store scaling',
      avgTenure: '2.2 yrs',
      glassdoorRating: '4.5★',
      culture: 'Frugal, high ownership, operational speed over perfection.',
      salaryTransparency: 'ESOP options for all leadership and strategy roles.',
      techMaturity: 'High — Real-time geo-clustering & route optimization.'
    }
  }
];

function AppContent() {
  const toast = useToast();
  const [jobs, setJobs] = useState(MOCK_WORKVERSE_JOBS);
  const [visibleCount, setVisibleCount] = useState(JOBS_PER_PAGE);
  const [candidateProfile, setCandidateProfile] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('workverse_candidate_profile')) || DEFAULT_CANDIDATE_PROFILE;
    } catch { return DEFAULT_CANDIDATE_PROFILE; }
  });

  const [jobAlerts, setJobAlerts] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('workverse_job_alerts')) || [];
    } catch { return []; }
  });
  
  const [applications, setApplications] = useState(() => {
    try {
      const stored = localStorage.getItem('workverse_applications');
      if (stored) return JSON.parse(stored);
      return { 3: 'saved' }; 
    } catch { return {}; }
  });
  const [currentUser, setCurrentUser] = useState(null);
  const [theme, setTheme] = useState(getInitialTheme());
  
  // Modals & Panels State
  const [selectedJob, setSelectedJob] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isApplyOpen, setIsApplyOpen] = useState(false);
  const [isPostJobOpen, setIsPostJobOpen] = useState(false);
  const [isProfileAnalysisOpen, setIsProfileAnalysisOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isResumeBuilderOpen, setIsResumeBuilderOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isPrepHubOpen, setIsPrepHubOpen] = useState(false);
  const [isSalaryGuideOpen, setIsSalaryGuideOpen] = useState(false);
  const [isCompaniesDirectoryOpen, setIsCompaniesDirectoryOpen] = useState(false);
  const [isCodingPlaygroundOpen, setIsCodingPlaygroundOpen] = useState(false);
  const [isAIMockInterviewOpen, setIsAIMockInterviewOpen] = useState(false);
  const [isHiringChallengesOpen, setIsHiringChallengesOpen] = useState(false);
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
  const [isJobAlertsOpen, setIsJobAlertsOpen] = useState(false);
  const [jobAlertsMode, setJobAlertsMode] = useState('manage');
  const [isReferralOpen, setIsReferralOpen] = useState(false);
  const [referralJob, setReferralJob] = useState(null);
  const [isPremium, setIsPremium] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [pendingNewUser, setPendingNewUser] = useState(null);
  const [isKYCOpen, setIsKYCOpen] = useState(false);
  const [isDPDPOpen, setIsDPDPOpen] = useState(false);
  const [isATSOpen, setIsATSOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isRealJobsOpen, setIsRealJobsOpen] = useState(false);
  const [showLocationBanner, setShowLocationBanner] = useState(true);
  const [userDetectedCity, setUserDetectedCity] = useState('');
  const [viewMode, setViewMode] = useState(() => {
    if (typeof window === 'undefined') return 'grid';
    return localStorage.getItem('workverse_view_mode') || 'grid';
  });

  const handleViewModeChange = useCallback((mode) => {
    setViewMode(mode);
    if (typeof window !== 'undefined') {
      localStorage.setItem('workverse_view_mode', mode);
    }
  }, []);


  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  useEffect(() => {
    const cleanup = initThemeListener((newTheme) => {
      setTheme(newTheme);
    });
    return cleanup;
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    saveThemeChoice(nextTheme);
  };

  const [filters, setFilters] = useState({
    search: '',
    location: '',
    categories: [],
    jobTypes: [],
    experienceLevels: [],
    remoteOnly: false,
    minSalary: 0,
    savedOnly: false,
    recommendedOnly: false,
    sortBy: 'match',
  });

  const handleResetFilters = useCallback(() => setFilters({
    search: '', location: '', categories: [], jobTypes: [], experienceLevels: [], remoteOnly: false, minSalary: 0, savedOnly: false, recommendedOnly: false, sortBy: 'match',
  }), []);

  const handleToggleBookmark = useCallback((jobId) => {
    setApplications((prev) => {
      const next = { ...prev };
      if (next[jobId] === 'saved') {
        delete next[jobId];
        toast('Removed from saved', 'info');
      } else if (!next[jobId]) {
        next[jobId] = 'saved';
        toast('Job saved!', 'success');
      } else {
        toast('Job is already in your tracker', 'info');
      }
      localStorage.setItem('workverse_applications', JSON.stringify(next));
      return next;
    });
  }, [toast]);

  const handleUpdateApplicationStage = useCallback((jobId, newStage) => {
    setApplications((prev) => {
      const next = { ...prev, [jobId]: newStage };
      localStorage.setItem('workverse_applications', JSON.stringify(next));
      return next;
    });
  }, []);

  const handleSaveAlert = useCallback((alertData) => {
    setJobAlerts((prev) => {
      const next = [alertData, ...prev].slice(0, 5);
      localStorage.setItem('workverse_job_alerts', JSON.stringify(next));
      return next;
    });
  }, []);

  const handleDeleteAlert = useCallback((alertId) => {
    setJobAlerts((prev) => {
      const next = prev.filter(a => a.id !== alertId);
      localStorage.setItem('workverse_job_alerts', JSON.stringify(next));
      return next;
    });
  }, []);

  const handleOpenReferral = useCallback((job) => {
    setReferralJob(job);
    setIsReferralOpen(true);
  }, []);

  const handleBoostSkill = useCallback((newSkill) => {
    setCandidateProfile((prev) => {
      if (prev.skills?.includes(newSkill)) return prev;
      const updatedSkills = [...(prev.skills || []), newSkill];
      const updatedProfile = { ...prev, skills: updatedSkills };
      localStorage.setItem('workverse_candidate_profile', JSON.stringify(updatedProfile));
      return updatedProfile;
    });
    toast(`Added "${newSkill}" to your skills! Match score boosted 🚀`, 'success');
  }, [toast]);

  const savedCount = useMemo(() => Object.keys(applications).length, [applications]);
  const totalNewAlerts = useMemo(() => jobAlerts.reduce((acc, alert) => acc + (alert.newMatches || 0), 0), [jobAlerts]);

  // Compute recommendation match scores for all jobs
  const jobsWithScores = useMemo(() => {
    return jobs.map((job) => {
      const matchResult = calculateJobMatchScore(candidateProfile, job);
      return {
        ...job,
        matchScore: matchResult.score,
        matchDetails: matchResult,
      };
    });
  }, [jobs, candidateProfile]);

  // Profile Insights & Suggestions
  const profileSuggestions = useMemo(() => {
    return generateProfileSuggestions(candidateProfile, jobsWithScores);
  }, [candidateProfile, jobsWithScores]);

  // Location detection callback
  const handleLocationDetected = useCallback((locStr) => {
    setUserDetectedCity(locStr);
    const cityName = locStr.split(',')[0].trim();
    if (!filters.search) {
      setFilters((prev) => ({ ...prev, search: cityName }));
    }
  }, [filters.search]);

  // Filtered & Sorted Jobs
  const filteredJobs = useMemo(() => {
    let result = jobsWithScores.filter((job) => {
      if (filters.savedOnly && !applications[job.id]) return false;
      if (filters.recommendedOnly && job.matchScore < 70) return false;
      if (filters.categories?.length > 0 && !filters.categories.includes(job.category)) return false;
      if (filters.search.trim()) {
        const q = filters.search.toLowerCase().trim();
        const fields = [job.title, job.company, job.category, ...(job.techStack || [])];
        if (!fields.some((f) => f.toLowerCase().includes(q))) return false;
      }
      if (filters.location?.trim()) {
        const loc = filters.location.toLowerCase().trim();
        if (!job.location.toLowerCase().includes(loc)) return false;
      }
      if (filters.jobTypes?.length > 0 && !filters.jobTypes.includes(job.jobType)) return false;
      if (filters.experienceLevels?.length > 0 && !filters.experienceLevels.includes(job.experienceLevel)) return false;
      if (filters.minSalary > 0 && job.salaryMin < filters.minSalary) return false;
      if (filters.remoteOnly && !job.remoteOnly && job.jobType !== 'REMOTE') return false;
      return true;
    });

    if (filters.sortBy === 'match') {
      result = [...result].sort((a, b) => b.matchScore - a.matchScore);
    } else if (filters.sortBy === 'newest') {
      result = [...result].sort((a, b) => (a.postedDaysAgo || 99) - (b.postedDaysAgo || 99));
    } else if (filters.sortBy === 'salary') {
      result = [...result].sort((a, b) => (b.salaryMax || b.salaryMin) - (a.salaryMax || a.salaryMin));
    }
    return result;
  }, [jobsWithScores, filters]);

  const handleOpenDetail = useCallback((job) => { setSelectedJob(job); setIsDetailOpen(true); }, []);
  const handleOpenApply = useCallback((job, isQuickApply = false) => {
    setSelectedJob(job);
    setIsDetailOpen(false);
    if (isQuickApply) {
      if (candidateProfile?.hasResume || currentUser?.email) {
        // Instant 1-Click Quick Apply Submission
        setJobs((prev) => prev.map((j) => (j.id === job.id ? { ...j, applicationCount: (j.applicationCount || 0) + 1 } : j)));
        setApplications((prev) => {
          const next = { ...prev, [job.id]: 'applied' };
          localStorage.setItem('workverse_applications', JSON.stringify(next));
          return next;
        });
        toast(`⚡ 1-Click Quick Applied to ${job.title} at ${job.company}!`, 'success');
        return;
      }
      toast('Please confirm your contact details & resume for Quick Apply', 'info');
    }
    setIsApplyOpen(true);
  }, [candidateProfile, currentUser, toast]);

  const handleOpenProfileAnalysis = useCallback((job) => { setSelectedJob(job); setIsProfileAnalysisOpen(true); }, []);
  const handleApplicationSubmitted = useCallback((jobId) => {
    setJobs((prev) => prev.map((j) => (j.id === jobId ? { ...j, applicationCount: (j.applicationCount || 0) + 1 } : j)));
    setApplications((prev) => {
      const next = { ...prev, [jobId]: 'applied' };
      localStorage.setItem('workverse_applications', JSON.stringify(next));
      return next;
    });
    toast('Application submitted successfully!', 'success');
  }, [toast]);
  const handleJobPosted = useCallback((newJob) => {
    setJobs((prev) => [newJob, ...prev]);
    toast('Job posted successfully!', 'success');
  }, [toast]);

  const handleSaveResume = useCallback((data) => {
    setCandidateProfile(prev => ({ ...prev, hasResume: true, resumeScore: data.score }));
  }, []);

  // ── Onboarding Flow ──
  const handleRegistrationComplete = useCallback((newUser) => {
    setPendingNewUser(newUser);
    setIsOnboardingOpen(true);
  }, []);

  const handleOnboardingComplete = useCallback((profileData) => {
    // Close onboarding
    setIsOnboardingOpen(false);

    // Set the user as logged in
    if (pendingNewUser) {
      const updatedUser = {
        ...pendingNewUser,
        onboardingCompleted: true,
        discoverySource: profileData.discoverySource,
        professionalStatus: profileData.professionalStatus,
      };
      setCurrentUser(updatedUser);

      // Update stored users list
      try {
        const storedUsers = JSON.parse(localStorage.getItem('workverse_users') || '[]');
        const idx = storedUsers.findIndex(u => u.email === updatedUser.email);
        if (idx >= 0) storedUsers[idx] = updatedUser;
        localStorage.setItem('workverse_users', JSON.stringify(storedUsers));
      } catch {}
    }

    // Save the parsed profile as candidate profile
    const newProfile = {
      ...candidateProfile,
      name: profileData.name || candidateProfile.name,
      headline: profileData.headline || candidateProfile.headline,
      location: profileData.location || candidateProfile.location,
      email: profileData.email || candidateProfile.email,
      experienceYears: profileData.experienceYears || candidateProfile.experienceYears,
      skills: profileData.skills?.length > 0 ? profileData.skills : candidateProfile.skills,
      experience: profileData.experience?.length > 0 ? profileData.experience : undefined,
      education: profileData.education?.length > 0 ? profileData.education : undefined,
      avatarInitials: profileData.avatarInitials || candidateProfile.avatarInitials,
      resumeUploaded: profileData.resumeUploaded || false,
      profileCompletion: profileData.profileCompletion || 50,
      discoverySource: profileData.discoverySource,
      professionalStatus: profileData.professionalStatus,
      onboardingCompleted: true,
    };
    setCandidateProfile(newProfile);
    localStorage.setItem('workverse_candidate_profile', JSON.stringify(newProfile));

    setPendingNewUser(null);
    toast('Welcome to WorkVerse! Your profile is ready 🚀', 'success');
  }, [pendingNewUser, candidateProfile, toast]);

  // Share handler
  const handleShareJob = useCallback(async (job) => {
    const url = `${window.location.origin}/?job=${job.id}`;
    const text = `${job.title} at ${job.company}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: text, url });
      } catch {}
    } else {
      await navigator.clipboard.writeText(url);
      toast('Link copied to clipboard!', 'info');
    }
  }, [toast]);

  // Pagination: slice filtered jobs
  const paginatedJobs = useMemo(() => filteredJobs.slice(0, visibleCount), [filteredJobs, visibleCount]);
  const hasMore = visibleCount < filteredJobs.length;

  // Reset pagination when filters change
  useEffect(() => { setVisibleCount(JOBS_PER_PAGE); }, [filters]);

  return (
    <div className="min-h-screen bg-main text-txtMain font-sans theme-transition relative overflow-x-hidden">
      {/* ── Page-Spanning Ambient Background Texture Layer ── */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
        {/* Slow Drifting Gradient Blobs */}
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-accent/10 blur-3xl animate-blob-slow-1" />
        <div className="absolute top-1/3 -right-40 w-96 h-96 rounded-full bg-indigo-500/10 blur-3xl animate-blob-slow-2" />
        <div className="absolute bottom-10 left-1/4 w-[30rem] h-[30rem] rounded-full bg-emerald-500/5 blur-3xl animate-blob-slow-1" />
        {/* Subtle Dot Grid Overlay */}
        <div className="absolute inset-0 bg-dot-grid opacity-30" />
      </div>

      {/* Relative Content Shell */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* ── Navbar ── */}
        <motion.header
          initial={{ y: -16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
          className="border-b border-borderSubtle bg-main/90 backdrop-blur-md sticky top-0 z-40 theme-transition"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
            {/* Logo */}
            <motion.div
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2.5 cursor-pointer shrink-0"
              onClick={() => handleResetFilters()}
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-accent to-indigo-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
                W
              </div>
              <span className="text-base font-bold text-txtMain tracking-tight">
                WorkVerse
              </span>
            </motion.div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-1 font-medium text-xs text-txtMuted">
              <button
                onClick={() => handleResetFilters()}
                className="px-3 py-1.5 rounded-lg hover:text-txtMain hover:bg-nested transition-colors"
              >
                Browse Jobs
              </button>
              <button
                onClick={() => setIsSalaryGuideOpen(true)}
                className="px-3 py-1.5 rounded-lg hover:text-txtMain hover:bg-nested transition-colors"
              >
                Salary Guide
              </button>
              <button
                onClick={() => setIsCompaniesDirectoryOpen(true)}
                className="px-3 py-1.5 rounded-lg hover:text-txtMain hover:bg-nested transition-colors"
              >
                Companies
              </button>
              <button
                onClick={() => setIsRealJobsOpen(true)}
                className="px-3 py-1.5 rounded-lg text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 transition-colors font-semibold flex items-center gap-1"
              >
                <Globe className="w-3.5 h-3.5" /> Real Jobs
              </button>
              <button
                onClick={() => setIsATSOpen(true)}
                className="px-3 py-1.5 rounded-lg hover:text-txtMain hover:bg-nested transition-colors"
              >
                ATS Pipeline
              </button>
              <button
                onClick={() => setIsKYCOpen(true)}
                className="px-3 py-1.5 rounded-lg text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 transition-colors font-semibold flex items-center gap-1"
              >
                <ShieldCheck className="w-3.5 h-3.5" /> e-KYC
              </button>
              <button
                onClick={() => setIsDPDPOpen(true)}
                className="px-3 py-1.5 rounded-lg hover:text-txtMain hover:bg-nested transition-colors"
              >
                DPDP Privacy
              </button>
              <button
                onClick={() => setIsAdminOpen(true)}
                className="px-3 py-1.5 rounded-lg hover:text-txtMain hover:bg-nested transition-colors"
              >
                Admin
              </button>
              <button
                onClick={() => setIsAIMockInterviewOpen(true)}
                data-testid="ai-voice-mock-interview-nav-button"
                className="px-3.5 py-1.5 rounded-lg text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 transition-all font-bold text-xs flex items-center gap-1.5 shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" /> AI Voice Mock Interview
              </button>
              <button
                onClick={() => setIsPrepHubOpen(true)}
                className="px-3 py-1.5 rounded-lg text-accent bg-accent/10 hover:bg-accent/20 transition-colors font-semibold flex items-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5" /> Prep & Tools
              </button>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                data-testid="theme-toggle"
                className="w-8 h-8 rounded-lg bg-nested border border-borderSubtle hover:border-accent/40 flex items-center justify-center text-txtMuted hover:text-txtMain transition-colors"
                title="Toggle theme"
                aria-label="Toggle Theme"
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 text-amber-400" />
                ) : (
                  <Moon className="w-4 h-4" />
                )}
              </button>

              {/* Auth */}
              {currentUser ? (
                <button
                  onClick={() => setIsProfileOpen(true)}
                  data-testid="user-profile-button"
                  className="w-8 h-8 rounded-full bg-gradient-to-tr from-accent to-indigo-500 flex items-center justify-center text-white text-xs font-bold"
                  title="Profile"
                >
                  {currentUser.avatarInitials || currentUser.name.substring(0, 2).toUpperCase()}
                </button>
              ) : (
                <button
                  onClick={() => setIsAuthOpen(true)}
                  data-testid="signin-button"
                  className="px-3 py-1.5 text-xs font-semibold text-txtMain bg-nested hover:bg-surface border border-borderSubtle rounded-lg transition-colors"
                >
                  Sign In
                </button>
              )}

              {/* Build Resume */}
              <button
                onClick={() => setIsResumeBuilderOpen(true)}
                data-testid="resume-builder-button"
                className="px-3 py-1.5 text-xs font-semibold text-txtMain bg-nested hover:bg-surface border border-borderSubtle rounded-lg transition-colors shadow-sm hidden sm:block"
              >
                Resume Builder
              </button>

              {/* Post Job */}
              <button
                onClick={() => setIsPostJobOpen(true)}
                data-testid="post-job-button"
                className="px-3 py-1.5 text-xs font-semibold text-white bg-accent hover:opacity-90 rounded-lg transition-opacity shadow-sm"
              >
                Post a Job
              </button>
            </div>
          </div>
        </motion.header>

        {/* ── Hero (Full-Bleed Outer + Centered Inner) ── */}
        <section className="w-full border-b border-borderSubtle bg-gradient-to-b from-surface via-surface/90 to-main theme-transition relative overflow-hidden">
          {/* Radial Glow Wash */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-radial-glow opacity-80 pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 relative">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Content Column */}
              <div className="lg:col-span-7 space-y-5">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-bold"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Next-Gen AI Hiring & Career Platform</span>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 }}
                  data-testid="hero-heading"
                  className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-txtMain leading-[1.15] tracking-tight"
                >
                  Find your next{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-indigo-400 to-emerald-400">
                    dream career move
                  </span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-txtMuted text-base sm:text-lg leading-relaxed max-w-2xl"
                >
                  Discover 10,000+ verified roles across Engineering, Product, Design & Finance with transparent <span className="text-emerald-400 font-semibold">₹ LPA</span> packages, AI resume parsing, and voice mock interview prep.
                </motion.p>

                {/* Quick CTA Action Row */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="flex flex-wrap items-center gap-3 pt-2"
                >
                  <button
                    onClick={() => handleResetFilters()}
                    className="px-6 py-3 text-xs font-bold text-white bg-accent hover:bg-accent/90 rounded-xl shadow-lg shadow-accent/20 transition-all flex items-center gap-2"
                  >
                    <SearchX className="w-4 h-4" /> Explore 10k+ Openings
                  </button>

                  <button
                    onClick={() => setIsAIMockInterviewOpen(true)}
                    data-testid="hero-ai-voice-mock-interview-button"
                    className="px-5 py-3 text-xs font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4 fill-white animate-pulse" /> 🎙️ AI Voice Mock Interview
                  </button>

                  <button
                    onClick={() => setIsPrepHubOpen(true)}
                    className="px-5 py-3 text-xs font-bold text-txtMain bg-nested hover:bg-surface border border-borderSubtle rounded-xl transition-all flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4 text-accent" /> AI Interview Studio
                  </button>

                  <button
                    onClick={() => setIsRealJobsOpen(true)}
                    className="px-5 py-3 text-xs font-bold text-white bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 rounded-xl shadow-lg shadow-teal-500/20 transition-all flex items-center gap-2"
                  >
                    <Globe className="w-4 h-4" /> 🌍 Real Jobs
                  </button>

                  <button
                    onClick={() => setIsResumeBuilderOpen(true)}
                    className="px-5 py-3 text-xs font-bold text-txtMain bg-nested hover:bg-surface border border-borderSubtle rounded-xl transition-all hidden sm:flex items-center gap-2"
                  >
                    <FileText className="w-4 h-4 text-emerald-400" /> Resume ATS Checker
                  </button>
                </motion.div>
              </div>

              {/* Right Visual Column (Hero Visual Artwork & Floating Stat Badges) */}
              <div className="lg:col-span-5 relative flex items-center justify-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="relative w-full max-w-md bg-nested/60 border border-borderStrong/60 rounded-3xl p-6 shadow-2xl backdrop-blur-sm space-y-5"
                >
                  {/* SVG Visual Graphic Container */}
                  <div className="flex items-center justify-between border-b border-borderSubtle pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-accent to-emerald-400 flex items-center justify-center text-white font-bold shadow-md">
                        <Cpu className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-txtMain">AI Matching Engine</p>
                        <p className="text-[11px] text-txtMuted">Live Candidate Vector Score</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                      98.4% Match Accuracy
                    </span>
                  </div>

                  {/* SVG Abstract Graphic */}
                  <div className="relative py-2">
                    <svg className="w-full h-24 stroke-accent/40 fill-none" viewBox="0 0 300 80">
                      <path d="M 10 70 Q 75 10, 150 40 T 290 20" strokeWidth="3" strokeDasharray="6 4" />
                      <circle cx="75" cy="30" r="5" className="fill-accent animate-pulse" />
                      <circle cx="150" cy="40" r="5" className="fill-emerald-400 animate-pulse" />
                      <circle cx="230" cy="25" r="5" className="fill-indigo-400 animate-pulse" />
                    </svg>
                  </div>

                  {/* Floating Stat Chip 1 */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-surface border border-borderSubtle rounded-xl p-3 shadow-md flex items-center gap-3"
                  >
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-txtMain">500+ Top Tech Enterprises</p>
                      <p className="text-[10px] text-txtMuted">Hiring actively across India & Remote</p>
                    </div>
                  </motion.div>

                  {/* Floating Stat Chip 2 */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-surface border border-borderSubtle rounded-xl p-3 shadow-md flex items-center gap-3"
                  >
                    <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center text-accent shrink-0">
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-txtMain">50,000+ Verified Hires</p>
                      <p className="text-[10px] text-txtMuted">Placed in 2024-2025 tech drives</p>
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Section: Trusted-By Partner Logo Strip (Full Bleed) ── */}
        <section className="w-full bg-surface/70 border-b border-borderSubtle py-5 overflow-hidden relative">
          <div className="max-w-7xl mx-auto px-4 mb-3 text-center">
            <p className="text-[11px] font-bold text-txtMuted uppercase tracking-widest">
              Hiring Now at Top Tech Enterprises & High-Growth Unicorns
            </p>
          </div>
          <div className="flex w-max space-x-8 animate-ticker">
            {[
              'Razorpay', 'Swiggy', 'Postman', 'Flipkart', 'CRED', 'HDFC Bank', 'Atlassian', 'Google India', 'Uber', 'Unacademy',
              'Razorpay', 'Swiggy', 'Postman', 'Flipkart', 'CRED', 'HDFC Bank', 'Atlassian', 'Google India', 'Uber', 'Unacademy',
            ].map((comp, idx) => (
              <div key={idx} className="flex items-center gap-2 bg-nested/50 border border-borderSubtle px-4 py-2 rounded-xl text-xs font-bold text-txtMain shadow-sm shrink-0">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                {comp}
              </div>
            ))}
          </div>
        </section>

        {/* ── Section: Live Platform Stats Bar (Full Bleed) ── */}
        <section className="w-full bg-gradient-to-r from-accent/10 via-surface to-indigo-500/10 border-b border-borderSubtle py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-center">
              <div className="bg-nested/60 border border-borderSubtle p-4 rounded-2xl">
                <p className="text-2xl sm:text-3xl font-extrabold text-accent">10,000+</p>
                <p className="text-xs text-txtMuted mt-1 font-medium">Verified Active Roles</p>
              </div>
              <div className="bg-nested/60 border border-borderSubtle p-4 rounded-2xl">
                <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400">500+</p>
                <p className="text-xs text-txtMuted mt-1 font-medium">Hiring Partner Companies</p>
              </div>
              <div className="bg-nested/60 border border-borderSubtle p-4 rounded-2xl">
                <p className="text-2xl sm:text-3xl font-extrabold text-indigo-400">50,000+</p>
                <p className="text-xs text-txtMuted mt-1 font-medium">Candidates Placed</p>
              </div>
              <div className="bg-nested/60 border border-borderSubtle p-4 rounded-2xl">
                <p className="text-2xl sm:text-3xl font-extrabold text-amber-400">98.4%</p>
                <p className="text-xs text-txtMuted mt-1 font-medium">AI Match Precision Score</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Section: How WorkVerse Works (Full Bleed) ── */}
        <section className="w-full bg-surface/50 border-b border-borderSubtle py-12 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="text-center space-y-2 max-w-xl mx-auto">
              <span className="text-xs font-bold text-accent bg-accent/10 border border-accent/20 px-3 py-1 rounded-full uppercase tracking-wider">
                3-Step Hiring Acceleration
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-txtMain tracking-tight">How WorkVerse Empowers Your Career</h2>
              <p className="text-xs text-txtMuted">From ATS resume optimization to AI voice practice and 1-click applications.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-main border border-borderSubtle p-6 rounded-2xl space-y-3 relative hover:border-accent/40 transition-all shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent font-bold flex items-center justify-center border border-accent/20">
                  01
                </div>
                <h3 className="text-base font-bold text-txtMain">Create & Parse Profile</h3>
                <p className="text-xs text-txtMuted leading-relaxed">
                  Upload your resume to calculate your match score against live openings and receive instant skill gap suggestions.
                </p>
              </div>

              <div className="bg-main border border-borderSubtle p-6 rounded-2xl space-y-3 relative hover:border-emerald-500/40 transition-all shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 font-bold flex items-center justify-center border border-emerald-500/20">
                  02
                </div>
                <h3 className="text-base font-bold text-txtMain">AI Voice Practice & Coding</h3>
                <p className="text-xs text-txtMuted leading-relaxed">
                  Practice audio interview questions with simulated TTS voice readers or hone coding challenges in our sandbox.
                </p>
              </div>

              <div className="bg-main border border-borderSubtle p-6 rounded-2xl space-y-3 relative hover:border-indigo-500/40 transition-all shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 font-bold flex items-center justify-center border border-indigo-500/20">
                  03
                </div>
                <h3 className="text-base font-bold text-txtMain">Apply & Track Status</h3>
                <p className="text-xs text-txtMuted leading-relaxed">
                  Apply directly to recruiters, request internal referral boosts, and track application stages live on your tracker.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Main Content (Full Bleed Outer + Centered Inner) ── */}
        <main className="w-full flex-1 py-8">
          <div className={`mx-auto px-4 sm:px-6 lg:px-8 space-y-5 transition-all duration-300 ${
            filters.savedOnly ? 'max-w-[1600px]' : 'max-w-7xl'
          }`}>
            {/* ── Jobs List & Filters ── */}
            <section id="jobs" className="space-y-4">
              <JobFilterBar
                filters={filters}
                onFilterChange={setFilters}
                onResetFilters={handleResetFilters}
                totalJobsCount={filteredJobs.length}
                totalAllCount={jobs.length}
                savedCount={savedCount}
                viewMode={viewMode}
                onViewModeChange={handleViewModeChange}
                onOpenJobAlerts={(mode) => {
                  setJobAlertsMode(mode);
                  setIsJobAlertsOpen(true);
                }}
                totalNewAlerts={totalNewAlerts}
              />

              {filteredJobs.length === 0 ? (
                /* ── Empty State ── */
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center justify-center py-20 text-center"
                >
                  <div className="w-16 h-16 rounded-2xl bg-nested border border-borderSubtle flex items-center justify-center mb-4">
                    <SearchX className="w-7 h-7 text-txtMuted" />
                  </div>
                  <h3 className="text-lg font-bold text-txtMain mb-1">No jobs found</h3>
                  <p className="text-sm text-txtMuted max-w-sm mb-4">
                    Try adjusting your filters or search terms to find more opportunities.
                  </p>
                  <button
                    onClick={handleResetFilters}
                    className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-accent bg-accent/10 border border-accent/20 rounded-lg hover:bg-accent/20 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Clear all filters
                  </button>
                </motion.div>
              ) : viewMode === 'deck' ? (
                <DeckView
                  jobs={paginatedJobs}
                  onApply={handleOpenDetail}
                  onToggleBookmark={handleToggleBookmark}
                  onSwitchToGrid={() => handleViewModeChange('grid')}
                />
              ) : filters.savedOnly ? (
                <ApplicationTracker
                  applications={applications}
                  allJobs={jobsWithScores}
                  onUpdateStage={handleUpdateApplicationStage}
                  onOpenDetail={handleOpenDetail}
                />
              ) : (
                <>
                  <JobsGrid
                    jobs={paginatedJobs}
                    onApply={handleOpenDetail}
                    onToggleBookmark={handleToggleBookmark}
                    onAnalyzeProfile={handleOpenProfileAnalysis}
                    onShareJob={handleShareJob}
                    applications={applications}
                    isPremium={isPremium}
                    onUpgradeClick={() => setIsPremiumModalOpen(true)}
                  />
                  {/* Load More */}
                  {hasMore && (
                    <div className="flex justify-center pt-4">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setVisibleCount((v) => v + JOBS_PER_PAGE)}
                        className="px-6 py-2.5 text-sm font-semibold text-txtMain bg-nested border border-borderSubtle rounded-xl hover:border-accent/40 transition-colors"
                      >
                        Load More ({filteredJobs.length - visibleCount} remaining)
                      </motion.button>
                    </div>
                  )}
                </>
              )}
            </section>
          </div>
        </main>

        {/* ── Enhanced Footer (Full Bleed Outer + Centered Inner) ── */}
        <footer className="w-full border-t border-borderSubtle bg-surface theme-transition pt-14 pb-8 mt-16 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            {/* Top Job Alert Email Banner */}
            <div className="bg-gradient-to-r from-accent/15 via-nested to-indigo-500/15 border border-borderStrong rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-1 text-center md:text-left">
                <h3 className="text-lg font-bold text-txtMain tracking-tight">Stay Ahead of Top Engineering & Tech Hiring Drops</h3>
                <p className="text-xs text-txtMuted">Get weekly curated job matches tailored directly to your profile skills.</p>
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto max-w-md">
                <input
                  type="email"
                  placeholder="Enter your email address..."
                  className="w-full bg-main border border-borderStrong focus:border-accent rounded-xl px-4 py-2.5 text-xs text-txtMain outline-none"
                />
                <button className="px-5 py-2.5 text-xs font-bold text-white bg-accent hover:bg-accent/90 rounded-xl whitespace-nowrap shadow-md flex items-center gap-1.5 shrink-0">
                  <Send className="w-3.5 h-3.5" /> Subscribe
                </button>
              </div>
            </div>

            {/* Links Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div>
                <h4 className="text-xs font-bold text-txtMain uppercase tracking-wider mb-3">WorkVerse Platform</h4>
                <ul className="space-y-2 text-xs text-txtMuted">
                  <li>
                    <button onClick={() => handleResetFilters()} className="hover:text-txtMain transition-colors">
                      Browse All Jobs
                    </button>
                  </li>
                  <li>
                    <button onClick={() => setIsSalaryGuideOpen(true)} className="hover:text-txtMain transition-colors">
                      Salary Guide 2025
                    </button>
                  </li>
                  <li>
                    <button onClick={() => setIsCompaniesDirectoryOpen(true)} className="hover:text-txtMain transition-colors">
                      Companies Directory
                    </button>
                  </li>
                  <li>
                    <button onClick={() => setIsRealJobsOpen(true)} className="hover:text-txtMain transition-colors">
                      🌍 Real Jobs (Live)
                    </button>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-xs font-bold text-txtMain uppercase tracking-wider mb-3">Prep & AI Tools</h4>
                <ul className="space-y-2 text-xs text-txtMuted">
                  <li>
                    <button onClick={() => setIsCodingPlaygroundOpen(true)} className="hover:text-txtMain transition-colors">
                      In-Browser Coding Playground
                    </button>
                  </li>
                  <li>
                    <button onClick={() => setIsAIMockInterviewOpen(true)} className="hover:text-txtMain transition-colors">
                      AI Voice Mock Interview
                    </button>
                  </li>
                  <li>
                    <button onClick={() => setIsHiringChallengesOpen(true)} className="hover:text-txtMain transition-colors">
                      Hiring Challenges & Contests
                    </button>
                  </li>
                  <li>
                    <button onClick={() => setIsResumeBuilderOpen(true)} className="hover:text-txtMain transition-colors">
                      Resume ATS Parser
                    </button>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-xs font-bold text-txtMain uppercase tracking-wider mb-3">Resources & Legal</h4>
                <ul className="space-y-2 text-xs text-txtMuted">
                  {['About WorkVerse', 'Careers & Hiring', 'Privacy Policy', 'Terms of Service'].map((l) => (
                    <li key={l}><a href="#" className="hover:text-txtMain transition-colors">{l}</a></li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-xs font-bold text-txtMain uppercase tracking-wider mb-3">Connect With Us</h4>
                <div className="flex items-center gap-2">
                  {[Share, Rss, Globe, Mail].map((Icon, i) => (
                    <a key={i} href="#" className="w-8 h-8 rounded-lg bg-nested hover:bg-surface flex items-center justify-center text-txtMuted hover:text-txtMain transition-colors border border-borderSubtle">
                      <Icon className="w-4 h-4" />
                    </a>
                  ))}
                </div>
                <p className="mt-4 text-[11px] text-txtMuted">© 2025 WorkVerse India & Global Careers. All rights reserved.</p>
              </div>
            </div>
          </div>
        </footer>
      </div>

      {/* ── Modals ── */}
      <JobDetailModal
        job={selectedJob}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onOpenApply={handleOpenApply}
        onShareJob={handleShareJob}
        applications={applications}
        allJobs={jobsWithScores}
        onStartMockInterview={(j) => {
          setSelectedJob(j);
          setIsAIMockInterviewOpen(true);
        }}
      />
      <ApplyModal job={selectedJob} isOpen={isApplyOpen} onClose={() => setIsApplyOpen(false)} onSubmitSuccess={handleApplicationSubmitted} applications={applications} candidateProfile={candidateProfile} onOpenReferral={handleOpenReferral} onBoostSkill={handleBoostSkill} />
      <PostJobModal isOpen={isPostJobOpen} onClose={() => setIsPostJobOpen(false)} onJobPosted={handleJobPosted} />
      <ResumeBuilderModal isOpen={isResumeBuilderOpen} onClose={() => setIsResumeBuilderOpen(false)} onSaveResume={handleSaveResume} />
      <JobAlertsModal isOpen={isJobAlertsOpen} onClose={() => setIsJobAlertsOpen(false)} currentFilters={filters} alerts={jobAlerts} onSaveAlert={handleSaveAlert} onDeleteAlert={handleDeleteAlert} mode={jobAlertsMode} />
      <ReferralModal isOpen={isReferralOpen} onClose={() => setIsReferralOpen(false)} job={referralJob} />
      <ProfileAnalysisModal job={selectedJob} isOpen={isProfileAnalysisOpen} onClose={() => setIsProfileAnalysisOpen(false)} />
      <ProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} allJobs={jobsWithScores} onSelectJob={handleOpenDetail} isPremium={isPremium} onLogout={() => setCurrentUser(null)} />
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={(user) => setCurrentUser(user)}
        onRegistrationComplete={handleRegistrationComplete}
      />
      <OnboardingWizard
        isOpen={isOnboardingOpen}
        onComplete={handleOnboardingComplete}
        userName={pendingNewUser?.name || ''}
      />
      <PrepHubModal isOpen={isPrepHubOpen} onClose={() => setIsPrepHubOpen(false)} isPremium={isPremium} onUpgradeClick={() => { setIsPrepHubOpen(false); setIsPremiumModalOpen(true); }} />
      <SalaryGuideModal isOpen={isSalaryGuideOpen} onClose={() => setIsSalaryGuideOpen(false)} />
      <CompaniesDirectoryModal isOpen={isCompaniesDirectoryOpen} onClose={() => setIsCompaniesDirectoryOpen(false)} onSelectJob={handleOpenDetail} />
      <CodingPlaygroundModal isOpen={isCodingPlaygroundOpen} onClose={() => setIsCodingPlaygroundOpen(false)} />
      <AIMockInterviewModal
        isOpen={isAIMockInterviewOpen}
        onClose={() => setIsAIMockInterviewOpen(false)}
        job={selectedJob}
        candidateProfile={candidateProfile}
        onOpenResumeBuilder={() => setIsResumeBuilderOpen(true)}
      />
      <HiringChallengesModal isOpen={isHiringChallengesOpen} onClose={() => setIsHiringChallengesOpen(false)} />
      <PremiumModal 
        isOpen={isPremiumModalOpen} 
        onClose={() => setIsPremiumModalOpen(false)} 
        isPremium={isPremium} 
        onSubscribe={() => setIsPremium(true)} 
        currentUser={currentUser}
        onOpenProfile={() => { setIsPremiumModalOpen(false); setIsProfileOpen(true); }}
      />
      <DigilockerKYCModal
        isOpen={isKYCOpen}
        onClose={() => setIsKYCOpen(false)}
        onVerifySuccess={() => toast('Identity & KYC badge issued successfully! 🛡️', 'success')}
      />
      <DPDPAuditModal
        isOpen={isDPDPOpen}
        onClose={() => setIsDPDPOpen(false)}
        onDataPurged={() => toast('DPDP Act data erasure complete.', 'info')}
      />
      <EmployerATSModal
        isOpen={isATSOpen}
        onClose={() => setIsATSOpen(false)}
      />
      <ReportJobModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        job={selectedJob}
      />
      <AdminModerationModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
      />
      <RealJobsModal
        isOpen={isRealJobsOpen}
        onClose={() => setIsRealJobsOpen(false)}
        candidateProfile={candidateProfile}
      />
      <AIChatbotWidget />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}
