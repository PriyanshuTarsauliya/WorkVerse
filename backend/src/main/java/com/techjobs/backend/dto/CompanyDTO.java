package com.techjobs.backend.dto;

import com.techjobs.backend.entity.Company;
import com.techjobs.backend.entity.CompanySize;
import lombok.*;

import java.util.List;

public class CompanyDTO {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CompanyResponse {
        private Long id;
        private String name;
        private String industry;
        private String location;
        private CompanySize companySize;
        private Double rating;
        private Integer reviewCount;
        private String description;
        private String logoUrl;
        private String websiteUrl;
        private List<String> techStack;
        private String fundingStage;
        private Boolean isVerified;

        public static CompanyResponse fromEntity(Company c) {
            return CompanyResponse.builder()
                    .id(c.getId())
                    .name(c.getName())
                    .industry(c.getIndustry())
                    .location(c.getLocation())
                    .companySize(c.getCompanySize())
                    .rating(c.getRating())
                    .reviewCount(c.getReviewCount())
                    .description(c.getDescription())
                    .logoUrl(c.getLogoUrl())
                    .websiteUrl(c.getWebsiteUrl())
                    .techStack(c.getTechStack())
                    .fundingStage(c.getFundingStage())
                    .isVerified(c.getIsVerified())
                    .build();
        }
    }
}
