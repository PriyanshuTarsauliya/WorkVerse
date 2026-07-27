package com.techjobs.backend.service;

import com.techjobs.backend.dto.QuickApplyDTO;
import com.techjobs.backend.entity.*;
import com.techjobs.backend.exception.QuickApplyException;
import com.techjobs.backend.exception.ResourceNotFoundException;
import com.techjobs.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class QuickApplyServiceImpl implements QuickApplyService {

    private final JobRepository jobRepository;
    private final UserRepository userRepository;
    private final JobApplicationRepository applicationRepository;
    private final NotificationService notificationService;

    @Override
    @Transactional
    public QuickApplyDTO.Response quickApply(Long userId, Long jobId, QuickApplyDTO.Request request) {
        // 1. Fetch User & Job
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job", "id", jobId));

        // 2. Validation Check A: Duplicate Application
        if (applicationRepository.existsByUserIdAndJobId(userId, jobId)) {
            throw new QuickApplyException(
                    HttpStatus.CONFLICT,
                    "ALREADY_APPLIED",
                    "You have already applied for this position."
            );
        }

        // 3. Validation Check B: Profile Completeness & Resume Presence
        List<String> missingFields = new ArrayList<>();
        if (user.getResumeUrl() == null || user.getResumeUrl().isBlank()) {
            missingFields.add("resumeUrl");
        }
        if (user.getPhone() == null || user.getPhone().isBlank()) {
            missingFields.add("phone");
        }

        if (!missingFields.isEmpty()) {
            throw new QuickApplyException(
                    HttpStatus.BAD_REQUEST,
                    "INCOMPLETE_PROFILE",
                    "Please upload a resume and complete your profile contact details before applying.",
                    missingFields
            );
        }

        // 4. Calculate Match Score (Simple Skill Matching Logic)
        int matchScore = calculateMatchScore(user.getSkills(), job.getTechStack());

        // 5. Create & Snapshot JobApplication Entity
        JobApplication application = JobApplication.builder()
                .jobId(job.getId())
                .userId(user.getId())
                .applicantName(user.getName())
                .applicantEmail(user.getEmail())
                .resumeUrl(user.getResumeUrl())
                .coverNote(request != null && request.getCustomCoverNote() != null ? request.getCustomCoverNote() : "Quick Applied via WorkVerse Profile")
                .status(ApplicationStatus.APPLIED)
                .matchScore(matchScore)
                .build();

        JobApplication savedApplication = applicationRepository.save(application);

        // 6. Asynchronous Notification Trigger
        notificationService.createNotification(
                userId,
                NotificationType.APPLICATION_UPDATE,
                "Application Submitted Successfully!",
                "Your application for " + job.getTitle() + " at " + job.getCompany() + " has been sent to the recruiter.",
                String.valueOf(job.getId())
        );

        return QuickApplyDTO.Response.fromEntity(savedApplication, job.getTitle(), job.getCompany());
    }

    private int calculateMatchScore(List<String> candidateSkills, List<String> requiredSkills) {
        if (requiredSkills == null || requiredSkills.isEmpty()) return 75;
        if (candidateSkills == null || candidateSkills.isEmpty()) return 40;

        long matched = candidateSkills.stream()
                .filter(s -> requiredSkills.stream().anyMatch(req -> req.equalsIgnoreCase(s)))
                .count();

        int score = (int) Math.round(((double) matched / requiredSkills.size()) * 100);
        return Math.max(score, 35);
    }
}
