package com.techjobs.backend.service;

import com.techjobs.backend.dto.ProfileDTO;

public interface ProfileService {
    ProfileDTO.UserProfileResponse getProfile(Long userId);
    ProfileDTO.UserProfileResponse updateProfile(Long userId, ProfileDTO.UpdateProfileRequest request);
    void grantDPDPConsent(Long userId);
    String exportUserData(Long userId);
    void eraseUserData(Long userId);
}
