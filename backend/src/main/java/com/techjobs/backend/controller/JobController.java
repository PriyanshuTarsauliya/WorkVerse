package com.techjobs.backend.controller;

import com.techjobs.backend.dto.JobApplicationDTO;
import com.techjobs.backend.dto.JobRequestDTO;
import com.techjobs.backend.dto.JobResponseDTO;
import com.techjobs.backend.dto.RecommendationDTO;
import com.techjobs.backend.entity.JobType;
import com.techjobs.backend.service.JobApplicationService;
import com.techjobs.backend.service.JobService;
import com.techjobs.backend.service.RecommendationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/jobs")
@RequiredArgsConstructor
public class JobController {

    private final JobService jobService;
    private final JobApplicationService applicationService;
    private final RecommendationService recommendationService;

    /**
     * GET /api/v1/jobs
     * Fetch job listings with optional query filters: keyword, jobType, location
     */
    @GetMapping
    public ResponseEntity<List<JobResponseDTO>> getAllJobs(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) JobType jobType,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String category
    ) {
        List<JobResponseDTO> jobs = jobService.getAllJobs(keyword, jobType, location, category);
        return ResponseEntity.ok(jobs);
    }

    /**
     * GET /api/v1/jobs/{id}
     * Fetch single job details by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<JobResponseDTO> getJobById(@PathVariable Long id) {
        JobResponseDTO job = jobService.getJobById(id);
        return ResponseEntity.ok(job);
    }

    /**
     * POST /api/v1/jobs
     * Create a new job posting
     */
    @PostMapping
    public ResponseEntity<JobResponseDTO> createJob(@Valid @RequestBody JobRequestDTO requestDTO) {
        JobResponseDTO createdJob = jobService.createJob(requestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdJob);
    }

    /**
     * POST /api/v1/jobs/{id}/apply
     * Submit a job application for a specific job
     */
    @PostMapping("/{id}/apply")
    public ResponseEntity<JobApplicationDTO> applyForJob(
            @PathVariable Long id,
            @Valid @RequestBody JobApplicationDTO applicationDTO
    ) {
        JobApplicationDTO createdApplication = applicationService.applyForJob(id, applicationDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdApplication);
    }

    /**
     * POST /api/v1/jobs/recommendations
     * Calculate profile-based candidate job recommendations & skill suggestions
     */
    @PostMapping("/recommendations")
    public ResponseEntity<RecommendationDTO.ProfileSuggestionsResponse> getRecommendations(
            @RequestBody RecommendationDTO.CandidateProfileRequest profileRequest
    ) {
        RecommendationDTO.ProfileSuggestionsResponse response = recommendationService.generateRecommendations(profileRequest);
        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/v1/jobs/{id}/applications
     * Fetch applications for a specific job
     */
    @GetMapping("/{id}/applications")
    public ResponseEntity<List<JobApplicationDTO>> getApplicationsForJob(@PathVariable Long id) {
        List<JobApplicationDTO> applications = applicationService.getApplicationsForJob(id);
        return ResponseEntity.ok(applications);
    }

    /**
     * DELETE /api/v1/jobs/{id}
     * Delete a job posting
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteJob(@PathVariable Long id) {
        jobService.deleteJob(id);
        return ResponseEntity.noContent().build();
    }
}
