package com.techjobs.backend.dto;

import com.techjobs.backend.entity.SalaryData;
import lombok.*;

import java.util.List;

public class SalaryGuideDTO {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SalaryResponse {
        private String role;
        private String location;
        private String experienceLevel;
        private Long salaryMin;
        private Long salaryMax;
        private String currency;
        private Integer sampleSize;

        public static SalaryResponse fromEntity(SalaryData s) {
            return SalaryResponse.builder()
                    .role(s.getRole())
                    .location(s.getLocation())
                    .experienceLevel(s.getExperienceLevel())
                    .salaryMin(s.getSalaryMin())
                    .salaryMax(s.getSalaryMax())
                    .currency(s.getCurrency())
                    .sampleSize(s.getSampleSize())
                    .build();
        }
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RolesListResponse {
        private List<String> roles;
    }
}
