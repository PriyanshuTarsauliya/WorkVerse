package com.techjobs.backend.dto;

import com.techjobs.backend.entity.AlertFrequency;
import com.techjobs.backend.entity.JobAlert;
import com.techjobs.backend.entity.JobType;
import lombok.*;

import java.time.LocalDateTime;

public class JobAlertDTO {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CreateAlertRequest {
        private String keyword;
        private String location;
        private String category;
        private JobType jobType;
        private Long salaryMin;
        private Long salaryMax;
        private AlertFrequency frequency;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AlertResponse {
        private Long id;
        private String keyword;
        private String location;
        private String category;
        private JobType jobType;
        private Long salaryMin;
        private Long salaryMax;
        private AlertFrequency frequency;
        private Boolean isActive;
        private LocalDateTime createdAt;

        public static AlertResponse fromEntity(JobAlert alert) {
            return AlertResponse.builder()
                    .id(alert.getId())
                    .keyword(alert.getKeyword())
                    .location(alert.getLocation())
                    .category(alert.getCategory())
                    .jobType(alert.getJobType())
                    .salaryMin(alert.getSalaryMin())
                    .salaryMax(alert.getSalaryMax())
                    .frequency(alert.getFrequency())
                    .isActive(alert.getIsActive())
                    .createdAt(alert.getCreatedAt())
                    .build();
        }
    }
}
