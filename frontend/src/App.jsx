import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Briefcase, Globe, Rss, Share, Mail, Sparkles, Sun, Moon, SearchX, RotateCcw,
  Building2, Award, Zap, CheckCircle2, ArrowRight, ShieldCheck, FileText, Cpu,
  ChevronRight, ChevronDown, Send, Users, TrendingUp, Check, Star, Terminal, Menu, X
} from 'lucide-react';
import { AnimatedHero } from './components/hero/AnimatedHero';
import { ToastProvider, useToast } from './components/Toast';
import { ReactLenis } from 'lenis/react';
import BubbleBackground from './components/ui/BubbleBackground';
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
import JobAlertsModal from './components/jobs/JobAlertsModal';
import MarketDemandModal from './components/jobs/MarketDemandModal';
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

import { fetchApi } from './utils/api';

function AppContent() {
  const toast = useToast();
  const [jobs, setJobs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
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
  const [isMarketDemandOpen, setIsMarketDemandOpen] = useState(false);
  const [isExploreDropdownOpen, setIsExploreDropdownOpen] = useState(false);
  const [isAiToolsDropdownOpen, setIsAiToolsDropdownOpen] = useState(false);
  const [showLocationBanner, setShowLocationBanner] = useState(true);
  const [userDetectedCity, setUserDetectedCity] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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

  const [isLoadingJobs, setIsLoadingJobs] = useState(false);

  useEffect(() => {
    const fetchBackendJobs = async () => {
      setIsLoadingJobs(true);
      try {
        const data = await fetchApi('/api/v1/jobs');
        if (data && data.length > 0) {
          const mappedJobs = data.map((job) => ({
            id: job.id,
            title: job.title,
            company: job.company,
            companyLogo: null,
            companyRating: 4.5,
            companyReviewCount: 100,
            location: job.location,
            jobType: job.jobType,
            category: job.category,
            customSalaryString: job.salaryRange,
            salaryMin: 100000,
            salaryMax: 150000,
            currency: 'INR',
            description: job.description,
            techStack: job.techStack || [],
            experienceLevel: 'Entry/Mid Level',
            experienceYears: '1-3',
            remoteOnly: false,
            isBookmarked: false,
            applicationCount: 42,
            postedDaysAgo: 1,
            companyInsights: {
              summary: 'Real Company • Active Hiring',
              funding: 'Verified',
              growth: 'Stable',
              avgTenure: '2.5 yrs',
              glassdoorRating: '4.5★',
              culture: 'Collaborative',
              salaryTransparency: job.salaryRange || 'Disclosed',
              techMaturity: 'Modern'
            }
          }));
          setJobs(mappedJobs);
        } else {
          setJobs(MOCK_WORKVERSE_JOBS);
        }
      } catch (err) {
        console.error("Failed to fetch backend jobs", err);
        setJobs(MOCK_WORKVERSE_JOBS);
      } finally {
        setIsLoadingJobs(false);
      }
    };
    fetchBackendJobs();
  }, []);

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
  const totalPages = Math.ceil(filteredJobs.length / JOBS_PER_PAGE);
  const paginatedJobs = useMemo(() => {
    const startIndex = (currentPage - 1) * JOBS_PER_PAGE;
    return filteredJobs.slice(startIndex, startIndex + JOBS_PER_PAGE);
  }, [filteredJobs, currentPage]);
  const hasMore = currentPage < totalPages;

  // Reset to first page on filter change
  useEffect(() => { setCurrentPage(1); }, [filters]);

  return (
    <div className="min-h-screen bg-main text-txtMain font-sans theme-transition relative overflow-x-hidden">
      {/* ── Page-Spanning Ambient Background Texture Layer ── */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
        <BubbleBackground interactive={false} />
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

            {/* Navigation Links - Condensed into 2 Dropdowns */}
            <div className="hidden md:flex items-center gap-2 font-medium text-xs text-txtMuted">
              {/* Explore Dropdown */}
              <div className="relative" onMouseLeave={() => setIsExploreDropdownOpen(false)}>
                <button
                  onMouseEnter={() => setIsExploreDropdownOpen(true)}
                  onClick={() => setIsExploreDropdownOpen(!isExploreDropdownOpen)}
                  className="px-3 py-1.5 rounded-lg hover:text-txtMain hover:bg-nested transition-colors flex items-center gap-1 font-semibold"
                >
                  <span>Explore</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>

                {isExploreDropdownOpen && (
                  <div className="absolute left-0 top-full mt-1 w-48 bg-surface border border-borderStrong rounded-xl shadow-xl p-1.5 z-50 space-y-1">
                    <button
                      onClick={() => { handleResetFilters(); setIsExploreDropdownOpen(false); }}
                      className="w-full text-left px-3 py-2 text-xs rounded-lg text-txtMuted hover:text-txtMain hover:bg-nested transition-colors font-medium flex items-center gap-2"
                    >
                      <Briefcase className="w-3.5 h-3.5 text-amber-500" />
                      <span>Browse Jobs</span>
                    </button>
                    <button
                      onClick={() => { setIsSalaryGuideOpen(true); setIsExploreDropdownOpen(false); }}
                      className="w-full text-left px-3 py-2 text-xs rounded-lg text-txtMuted hover:text-txtMain hover:bg-nested transition-colors font-medium flex items-center gap-2"
                    >
                      <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Salary Guide 2025</span>
                    </button>
                    <button
                      onClick={() => { setIsCompaniesDirectoryOpen(true); setIsExploreDropdownOpen(false); }}
                      className="w-full text-left px-3 py-2 text-xs rounded-lg text-txtMuted hover:text-txtMain hover:bg-nested transition-colors font-medium flex items-center gap-2"
                    >
                      <Building2 className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Companies Directory</span>
                    </button>
                    <button
                      onClick={() => { setIsMarketDemandOpen(true); setIsExploreDropdownOpen(false); }}
                      className="w-full text-left px-3 py-2 text-xs rounded-lg text-txtMuted hover:text-txtMain hover:bg-nested transition-colors font-medium flex items-center gap-2"
                    >
                      <Zap className="w-3.5 h-3.5 text-amber-400" />
                      <span>Market Insights</span>
                    </button>
                  </div>
                )}
              </div>

              {/* AI Tools Dropdown */}
              <div className="relative" onMouseLeave={() => setIsAiToolsDropdownOpen(false)}>
                <button
                  onMouseEnter={() => setIsAiToolsDropdownOpen(true)}
                  onClick={() => setIsAiToolsDropdownOpen(!isAiToolsDropdownOpen)}
                  className="px-3 py-1.5 rounded-lg text-amber-400 bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 transition-colors flex items-center gap-1.5 font-bold"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>AI Tools</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>

                {isAiToolsDropdownOpen && (
                  <div className="absolute left-0 top-full mt-1 w-56 bg-surface border border-borderStrong rounded-xl shadow-xl p-1.5 z-50 space-y-1">
                    <button
                      onClick={() => { setIsAIMockInterviewOpen(true); setIsAiToolsDropdownOpen(false); }}
                      className="w-full text-left px-3 py-2 text-xs rounded-lg text-emerald-400 hover:bg-emerald-500/10 transition-colors font-semibold flex items-center gap-2"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Voice Mock Interview</span>
                    </button>
                    <button
                      onClick={() => { setIsPrepHubOpen(true); setIsAiToolsDropdownOpen(false); }}
                      className="w-full text-left px-3 py-2 text-xs rounded-lg text-txtMuted hover:text-txtMain hover:bg-nested transition-colors font-medium flex items-center gap-2"
                    >
                      <FileText className="w-3.5 h-3.5 text-amber-400" />
                      <span>Resume ATS Checker</span>
                    </button>
                    <button
                      onClick={() => { setIsCodingPlaygroundOpen(true); setIsAiToolsDropdownOpen(false); }}
                      className="w-full text-left px-3 py-2 text-xs rounded-lg text-txtMuted hover:text-txtMain hover:bg-nested transition-colors font-medium flex items-center gap-2"
                    >
                      <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Coding Sandbox</span>
                    </button>
                    <button
                      onClick={() => { setIsHiringChallengesOpen(true); setIsAiToolsDropdownOpen(false); }}
                      className="w-full text-left px-3 py-2 text-xs rounded-lg text-txtMuted hover:text-txtMain hover:bg-nested transition-colors font-medium flex items-center gap-2"
                    >
                      <Award className="w-3.5 h-3.5 text-rose-400" />
                      <span>Hiring Challenges</span>
                    </button>
                    <button
                      onClick={() => { setIsKYCOpen(true); setIsAiToolsDropdownOpen(false); }}
                      className="w-full text-left px-3 py-2 text-xs rounded-lg text-txtMuted hover:text-txtMain hover:bg-nested transition-colors font-medium flex items-center gap-2"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>e-KYC Verification</span>
                    </button>
                  </div>
                )}
              </div>
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
              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden w-8 h-8 rounded-lg bg-nested border border-borderSubtle flex items-center justify-center text-txtMuted hover:text-txtMain transition-colors"
              >
                {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="md:hidden border-t border-borderSubtle bg-main/95 backdrop-blur-md overflow-hidden"
              >
                <div className="p-4 space-y-4">
                  <div>
                    <h3 className="text-xs font-bold text-txtMuted uppercase tracking-wider mb-2">Explore</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <button onClick={() => { handleResetFilters(); setIsMobileMenuOpen(false); }} className="text-left px-3 py-2 text-xs rounded-lg bg-nested hover:bg-surface text-txtMain flex items-center gap-2">
                        <Briefcase className="w-3.5 h-3.5 text-amber-500" /> Browse Jobs
                      </button>
                      <button onClick={() => { setIsSalaryGuideOpen(true); setIsMobileMenuOpen(false); }} className="text-left px-3 py-2 text-xs rounded-lg bg-nested hover:bg-surface text-txtMain flex items-center gap-2">
                        <TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> Salary Guide
                      </button>
                      <button onClick={() => { setIsCompaniesDirectoryOpen(true); setIsMobileMenuOpen(false); }} className="text-left px-3 py-2 text-xs rounded-lg bg-nested hover:bg-surface text-txtMain flex items-center gap-2">
                        <Building2 className="w-3.5 h-3.5 text-indigo-400" /> Companies
                      </button>
                      <button onClick={() => { setIsMarketDemandOpen(true); setIsMobileMenuOpen(false); }} className="text-left px-3 py-2 text-xs rounded-lg bg-nested hover:bg-surface text-txtMain flex items-center gap-2">
                        <Zap className="w-3.5 h-3.5 text-amber-400" /> Market Insights
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-xs font-bold text-txtMuted uppercase tracking-wider mb-2">AI Tools</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <button onClick={() => { setIsAIMockInterviewOpen(true); setIsMobileMenuOpen(false); }} className="text-left px-3 py-2 text-xs rounded-lg bg-emerald-500/10 text-emerald-400 font-semibold flex items-center gap-2">
                        <Sparkles className="w-3.5 h-3.5" /> Voice Mock
                      </button>
                      <button onClick={() => { setIsPrepHubOpen(true); setIsMobileMenuOpen(false); }} className="text-left px-3 py-2 text-xs rounded-lg bg-nested hover:bg-surface text-txtMain flex items-center gap-2">
                        <FileText className="w-3.5 h-3.5 text-amber-400" /> ATS Checker
                      </button>
                      <button onClick={() => { setIsCodingPlaygroundOpen(true); setIsMobileMenuOpen(false); }} className="text-left px-3 py-2 text-xs rounded-lg bg-nested hover:bg-surface text-txtMain flex items-center gap-2">
                        <Terminal className="w-3.5 h-3.5 text-indigo-400" /> Coding
                      </button>
                      <button onClick={() => { setIsHiringChallengesOpen(true); setIsMobileMenuOpen(false); }} className="text-left px-3 py-2 text-xs rounded-lg bg-nested hover:bg-surface text-txtMain flex items-center gap-2">
                        <Award className="w-3.5 h-3.5 text-rose-400" /> Challenges
                      </button>
                    </div>
                  </div>
                  
                  <div className="pt-2 border-t border-borderSubtle">
                    <button
                      onClick={() => { setIsResumeBuilderOpen(true); setIsMobileMenuOpen(false); }}
                      className="w-full text-center px-3 py-2 text-xs font-semibold text-txtMain bg-nested hover:bg-surface border border-borderSubtle rounded-lg transition-colors"
                    >
                      Resume Builder
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.header>

        {/* ── Signature AnimatedHero Section ── */}
        <AnimatedHero
          onExploreClick={() => {
            const section = document.getElementById('jobs');
            if (section) section.scrollIntoView({ behavior: 'smooth' });
          }}
          onPrepClick={() => setIsAIMockInterviewOpen(true)}
        />

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
              <div className="bg-main border border-borderSubtle p-6 rounded-2xl space-y-3 relative hover:border-amber-500/40 transition-all shadow-sm">
                <div className="px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-500 font-mono text-xs font-bold w-max border border-amber-500/20">
                  STEP 01 / 03
                </div>
                <h3 className="text-base font-bold text-txtMain">Create & Parse Profile</h3>
                <p className="text-xs text-txtMuted leading-relaxed">
                  Upload your resume to calculate your match score against live openings and receive instant skill gap suggestions.
                </p>
              </div>

              <div className="bg-main border border-borderSubtle p-6 rounded-2xl space-y-3 relative hover:border-emerald-500/40 transition-all shadow-sm">
                <div className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 font-mono text-xs font-bold w-max border border-emerald-500/20">
                  STEP 02 / 03
                </div>
                <h3 className="text-base font-bold text-txtMain">AI Voice Practice & Coding</h3>
                <p className="text-xs text-txtMuted leading-relaxed">
                  Practice audio interview questions with simulated TTS voice readers or hone coding challenges in our sandbox.
                </p>
              </div>

              <div className="bg-main border border-borderSubtle p-6 rounded-2xl space-y-3 relative hover:border-indigo-500/40 transition-all shadow-sm">
                <div className="px-2.5 py-1 rounded-md bg-indigo-500/10 text-indigo-400 font-mono text-xs font-bold w-max border border-indigo-500/20">
                  STEP 03 / 03
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
                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 pt-6">
                      <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1.5 rounded-lg border border-borderSubtle bg-surface text-txtMuted hover:text-txtMain disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Prev
                      </button>
                      
                      <div className="flex items-center gap-1">
                        {Array.from({ length: totalPages }).map((_, idx) => {
                          const pageNumber = idx + 1;
                          return (
                            <button
                              key={pageNumber}
                              onClick={() => setCurrentPage(pageNumber)}
                              className={`w-8 h-8 rounded-lg text-sm font-semibold flex items-center justify-center transition-colors ${
                                currentPage === pageNumber
                                  ? 'bg-accent text-white shadow-sm'
                                  : 'bg-surface border border-borderSubtle text-txtMuted hover:border-accent/40 hover:text-txtMain'
                              }`}
                            >
                              {pageNumber}
                            </button>
                          );
                        })}
                      </div>

                      <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1.5 rounded-lg border border-borderSubtle bg-surface text-txtMuted hover:text-txtMain disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
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
            <div className="bg-surface border border-borderStrong rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
              <div className="space-y-1 text-center md:text-left">
                <h3 className="text-lg font-bold text-txtMain tracking-tight">Stay Ahead of Top Engineering & Tech Drops</h3>
                <p className="text-xs text-txtMuted font-mono">Curated skill-gap vector drops delivered directly to your inbox.</p>
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto max-w-md">
                <input
                  type="email"
                  placeholder="dev@workverse.ai █"
                  className="w-full bg-canvas border border-borderStrong focus:border-amber-500 rounded-xl px-4 py-2.5 text-xs text-txtMain font-mono outline-none"
                />
                <button className="px-5 py-2.5 text-xs font-bold text-black bg-amber-500 hover:bg-amber-600 rounded-xl whitespace-nowrap shadow-md flex items-center gap-1.5 shrink-0 transition-colors">
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
                    <button onClick={() => setIsMarketDemandOpen(true)} className="hover:text-txtMain transition-colors flex items-center gap-1">
                      <TrendingUp className="w-3.5 h-3.5" /> Market Insights
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
      <MarketDemandModal 
        isOpen={isMarketDemandOpen}
        onClose={() => setIsMarketDemandOpen(false)}
      />
      
      <AIChatbotWidget />
    </div>
  );
}

export default function App() {
  return (
    <ReactLenis root>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </ReactLenis>
  );
}
