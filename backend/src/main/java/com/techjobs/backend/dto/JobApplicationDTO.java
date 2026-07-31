package com.techjobs.backend.dto;

import com.techjobs.backend.entity.ApplicationStatus;
import com.techjobs.backend.entity.JobApplication;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobApplicationDTO {

    private Long id;

    private Long jobId;

    private Long userId;

    @NotBlank(message = "Applicant name is required")
    private String applicantName;

    @NotBlank(message = "Applicant email is required")
    @Email(message = "Must be a valid email address")
    private String applicantEmail;

    private String portfolioUrl;

    private String coverNote;

    private String resumeUrl;

    private ApplicationStatus status;

    private Integer matchScore;

    private String recruiterNotes;

    private LocalDateTime statusUpdatedAt;

    private LocalDateTime appliedAt;

    public static JobApplicationDTO fromEntity(JobApplication app) {
        return JobApplicationDTO.builder()
                .id(app.getId())
                .jobId(app.getJobId())
                .userId(app.getUserId())
                .applicantName(app.getApplicantName())
                .applicantEmail(app.getApplicantEmail())
                .portfolioUrl(app.getPortfolioUrl())
                .coverNote(app.getCoverNote())
                .resumeUrl(app.getResumeUrl())
                .status(app.getStatus())
                .matchScore(app.getMatchScore())
                .recruiterNotes(app.getRecruiterNotes())
                .statusUpdatedAt(app.getStatusUpdatedAt())
                .appliedAt(app.getAppliedAt())
                .build();
    }
}
