package com.techjobs.backend.controller;

import com.techjobs.backend.dto.InterviewRequestDTO;
import com.techjobs.backend.dto.InterviewResponseDTO;
import com.techjobs.backend.service.InterviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/interview")
@RequiredArgsConstructor
public class InterviewController {

    private final InterviewService interviewService;

    /**
     * POST /api/interview/generate
     * Generate customized mock interview questions based on resume & job description
     */
    @PostMapping("/generate")
    public ResponseEntity<?> generateInterview(@Valid @RequestBody InterviewRequestDTO request) {
        try {
            InterviewResponseDTO response = interviewService.generateInterviewQuestions(request);
            return ResponseEntity.ok(response);
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS).body(Map.of(
                    "error", "RATE_LIMIT_EXCEEDED",
                    "message", e.getMessage()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                    "error", "GENERATION_FAILED",
                    "message", e.getMessage()
            ));
        }
    }

    /**
     * POST /api/interview/tts
     * Converts text to audio payload / stream (Decoupled TTS endpoint)
     */
    @PostMapping("/tts")
    public ResponseEntity<byte[]> generateTTSAudio(@RequestBody Map<String, String> payload) {
        String text = payload.get("text");
        byte[] audioBytes = interviewService.generateQuestionAudioTTS(text);
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(audioBytes);
    }
}
