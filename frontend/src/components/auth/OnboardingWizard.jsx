import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload, FileText, CheckCircle, ChevronRight, ChevronLeft, X, Sparkles,
  MapPin, Briefcase, GraduationCap, User, Search, Users, Globe, Megaphone,
  Newspaper, MessageCircle, Loader2, AlertCircle, Edit3, Plus, Trash2,
} from 'lucide-react';
import { parseResumeFile } from '../../utils/resumeParser';

const DISCOVERY_OPTIONS = [
  { id: 'search', label: 'Search Engine (Google, Bing)', icon: Search },
  { id: 'social', label: 'Social Media (LinkedIn, Twitter)', icon: Globe },
  { id: 'friend', label: 'Friend / Colleague Referral', icon: Users },
  { id: 'ads', label: 'Online Advertisement', icon: Megaphone },
  { id: 'news', label: 'Tech Blog / News Article', icon: Newspaper },
  { id: 'community', label: 'Community / Forum', icon: MessageCircle },
];

const PROFESSION_OPTIONS = [
  { id: 'job_seeker', label: 'Actively Job Seeking', icon: Briefcase, desc: 'Looking for my next full-time role' },
  { id: 'student', label: 'Student / Fresh Graduate', icon: GraduationCap, desc: 'Exploring internships & entry-level roles' },
  { id: 'career_switch', label: 'Career Switcher', icon: Edit3, desc: 'Transitioning into a new field' },
  { id: 'freelancer', label: 'Freelancer / Contractor', icon: User, desc: 'Looking for contract & project-based work' },
  { id: 'passive', label: 'Passively Exploring', icon: Search, desc: 'Not actively looking but open to offers' },
];

const STEP_TITLES = [
  'Tell us about yourself',
  'Upload your resume',
  'Review your profile',
  'You\'re all set!',
];

const slideVariants = {
  enter: (direction) => ({ x: direction > 0 ? 80 : -80, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction) => ({ x: direction > 0 ? -80 : 80, opacity: 0 }),
};

export default function OnboardingWizard({ isOpen, onComplete, userName }) {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);

  // Step 1 — Discovery
  const [discoverySource, setDiscoverySource] = useState('');
  const [professionalStatus, setProfessionalStatus] = useState('');

  // Step 2 — Resume Upload
  const [resumeFile, setResumeFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [parseError, setParseError] = useState('');

  // Step 3 — Parsed Profile (editable)
  const [parsedProfile, setParsedProfile] = useState({
    name: userName || '',
    email: '',
    headline: '',
    location: '',
    experienceYears: 0,
    skills: [],
    experience: [],
    education: [],
  });
  const [newSkillInput, setNewSkillInput] = useState('');

  if (!isOpen) return null;

  const goNext = () => { setDirection(1); setStep((s) => Math.min(3, s + 1)); };
  const goBack = () => { setDirection(-1); setStep((s) => Math.max(0, s - 1)); };

  const canProceedStep0 = discoverySource && professionalStatus;

  // ─── Resume handlers ───
  const handleFileDrop = async (file) => {
    if (!file) return;
    const ext = file.name.split('.').pop().toLowerCase();
    if (!['pdf', 'docx'].includes(ext)) {
      setParseError('Please upload a PDF or DOCX file.');
      return;
    }

    setResumeFile(file);
    setIsParsing(true);
    setParseError('');

    try {
      const parsed = await parseResumeFile(file);
      setParsedProfile((prev) => ({
        ...prev,
        name: parsed.name || prev.name || userName || '',
        email: parsed.email || prev.email || '',
        headline: parsed.headline || prev.headline || '',
        experienceYears: parsed.experienceYears || prev.experienceYears || 0,
        skills: parsed.skills.length > 0 ? parsed.skills.map((s) => ({ name: s, level: 'Intermediate' })) : prev.skills,
        experience: parsed.experience.length > 0 ? parsed.experience : prev.experience,
        education: parsed.education.length > 0 ? parsed.education : prev.education,
      }));
      setIsParsing(false);
      // Auto-advance to review
      setTimeout(() => { setDirection(1); setStep(2); }, 600);
    } catch (err) {
      setIsParsing(false);
      setParseError(err.message || 'Failed to parse resume. You can fill in details manually.');
      // Still advance to review with whatever we have
      setTimeout(() => { setDirection(1); setStep(2); }, 1500);
    }
  };

  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.[0]) handleFileDrop(e.dataTransfer.files[0]);
  };

  // ─── Skills editor ───
  const addSkill = () => {
    const name = newSkillInput.trim();
    if (name && !parsedProfile.skills.some((s) => s.name.toLowerCase() === name.toLowerCase())) {
      setParsedProfile((prev) => ({
        ...prev,
        skills: [...prev.skills, { name, level: 'Intermediate' }],
      }));
      setNewSkillInput('');
    }
  };
  const removeSkill = (skillName) => {
    setParsedProfile((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s.name !== skillName),
    }));
  };

  // ─── Final submit ───
  const handleComplete = () => {
    const profileData = {
      ...parsedProfile,
      discoverySource,
      professionalStatus,
      onboardingCompleted: true,
      resumeUploaded: !!resumeFile,
      avatarInitials: (parsedProfile.name || userName || 'U').substring(0, 2).toUpperCase(),
      profileCompletion: resumeFile ? 85 : 50,
    };
    onComplete?.(profileData);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[70] flex items-center justify-center p-4" data-testid="onboarding-wizard">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/70 backdrop-blur-md"
        />

        {/* Wizard Card */}
        <motion.div
          initial={{ scale: 0.92, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 28, stiffness: 200 }}
          className="relative z-10 w-full max-w-2xl bg-surface border border-borderSubtle rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* ── Header ── */}
          <div className="px-6 pt-5 pb-4 border-b border-borderSubtle bg-nested/30">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-accent to-indigo-500 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-accent/20">
                  W
                </div>
                <div>
                  <h2 className="text-lg font-bold text-txtMain">Welcome to WorkVerse</h2>
                  <p className="text-xs text-txtMuted">Let's set up your profile in 2 minutes</p>
                </div>
              </div>
              {step < 3 && (
                <span className="text-xs font-semibold text-txtMuted bg-nested border border-borderSubtle rounded-full px-3 py-1">
                  Step {step + 1} of 4
                </span>
              )}
            </div>

            {/* Progress Bar */}
            <div className="flex gap-1.5">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`h-1 rounded-full flex-1 transition-all duration-500 ${
                    i <= step ? 'bg-accent' : 'bg-nested'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* ── Step Content ── */}
          <div className="flex-1 overflow-y-auto p-6">
            <AnimatePresence mode="wait" custom={direction}>
              {/* ════ Step 0: Discovery Questions ════ */}
              {step === 0 && (
                <motion.div
                  key="step-0"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.25 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-base font-bold text-txtMain mb-1">{STEP_TITLES[0]}</h3>
                    <p className="text-sm text-txtMuted">Help us personalize your experience</p>
                  </div>

                  {/* Discovery Source */}
                  <div>
                    <label className="block text-xs font-semibold text-txtMuted mb-2.5">How did you hear about WorkVerse?</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {DISCOVERY_OPTIONS.map((opt) => (
                        <button
                          key={opt.id}
                          type="button"
                          data-testid={`discovery-${opt.id}`}
                          onClick={() => setDiscoverySource(opt.id)}
                          className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                            discoverySource === opt.id
                              ? 'bg-accent/10 border-accent/40 text-accent shadow-sm'
                              : 'bg-nested border-borderSubtle text-txtMuted hover:border-borderStrong hover:bg-surface'
                          }`}
                        >
                          <opt.icon className="w-4 h-4 shrink-0" />
                          <span className="text-xs font-medium leading-tight">{opt.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Professional Status */}
                  <div>
                    <label className="block text-xs font-semibold text-txtMuted mb-2.5">What best describes you?</label>
                    <div className="space-y-2">
                      {PROFESSION_OPTIONS.map((opt) => (
                        <button
                          key={opt.id}
                          type="button"
                          data-testid={`profession-${opt.id}`}
                          onClick={() => setProfessionalStatus(opt.id)}
                          className={`w-full p-3.5 rounded-xl border text-left flex items-center gap-3 transition-all ${
                            professionalStatus === opt.id
                              ? 'bg-accent/10 border-accent/40 shadow-sm'
                              : 'bg-nested border-borderSubtle hover:border-borderStrong hover:bg-surface'
                          }`}
                        >
                          <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                            professionalStatus === opt.id ? 'bg-accent/20 text-accent' : 'bg-surface text-txtMuted'
                          }`}>
                            <opt.icon className="w-4.5 h-4.5" />
                          </div>
                          <div>
                            <span className={`text-sm font-semibold block ${professionalStatus === opt.id ? 'text-txtMain' : 'text-txtMain'}`}>
                              {opt.label}
                            </span>
                            <span className="text-[11px] text-txtMuted">{opt.desc}</span>
                          </div>
                          {professionalStatus === opt.id && (
                            <CheckCircle className="w-5 h-5 text-accent ml-auto shrink-0" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ════ Step 1: Resume Upload ════ */}
              {step === 1 && (
                <motion.div
                  key="step-1"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.25 }}
                  className="space-y-5"
                >
                  <div>
                    <h3 className="text-base font-bold text-txtMain mb-1">{STEP_TITLES[1]}</h3>
                    <p className="text-sm text-txtMuted">
                      We'll auto-extract your skills, experience, and education to save you time
                    </p>
                  </div>

                  {/* Drop Zone */}
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all ${
                      isParsing
                        ? 'border-accent/50 bg-accent/5'
                        : isDragging
                          ? 'border-accent bg-accent/10 scale-[1.01]'
                          : resumeFile && !parseError
                            ? 'border-emerald-500/40 bg-emerald-500/5'
                            : 'border-borderStrong bg-nested hover:border-accent/40 hover:bg-surface'
                    }`}
                  >
                    <input
                      type="file"
                      id="onboarding-resume-input"
                      accept=".pdf,.docx"
                      onChange={(e) => e.target.files?.[0] && handleFileDrop(e.target.files[0])}
                      className="hidden"
                    />
                    <label htmlFor="onboarding-resume-input" className="cursor-pointer block">
                      {isParsing ? (
                        <div className="flex flex-col items-center gap-3">
                          <Loader2 className="w-10 h-10 text-accent animate-spin" />
                          <p className="text-sm font-semibold text-accent">Parsing your resume...</p>
                          <p className="text-xs text-txtMuted">Extracting skills, experience & education</p>
                        </div>
                      ) : resumeFile && !parseError ? (
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                            <CheckCircle className="w-7 h-7 text-emerald-400" />
                          </div>
                          <p className="text-sm font-semibold text-emerald-400">{resumeFile.name}</p>
                          <p className="text-xs text-txtMuted">{(resumeFile.size / 1024).toFixed(0)} KB — Successfully parsed!</p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-16 h-16 rounded-2xl bg-nested border border-borderSubtle flex items-center justify-center">
                            <Upload className="w-8 h-8 text-txtMuted" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-txtMain">
                              Drop your resume here or <span className="text-accent">browse files</span>
                            </p>
                            <p className="text-xs text-txtMuted mt-1">PDF or DOCX, max 5 MB</p>
                          </div>
                        </div>
                      )}
                    </label>
                  </div>

                  {parseError && (
                    <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <p className="text-xs text-amber-400">{parseError}</p>
                    </div>
                  )}

                  {/* Skip option */}
                  <button
                    onClick={() => { setDirection(1); setStep(2); }}
                    className="w-full text-center text-xs text-txtMuted hover:text-txtMain transition-colors py-2"
                  >
                    Skip for now — I'll fill in my details manually
                  </button>
                </motion.div>
              )}

              {/* ════ Step 2: Review & Edit ════ */}
              {step === 2 && (
                <motion.div
                  key="step-2"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.25 }}
                  className="space-y-5"
                >
                  <div>
                    <h3 className="text-base font-bold text-txtMain mb-1">{STEP_TITLES[2]}</h3>
                    <p className="text-sm text-txtMuted">
                      {resumeFile ? 'We extracted the following from your resume. Review and edit if needed.' : 'Fill in your details to get personalized job matches.'}
                    </p>
                  </div>

                  <div className="space-y-4">
                    {/* Name + Headline */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-txtMuted mb-1.5">Full Name</label>
                        <input
                          type="text"
                          data-testid="onboarding-name"
                          value={parsedProfile.name}
                          onChange={(e) => setParsedProfile((p) => ({ ...p, name: e.target.value }))}
                          placeholder="Your full name"
                          className="w-full bg-main border border-borderStrong focus:border-accent rounded-xl px-4 py-2.5 text-sm text-txtMain outline-none transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-txtMuted mb-1.5">Headline / Role</label>
                        <input
                          type="text"
                          data-testid="onboarding-headline"
                          value={parsedProfile.headline}
                          onChange={(e) => setParsedProfile((p) => ({ ...p, headline: e.target.value }))}
                          placeholder="e.g. Senior Frontend Engineer"
                          className="w-full bg-main border border-borderStrong focus:border-accent rounded-xl px-4 py-2.5 text-sm text-txtMain outline-none transition-colors"
                        />
                      </div>
                    </div>

                    {/* Location + Experience */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-txtMuted mb-1.5">Location</label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-txtMuted opacity-60" />
                          <input
                            type="text"
                            data-testid="onboarding-location"
                            value={parsedProfile.location}
                            onChange={(e) => setParsedProfile((p) => ({ ...p, location: e.target.value }))}
                            placeholder="e.g. Bengaluru, India"
                            className="w-full bg-main border border-borderStrong focus:border-accent rounded-xl pl-10 pr-4 py-2.5 text-sm text-txtMain outline-none transition-colors"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-txtMuted mb-1.5">Years of Experience</label>
                        <select
                          data-testid="onboarding-experience"
                          value={parsedProfile.experienceYears}
                          onChange={(e) => setParsedProfile((p) => ({ ...p, experienceYears: Number(e.target.value) }))}
                          className="w-full bg-main border border-borderStrong focus:border-accent rounded-xl px-4 py-2.5 text-sm text-txtMain outline-none transition-colors appearance-none cursor-pointer"
                        >
                          <option value="0">0 — Fresh Graduate</option>
                          <option value="1">1 year</option>
                          <option value="2">2 years</option>
                          <option value="3">3 years</option>
                          <option value="5">5 years</option>
                          <option value="8">8+ years</option>
                          <option value="10">10+ years</option>
                        </select>
                      </div>
                    </div>

                    {/* Skills */}
                    <div>
                      <label className="block text-xs font-semibold text-txtMuted mb-1.5">
                        Skills {parsedProfile.skills.length > 0 && <span className="text-accent">({parsedProfile.skills.length} detected)</span>}
                      </label>
                      <div className="bg-main border border-borderSubtle rounded-xl p-3 space-y-2.5">
                        <div className="flex flex-wrap gap-2">
                          {parsedProfile.skills.map((skill, i) => (
                            <span
                              key={i}
                              className="flex items-center gap-1.5 bg-surface border border-borderStrong text-txtMain text-xs px-2.5 py-1.5 rounded-lg"
                            >
                              {typeof skill === 'string' ? skill : skill.name}
                              <button onClick={() => removeSkill(typeof skill === 'string' ? skill : skill.name)} className="hover:text-rose-400 transition-colors">
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          ))}
                          {parsedProfile.skills.length === 0 && (
                            <span className="text-xs text-txtMuted italic">No skills detected — add some below</span>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={newSkillInput}
                            onChange={(e) => setNewSkillInput(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }}
                            placeholder="Add a skill (e.g. React, Python)"
                            className="flex-1 bg-transparent text-xs text-txtMain focus:outline-none px-2 py-1.5"
                          />
                          <button
                            type="button"
                            onClick={addSkill}
                            className="px-3 py-1.5 text-xs font-bold text-txtMain bg-nested border border-borderStrong hover:bg-surface rounded-lg transition-colors shrink-0 flex items-center gap-1"
                          >
                            <Plus className="w-3 h-3" /> Add
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Experience Preview (if parsed) */}
                    {parsedProfile.experience.length > 0 && (
                      <div>
                        <label className="block text-xs font-semibold text-txtMuted mb-1.5">Experience Extracted</label>
                        <div className="space-y-2">
                          {parsedProfile.experience.slice(0, 3).map((exp, i) => (
                            <div key={i} className="bg-main border border-borderSubtle rounded-xl p-3 flex items-start gap-3">
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${exp.current ? 'bg-accent/20 text-accent' : 'bg-nested text-txtMuted'}`}>
                                <Briefcase className="w-4 h-4" />
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-semibold text-txtMain truncate">{exp.role || 'Role'}</p>
                                <p className="text-xs text-txtMuted truncate">{exp.company || 'Company'} · {exp.period}</p>
                              </div>
                              {exp.current && (
                                <span className="ml-auto px-2 py-0.5 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-md shrink-0">
                                  Current
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Education Preview (if parsed) */}
                    {parsedProfile.education.length > 0 && (
                      <div>
                        <label className="block text-xs font-semibold text-txtMuted mb-1.5">Education Extracted</label>
                        <div className="space-y-2">
                          {parsedProfile.education.slice(0, 2).map((edu, i) => (
                            <div key={i} className="bg-main border border-borderSubtle rounded-xl p-3 flex items-start gap-3">
                              <div className="w-8 h-8 rounded-lg bg-nested text-txtMuted flex items-center justify-center shrink-0">
                                <GraduationCap className="w-4 h-4" />
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-semibold text-txtMain truncate">{edu.degree}</p>
                                <p className="text-xs text-txtMuted truncate">{edu.institution} {edu.period && `· ${edu.period}`}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* ════ Step 3: Success ════ */}
              {step === 3 && (
                <motion.div
                  key="step-3"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.25 }}
                  className="flex flex-col items-center justify-center py-8 text-center space-y-5"
                >
                  {/* Animated checkmark */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', damping: 12, stiffness: 200, delay: 0.15 }}
                    className="w-20 h-20 rounded-full bg-gradient-to-tr from-emerald-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/30"
                  >
                    <CheckCircle className="w-10 h-10 text-white" />
                  </motion.div>

                  <div>
                    <h3 className="text-xl font-bold text-txtMain mb-1.5">{STEP_TITLES[3]}</h3>
                    <p className="text-sm text-txtMuted max-w-sm mx-auto">
                      Your profile is ready. We'll use your skills and preferences to recommend the best matching jobs.
                    </p>
                  </div>

                  {/* Quick stats */}
                  <div className="flex items-center gap-6 py-3">
                    {[
                      { label: 'Skills', value: parsedProfile.skills.length, color: 'text-accent' },
                      { label: 'Experience', value: `${parsedProfile.experienceYears}yr`, color: 'text-emerald-400' },
                      { label: 'Resume', value: resumeFile ? '✓' : '—', color: resumeFile ? 'text-emerald-400' : 'text-txtMuted' },
                    ].map((stat, i) => (
                      <div key={i} className="text-center">
                        <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
                        <p className="text-[11px] text-txtMuted">{stat.label}</p>
                      </div>
                    ))}
                  </div>

                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    onClick={handleComplete}
                    data-testid="onboarding-finish"
                    className="px-8 py-3 text-sm font-bold text-white bg-gradient-to-r from-accent to-indigo-500 rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-accent/20 flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    Explore Jobs
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ── Footer Navigation ── */}
          {step < 3 && (
            <div className="px-6 py-4 border-t border-borderSubtle bg-nested/30 flex items-center justify-between">
              <button
                onClick={step === 0 ? undefined : goBack}
                disabled={step === 0}
                className={`flex items-center gap-1 px-4 py-2 text-xs font-semibold rounded-xl transition-colors ${
                  step === 0
                    ? 'text-txtMuted/40 cursor-not-allowed'
                    : 'text-txtMain bg-nested border border-borderSubtle hover:bg-surface'
                }`}
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                Back
              </button>

              <button
                onClick={step === 2 ? () => { goNext(); } : goNext}
                disabled={step === 0 && !canProceedStep0}
                className={`flex items-center gap-1.5 px-5 py-2 text-xs font-bold rounded-xl transition-all ${
                  (step === 0 && !canProceedStep0)
                    ? 'bg-nested text-txtMuted/50 cursor-not-allowed border border-borderSubtle'
                    : 'text-white bg-gradient-to-r from-accent to-indigo-500 hover:opacity-90 shadow-lg shadow-accent/20'
                }`}
              >
                {step === 2 ? 'Finish Setup' : 'Continue'}
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
