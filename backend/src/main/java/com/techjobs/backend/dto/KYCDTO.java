package com.techjobs.backend.dto;

import com.techjobs.backend.entity.KYCStatus;
import com.techjobs.backend.entity.KYCType;
import com.techjobs.backend.entity.KYCVerification;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

public class KYCDTO {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class InitiateKYCRequest {
        private KYCType verificationType;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class VerifyOTPRequest {
        private KYCType verificationType;
        private String otp;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class VerifyPANRequest {
        private String panNumber;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class VerifyGSTINRequest {
        private String gstin;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class KYCResponse {
        private Long id;
        private KYCType verificationType;
        private String kycToken;
        private KYCStatus status;
        private LocalDateTime verifiedAt;
        private String message;

        public static KYCResponse fromEntity(KYCVerification v) {
            return KYCResponse.builder()
                    .id(v.getId())
                    .verificationType(v.getVerificationType())
                    .kycToken(v.getKycToken())
                    .status(v.getStatus())
                    .verifiedAt(v.getVerifiedAt())
                    .build();
        }
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class KYCStatusResponse {
        private List<KYCResponse> verifications;
        private boolean overallVerified;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DigilockerRedirectResponse {
        private String redirectUrl;
        private String sessionId;
        private String message;
    }
}
