package com.techjobs.backend.service;

import com.techjobs.backend.dto.JobApplicationDTO;
import com.techjobs.backend.dto.StatusUpdateDTO;
import com.techjobs.backend.entity.ApplicationStatus;
import com.techjobs.backend.entity.ApplicationStatusHistory;
import com.techjobs.backend.entity.JobApplication;
import com.techjobs.backend.entity.NotificationType;
import com.techjobs.backend.exception.ResourceNotFoundException;
import com.techjobs.backend.repository.ApplicationStatusHistoryRepository;
import com.techjobs.backend.repository.JobApplicationRepository;
import com.techjobs.backend.repository.JobRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class JobApplicationServiceImpl implements JobApplicationService {

    private final JobApplicationRepository applicationRepository;
    private final JobRepository jobRepository;
    private final ApplicationStatusHistoryRepository historyRepository;
    private final StatusTransitionValidator transitionValidator;
    private final NotificationService notificationService;

    @Override
    @Transactional
    public JobApplicationDTO applyForJob(Long jobId, JobApplicationDTO applicationDTO) {
        // Verify job exists
        if (!jobRepository.existsById(jobId)) {
            throw new ResourceNotFoundException("Job", "id", jobId);
        }

        // Duplicate application prevention (was missing from regular apply — only existed in QuickApply)
        if (applicationDTO.getApplicantEmail() != null &&
                applicationRepository.existsByJobIdAndApplicantEmail(jobId, applicationDTO.getApplicantEmail())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "You have already applied for this position with email: " + applicationDTO.getApplicantEmail());
        }

        JobApplication application = JobApplication.builder()
                .jobId(jobId)
                .userId(applicationDTO.getUserId())
                .applicantName(applicationDTO.getApplicantName())
                .applicantEmail(applicationDTO.getApplicantEmail())
                .portfolioUrl(applicationDTO.getPortfolioUrl())
                .coverNote(applicationDTO.getCoverNote())
                .resumeUrl(applicationDTO.getResumeUrl())
                .build();

        JobApplication savedApplication = applicationRepository.save(application);

        // Record initial status in audit history
        historyRepository.save(ApplicationStatusHistory.builder()
                .applicationId(savedApplication.getId())
                .fromStatus(null)
                .toStatus(ApplicationStatus.APPLIED)
                .notes("Application submitted")
                .build());

        return JobApplicationDTO.fromEntity(savedApplication);
    }

    @Override
    @Transactional(readOnly = true)
    public List<JobApplicationDTO> getApplicationsForJob(Long jobId) {
        if (!jobRepository.existsById(jobId)) {
            throw new ResourceNotFoundException("Job", "id", jobId);
        }

        return applicationRepository.findByJobId(jobId)
                .stream()
                .map(JobApplicationDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public StatusUpdateDTO.StatusUpdateResponse updateApplicationStatus(
            Long applicationId, ApplicationStatus newStatus, Long changedByUserId, String notes) {

        JobApplication application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("JobApplication", "id", applicationId));

        ApplicationStatus oldStatus = application.getStatus();

        // Validate transition using state machine
        if (!transitionValidator.isValidTransition(oldStatus, newStatus)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    String.format("Invalid status transition: %s → %s. Allowed transitions from %s: %s",
                            oldStatus, newStatus, oldStatus,
                            transitionValidator.getAllowedTransitions(oldStatus)));
        }

        // Update application
        application.setStatus(newStatus);
        application.setStatusUpdatedAt(LocalDateTime.now());
        if (notes != null && !notes.isBlank()) {
            application.setRecruiterNotes(notes);
        }
        applicationRepository.save(application);

        // Record in audit history
        historyRepository.save(ApplicationStatusHistory.builder()
                .applicationId(applicationId)
                .fromStatus(oldStatus)
                .toStatus(newStatus)
                .changedByUserId(changedByUserId)
                .notes(notes)
                .build());

        // Send notification to candidate
        if (application.getUserId() != null) {
            String title = "Application Status Updated";
            String message = String.format("Your application (ID: %d) status changed from %s to %s.",
                    applicationId, oldStatus, newStatus);
            notificationService.createNotification(
                    application.getUserId(),
                    NotificationType.APPLICATION_UPDATE,
                    title, message,
                    String.valueOf(applicationId));
        }

        return StatusUpdateDTO.StatusUpdateResponse.builder()
                .applicationId(applicationId)
                .oldStatus(oldStatus)
                .newStatus(newStatus)
                .notes(notes)
                .updatedAt(application.getStatusUpdatedAt())
                .message("Status updated successfully: " + oldStatus + " → " + newStatus)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public List<JobApplicationDTO> getApplicationsByUserId(Long userId) {
        return applicationRepository.findByUserIdOrderByAppliedAtDesc(userId)
                .stream()
                .map(JobApplicationDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public JobApplicationDTO withdrawApplication(Long applicationId, Long userId) {
        JobApplication application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("JobApplication", "id", applicationId));

        // Verify ownership
        if (application.getUserId() == null || !application.getUserId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "You can only withdraw your own applications.");
        }

        ApplicationStatus oldStatus = application.getStatus();

        // Validate transition
        if (!transitionValidator.isValidTransition(oldStatus, ApplicationStatus.WITHDRAWN)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    String.format("Cannot withdraw application in %s status. Application may already be %s.",
                            oldStatus, oldStatus));
        }

        application.setStatus(ApplicationStatus.WITHDRAWN);
        application.setStatusUpdatedAt(LocalDateTime.now());
        applicationRepository.save(application);

        // Record in audit history
        historyRepository.save(ApplicationStatusHistory.builder()
                .applicationId(applicationId)
                .fromStatus(oldStatus)
                .toStatus(ApplicationStatus.WITHDRAWN)
                .changedByUserId(userId)
                .notes("Withdrawn by candidate")
                .build());

        return JobApplicationDTO.fromEntity(application);
    }
}
