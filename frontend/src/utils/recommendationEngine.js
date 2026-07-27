/**
 * Recommendation Engine for Candidate Profile Matching & Career Suggestions
 */

export const DEFAULT_CANDIDATE_PROFILE = {
  name: 'Alex Rivera',
  headline: 'Senior Frontend Engineer',
  location: 'San Francisco, CA',
  email: 'alex.rivera@example.com',
  avatarInitials: 'AR',
  experienceYears: 8,
  preferredJobTypes: ['FULL_TIME', 'REMOTE', 'HYBRID'],
  preferredRemote: true,
  targetSalary: 180000,
  discoverySource: '',
  professionalStatus: '',
  onboardingCompleted: false,
  skills: [
    { name: 'React', level: 'Expert' },
    { name: 'JavaScript', level: 'Expert' },
    { name: 'TypeScript', level: 'Advanced' },
    { name: 'Node.js', level: 'Advanced' },
    { name: 'Tailwind CSS', level: 'Expert' },
    { name: 'Spring Boot', level: 'Intermediate' },
    { name: 'PostgreSQL', level: 'Advanced' },
    { name: 'Docker', level: 'Intermediate' },
  ],
};

/**
 * Normalizes skill strings for robust matching (e.g. "React.js" -> "react", "Java 21" -> "java")
 */
function normalizeSkill(skillName) {
  if (!skillName) return '';
  return skillName
    .toLowerCase()
    .replace(/\.js$/i, '')
    .replace(/[^a-z0-9#+]/g, '')
    .trim();
}

/**
 * Calculates candidate match score for a job (0 - 100%)
 */
export function calculateJobMatchScore(candidateProfile, job) {
  if (!job || !candidateProfile) {
    return { score: 0, matchedSkills: [], missingSkills: [], breakdown: {} };
  }

  const userSkills = (candidateProfile.skills || []).map((s) => (typeof s === 'string' ? s : s.name));
  const normUserSkills = userSkills.map(normalizeSkill);
  const jobTechStack = job.techStack || [];

  // 1. Skill Overlap (45% Weight)
  const matchedSkills = [];
  const missingSkills = [];

  jobTechStack.forEach((jobSkill) => {
    const normJobSkill = normalizeSkill(jobSkill);
    const hasMatch = normUserSkills.some(
      (normUs) => normUs.includes(normJobSkill) || normJobSkill.includes(normUs)
    );
    if (hasMatch) {
      matchedSkills.push(jobSkill);
    } else {
      missingSkills.push(jobSkill);
    }
  });

  const skillScoreRatio = jobTechStack.length > 0 ? matchedSkills.length / jobTechStack.length : 0.8;
  const skillScore = Math.min(100, Math.round(skillScoreRatio * 100));

  // 2. Role Title Similarity (25% Weight)
  const userRole = (candidateProfile.headline || candidateProfile.role || '').toLowerCase();
  const jobTitle = (job.title || '').toLowerCase();

  let roleScore = 40;
  const roleKeywords = ['frontend', 'backend', 'full stack', 'fullstack', 'platform', 'devops', 'mobile', 'data', 'learning', 'machine learning', 'designer', 'engineer'];
  
  roleKeywords.forEach((kw) => {
    if (userRole.includes(kw) && jobTitle.includes(kw)) {
      roleScore += 30;
    }
  });

  if (userRole.includes('senior') && jobTitle.includes('senior')) roleScore += 15;
  if (userRole.includes('lead') && jobTitle.includes('staff')) roleScore += 15;
  roleScore = Math.min(100, roleScore);

  // 3. Experience Match (15% Weight)
  const candidateExp = candidateProfile.experienceYears || 5;
  let expScore = 70;

  const jobExpStr = (job.experienceLevel || '').toLowerCase();
  if (jobExpStr.includes('entry') && candidateExp <= 3) expScore = 100;
  else if (jobExpStr.includes('mid') && candidateExp >= 3 && candidateExp <= 6) expScore = 100;
  else if (jobExpStr.includes('senior') && candidateExp >= 5) expScore = 100;
  else if (jobExpStr.includes('lead') || jobExpStr.includes('staff')) {
    expScore = candidateExp >= 7 ? 100 : 65;
  }

  // 4. Location & Remote Alignment (15% Weight)
  let locationScore = 60;
  if (job.jobType === 'REMOTE' || job.remoteOnly) {
    locationScore = candidateProfile.preferredRemote ? 100 : 80;
  } else if (job.location && candidateProfile.location) {
    const jobLocCity = job.location.split(',')[0].toLowerCase().trim();
    const candLocCity = candidateProfile.location.split(',')[0].toLowerCase().trim();
    if (jobLocCity === candLocCity) {
      locationScore = 100;
    } else {
      locationScore = 50;
    }
  }

  // Composite Weighted Score
  const compositeScore = Math.round(
    skillScore * 0.45 +
    roleScore * 0.25 +
    expScore * 0.15 +
    locationScore * 0.15
  );

  return {
    score: Math.max(15, Math.min(99, compositeScore)),
    matchedSkills,
    missingSkills,
    breakdown: {
      skillScore,
      roleScore,
      expScore,
      locationScore,
    },
  };
}

/**
 * Analyzes candidate profile against full jobs database to generate tailored profile recommendations & suggestions
 */
export function generateProfileSuggestions(candidateProfile, allJobs = []) {
  if (!candidateProfile || !allJobs.length) {
    return {
      topRecommendations: [],
      topSkillsToLearn: [],
      profileCompletionTips: [],
      averageMatchScore: 0,
    };
  }

  const scoredJobs = allJobs.map((job) => ({
    job,
    match: calculateJobMatchScore(candidateProfile, job),
  })).sort((a, b) => b.match.score - a.match.score);

  // Frequency count of missing skills across top roles
  const skillGapFrequency = {};
  scoredJobs.slice(0, 8).forEach(({ match }) => {
    match.missingSkills.forEach((skill) => {
      skillGapFrequency[skill] = (skillGapFrequency[skill] || 0) + 1;
    });
  });

  const topSkillsToLearn = Object.entries(skillGapFrequency)
    .map(([skill, count]) => ({
      skill,
      count,
      scoreBoost: Math.min(25, count * 6),
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 4);

  // Profile completion & boost suggestions
  const profileCompletionTips = [];
  const userSkillsCount = (candidateProfile.skills || []).length;

  if (userSkillsCount < 6) {
    profileCompletionTips.push({
      title: 'Add more core technical skills',
      description: `You have ${userSkillsCount} skills listed. Adding 3+ additional tools can improve callback rates by up to 24%.`,
      category: 'skills',
    });
  }

  if (topSkillsToLearn.length > 0) {
    const topSkill = topSkillsToLearn[0];
    profileCompletionTips.push({
      title: `High Demand Skill Gap: ${topSkill.skill}`,
      description: `${topSkill.skill} appears in ${topSkill.count} of your top matched positions. Adding it could boost your candidate score by +${topSkill.scoreBoost}%.`,
      category: 'upskill',
    });
  }

  if (!candidateProfile.resumeUploaded) {
    profileCompletionTips.push({
      title: 'Upload ATS-friendly resume',
      description: 'PDF resumes unlock instant automatic ATS parsing and speed up 1-click applications.',
      category: 'resume',
    });
  }

  return {
    topRecommendations: scoredJobs.slice(0, 4),
    topSkillsToLearn,
    profileCompletionTips,
    averageMatchScore: Math.round(
      scoredJobs.reduce((acc, curr) => acc + curr.match.score, 0) / scoredJobs.length
    ),
  };
}
