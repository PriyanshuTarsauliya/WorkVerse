package com.techjobs.backend.dto;

import com.techjobs.backend.entity.CandidateProfile;
import com.techjobs.backend.entity.User;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

public class ProfileDTO {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserProfileResponse {
        private Long id;
        private String email;
        private String name;
        private String role;
        private String phone;
        private String headline;
        private String location;
        private Integer experienceYears;
        private List<String> skills;
        private Boolean preferredRemote;
        private String resumeUrl;
        private String avatarUrl;
        private Boolean kycVerified;
        private Boolean dpdpConsentGiven;
        private LocalDateTime dpdpConsentDate;
        private CandidateProfileResponse candidateProfile;

        public static UserProfileResponse fromUser(User user, CandidateProfile profile) {
            UserProfileResponseBuilder builder = UserProfileResponse.builder()
                    .id(user.getId())
                    .email(user.getEmail())
                    .name(user.getName())
                    .role(user.getRole())
                    .phone(user.getPhone())
                    .headline(user.getHeadline())
                    .location(user.getLocation())
                    .experienceYears(user.getExperienceYears())
                    .skills(user.getSkills())
                    .preferredRemote(user.getPreferredRemote())
                    .resumeUrl(user.getResumeUrl())
                    .avatarUrl(user.getAvatarUrl())
                    .kycVerified(user.getKycVerified())
                    .dpdpConsentGiven(user.getDpdpConsentGiven())
                    .dpdpConsentDate(user.getDpdpConsentDate());

            if (profile != null) {
                builder.candidateProfile(CandidateProfileResponse.fromEntity(profile));
            }
            return builder.build();
        }
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UpdateProfileRequest {
        private String name;
        private String phone;
        private String headline;
        private String location;
        private Integer experienceYears;
        private List<String> skills;
        private Boolean preferredRemote;
        private String bio;
        private String education;
        private String workExperience;
        private String certifications;
        private String linkedinUrl;
        private String githubUrl;
        private String portfolioUrl;
        private Long expectedSalaryMin;
        private Long expectedSalaryMax;
        private Integer noticePeriodDays;
        private List<String> preferredLocations;
        private List<String> preferredCategories;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CandidateProfileResponse {
        private String bio;
        private String education;
        private String workExperience;
        private String certifications;
        private String linkedinUrl;
        private String githubUrl;
        private String portfolioUrl;
        private Long expectedSalaryMin;
        private Long expectedSalaryMax;
        private Integer noticePeriodDays;
        private List<String> preferredLocations;
        private List<String> preferredCategories;

        public static CandidateProfileResponse fromEntity(CandidateProfile p) {
            return CandidateProfileResponse.builder()
                    .bio(p.getBio())
                    .education(p.getEducation())
                    .workExperience(p.getWorkExperience())
                    .certifications(p.getCertifications())
                    .linkedinUrl(p.getLinkedinUrl())
                    .githubUrl(p.getGithubUrl())
                    .portfolioUrl(p.getPortfolioUrl())
                    .expectedSalaryMin(p.getExpectedSalaryMin())
                    .expectedSalaryMax(p.getExpectedSalaryMax())
                    .noticePeriodDays(p.getNoticePeriodDays())
                    .preferredLocations(p.getPreferredLocations())
                    .preferredCategories(p.getPreferredCategories())
                    .build();
        }
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DPDPConsentRequest {
        private Boolean consentGiven;
    }
}
