package com.techjobs.backend.dto;

import java.util.List;

public record InterviewResponseDTO(
    String sessionId,
    String jobTitle,
    String mode,
    int totalQuestions,
    int remainingDailyQuota,
    List<QuestionItemDTO> questions,
    String resumeFeedback // Used when mode is 'resume_review'
) {}
