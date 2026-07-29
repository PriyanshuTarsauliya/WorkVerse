package com.techjobs.backend.controller;

import com.techjobs.backend.dto.CandidateProfileDto;
import com.techjobs.backend.dto.JobMatchResultDto;
import com.techjobs.backend.service.RemotiveJobRecommendationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recommendations")
@RequiredArgsConstructor
public class JobRecommendationController {

    private final RemotiveJobRecommendationService recommendationService;

    @PostMapping("/real-jobs")
    public ResponseEntity<List<JobMatchResultDto>> getRealJobsRecommendations(
            @RequestBody CandidateProfileDto candidateProfile) {
        
        List<JobMatchResultDto> recommendedJobs = recommendationService.getRecommendedJobs(candidateProfile);
        return ResponseEntity.ok(recommendedJobs);
    }
}
