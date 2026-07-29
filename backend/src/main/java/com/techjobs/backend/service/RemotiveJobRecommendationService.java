package com.techjobs.backend.service;

import com.techjobs.backend.dto.CandidateProfileDto;
import com.techjobs.backend.dto.JobMatchResultDto;
import com.techjobs.backend.dto.RemotiveJobDto;
import com.techjobs.backend.dto.RemotiveResponseDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class RemotiveJobRecommendationService {

    private final RestTemplate restTemplate;
    
    // In-memory cache for Remotive API jobs
    private List<RemotiveJobDto> cachedJobs = null;
    private long lastFetchTime = 0;
    private static final long CACHE_TTL_MS = 6 * 60 * 60 * 1000; // 6 hours

    public List<JobMatchResultDto> getRecommendedJobs(CandidateProfileDto profile) {
        List<RemotiveJobDto> jobs = fetchJobsWithCache();
        
        List<JobMatchResultDto> scoredJobs = jobs.stream()
                .map(job -> calculateJobMatchScore(profile, job))
                .sorted((a, b) -> Integer.compare(b.getMatchScore(), a.getMatchScore()))
                .collect(Collectors.toList());
                
        return scoredJobs;
    }

    private synchronized List<RemotiveJobDto> fetchJobsWithCache() {
        long now = System.currentTimeMillis();
        if (cachedJobs != null && (now - lastFetchTime) < CACHE_TTL_MS) {
            return cachedJobs;
        }

        try {
            log.info("Fetching jobs from Remotive API...");
            String url = "https://remotive.com/api/remote-jobs?limit=200";
            RemotiveResponseDto response = restTemplate.getForObject(url, RemotiveResponseDto.class);
            if (response != null && response.getJobs() != null) {
                cachedJobs = response.getJobs();
                lastFetchTime = now;
                log.info("Successfully fetched and cached {} jobs", cachedJobs.size());
            }
        } catch (Exception e) {
            log.error("Failed to fetch jobs from Remotive API", e);
            if (cachedJobs == null) {
                return Collections.emptyList();
            }
        }
        return cachedJobs != null ? cachedJobs : Collections.emptyList();
    }

    private JobMatchResultDto calculateJobMatchScore(CandidateProfileDto candidateProfile, RemotiveJobDto job) {
        if (candidateProfile == null || job == null) {
            return new JobMatchResultDto(job, 0, new ArrayList<>(), new ArrayList<>());
        }

        List<String> normUserSkills = new ArrayList<>();
        if (candidateProfile.getSkills() != null) {
            for (Object skillObj : candidateProfile.getSkills()) {
                String skillName = "";
                if (skillObj instanceof String) {
                    skillName = (String) skillObj;
                } else if (skillObj instanceof Map) {
                    Map<?, ?> map = (Map<?, ?>) skillObj;
                    if (map.containsKey("name")) {
                        skillName = (String) map.get("name");
                    }
                }
                normUserSkills.add(normalizeSkill(skillName));
            }
        }

        List<String> jobTechStack = job.getTags() != null ? job.getTags() : new ArrayList<>();
        List<String> matchedSkills = new ArrayList<>();
        List<String> missingSkills = new ArrayList<>();

        // 1. Skill Overlap (45% Weight)
        for (String jobSkill : jobTechStack) {
            String normJobSkill = normalizeSkill(jobSkill);
            boolean hasMatch = normUserSkills.stream()
                    .anyMatch(normUs -> normUs.contains(normJobSkill) || normJobSkill.contains(normUs));
            if (hasMatch) {
                matchedSkills.add(jobSkill);
            } else {
                missingSkills.add(jobSkill);
            }
        }

        double skillScoreRatio = jobTechStack.size() > 0 ? (double) matchedSkills.size() / jobTechStack.size() : 0.8;
        int skillScore = Math.min(100, (int) Math.round(skillScoreRatio * 100));

        // 2. Role Title Similarity (25% Weight)
        String userRole = (candidateProfile.getHeadline() != null ? candidateProfile.getHeadline() : 
                          (candidateProfile.getRole() != null ? candidateProfile.getRole() : "")).toLowerCase();
        String jobTitle = (job.getTitle() != null ? job.getTitle() : "").toLowerCase();

        int roleScore = 40;
        List<String> roleKeywords = Arrays.asList("frontend", "backend", "full stack", "fullstack", "platform", "devops", "mobile", "data", "learning", "machine learning", "designer", "engineer");

        for (String kw : roleKeywords) {
            if (userRole.contains(kw) && jobTitle.contains(kw)) {
                roleScore += 30;
            }
        }

        if (userRole.contains("senior") && jobTitle.contains("senior")) roleScore += 15;
        if (userRole.contains("lead") && jobTitle.contains("staff")) roleScore += 15;
        roleScore = Math.min(100, roleScore);

        // 3. Experience Match (15% Weight)
        int candidateExp = candidateProfile.getExperienceYears() != null ? candidateProfile.getExperienceYears() : 5;
        int expScore = 70; // Remotive doesn't have experience level explicitly, so we give a base score

        // 4. Calculate Total Match Score
        int totalScore = (int) Math.round((skillScore * 0.45) + (roleScore * 0.40) + (expScore * 0.15));

        return new JobMatchResultDto(job, totalScore, matchedSkills, missingSkills);
    }

    private String normalizeSkill(String skillName) {
        if (skillName == null) return "";
        return skillName.toLowerCase()
                .replaceAll("\\.js$", "")
                .replaceAll("[^a-z0-9#+]", "")
                .trim();
    }
}
