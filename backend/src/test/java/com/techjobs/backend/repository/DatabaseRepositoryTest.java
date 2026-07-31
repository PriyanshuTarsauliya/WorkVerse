package com.techjobs.backend.repository;

import com.techjobs.backend.entity.Job;
import com.techjobs.backend.entity.JobApplication;
import com.techjobs.backend.entity.JobStatus;
import com.techjobs.backend.entity.JobType;
import com.techjobs.backend.entity.User;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;

@DataJpaTest
@DisplayName("Database Access & JPA Repository Test Suite")
public class DatabaseRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private JobApplicationRepository jobApplicationRepository;

    @Nested
    @DisplayName("User Entity & Repository Tests")
    class UserRepositoryTests {

        @Test
        @DisplayName("TEST 1: Save User & Find by Email (Persistence & PrePersist Check)")
        void testSaveAndFindUserByEmail_Success() {
            User user = User.builder()
                    .name("Jane Smith")
                    .email("jane.smith@techverse.io")
                    .password("EncryptedPassword123")
                    .role("ROLE_DEVELOPER")
                    .build();

            User savedUser = userRepository.save(user);
            entityManager.flush();

            assertThat(savedUser.getId()).isNotNull();
            assertThat(savedUser.getCreatedAt()).isNotNull();

            Optional<User> foundUser = userRepository.findByEmail("jane.smith@techverse.io");
            assertThat(foundUser).isPresent();
            assertThat(foundUser.get().getName()).isEqualTo("Jane Smith");
            assertThat(foundUser.get().getRole()).isEqualTo("ROLE_DEVELOPER");
        }

        @Test
        @DisplayName("TEST 2: Unique Email Constraint Edge Case — Throws DataIntegrityViolationException")
        void testDuplicateEmailConstraint_ThrowsException() {
            User user1 = User.builder()
                    .name("User One")
                    .email("duplicate@techverse.io")
                    .password("pass1")
                    .role("ROLE_USER")
                    .build();

            userRepository.saveAndFlush(user1);

            User user2 = User.builder()
                    .name("User Two")
                    .email("duplicate@techverse.io")
                    .password("pass2")
                    .role("ROLE_USER")
                    .build();

            assertThrows(DataIntegrityViolationException.class, () -> userRepository.saveAndFlush(user2));
        }

        @Test
        @DisplayName("TEST 3: Query Non-Existent Email — Returns Empty Optional")
        void testFindUserByEmail_NotFound_ReturnsEmptyOptional() {
            Optional<User> user = userRepository.findByEmail("unknown.candidate@example.com");
            assertThat(user).isEmpty();
        }
    }

    @Nested
    @DisplayName("Job Entity & Repository Tests")
    class JobRepositoryTests {

        @Test
        @DisplayName("TEST 4: Save Job Posting & Verify Tech Stack Collection Persistence")
        void testSaveAndFindJob_Success() {
            Job job = Job.builder()
                    .title("Senior Cloud Architect")
                    .company("SkyNet Systems")
                    .location("Austin, TX")
                    .jobType(JobType.FULL_TIME)
                    .category("Cloud Infrastructure")
                    .salaryRange("$160k - $190k")
                    .description("Lead multi-region cloud deployment using AWS & Kubernetes.")
                    .techStack(List.of("AWS", "Kubernetes", "Terraform", "Go"))
                    .build();

            Job savedJob = jobRepository.save(job);
            entityManager.flush();
            entityManager.clear();

            Optional<Job> foundJob = jobRepository.findById(savedJob.getId());
            assertThat(foundJob).isPresent();
            assertThat(foundJob.get().getTitle()).isEqualTo("Senior Cloud Architect");
            assertThat(foundJob.get().getTechStack()).containsExactlyInAnyOrder("AWS", "Kubernetes", "Terraform", "Go");
        }

        @Test
        @DisplayName("TEST 5: Query Jobs by JobType & Location Case-Insensitive")
        void testFindByJobTypeAndLocation() {
            Job remoteJob = Job.builder()
                    .title("Remote Backend Lead")
                    .company("Distributed Corp")
                    .location("Remote - USA")
                    .jobType(JobType.REMOTE)
                    .category("Engineering")
                    .description("Java Spring Boot microservices")
                    .techStack(List.of("Java", "Spring Boot"))
                    .build();

            Job onsiteJob = Job.builder()
                    .title("Onsite QA Engineer")
                    .company("Local Tech")
                    .location("Seattle, WA")
                    .jobType(JobType.FULL_TIME)
                    .category("QA")
                    .description("Automation testing")
                    .techStack(List.of("Selenium", "Java"))
                    .build();

            jobRepository.saveAll(List.of(remoteJob, onsiteJob));
            entityManager.flush();

            List<Job> remoteJobs = jobRepository.findByJobType(JobType.REMOTE);
            assertThat(remoteJobs).hasSize(1);
            assertThat(remoteJobs.get(0).getTitle()).isEqualTo("Remote Backend Lead");

            List<Job> seattleJobs = jobRepository.findByLocationContainingIgnoreCase("seattle");
            assertThat(seattleJobs).hasSize(1);
            assertThat(seattleJobs.get(0).getCompany()).isEqualTo("Local Tech");
        }

        @Test
        @DisplayName("TEST 6: Custom JPQL Keyword Search Query Across Fields")
        void testSearchByKeyword_CustomJPQL() {
            Job j1 = Job.builder()
                    .title("React Frontend Developer")
                    .company("PixelCraft")
                    .location("Remote")
                    .jobType(JobType.FULL_TIME)
                    .category("Frontend")
                    .description("Building accessible modern web components with Framer Motion")
                    .techStack(List.of("React", "TypeScript", "Tailwind"))
                    .build();

            Job j2 = Job.builder()
                    .title("Python Data Scientist")
                    .company("AI Research Lab")
                    .location("Boston, MA")
                    .jobType(JobType.FULL_TIME)
                    .category("Data Science")
                    .description("Machine Learning and LLM fine-tuning")
                    .techStack(List.of("Python", "PyTorch"))
                    .build();

            jobRepository.saveAll(List.of(j1, j2));
            entityManager.flush();

            List<Job> reactMatches = jobRepository.searchByKeyword("%pixelcraft%");
            assertThat(reactMatches).hasSize(1);
            assertThat(reactMatches.get(0).getTitle()).isEqualTo("React Frontend Developer");

            List<Job> aiMatches = jobRepository.searchByKeyword("%machine learning%");
            assertThat(aiMatches).hasSize(1);
            assertThat(aiMatches.get(0).getCompany()).isEqualTo("AI Research Lab");
        }

        @Test
        @DisplayName("TEST 7: Pageable Job Filtering & Pagination Execution")
        void testFilterJobs_Pageable() {
            for (int i = 1; i <= 15; i++) {
                Job job = Job.builder()
                        .title("Software Developer #" + i)
                        .company("Tech Corp")
                        .location("New York, NY")
                        .jobType(JobType.FULL_TIME)
                        .category("Software Development")
                        .description("Generic description for job " + i)
                        .techStack(List.of("Java", "SQL"))
                        .build();
                jobRepository.save(job);
            }
            entityManager.flush();

            PageRequest pageRequest = PageRequest.of(0, 10, Sort.by("id").ascending());
            Page<Job> pageResult = jobRepository.filterJobs("developer", JobType.FULL_TIME, "new york", "software development", JobStatus.ACTIVE, pageRequest);

            assertThat(pageResult.getTotalElements()).isEqualTo(15);
            assertThat(pageResult.getTotalPages()).isEqualTo(2);
            assertThat(pageResult.getContent()).hasSize(10);
        }
    }

    @Nested
    @DisplayName("Job Application Entity & Repository Tests")
    class JobApplicationRepositoryTests {

        @Test
        @DisplayName("TEST 8: Save Job Application & Query by Applicant Email & Job ID")
        void testSaveAndFindJobApplication() {
            JobApplication app = JobApplication.builder()
                    .jobId(101L)
                    .applicantName("Alex Rivera")
                    .applicantEmail("alex.rivera@example.com")
                    .coverNote("Highly passionate fullstack engineer with 5 years experience.")
                    .portfolioUrl("https://alexrivera.dev")
                    .appliedAt(LocalDateTime.now())
                    .build();

            JobApplication savedApp = jobApplicationRepository.save(app);
            entityManager.flush();

            assertThat(savedApp.getId()).isNotNull();

            List<JobApplication> jobApps = jobApplicationRepository.findByJobId(101L);
            assertThat(jobApps).hasSize(1);
            assertThat(jobApps.get(0).getApplicantName()).isEqualTo("Alex Rivera");

            boolean exists = jobApplicationRepository.existsByJobIdAndApplicantEmail(101L, "alex.rivera@example.com");
            assertThat(exists).isTrue();

            boolean notExists = jobApplicationRepository.existsByJobIdAndApplicantEmail(101L, "other@example.com");
            assertThat(notExists).isFalse();
        }

        @Test
        @DisplayName("TEST 9: Aggregate JPQL Query — Count Applications by Multiple Job IDs")
        void testCountApplicationsByJobIds_AggregateQuery() {
            JobApplication app1 = JobApplication.builder().jobId(1L).applicantName("User 1").applicantEmail("u1@test.com").build();
            JobApplication app2 = JobApplication.builder().jobId(1L).applicantName("User 2").applicantEmail("u2@test.com").build();
            JobApplication app3 = JobApplication.builder().jobId(2L).applicantName("User 3").applicantEmail("u3@test.com").build();

            jobApplicationRepository.saveAll(List.of(app1, app2, app3));
            entityManager.flush();

            List<Object[]> counts = jobApplicationRepository.countApplicationsByJobIds(List.of(1L, 2L));
            assertThat(counts).hasSize(2);

            long totalAppsForJob1 = jobApplicationRepository.countByJobId(1L);
            assertThat(totalAppsForJob1).isEqualTo(2);

            long totalAppsForJob2 = jobApplicationRepository.countByJobId(2L);
            assertThat(totalAppsForJob2).isEqualTo(1);
        }
    }
}
