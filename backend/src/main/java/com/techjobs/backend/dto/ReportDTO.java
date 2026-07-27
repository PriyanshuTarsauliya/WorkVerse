package com.techjobs.backend.dto;

import com.techjobs.backend.entity.JobReport;
import com.techjobs.backend.entity.ReportReason;
import com.techjobs.backend.entity.ReportStatus;
import lombok.*;

import java.time.LocalDateTime;

public class ReportDTO {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CreateReportRequest {
        private ReportReason reason;
        private String description;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ReviewReportRequest {
        private ReportStatus status;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ReportResponse {
        private Long id;
        private Long reporterId;
        private Long jobId;
        private ReportReason reason;
        private String description;
        private ReportStatus status;
        private Long reviewedBy;
        private LocalDateTime reviewedAt;
        private LocalDateTime createdAt;

        public static ReportResponse fromEntity(JobReport r) {
            return ReportResponse.builder()
                    .id(r.getId())
                    .reporterId(r.getReporterId())
                    .jobId(r.getJobId())
                    .reason(r.getReason())
                    .description(r.getDescription())
                    .status(r.getStatus())
                    .reviewedBy(r.getReviewedBy())
                    .reviewedAt(r.getReviewedAt())
                    .createdAt(r.getCreatedAt())
                    .build();
        }
    }
}
