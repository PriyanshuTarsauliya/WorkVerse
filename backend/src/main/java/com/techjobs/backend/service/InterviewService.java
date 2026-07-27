package com.techjobs.backend.service;

import com.techjobs.backend.dto.InterviewRequestDTO;
import com.techjobs.backend.dto.InterviewResponseDTO;

public interface InterviewService {
    InterviewResponseDTO generateInterviewQuestions(InterviewRequestDTO request);
    byte[] generateQuestionAudioTTS(String text);
}
