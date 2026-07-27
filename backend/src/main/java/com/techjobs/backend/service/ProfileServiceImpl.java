package com.techjobs.backend.service;

import com.techjobs.backend.dto.ProfileDTO;
import com.techjobs.backend.entity.CandidateProfile;
import com.techjobs.backend.entity.User;
import com.techjobs.backend.exception.ResourceNotFoundException;
import com.techjobs.backend.repository.CandidateProfileRepository;
import com.techjobs.backend.repository.UserRepository;
import com.techjobs.backend.repository.BookmarkRepository;
import com.techjobs.backend.repository.JobAlertRepository;
import com.techjobs.backend.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class ProfileServiceImpl implements ProfileService {

    private final UserRepository userRepository;
    private final CandidateProfileRepository profileRepository;
    private final BookmarkRepository bookmarkRepository;
    private final JobAlertRepository alertRepository;
    private final NotificationRepository notificationRepository;

    @Override
    @Transactional(readOnly = true)
    public ProfileDTO.UserProfileResponse getProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        CandidateProfile profile = profileRepository.findByUserId(userId).orElse(null);
        return ProfileDTO.UserProfileResponse.fromUser(user, profile);
    }

    @Override
    @Transactional
    public ProfileDTO.UserProfileResponse updateProfile(Long userId, ProfileDTO.UpdateProfileRequest req) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        // Update user fields
        if (req.getName() != null) user.setName(req.getName());
        if (req.getPhone() != null) user.setPhone(req.getPhone());
        if (req.getHeadline() != null) user.setHeadline(req.getHeadline());
        if (req.getLocation() != null) user.setLocation(req.getLocation());
        if (req.getExperienceYears() != null) user.setExperienceYears(req.getExperienceYears());
        if (req.getSkills() != null) user.setSkills(req.getSkills());
        if (req.getPreferredRemote() != null) user.setPreferredRemote(req.getPreferredRemote());
        userRepository.save(user);

        // Update or create candidate profile
        CandidateProfile profile = profileRepository.findByUserId(userId)
                .orElse(CandidateProfile.builder().userId(userId).build());

        if (req.getBio() != null) profile.setBio(req.getBio());
        if (req.getEducation() != null) profile.setEducation(req.getEducation());
        if (req.getWorkExperience() != null) profile.setWorkExperience(req.getWorkExperience());
        if (req.getCertifications() != null) profile.setCertifications(req.getCertifications());
        if (req.getLinkedinUrl() != null) profile.setLinkedinUrl(req.getLinkedinUrl());
        if (req.getGithubUrl() != null) profile.setGithubUrl(req.getGithubUrl());
        if (req.getPortfolioUrl() != null) profile.setPortfolioUrl(req.getPortfolioUrl());
        if (req.getExpectedSalaryMin() != null) profile.setExpectedSalaryMin(req.getExpectedSalaryMin());
        if (req.getExpectedSalaryMax() != null) profile.setExpectedSalaryMax(req.getExpectedSalaryMax());
        if (req.getNoticePeriodDays() != null) profile.setNoticePeriodDays(req.getNoticePeriodDays());
        if (req.getPreferredLocations() != null) profile.setPreferredLocations(req.getPreferredLocations());
        if (req.getPreferredCategories() != null) profile.setPreferredCategories(req.getPreferredCategories());
        profileRepository.save(profile);

        return ProfileDTO.UserProfileResponse.fromUser(user, profile);
    }

    @Override
    @Transactional
    public void grantDPDPConsent(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        user.setDpdpConsentGiven(true);
        user.setDpdpConsentDate(LocalDateTime.now());
        userRepository.save(user);
    }

    @Override
    @Transactional(readOnly = true)
    public String exportUserData(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        CandidateProfile profile = profileRepository.findByUserId(userId).orElse(null);

        StringBuilder sb = new StringBuilder();
        sb.append("{\n");
        sb.append("  \"user\": {\n");
        sb.append("    \"id\": ").append(user.getId()).append(",\n");
        sb.append("    \"name\": \"").append(user.getName()).append("\",\n");
        sb.append("    \"email\": \"").append(user.getEmail()).append("\",\n");
        sb.append("    \"phone\": \"").append(user.getPhone() != null ? user.getPhone() : "").append("\",\n");
        sb.append("    \"headline\": \"").append(user.getHeadline() != null ? user.getHeadline() : "").append("\",\n");
        sb.append("    \"location\": \"").append(user.getLocation() != null ? user.getLocation() : "").append("\",\n");
        sb.append("    \"skills\": ").append(user.getSkills()).append(",\n");
        sb.append("    \"kycVerified\": ").append(user.getKycVerified()).append("\n");
        sb.append("  }");
        if (profile != null) {
            sb.append(",\n  \"candidateProfile\": {\n");
            sb.append("    \"bio\": \"").append(profile.getBio() != null ? profile.getBio() : "").append("\",\n");
            sb.append("    \"education\": \"").append(profile.getEducation() != null ? profile.getEducation() : "").append("\"\n");
            sb.append("  }");
        }
        sb.append("\n}");
        return sb.toString();
    }

    @Override
    @Transactional
    public void eraseUserData(Long userId) {
        profileRepository.findByUserId(userId).ifPresent(profileRepository::delete);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        user.setName("Deleted User");
        user.setPhone(null);
        user.setHeadline(null);
        user.setLocation(null);
        user.setExperienceYears(null);
        user.setSkills(java.util.List.of());
        user.setResumeUrl(null);
        user.setAvatarUrl(null);
        user.setKycToken(null);
        user.setDpdpConsentGiven(false);
        userRepository.save(user);
    }
}
