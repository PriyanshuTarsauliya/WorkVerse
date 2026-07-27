package com.techjobs.backend.service;

import com.techjobs.backend.dto.RecommendationDTO;

public interface RecommendationService {
    RecommendationDTO.ProfileSuggestionsResponse generateRecommendations(RecommendationDTO.CandidateProfileRequest profile);
}
