package com.techjobs.backend.service;

import com.techjobs.backend.dto.JobResponseDTO;
import com.techjobs.backend.dto.RecommendationDTO;
import com.techjobs.backend.entity.Job;
import com.techjobs.backend.repository.JobApplicationRepository;
import com.techjobs.backend.repository.JobRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RecommendationServiceImpl implements RecommendationService {

    private final JobRepository jobRepository;
    private final JobApplicationRepository applicationRepository;

    @Override
    @Transactional(readOnly = true)
    public RecommendationDTO.ProfileSuggestionsResponse generateRecommendations(RecommendationDTO.CandidateProfileRequest profile) {
        List<Job> allJobs = jobRepository.findAll();
        List<String> userSkills = profile.getSkills() != null ? profile.getSkills() : Collections.emptyList();
        List<String> normUserSkills = userSkills.stream().map(String::toLowerCase).collect(Collectors.toList());

        List<RecommendationDTO.JobRecommendationResponse> scored = new ArrayList<>();
        Map<String, Integer> gapCounts = new HashMap<>();

        for (Job job : allJobs) {
            List<String> techStack = job.getTechStack() != null ? job.getTechStack() : Collections.emptyList();
            List<String> matched = new ArrayList<>();
            List<String> missing = new ArrayList<>();

            for (String tech : techStack) {
                String normTech = tech.toLowerCase();
                boolean isMatch = normUserSkills.stream().anyMatch(us -> us.contains(normTech) || normTech.contains(us));
                if (isMatch) {
                    matched.add(tech);
                } else {
                    missing.add(tech);
                    gapCounts.put(tech, gapCounts.getOrDefault(tech, 0) + 1);
                }
            }

            int skillScore = techStack.isEmpty() ? 80 : (int) Math.round(((double) matched.size() / techStack.size()) * 100);
            int matchScore = Math.max(20, Math.min(99, skillScore));

            long appCount = applicationRepository.countByJobId(job.getId());
            JobResponseDTO dto = JobResponseDTO.fromEntity(job, appCount);

            scored.add(RecommendationDTO.JobRecommendationResponse.builder()
                    .job(dto)
                    .matchScore(matchScore)
                    .matchedSkills(matched)
                    .missingSkills(missing)
                    .build());
        }

        scored.sort((a, b) -> Integer.compare(b.getMatchScore(), a.getMatchScore()));

        List<String> topGaps = gapCounts.entrySet().stream()
                .sorted(Map.Entry.<String, Integer>comparingByValue().reversed())
                .limit(4)
                .map(Map.Entry::getKey)
                .collect(Collectors.toList());

        int avgScore = scored.isEmpty() ? 0 : (int) Math.round(scored.stream().mapToInt(RecommendationDTO.JobRecommendationResponse::getMatchScore).average().orElse(0));

        return RecommendationDTO.ProfileSuggestionsResponse.builder()
                .topRecommendations(scored.stream().limit(4).collect(Collectors.toList()))
                .topSkillGaps(topGaps)
                .averageMatchScore(avgScore)
                .build();
    }
}
