export type JobType = 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'REMOTE' | 'HYBRID';

export type ExperienceLevel = 'Entry Level' | 'Mid Level' | 'Senior Level' | 'Lead / Staff';

export interface Job {
  id: number;
  title: string;
  company: string;
  companyWebsite?: string;
  companyLogoUrl?: string;
  location: string;
  jobType: JobType;
  category?: string;
  salaryMin: number;
  salaryMax?: number | null;
  currency: string;
  description: string;
  techStack: string[];
  experienceLevel?: ExperienceLevel;
  remoteOnly?: boolean;
  isNew?: boolean;
  isBookmarked?: boolean;
  companyRating?: number;
  companyReviewCount?: number;
  applicationCount?: number;
  createdAt?: string;
}

export interface FilterState {
  search: string;
  jobTypes: JobType[];
  experienceLevels: ExperienceLevel[];
  remoteOnly: boolean;
  minSalary: number;
  savedOnly?: boolean;
}

export interface ApplicationFormData {
  applicantName: string;
  applicantEmail: string;
  resumeFile?: File | null;
  resumeUrl: string;
  coverLetter: string;
}

export interface NewJobFormData {
  title: string;
  company: string;
  companyWebsite: string;
  location: string;
  jobType: JobType;
  category: string;
  salaryMin: string | number;
  salaryMax: string | number;
  currency: string;
  description: string;
  techStack: string[];
}

export interface TechHub {
  id: number;
  city: string;
  lat: number;
  lng: number;
  activeJobs: number;
  tech: string;
}
