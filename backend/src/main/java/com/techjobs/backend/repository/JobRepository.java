package com.techjobs.backend.repository;

import com.techjobs.backend.entity.Job;
import com.techjobs.backend.entity.JobType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobRepository extends JpaRepository<Job, Long> {

    // Filter by Job Type (e.g. FULL_TIME, REMOTE)
    List<Job> findByJobType(JobType jobType);

    // Filter by Location (case-insensitive search)
    List<Job> findByLocationContainingIgnoreCase(String location);

    // Filter by Category
    List<Job> findByCategoryIgnoreCase(String category);

    // Filter by Job Type and Location
    List<Job> findByJobTypeAndLocationContainingIgnoreCase(JobType jobType, String location);

    // Fetch latest job postings
    List<Job> findTop10ByOrderByCreatedAtDesc();

    // Custom JPQL Search Query matching title, company, description, or category
    @Query("SELECT DISTINCT j FROM Job j WHERE " +
           "LOWER(j.title) LIKE :keyword OR " +
           "LOWER(j.company) LIKE :keyword OR " +
           "LOWER(CAST(j.description AS java.lang.String)) LIKE :keyword OR " +
           "LOWER(j.category) LIKE :keyword")
    List<Job> searchByKeyword(@Param("keyword") String keyword);

    // Pageable Search Query for production pagination
    @org.springframework.data.jpa.repository.EntityGraph(attributePaths = {"techStack"})
    @Query("SELECT DISTINCT j FROM Job j WHERE " +
           "(:keyword IS NULL OR LOWER(j.title) LIKE CONCAT('%', :keyword, '%') OR LOWER(j.company) LIKE CONCAT('%', :keyword, '%')) AND " +
           "(:jobType IS NULL OR j.jobType = :jobType) AND " +
           "(:location IS NULL OR LOWER(j.location) LIKE CONCAT('%', :location, '%')) AND " +
           "(:category IS NULL OR LOWER(j.category) LIKE CONCAT('%', :category, '%'))")
    Page<Job> filterJobs(
            @Param("keyword") String keyword,
            @Param("jobType") JobType jobType,
            @Param("location") String location,
            @Param("category") String category,
            Pageable pageable
    );
}
