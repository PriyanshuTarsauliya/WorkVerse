package com.techjobs.backend.dto;

import com.techjobs.backend.entity.ApplicationStatus;
import com.techjobs.backend.entity.JobApplication;
import lombok.*;

import java.time.LocalDateTime;

public class QuickApplyDTO {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Request {
        private String customCoverNote;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Response {
        private Long applicationId;
        private Long jobId;
        private String jobTitle;
        private String companyName;
        private String applicantName;
        private String applicantEmail;
        private String resumeUrl;
        private Integer matchScore;
        private ApplicationStatus status;
        private LocalDateTime appliedAt;

        public static Response fromEntity(JobApplication app, String jobTitle, String companyName) {
            return Response.builder()
                    .applicationId(app.getId())
                    .jobId(app.getJobId())
                    .jobTitle(jobTitle)
                    .companyName(companyName)
                    .applicantName(app.getApplicantName())
                    .applicantEmail(app.getApplicantEmail())
                    .resumeUrl(app.getResumeUrl())
                    .matchScore(app.getMatchScore())
                    .status(app.getStatus())
                    .appliedAt(app.getAppliedAt())
                    .build();
        }
    }
}
