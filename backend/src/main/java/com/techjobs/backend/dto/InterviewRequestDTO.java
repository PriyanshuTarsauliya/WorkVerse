package com.techjobs.backend.dto;

import jakarta.validation.constraints.NotBlank;

public record InterviewRequestDTO(
    String userId,
    @NotBlank(message = "Job description is required")
    String jobDescription,
    String jobTitle,
    String resumeText,
    String mode, // 'tech_resume' | 'tech_general' | 'behavioral' | 'resume_review'
    Integer questionCount
) {}
