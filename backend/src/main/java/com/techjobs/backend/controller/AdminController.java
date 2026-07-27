package com.techjobs.backend.controller;

import com.techjobs.backend.dto.AdminDashboardDTO;
import com.techjobs.backend.dto.ReportDTO;
import com.techjobs.backend.security.CustomUserDetails;
import com.techjobs.backend.service.AdminService;
import com.techjobs.backend.service.ReportService;
import com.techjobs.backend.repository.UserRepository;
import com.techjobs.backend.repository.KYCVerificationRepository;
import com.techjobs.backend.dto.KYCDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;
    private final ReportService reportService;
    private final UserRepository userRepository;
    private final KYCVerificationRepository kycRepository;

    @GetMapping("/dashboard")
    public ResponseEntity<AdminDashboardDTO> getDashboard() {
        return ResponseEntity.ok(adminService.getDashboard());
    }

    @GetMapping("/reports")
    public ResponseEntity<Page<ReportDTO.ReportResponse>> getReports(
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(reportService.getAllReports(pageable));
    }

    @PutMapping("/reports/{id}/review")
    public ResponseEntity<ReportDTO.ReportResponse> reviewReport(
            @AuthenticationPrincipal CustomUserDetails admin,
            @PathVariable Long id,
            @RequestBody ReportDTO.ReviewReportRequest request) {
        return ResponseEntity.ok(reportService.reviewReport(admin.getUser().getId(), id, request));
    }

    @PutMapping("/users/{id}/role")
    public ResponseEntity<?> changeUserRole(@PathVariable Long id, @RequestBody java.util.Map<String, String> body) {
        return userRepository.findById(id).map(user -> {
            String newRole = body.get("role");
            if (newRole != null && !newRole.startsWith("ROLE_")) {
                newRole = "ROLE_" + newRole.toUpperCase();
            }
            user.setRole(newRole);
            userRepository.save(user);
            return ResponseEntity.ok().body("{\"message\":\"Role updated to " + newRole + "\"}");
        }).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/kyc-audits")
    public ResponseEntity<List<KYCDTO.KYCResponse>> getKYCAudits() {
        List<KYCDTO.KYCResponse> audits = kycRepository.findAll().stream()
                .map(KYCDTO.KYCResponse::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(audits);
    }
}
