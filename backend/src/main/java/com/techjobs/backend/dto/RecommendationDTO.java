package com.techjobs.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

public class RecommendationDTO {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CandidateProfileRequest {
        private String name;
        private String headline;
        private String location;
        private Integer experienceYears;
        private List<String> skills;
        private Boolean preferredRemote;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class JobRecommendationResponse {
        private JobResponseDTO job;
        private Integer matchScore;
        private List<String> matchedSkills;
        private List<String> missingSkills;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ProfileSuggestionsResponse {
        private List<JobRecommendationResponse> topRecommendations;
        private List<String> topSkillGaps;
        private Integer averageMatchScore;
    }
}
