package com.techjobs.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.techjobs.backend.dto.JobApplicationDTO;
import com.techjobs.backend.dto.JobRequestDTO;
import com.techjobs.backend.dto.RecommendationDTO;
import com.techjobs.backend.entity.Job;
import com.techjobs.backend.entity.JobType;
import com.techjobs.backend.repository.JobApplicationRepository;
import com.techjobs.backend.repository.JobRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import org.springframework.security.test.context.support.WithMockUser;
import java.util.List;

import static org.hamcrest.Matchers.*;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@WithMockUser(username = "testuser", roles = {"USER", "ADMIN"})
public class JobControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private JobApplicationRepository applicationRepository;

    private Job sampleJob1;
    private Job sampleJob2;

    @BeforeEach
    void setUp() {
        applicationRepository.deleteAll();
        jobRepository.deleteAll();

        sampleJob1 = Job.builder()
                .title("Senior Full Stack Engineer")
                .company("GlobalCo Tech")
                .location("Bengaluru, KA")
                .jobType(JobType.FULL_TIME)
                .category("Software Engineering")
                .salaryRange("₹25 - 35 LPA")
                .description("Build scalable full stack applications with React and Spring Boot.")
                .techStack(List.of("React", "Java", "Spring Boot", "GraphQL"))
                .build();

        sampleJob2 = Job.builder()
                .title("Frontend Developer")
                .company("Designify Studios")
                .location("Remote - India")
                .jobType(JobType.CONTRACT)
                .category("Frontend")
                .salaryRange("₹15 - 22 LPA")
                .description("Craft stunning user interfaces with Next.js and Tailwind CSS.")
                .techStack(List.of("React", "Next.js", "TypeScript", "Tailwind"))
                .build();

        sampleJob1 = jobRepository.save(sampleJob1);
        sampleJob2 = jobRepository.save(sampleJob2);
    }

    @Test
    @DisplayName("TEST 1: Get All Jobs & Query Filtering — Happy Path")
    void testGetAllJobs_WithFilters() throws Exception {
        // Fetch all jobs
        mockMvc.perform(get("/api/v1/jobs"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)));

        // Filter by keyword 'Full Stack'
        mockMvc.perform(get("/api/v1/jobs").param("keyword", "Full Stack"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].title", is("Senior Full Stack Engineer")));

        // Filter by location 'Bengaluru'
        mockMvc.perform(get("/api/v1/jobs").param("location", "Bengaluru"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].company", is("GlobalCo Tech")));
    }

    @Test
    @DisplayName("TEST 2: Get Job By ID — Happy Path & 404 Edge Case")
    void testGetJobById() throws Exception {
        // Happy Path
        mockMvc.perform(get("/api/v1/jobs/" + sampleJob1.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(sampleJob1.getId().intValue())))
                .andExpect(jsonPath("$.title", is("Senior Full Stack Engineer")));

        // 404 Non-Existent ID Edge Case
        mockMvc.perform(get("/api/v1/jobs/999999"))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("TEST 3: Create Job Posting — Happy Path")
    void testCreateJob_Success() throws Exception {
        JobRequestDTO requestDTO = JobRequestDTO.builder()
                .title("DevOps Engineer")
                .company("CloudScale")
                .location("Hyderabad, TS")
                .jobType(JobType.FULL_TIME)
                .category("Cloud")
                .salaryRange("₹20 - 28 LPA")
                .description("Manage Kubernetes clusters and CI/CD pipelines.")
                .techStack(List.of("Docker", "Kubernetes", "AWS"))
                .build();

        mockMvc.perform(post("/api/v1/jobs")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(requestDTO)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id", notNullValue()))
                .andExpect(jsonPath("$.title", is("DevOps Engineer")))
                .andExpect(jsonPath("$.company", is("CloudScale")));
    }

    @Test
    @DisplayName("TEST 4: Create Job Posting — Validation Edge Cases")
    void testCreateJob_ValidationFailure() throws Exception {
        // Missing required fields
        JobRequestDTO invalidRequest = JobRequestDTO.builder()
                .title("")
                .company("")
                .location("")
                .build();

        mockMvc.perform(post("/api/v1/jobs")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("TEST 5: Apply for Job — Happy Path")
    void testApplyForJob_Success() throws Exception {
        JobApplicationDTO applicationDTO = JobApplicationDTO.builder()
                .applicantName("QA Candidate")
                .applicantEmail("qa.candidate@example.com")
                .portfolioUrl("https://github.com/qacandidate")
                .coverNote("Excited to apply for this full stack role!")
                .build();

        mockMvc.perform(post("/api/v1/jobs/" + sampleJob1.getId() + "/apply")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(applicationDTO)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id", notNullValue()))
                .andExpect(jsonPath("$.jobId", is(sampleJob1.getId().intValue())))
                .andExpect(jsonPath("$.applicantName", is("QA Candidate")))
                .andExpect(jsonPath("$.applicantEmail", is("qa.candidate@example.com")));

        // Verify in database
        assertEquals(1, applicationRepository.count());
    }

    @Test
    @DisplayName("TEST 6: Apply for Job — Validation Edge Cases")
    void testApplyForJob_ValidationFailure() throws Exception {
        // Missing applicant name and invalid email
        JobApplicationDTO invalidApp = JobApplicationDTO.builder()
                .applicantName("")
                .applicantEmail("invalid-email-format")
                .build();

        mockMvc.perform(post("/api/v1/jobs/" + sampleJob1.getId() + "/apply")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidApp)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("TEST 7: Fetch Applications for Job")
    void testGetApplicationsForJob() throws Exception {
        // Submit an application first
        JobApplicationDTO applicationDTO = JobApplicationDTO.builder()
                .applicantName("Sarah Connor")
                .applicantEmail("sarah@example.com")
                .build();

        mockMvc.perform(post("/api/v1/jobs/" + sampleJob1.getId() + "/apply")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(applicationDTO)))
                .andExpect(status().isCreated());

        // Fetch applications for sampleJob1
        mockMvc.perform(get("/api/v1/jobs/" + sampleJob1.getId() + "/applications"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].applicantName", is("Sarah Connor")));
    }

    @Test
    @DisplayName("TEST 8: Profile Recommendations & Skill Gaps API")
    void testGenerateRecommendations() throws Exception {
        RecommendationDTO.CandidateProfileRequest profileRequest = RecommendationDTO.CandidateProfileRequest.builder()
                .name("Alex Morgan")
                .headline("Senior Full Stack Developer")
                .location("Bengaluru")
                .experienceYears(5)
                .skills(List.of("React", "Java", "TypeScript"))
                .preferredRemote(false)
                .build();

        mockMvc.perform(post("/api/v1/jobs/recommendations")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(profileRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.topRecommendations", notNullValue()))
                .andExpect(jsonPath("$.topSkillGaps", notNullValue()))
                .andExpect(jsonPath("$.averageMatchScore", notNullValue()));
    }

    @Test
    @DisplayName("TEST 9: Delete Job Posting")
    void testDeleteJob() throws Exception {
        mockMvc.perform(delete("/api/v1/jobs/" + sampleJob2.getId()))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/api/v1/jobs/" + sampleJob2.getId()))
                .andExpect(status().isNotFound());
    }
}
