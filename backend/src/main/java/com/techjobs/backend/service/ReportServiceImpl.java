package com.techjobs.backend.service;

import com.techjobs.backend.dto.ReportDTO;
import com.techjobs.backend.entity.JobReport;
import com.techjobs.backend.exception.ResourceNotFoundException;
import com.techjobs.backend.repository.JobReportRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class ReportServiceImpl implements ReportService {

    private final JobReportRepository reportRepository;

    @Override
    @Transactional
    public ReportDTO.ReportResponse createReport(Long userId, Long jobId, ReportDTO.CreateReportRequest req) {
        JobReport report = JobReport.builder()
                .reporterId(userId)
                .jobId(jobId)
                .reason(req.getReason())
                .description(req.getDescription())
                .build();
        return ReportDTO.ReportResponse.fromEntity(reportRepository.save(report));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ReportDTO.ReportResponse> getAllReports(Pageable pageable) {
        return reportRepository.findAllByOrderByCreatedAtDesc(pageable)
                .map(ReportDTO.ReportResponse::fromEntity);
    }

    @Override
    @Transactional
    public ReportDTO.ReportResponse reviewReport(Long adminId, Long reportId, ReportDTO.ReviewReportRequest req) {
        JobReport report = reportRepository.findById(reportId)
                .orElseThrow(() -> new ResourceNotFoundException("JobReport", "id", reportId));
        report.setStatus(req.getStatus());
        report.setReviewedBy(adminId);
        report.setReviewedAt(LocalDateTime.now());
        return ReportDTO.ReportResponse.fromEntity(reportRepository.save(report));
    }
}
