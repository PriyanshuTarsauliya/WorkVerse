package com.techjobs.backend.dto;

import com.techjobs.backend.entity.ApplicationStatus;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDateTime;

public class StatusUpdateDTO {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class StatusUpdateRequest {
        @NotNull(message = "New status is required")
        private ApplicationStatus newStatus;

        private String notes;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class StatusUpdateResponse {
        private Long applicationId;
        private ApplicationStatus oldStatus;
        private ApplicationStatus newStatus;
        private String notes;
        private LocalDateTime updatedAt;
        private String message;
    }
}
