package com.techjobs.backend.dto;

import java.util.List;

public record QuestionItemDTO(
    String id,
    String question,
    String category,
    List<String> keyPoints,
    String sampleAnswer,
    String targetSkill,
    String audioUrl
) {}
