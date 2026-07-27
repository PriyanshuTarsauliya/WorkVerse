package com.techjobs.backend.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminDashboardDTO {
    private long totalUsers;
    private long totalJobs;
    private long totalApplications;
    private long pendingReports;
    private long verifiedKYCs;
    private long activeSubscriptions;
}
