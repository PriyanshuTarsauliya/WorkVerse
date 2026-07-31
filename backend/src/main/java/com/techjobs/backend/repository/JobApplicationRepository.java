package com.techjobs.backend.repository;

import com.techjobs.backend.entity.ApplicationStatus;
import com.techjobs.backend.entity.JobApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobApplicationRepository extends JpaRepository<JobApplication, Long> {

    // Find all applications for a specific job posting
    List<JobApplication> findByJobId(Long jobId);

    // Count total applications received for a specific job
    long countByJobId(Long jobId);

    // Find applications by candidate email
    List<JobApplication> findByApplicantEmail(String applicantEmail);

    // Check if an applicant has already applied for a specific job
    boolean existsByJobIdAndApplicantEmail(Long jobId, String applicantEmail);

    // Check if user has applied for job by userId and jobId
    boolean existsByUserIdAndJobId(Long userId, Long jobId);

    // Batch count applications by job IDs
    @org.springframework.data.jpa.repository.Query("SELECT a.jobId, COUNT(a) FROM JobApplication a WHERE a.jobId IN :jobIds GROUP BY a.jobId")
    List<Object[]> countApplicationsByJobIds(@org.springframework.data.repository.query.Param("jobIds") List<Long> jobIds);

    // ── New queries for LinkedIn/Naukri patterns ──

    // Find all applications by a candidate (for "My Applications" feature)
    List<JobApplication> findByUserIdOrderByAppliedAtDesc(Long userId);

    // Filter applications for a job by status (employer pipeline view)
    List<JobApplication> findByJobIdAndStatus(Long jobId, ApplicationStatus status);

    // Find applications by user for a specific job
    List<JobApplication> findByUserIdAndJobId(Long userId, Long jobId);
}
