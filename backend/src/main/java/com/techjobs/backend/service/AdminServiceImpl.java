package com.techjobs.backend.service;

import com.techjobs.backend.dto.AdminDashboardDTO;
import com.techjobs.backend.entity.KYCStatus;
import com.techjobs.backend.entity.ReportStatus;
import com.techjobs.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;
    private final JobRepository jobRepository;
    private final JobApplicationRepository applicationRepository;
    private final JobReportRepository reportRepository;
    private final KYCVerificationRepository kycRepository;
    private final SubscriptionRepository subscriptionRepository;

    @Override
    @Transactional(readOnly = true)
    public AdminDashboardDTO getDashboard() {
        return AdminDashboardDTO.builder()
                .totalUsers(userRepository.count())
                .totalJobs(jobRepository.count())
                .totalApplications(applicationRepository.count())
                .pendingReports(reportRepository.countByStatus(ReportStatus.PENDING))
                .verifiedKYCs(kycRepository.findAll().stream()
                        .filter(v -> v.getStatus() == KYCStatus.VERIFIED).count())
                .activeSubscriptions(subscriptionRepository.count())
                .build();
    }
}
