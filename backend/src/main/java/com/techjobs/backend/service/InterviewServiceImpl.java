package com.techjobs.backend.service;

import com.techjobs.backend.dto.InterviewRequestDTO;
import com.techjobs.backend.dto.InterviewResponseDTO;
import com.techjobs.backend.dto.QuestionItemDTO;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class InterviewServiceImpl implements InterviewService {

    private static final int DAILY_RATE_LIMIT = 5;
    
    // Concurrent map tracking user daily quota: userId -> (date, count)
    private final Map<String, UserQuota> userQuotaMap = new ConcurrentHashMap<>();

    private record UserQuota(String dateStr, int count) {}

    @Override
    public InterviewResponseDTO generateInterviewQuestions(InterviewRequestDTO request) {
        String userId = (request.userId() != null && !request.userId().isBlank()) ? request.userId() : "anonymous_user";
        String todayStr = java.time.LocalDate.now().toString();

        // 1. Rate Limiting Check
        UserQuota currentQuota = userQuotaMap.getOrDefault(userId, new UserQuota(todayStr, 0));
        if (!todayStr.equals(currentQuota.dateStr())) {
            currentQuota = new UserQuota(todayStr, 0);
        }

        if (currentQuota.count() >= DAILY_RATE_LIMIT) {
            throw new IllegalStateException("Daily rate limit reached. You can generate up to 5 mock interview sets per day.");
        }

        // Increment quota
        userQuotaMap.put(userId, new UserQuota(todayStr, currentQuota.count() + 1));
        int remainingQuota = DAILY_RATE_LIMIT - (currentQuota.count() + 1);

        String mode = (request.mode() != null) ? request.mode() : "tech_general";
        int targetCount = (request.questionCount() != null && request.questionCount() >= 3 && request.questionCount() <= 10)
                ? request.questionCount()
                : 6;

        String jobTitle = (request.jobTitle() != null && !request.jobTitle().isBlank()) ? request.jobTitle() : "Software Engineer";
        String sessionId = "sess_" + UUID.randomUUID().toString().substring(0, 8);

        List<QuestionItemDTO> questions = new ArrayList<>();
        String resumeFeedback = null;

        if ("resume_review".equalsIgnoreCase(mode)) {
            resumeFeedback = generateResumeReviewFeedback(jobTitle, request.jobDescription(), request.resumeText());
        } else {
            questions = generateQuestionsForMode(mode, jobTitle, request.jobDescription(), request.resumeText(), targetCount);
        }

        return new InterviewResponseDTO(
                sessionId,
                jobTitle,
                mode,
                questions.size(),
                remainingQuota,
                questions,
                resumeFeedback
        );
    }

    @Override
    public byte[] generateQuestionAudioTTS(String text) {
        // Simple WAV/audio header generator or text payload for decoupled TTS endpoint
        return text != null ? text.getBytes() : new byte[0];
    }

    private List<QuestionItemDTO> generateQuestionsForMode(String mode, String jobTitle, String jobDescription, String resumeText, int count) {
        List<QuestionItemDTO> list = new ArrayList<>();

        if ("tech_resume".equalsIgnoreCase(mode)) {
            list.add(new QuestionItemDTO(
                    "q1",
                    "Based on your resume experience with distributed systems, how did you architect the real-time data pipeline for " + jobTitle + "?",
                    "Resume Technical",
                    List.of("System design trade-offs", "Message queue selection", "Backpressure handling"),
                    "I decoupled the producer and consumer stages using Apache Kafka with a Redis caching layer for instantaneous reads.",
                    "Distributed Systems",
                    null
            ));
            list.add(new QuestionItemDTO(
                    "q2",
                    "Your resume mentions microservices migration. How did you handle database schema refactoring without downtime during deployment?",
                    "Resume Architecture",
                    List.of("Expand-contract pattern", "Dual writing", "Feature flags"),
                    "We used the Expand-Contract pattern where new columns were added first, dual writes enabled, and old fields phased out cleanly.",
                    "Database Engineering",
                    null
            ));
            list.add(new QuestionItemDTO(
                    "q3",
                    "Tell me about a technical project on your resume where you had to optimize critical path latency. What tools and metrics did you track?",
                    "Performance Tuning",
                    List.of("P99 latency analysis", "Flame graphs", "DB query indexing"),
                    "We profiled main thread blocking times using Chrome DevTools and reduced P99 latency by 40% through async task batching.",
                    "Performance Optimization",
                    null
            ));
        } else if ("behavioral".equalsIgnoreCase(mode)) {
            list.add(new QuestionItemDTO(
                    "q1",
                    "Describe a situation where you had a strong disagreement with a Senior Tech Lead on system design architecture. How did you resolve it?",
                    "Behavioral / Conflict Resolution",
                    List.of("STAR framework", "Data-driven proof", "Collaborative compromise"),
                    "I created a quick benchmark prototype comparing both approaches with empirical latency data to align on the best solution.",
                    "Communication & Leadership",
                    null
            ));
            list.add(new QuestionItemDTO(
                    "q2",
                    "Tell me about a time a production deployment caused an incident or outage. What steps did you take during post-mortem analysis?",
                    "Incident Management",
                    List.of("Immediate rollback", "Blameless post-mortem", "Automated regression tests"),
                    "We initiated immediate rollback within 2 minutes, communicated with stakeholders, and added automated canary integration tests.",
                    "Operational Excellence",
                    null
            ));
        } else {
            // General Technical
            list.add(new QuestionItemDTO(
                    "q1",
                    "For the position of " + jobTitle + ", how would you design a resilient retry and circuit breaker pattern for external payment gateway APIs?",
                    "System Resilience",
                    List.of("Exponential backoff", "Jitter algorithm", "Circuit Breaker states (Open, Closed, Half-Open)"),
                    "I implement Resilience4j circuit breakers with exponential backoff and randomized jitter to prevent thundering herd problems.",
                    "API Reliability",
                    null
            ));
            list.add(new QuestionItemDTO(
                    "q2",
                    "Explain the difference between optimistic and pessimistic locking in high-concurrency database transactions.",
                    "Database Systems",
                    List.of("Version column checks", "SELECT FOR UPDATE locks", "Deadlock risks"),
                    "Optimistic locking uses a version counter for low contention, while pessimistic locking holds exclusive row locks for high contention.",
                    "Concurrency Control",
                    null
            ));
            list.add(new QuestionItemDTO(
                    "q3",
                    "How do you approach Core Web Vitals (LCP, CLS, INP) optimization in a large-scale React production application?",
                    "Frontend Architecture",
                    List.of("Route code splitting", "Image optimization", "Yielding to main thread"),
                    "By code-splitting heavy route components, optimizing fonts and images, and yielding long JS tasks via requestIdleCallback.",
                    "Web Performance",
                    null
            ));
        }

        // Fill up to requested count
        while (list.size() < count) {
            int idx = list.size() + 1;
            list.add(new QuestionItemDTO(
                    "q" + idx,
                    "How do you ensure high test coverage and zero-downtime CI/CD deployments when shipping features for " + jobTitle + "?",
                    "Software Craftsmanship",
                    List.of("Automated unit/integration suites", "Blue-green deployment", "Feature flagging"),
                    "We enforce 85%+ branch coverage in GitHub Actions pipelines and use blue-green deployments paired with LaunchDarkly flags.",
                    "DevOps & Quality",
                    null
            ));
        }

        return list.subList(0, count);
    }

    private String generateResumeReviewFeedback(String jobTitle, String jobDescription, String resumeText) {
        if (resumeText == null || resumeText.isBlank()) {
            return "No resume provided. Upload your resume to receive personalized gap analysis for " + jobTitle + ".";
        }

        return "Resume Review Analysis for " + jobTitle + ":\n" +
                "• Strengths: Solid technical foundation in core engineering principles.\n" +
                "• Key Gaps: The target job description highlights cloud-native infrastructure (Kubernetes, Terraform). Consider adding quantifiable impact metrics (e.g., 'Reduced latency by 35%').\n" +
                "• Action Items: Tailor project bullet points to directly reflect the requirements of " + jobTitle + ".";
    }
}
