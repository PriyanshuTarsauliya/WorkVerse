package com.techjobs.backend.service;

import com.techjobs.backend.dto.ReportDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ReportService {
    ReportDTO.ReportResponse createReport(Long userId, Long jobId, ReportDTO.CreateReportRequest request);
    Page<ReportDTO.ReportResponse> getAllReports(Pageable pageable);
    ReportDTO.ReportResponse reviewReport(Long adminId, Long reportId, ReportDTO.ReviewReportRequest request);
}
