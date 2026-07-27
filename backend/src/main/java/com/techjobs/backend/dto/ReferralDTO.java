package com.techjobs.backend.dto;

import com.techjobs.backend.entity.Referral;
import com.techjobs.backend.entity.ReferralStatus;
import lombok.*;

import java.time.LocalDateTime;

public class ReferralDTO {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CreateReferralRequest {
        private String refereeEmail;
        private Long jobId;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ReferralResponse {
        private Long id;
        private String refereeEmail;
        private Long jobId;
        private String referralCode;
        private ReferralStatus status;
        private LocalDateTime createdAt;

        public static ReferralResponse fromEntity(Referral r) {
            return ReferralResponse.builder()
                    .id(r.getId())
                    .refereeEmail(r.getRefereeEmail())
                    .jobId(r.getJobId())
                    .referralCode(r.getReferralCode())
                    .status(r.getStatus())
                    .createdAt(r.getCreatedAt())
                    .build();
        }
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ValidateResponse {
        private boolean valid;
        private String referrerName;
        private String message;
    }
}
