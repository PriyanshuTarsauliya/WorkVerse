package com.techjobs.backend.dto;

import com.techjobs.backend.entity.Job;
import com.techjobs.backend.entity.JobType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class JobDto {

    public record Request(
            @NotBlank(message = "Title is required") String title,
            @NotBlank(message = "Company is required") String company,
            String companyLogoUrl,
            @NotBlank(message = "Location is required") String location,
            @NotNull(message = "Job type is required") JobType jobType,
            @NotBlank(message = "Description is required") String description,
            List<String> techStack,
            @NotNull(message = "Salary min is required") @Min(0) BigDecimal salaryMin,
            BigDecimal salaryMax,
            String currency
    ) {}

    public record Response(
            Long id,
            String title,
            String company,
            String companyLogoUrl,
            String location,
            JobType jobType,
            String description,
            List<String> techStack,
            BigDecimal salaryMin,
            BigDecimal salaryMax,
            String currency,
            boolean active,
            int applicationCount,
            LocalDateTime createdAt
    ) {
        public static Response fromEntity(Job job) {
            return new Response(
                    job.getId(),
                    job.getTitle(),
                    job.getCompany(),
                    null,
                    job.getLocation(),
                    job.getJobType(),
                    job.getDescription(),
                    job.getTechStack(),
                    null,
                    null,
                    "USD",
                    true,
                    0,
                    job.getCreatedAt()
            );
        }
    }

    public record ApplicationRequest(
            @NotBlank(message = "Applicant name is required") String applicantName,
            @NotBlank(message = "Applicant email is required") String applicantEmail,
            String resumeUrl,
            String coverLetter
    ) {}

    public record ApplicationResponse(
            Long id,
            Long jobId,
            String applicantName,
            String applicantEmail,
            LocalDateTime appliedAt
    ) {}
}
