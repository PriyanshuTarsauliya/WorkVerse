package com.techjobs.backend.repository;

import com.techjobs.backend.entity.JobReport;
import com.techjobs.backend.entity.ReportStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JobReportRepository extends JpaRepository<JobReport, Long> {
    Page<JobReport> findByStatusOrderByCreatedAtDesc(ReportStatus status, Pageable pageable);
    Page<JobReport> findAllByOrderByCreatedAtDesc(Pageable pageable);
    long countByStatus(ReportStatus status);
}
