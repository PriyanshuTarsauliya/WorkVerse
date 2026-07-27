import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, User, Briefcase, GraduationCap, FolderGit2, Award, FileText, MapPin, Mail,
  Calendar, ExternalLink, Upload, CheckCircle, Star, Edit3, ChevronRight, Sparkles, TrendingUp, Plus, AlertCircle,
} from 'lucide-react';
import { generateProfileSuggestions, calculateJobMatchScore } from '../../utils/recommendationEngine';

const DEFAULT_PROFILE_DATA = {
  name: 'Alex Rivera',
  headline: 'Senior Frontend Engineer',
  location: 'San Francisco, CA',
  email: 'alex.rivera@example.com',
  avatarInitials: 'AR',
  profileCompletion: 92,
  experienceYears: 8,
  stats: {
    yearsExp: 8,
    applicationsSubmitted: 12,
    savedJobs: 5,
  },
  skills: [
    { name: 'JavaScript', level: 'Expert' },
    { name: 'React', level: 'Expert' },
    { name: 'TypeScript', level: 'Advanced' },
    { name: 'Node.js', level: 'Advanced' },
    { name: 'Tailwind CSS', level: 'Expert' },
    { name: 'Spring Boot', level: 'Intermediate' },
    { name: 'PostgreSQL', level: 'Advanced' },
    { name: 'Docker', level: 'Intermediate' },
  ],
  experience: [
    {
      company: 'TechFlow Solutions',
      role: 'Senior Frontend Engineer',
      period: 'Jan 2020 — Present',
      current: true,
      bullets: [
        'Led migration of legacy jQuery app to React 18 + TypeScript, reducing bundle size by 45%.',
        'Architected component library serving 6 product teams with 98% adoption.',
        'Mentored 4 junior engineers through structured pair programming sessions.',
      ],
    },
    {
      company: 'DataPulse Systems',
      role: 'Frontend Developer',
      period: 'Jun 2016 — Dec 2019',
      current: false,
      bullets: [
        'Built real-time analytics dashboard processing 2M+ daily events.',
        'Optimized Core Web Vitals, achieving 95+ Lighthouse performance score.',
        'Introduced automated visual regression testing with Chromatic.',
      ],
    },
  ],
  education: [
    {
      institution: 'University of California, Berkeley',
      degree: 'B.S. Computer Science',
      gpa: '3.9',
      period: '2012 — 2016',
      honors: 'Magna Cum Laude',
    },
  ],
  projects: [
    {
      name: 'Project Alpha',
      description: 'High-performance SaaS analytics dashboard with real-time WebSocket updates and interactive data visualizations.',
      tech: ['React', 'Next.js', 'Tailwind CSS', 'D3.js'],
      link: 'https://project-alpha.dev',
    },
    {
      name: 'DevConnect',
      description: 'Community platform for developers to share projects, get code reviews, and collaborate on open-source.',
      tech: ['Node.js', 'Socket.io', 'PostgreSQL', 'Redis'],
      link: 'https://devconnect.io',
    },
  ],
  certificates: [
    { name: 'AWS Certified Solutions Architect', issuer: 'Amazon Web Services', date: '2023', verified: true },
    { name: 'Google UX Design Professional', issuer: 'Coursera / Google', date: '2022', verified: true },
  ],
};

const TABS = [
  { id: 'overview', label: 'Overview', icon: User },
  { id: 'recommendations', label: 'AI Recommendations', icon: Sparkles },
  { id: 'experience', label: 'Experience', icon: Briefcase },
  { id: 'education', label: 'Education', icon: GraduationCap },
  { id: 'projects', label: 'Projects', icon: FolderGit2 },
  { id: 'certificates', label: 'Certificates', icon: Award },
  { id: 'resume', label: 'Resume', icon: FileText },
];

const levelColor = (level) => {
  if (level === 'Expert') return 'text-amber bg-amber/10 border-amber/20';
  if (level === 'Advanced') return 'text-accent bg-accent/10 border-accent/20';
  return 'text-txtMuted bg-nested border-borderStrong';
};

export default function ProfileModal({ isOpen, onClose, allJobs = [], onSelectJob, isPremium, onLogout }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [profile, setProfile] = useState(DEFAULT_PROFILE_DATA);
  const [newSkillInput, setNewSkillInput] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // Edit profile form state
  const [editForm, setEditForm] = useState({
    name: DEFAULT_PROFILE_DATA.name,
    location: DEFAULT_PROFILE_DATA.location,
    experienceYears: DEFAULT_PROFILE_DATA.experienceYears,
  });
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');

  if (!isOpen) return null;

  const suggestions = generateProfileSuggestions(profile, allJobs);

  const handleAddSkillSubmit = () => {
    const name = newSkillInput.trim();
    if (name && !profile.skills.some((s) => s.name.toLowerCase() === name.toLowerCase())) {
      const updatedSkills = [...profile.skills, { name, level: 'Intermediate' }];
      const newCompletion = Math.min(100, profile.profileCompletion + 5);
      setProfile({
        ...profile,
        skills: updatedSkills,
        profileCompletion: newCompletion,
      });
      setNewSkillInput('');
    }
  };

  const handleAddSkill = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAddSkillSubmit();
    }
  };

  const handleRemoveSkill = (skillName) => {
    setProfile({
      ...profile,
      skills: profile.skills.filter((s) => s.name !== skillName),
    });
  };

  const handleFileDrop = (file) => {
    if (file && (file.name.endsWith('.pdf') || file.name.endsWith('.docx'))) {
      setResumeFile(file);
      setProfile((prev) => ({ ...prev, resumeUploaded: true, profileCompletion: 100 }));
    }
  };

  const handleSaveProfile = (e) => {
    e?.preventDefault();
    setSaveError('');
    setSaveSuccess(false);

    if (!editForm.name.trim() || !editForm.location.trim()) {
      setSaveError('Full name and location are required fields.');
      return;
    }

    // Calculate strictly increased completion percentage
    const newCompletion = Math.min(100, profile.profileCompletion + 8);

    setProfile((prev) => ({
      ...prev,
      name: editForm.name,
      location: editForm.location,
      experienceYears: Number(editForm.experienceYears),
      avatarInitials: editForm.name.substring(0, 2).toUpperCase(),
      profileCompletion: newCompletion,
      stats: { ...prev.stats, yearsExp: Number(editForm.experienceYears) }
    }));

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
    setIsEditingProfile(false);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-end" data-testid="profile-modal">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 220 }}
          className="relative z-10 w-full max-w-3xl h-full bg-main border-l border-borderSubtle flex flex-col overflow-hidden"
        >
          {/* Profile Header */}
          <div className="p-6 bg-surface border-b border-borderSubtle">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-accent/20 border border-accent/30 flex items-center justify-center text-accent text-xl font-bold">
                  {profile.avatarInitials}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-txtMain" data-testid="profile-header-name">{profile.name}</h2>
                    {isPremium && (
                      <span className="px-2 py-0.5 text-[10px] font-bold text-white bg-gradient-to-r from-accent to-indigo-500 rounded-full shadow-sm flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        Premium
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-txtMuted">{profile.headline}</p>
                  <div className="flex items-center gap-3 mt-1.5 text-xs text-txtMain0">
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{profile.location}</span>
                    <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{profile.email}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsEditingProfile(true)}
                  className="px-3 py-1.5 text-xs font-semibold text-txtMain bg-nested hover:bg-surface border border-borderSubtle rounded-lg transition-colors flex items-center gap-1"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  Edit
                </button>
                {onLogout && (
                  <button
                    onClick={() => { onLogout(); onClose(); }}
                    data-testid="profile-logout-button"
                    className="px-3 py-1.5 text-xs font-semibold text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 rounded-lg transition-colors"
                  >
                    Log Out
                  </button>
                )}
                <button onClick={onClose} data-testid="profile-close-button" className="w-8 h-8 rounded-lg bg-nested hover:bg-base-700 flex items-center justify-center text-txtMuted hover:text-white transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Profile Completion */}
            <div className="mt-4 flex items-center gap-3">
              <div className="flex-1 h-1.5 bg-nested rounded-full overflow-hidden">
                <div className="h-full bg-accent rounded-full transition-all duration-500" style={{ width: `${profile.profileCompletion}%` }} />
              </div>
              <span className="text-xs font-medium text-accent" data-testid="profile-completion-percentage">{profile.profileCompletion}% complete</span>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-borderSubtle px-6 bg-surface">
            <div className="flex gap-0 overflow-x-auto no-scrollbar">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  data-testid={`profile-tab-${tab.id}`}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-accent text-txtMain'
                      : 'border-transparent text-txtMain0 hover:text-txtMain'
                  }`}
                >
                  <tab.icon className={`w-3.5 h-3.5 ${tab.id === 'recommendations' ? 'text-accent' : ''}`} />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* ── AI Recommendations Tab ── */}
            {activeTab === 'recommendations' && (
              <div className="space-y-6">
                {/* Score summary banner */}
                <div className="bg-gradient-to-r from-indigo-950/80 via-navy-900 to-navy-900 border border-accent-500/25 rounded-xl p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-accent/20 border border-accent/30 flex items-center justify-center text-accent">
                        <Sparkles className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-white">Market Match Index</h3>
                        <p className="text-xs text-txtMuted mt-0.5">
                          Calculated across {allJobs.length} active positions in tech hubs
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-accent">{suggestions.averageMatchScore}%</p>
                      <p className="text-[11px] text-emerald-400 font-medium">Top 5% candidate fit</p>
                    </div>
                  </div>
                </div>

                {/* Top Recommended Roles */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-txtMain flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-accent" />
                      Top Recommended Positions for You
                    </h3>
                    <span className="text-xs text-txtMain0">Sorted by Recommendation Engine</span>
                  </div>

                  <div className="space-y-3">
                    {suggestions.topRecommendations.map(({ job, match }, idx) => (
                      <div
                        key={job.id || idx}
                        onClick={() => { onClose(); onSelectJob?.(job); }}
                        className="bg-surface border border-borderSubtle hover:border-accent-500/40 rounded-xl p-4 transition-colors cursor-pointer group"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-semibold text-txtMain group-hover:text-accent transition-colors">
                                {job.title}
                              </h4>
                              <span className="px-2 py-0.5 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-md">
                                {match.score}% Match
                              </span>
                            </div>
                            <p className="text-xs text-txtMuted mt-1">
                              {job.company} · {job.location} · ${(job.salaryMin / 1000).toFixed(0)}k–${(job.salaryMax / 1000).toFixed(0)}k
                            </p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-txtMain0 group-hover:text-white transition-colors mt-1" />
                        </div>

                        {/* Matched skills preview */}
                        <div className="flex flex-wrap items-center gap-1.5 mt-3 pt-3 border-t border-borderSubtle/80">
                          <span className="text-[11px] text-txtMain0 mr-1">Matched skills:</span>
                          {match.matchedSkills.slice(0, 4).map((s, i) => (
                            <span key={i} className="px-2 py-0.5 text-[11px] font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-md">
                              ✓ {s}
                            </span>
                          ))}
                          {match.missingSkills.length > 0 && (
                            <span className="px-2 py-0.5 text-[11px] font-medium text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-md">
                              + Need {match.missingSkills[0]}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* High impact skill upskilling */}
                <div>
                  <h3 className="text-sm font-semibold text-txtMain mb-3 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber" />
                    High Impact Skill Gap Suggestions
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {suggestions.topSkillsToLearn.map((item, i) => (
                      <div key={i} className="bg-surface border border-borderSubtle rounded-xl p-4">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-sm font-semibold text-white">{item.skill}</span>
                          <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                            +{item.scoreBoost}% match boost
                          </span>
                        </div>
                        <p className="text-xs text-txtMuted">
                          Required in <span className="text-txtMain font-medium">{item.count} high-paying target roles</span>. Adding this skill instantly increases callback likelihood.
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Interactive Skill Editor */}
                <div className="bg-surface border border-borderSubtle rounded-xl p-5">
                  <h3 className="text-sm font-semibold text-txtMain mb-2">Edit your skills to recalculate matches</h3>
                  <div className="flex flex-wrap items-center gap-2 bg-main border border-borderSubtle p-3 rounded-lg mb-3">
                    {profile.skills.map((s, i) => (
                      <span key={i} className="flex items-center gap-1.5 bg-surface border border-borderStrong text-txtMain text-xs px-2.5 py-1 rounded-md">
                        {s.name}
                        <button onClick={() => handleRemoveSkill(s.name)} className="hover:text-rose-400">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                    <input
                      type="text"
                      value={newSkillInput}
                      onChange={(e) => setNewSkillInput(e.target.value)}
                      onKeyDown={handleAddSkill}
                      placeholder="Add skill (e.g. AWS, Go), press Enter"
                      className="flex-1 bg-transparent text-xs text-white focus:outline-none px-1 py-1 min-w-[160px]"
                    />
                  </div>
                  <p className="text-[11px] text-txtMain0">
                    Recommendations update live as skills are modified.
                  </p>
                </div>
              </div>
            )}

            {/* ── Overview Tab ── */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Save Feedback Messages */}
                {saveSuccess && (
                  <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold text-center" data-testid="profile-success-message">
                    Profile saved successfully! Completion score updated.
                  </div>
                )}
                {saveError && (
                  <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold text-center" data-testid="profile-error-message">
                    {saveError}
                  </div>
                )}

                <div className="grid grid-cols-3 gap-4 mt-2">
                  {[
                    { label: 'Years of Experience', value: profile.stats.yearsExp, color: 'text-accent' },
                    { label: 'Applications Sent', value: profile.stats.applicationsSubmitted, color: 'text-amber' },
                    { label: 'Saved Jobs', value: profile.stats.savedJobs, color: 'text-txtMain' },
                  ].map((stat, i) => (
                    <div key={i} className="bg-surface border border-borderSubtle rounded-lg p-4 text-center">
                      <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                      <p className="text-xs text-txtMain0 mt-1">{stat.label}</p>
                    </div>
                  ))}
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-txtMain mb-3">Technical skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((skill, i) => (
                      <span key={i} className={`px-3 py-1.5 text-xs font-medium border rounded-lg ${levelColor(skill.level)}`}>
                        {skill.name}
                        <span className="ml-1.5 opacity-70">{skill.level}</span>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-surface border border-borderSubtle rounded-lg p-5">
                  <h3 className="text-sm font-semibold text-txtMain mb-2">About</h3>
                  <p className="text-sm text-txtMuted leading-relaxed">
                    Passionate frontend engineer with {profile.stats.yearsExp} years of experience building performant web applications.
                    Specialized in React architecture, design systems, and developer tooling.
                  </p>
                </div>
              </div>
            )}

            {/* ── Experience Tab ── */}
            {activeTab === 'experience' && (
              <div className="space-y-0">
                {profile.experience.map((exp, i) => (
                  <div key={i} className="relative pl-6 pb-8 last:pb-0">
                    {i < profile.experience.length - 1 && (
                      <div className="absolute left-[7px] top-3 bottom-0 w-0.5 bg-nested" />
                    )}
                    <div className={`absolute left-0 top-1.5 w-4 h-4 rounded-full border-2 ${
                      exp.current ? 'bg-accent border-accent' : 'bg-surface border-borderStrong'
                    }`} />

                    <div className="bg-surface border border-borderSubtle rounded-lg p-5 hover:border-borderStrong transition-colors">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="text-[15px] font-semibold text-txtMain">{exp.role}</h4>
                          <p className="text-sm text-txtMuted">{exp.company}</p>
                        </div>
                        <span className="flex items-center gap-1 text-xs text-txtMain0">
                          <Calendar className="w-3 h-3" />
                          {exp.period}
                        </span>
                      </div>
                      <ul className="mt-3 space-y-1.5">
                        {exp.bullets.map((b, j) => (
                          <li key={j} className="flex items-start gap-2 text-sm text-txtMuted">
                            <ChevronRight className="w-3 h-3 text-accent shrink-0 mt-1" />
                            {b}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ── Education Tab ── */}
            {activeTab === 'education' && (
              <div className="space-y-4">
                {profile.education.map((edu, i) => (
                  <div key={i} className="bg-surface border border-borderSubtle rounded-lg p-5 hover:border-borderStrong transition-colors">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-[15px] font-semibold text-txtMain">{edu.degree}</h4>
                        <p className="text-sm text-txtMuted">{edu.institution}</p>
                        {edu.honors && (
                          <span className="inline-block mt-2 px-2.5 py-0.5 text-xs font-medium text-amber bg-amber/10 border border-amber/20 rounded-md">
                            {edu.honors}
                          </span>
                        )}
                      </div>
                      <div className="text-right">
                        <span className="flex items-center gap-1 text-xs text-txtMain0">
                          <Calendar className="w-3 h-3" />{edu.period}
                        </span>
                        {edu.gpa && (
                          <p className="mt-1 text-sm font-semibold text-accent">GPA: {edu.gpa}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ── Projects Tab ── */}
            {activeTab === 'projects' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {profile.projects.map((proj, i) => (
                  <div key={i} className="bg-surface border border-borderSubtle rounded-lg p-5 hover:border-borderStrong transition-colors flex flex-col justify-between">
                    <div>
                      <h4 className="text-[15px] font-semibold text-txtMain mb-1">{proj.name}</h4>
                      <p className="text-sm text-txtMuted mb-3 line-clamp-2">{proj.description}</p>
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {proj.tech.map((t, j) => (
                          <span key={j} className="px-2 py-0.5 text-xs font-medium text-txtMuted bg-nested border border-borderStrong rounded-md">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                    {proj.link && (
                      <a href={proj.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs font-medium text-accent hover:text-accent transition-colors">
                        <ExternalLink className="w-3 h-3" /> View live project
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* ── Certificates Tab ── */}
            {activeTab === 'certificates' && (
              <div className="space-y-3">
                {profile.certificates.map((cert, i) => (
                  <div key={i} className="bg-surface border border-borderSubtle rounded-lg p-5 hover:border-borderStrong transition-colors flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        cert.verified ? 'bg-amber/10 text-amber' : 'bg-nested text-txtMain0'
                      }`}>
                        <Award className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-txtMain">{cert.name}</h4>
                        <p className="text-xs text-txtMain0">{cert.issuer} · {cert.date}</p>
                      </div>
                    </div>
                    {cert.verified && (
                      <span className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-amber bg-amber/10 border border-amber/20 rounded-md">
                        <CheckCircle className="w-3 h-3" /> Verified
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* ── Resume Tab ── */}
            {activeTab === 'resume' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-txtMain mb-3">Upload your resume</h3>
                  <div
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={(e) => {
                      e.preventDefault(); setIsDragging(false);
                      if (e.dataTransfer.files?.[0]) handleFileDrop(e.dataTransfer.files[0]);
                    }}
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                      isDragging ? 'border-accent bg-accent/5'
                      : resumeFile ? 'border-emerald-500/40 bg-emerald-500/5'
                      : 'border-borderStrong bg-surface hover:border-borderStrong'
                    }`}
                  >
                    <input
                      type="file" id="profile-resume" accept=".pdf,.docx"
                      onChange={(e) => e.target.files?.[0] && handleFileDrop(e.target.files[0])}
                      className="hidden"
                    />
                    <label htmlFor="profile-resume" className="cursor-pointer block">
                      {resumeFile ? (
                        <div className="flex items-center justify-center gap-2 text-emerald-400">
                          <FileText className="w-5 h-5" />
                          <span className="text-sm font-medium">{resumeFile.name}</span>
                          <span className="text-xs text-txtMain0">({(resumeFile.size / 1024).toFixed(0)} KB)</span>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Upload className="w-8 h-8 text-txtMain0 mx-auto" />
                          <p className="text-sm text-txtMain">
                            Drop your resume here or <span className="text-accent">browse files</span>
                          </p>
                          <p className="text-xs text-txtMain0">PDF or DOCX, max 5MB</p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Edit Profile Modal Overlay */}
        <AnimatePresence>
          {isEditingProfile && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsEditingProfile(false)}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              />
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="relative z-10 w-full max-w-lg bg-surface border border-borderSubtle rounded-2xl shadow-2xl overflow-hidden"
              >
                <div className="p-5 border-b border-borderSubtle flex items-center justify-between bg-nested/50">
                  <h3 className="text-lg font-bold text-txtMain flex items-center gap-2">
                    <Edit3 className="w-5 h-5 text-accent" />
                    Edit Candidate Profile
                  </h3>
                  <button onClick={() => setIsEditingProfile(false)} className="w-8 h-8 rounded-lg bg-nested hover:bg-borderSubtle flex items-center justify-center text-txtMuted hover:text-white transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                
                <form onSubmit={handleSaveProfile} className="p-6 space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-semibold text-txtMuted mb-1.5">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        className="w-full bg-main border border-borderStrong focus:border-accent rounded-xl px-4 py-2.5 text-sm text-txtMain outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-txtMuted mb-1.5">Location *</label>
                      <input
                        type="text"
                        required
                        value={editForm.location}
                        onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                        className="w-full bg-main border border-borderStrong focus:border-accent rounded-xl px-4 py-2.5 text-sm text-txtMain outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-txtMuted mb-1.5">Years of Experience</label>
                    <select
                      value={editForm.experienceYears}
                      onChange={(e) => setEditForm({ ...editForm, experienceYears: e.target.value })}
                      className="w-full bg-main border border-borderStrong focus:border-accent rounded-xl px-4 py-2.5 text-sm text-txtMain outline-none transition-colors appearance-none cursor-pointer"
                    >
                      <option value="1">1 year (Entry Level)</option>
                      <option value="3">3 years (Mid Level)</option>
                      <option value="5">5 years (Senior Level)</option>
                      <option value="8">8+ years (Lead / Staff)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-txtMuted mb-1.5">Add Skills</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newSkillInput}
                        onChange={(e) => setNewSkillInput(e.target.value)}
                        onKeyDown={handleAddSkill}
                        placeholder="Type skill name & press Add"
                        className="flex-1 bg-main border border-borderStrong focus:border-accent rounded-xl px-4 py-2.5 text-sm text-txtMain outline-none transition-colors"
                      />
                      <button
                        type="button"
                        onClick={handleAddSkillSubmit}
                        className="px-5 py-2.5 text-sm font-bold text-white bg-nested border border-borderStrong hover:bg-surface rounded-xl transition-colors shrink-0"
                      >
                        + Add
                      </button>
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end gap-3 border-t border-borderSubtle mt-2">
                    <button
                      type="button"
                      onClick={() => setIsEditingProfile(false)}
                      className="px-5 py-2.5 text-sm font-semibold text-txtMain bg-nested hover:bg-surface border border-borderSubtle rounded-xl transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-accent to-indigo-500 rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-accent/20"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </AnimatePresence>
  );
}
