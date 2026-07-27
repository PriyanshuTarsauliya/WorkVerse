package com.techjobs.backend.controller;

import com.techjobs.backend.dto.ReportDTO;
import com.techjobs.backend.security.CustomUserDetails;
import com.techjobs.backend.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @PostMapping("/api/v1/jobs/{jobId}/report")
    public ResponseEntity<ReportDTO.ReportResponse> reportJob(
            @AuthenticationPrincipal CustomUserDetails user,
            @PathVariable Long jobId,
            @RequestBody ReportDTO.CreateReportRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(reportService.createReport(user.getUser().getId(), jobId, request));
    }
}
