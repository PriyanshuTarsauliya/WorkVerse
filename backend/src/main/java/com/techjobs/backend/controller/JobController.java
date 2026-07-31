package com.techjobs.backend.controller;

import com.techjobs.backend.dto.*;
import com.techjobs.backend.entity.JobType;
import com.techjobs.backend.security.CustomUserDetails;
import com.techjobs.backend.service.JobApplicationService;
import com.techjobs.backend.service.JobService;
import com.techjobs.backend.service.RecommendationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
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
     * Fetch single job details by ID + increment view count
     */
    @GetMapping("/{id}")
    public ResponseEntity<JobResponseDTO> getJobById(@PathVariable Long id) {
        jobService.incrementViewCount(id);
        JobResponseDTO job = jobService.getJobById(id);
        return ResponseEntity.ok(job);
    }

    /**
     * POST /api/v1/jobs
     * Create a new job posting
     */
    @PostMapping
    public ResponseEntity<JobResponseDTO> createJob(
            @AuthenticationPrincipal CustomUserDetails user,
            @Valid @RequestBody JobRequestDTO requestDTO) {
        if (user != null && requestDTO.getEmployerId() == null) {
            requestDTO.setEmployerId(user.getUser().getId());
        }
        JobResponseDTO createdJob = jobService.createJob(requestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdJob);
    }

    /**
     * PUT /api/v1/jobs/{id}
     * Update an existing job posting (employer edit)
     */
    @PutMapping("/{id}")
    public ResponseEntity<JobResponseDTO> updateJob(
            @PathVariable Long id,
            @Valid @RequestBody JobRequestDTO requestDTO) {
        JobResponseDTO updatedJob = jobService.updateJob(id, requestDTO);
        return ResponseEntity.ok(updatedJob);
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
     * Fetch applications for a specific job (employer view)
     */
    @GetMapping("/{id}/applications")
    public ResponseEntity<List<JobApplicationDTO>> getApplicationsForJob(@PathVariable Long id) {
        List<JobApplicationDTO> applications = applicationService.getApplicationsForJob(id);
        return ResponseEntity.ok(applications);
    }

    /**
     * PATCH /api/v1/jobs/{jobId}/applications/{appId}/status
     * Employer updates application status with validation
     */
    @PatchMapping("/{jobId}/applications/{appId}/status")
    public ResponseEntity<StatusUpdateDTO.StatusUpdateResponse> updateApplicationStatus(
            @AuthenticationPrincipal CustomUserDetails user,
            @PathVariable Long jobId,
            @PathVariable Long appId,
            @Valid @RequestBody StatusUpdateDTO.StatusUpdateRequest request) {
        StatusUpdateDTO.StatusUpdateResponse response = applicationService.updateApplicationStatus(
                appId, request.getNewStatus(), user.getUser().getId(), request.getNotes());
        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/v1/jobs/applications/mine
     * Candidate's own applications list ("My Applications")
     */
    @GetMapping("/applications/mine")
    public ResponseEntity<List<JobApplicationDTO>> getMyApplications(
            @AuthenticationPrincipal CustomUserDetails user) {
        List<JobApplicationDTO> applications = applicationService.getApplicationsByUserId(user.getUser().getId());
        return ResponseEntity.ok(applications);
    }

    /**
     * POST /api/v1/jobs/applications/{appId}/withdraw
     * Candidate withdraws their own application
     */
    @PostMapping("/applications/{appId}/withdraw")
    public ResponseEntity<JobApplicationDTO> withdrawApplication(
            @AuthenticationPrincipal CustomUserDetails user,
            @PathVariable Long appId) {
        JobApplicationDTO withdrawn = applicationService.withdrawApplication(appId, user.getUser().getId());
        return ResponseEntity.ok(withdrawn);
    }

    /**
     * GET /api/v1/jobs/employer/mine
     * Employer's own job postings
     */
    @GetMapping("/employer/mine")
    public ResponseEntity<List<JobResponseDTO>> getMyPostedJobs(
            @AuthenticationPrincipal CustomUserDetails user) {
        List<JobResponseDTO> jobs = jobService.getJobsByEmployer(user.getUser().getId());
        return ResponseEntity.ok(jobs);
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
