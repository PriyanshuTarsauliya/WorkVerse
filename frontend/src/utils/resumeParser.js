/**
 * Resume Parser — Client-side PDF/DOCX text extraction + heuristic profile parsing
 */
import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

/**
 * Extract raw text from a PDF file using pdfjs-dist
 */
async function extractTextFromPDF(file) {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const pages = [];
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items.map((item) => item.str).join(' ');
    pages.push(pageText);
  }
  return pages.join('\n');
}

/**
 * Extract raw text from a DOCX file using mammoth
 */
async function extractTextFromDOCX(file) {
  const mammoth = await import('mammoth');
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value;
}

/**
 * Heuristic section parser — scans raw text for common resume sections
 */
function parseResumeText(rawText) {
  const lines = rawText.split(/\n/).map((l) => l.trim()).filter(Boolean);
  const fullText = rawText;

  // ─── Email ───
  const emailMatch = fullText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const email = emailMatch ? emailMatch[0] : '';

  // ─── Phone ───
  const phoneMatch = fullText.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4}/);
  const phone = phoneMatch ? phoneMatch[0].trim() : '';

  // ─── Name ───
  // First non-trivial line that doesn't look like an address or email
  let name = '';
  for (const line of lines.slice(0, 5)) {
    const clean = line.replace(/[^a-zA-Z\s.]/g, '').trim();
    if (
      clean.length >= 3 &&
      clean.length <= 50 &&
      !clean.includes('@') &&
      !/^\d/.test(line) &&
      !/(summary|objective|profile|resume|curriculum|vitae)/i.test(clean)
    ) {
      name = clean;
      break;
    }
  }

  // ─── Section detection ───
  const sectionHeaders = {
    skills: /^(technical\s+)?skills|^core\s+competencies|^technologies/i,
    experience: /^(work\s+)?experience|^employment|^work\s+history|^professional\s+experience/i,
    education: /^education|^academic|^qualifications/i,
    projects: /^projects|^personal\s+projects/i,
    certifications: /^certif/i,
  };

  const sections = {};
  let currentSection = null;
  let currentContent = [];

  for (const line of lines) {
    let matchedSection = null;
    for (const [key, regex] of Object.entries(sectionHeaders)) {
      if (regex.test(line) && line.length < 60) {
        matchedSection = key;
        break;
      }
    }

    if (matchedSection) {
      if (currentSection) {
        sections[currentSection] = currentContent.join('\n');
      }
      currentSection = matchedSection;
      currentContent = [];
    } else if (currentSection) {
      currentContent.push(line);
    }
  }
  if (currentSection) {
    sections[currentSection] = currentContent.join('\n');
  }

  // ─── Skills extraction ───
  const skills = [];
  if (sections.skills) {
    // Split by common delimiters: commas, bullets, pipes, newlines
    const rawSkills = sections.skills
      .split(/[,|•·●▪■►\n]/)
      .map((s) => s.replace(/[-–—:]/g, '').trim())
      .filter((s) => s.length >= 2 && s.length <= 40 && !/^\d+$/.test(s));
    
    rawSkills.forEach((s) => {
      // Avoid duplicates (case-insensitive)
      if (!skills.some((existing) => existing.toLowerCase() === s.toLowerCase())) {
        skills.push(s);
      }
    });
  }

  // ─── Experience extraction ───
  const experience = [];
  if (sections.experience) {
    const expLines = sections.experience.split('\n').filter(Boolean);
    let currentExp = null;

    for (const line of expLines) {
      // Detect date ranges like "Jan 2020 — Present", "2019-2022", "Jun 2016 - Dec 2019"
      const dateMatch = line.match(
        /((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{4}|20\d{2}|19\d{2})\s*[-–—to]+\s*((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{4}|20\d{2}|19\d{2}|[Pp]resent|[Cc]urrent)/i
      );

      if (dateMatch) {
        if (currentExp) experience.push(currentExp);
        currentExp = {
          period: dateMatch[0],
          role: line.replace(dateMatch[0], '').replace(/[|,]/g, '').trim(),
          company: '',
          bullets: [],
          current: /present|current/i.test(dateMatch[2]),
        };
      } else if (currentExp) {
        if (!currentExp.company && line.length < 60 && !line.startsWith('•') && !line.startsWith('-')) {
          currentExp.company = line;
        } else {
          const bullet = line.replace(/^[•\-–—►▪■]\s*/, '').trim();
          if (bullet.length > 10) {
            currentExp.bullets.push(bullet);
          }
        }
      }
    }
    if (currentExp) experience.push(currentExp);
  }

  // ─── Education extraction ───
  const education = [];
  if (sections.education) {
    const eduLines = sections.education.split('\n').filter(Boolean);
    let currentEdu = null;

    for (const line of eduLines) {
      const degreeMatch = line.match(
        /(B\.?S\.?|B\.?A\.?|M\.?S\.?|M\.?A\.?|B\.?Tech|M\.?Tech|B\.?E\.?|M\.?E\.?|Ph\.?D\.?|MBA|Bachelor|Master|Associate|Diploma)/i
      );
      const yearMatch = line.match(/(20\d{2}|19\d{2})/);

      if (degreeMatch) {
        if (currentEdu) education.push(currentEdu);
        currentEdu = {
          degree: line.trim(),
          institution: '',
          period: yearMatch ? yearMatch[0] : '',
        };
      } else if (currentEdu && !currentEdu.institution && line.length > 5) {
        currentEdu.institution = line.trim();
        if (!currentEdu.period && yearMatch) {
          currentEdu.period = yearMatch[0];
        }
      }
    }
    if (currentEdu) education.push(currentEdu);
  }

  // ─── Experience years estimation ───
  let experienceYears = 0;
  if (experience.length > 0) {
    const years = [];
    experience.forEach((exp) => {
      const matches = exp.period.match(/(20\d{2}|19\d{2})/g);
      if (matches) years.push(...matches.map(Number));
    });
    if (years.length >= 2) {
      experienceYears = Math.max(...years) - Math.min(...years);
    }
    // If "Present" is involved, use current year
    if (experience.some((e) => e.current)) {
      const minYear = Math.min(...years);
      experienceYears = new Date().getFullYear() - minYear;
    }
  }

  // ─── Headline / Role guess ───
  let headline = '';
  if (experience.length > 0 && experience[0].role) {
    headline = experience[0].role;
  }

  return {
    name,
    email,
    phone,
    headline,
    skills: skills.slice(0, 20), // cap at 20
    experience,
    education,
    experienceYears: Math.min(30, experienceYears),
  };
}

/**
 * Main entry — accepts a File object, returns a parsed profile
 */
export async function parseResumeFile(file) {
  if (!file) throw new Error('No file provided');

  const fileName = file.name.toLowerCase();
  let rawText = '';

  if (fileName.endsWith('.pdf')) {
    rawText = await extractTextFromPDF(file);
  } else if (fileName.endsWith('.docx')) {
    rawText = await extractTextFromDOCX(file);
  } else {
    throw new Error('Unsupported file format. Please upload a PDF or DOCX file.');
  }

  if (!rawText || rawText.trim().length < 20) {
    throw new Error('Could not extract text from the file. The file may be image-based or empty.');
  }

  return parseResumeText(rawText);
}
