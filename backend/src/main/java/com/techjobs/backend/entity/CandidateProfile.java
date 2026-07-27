package com.techjobs.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "candidate_profiles")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CandidateProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false, unique = true)
    private Long userId;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String bio;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String education;

    @Lob
    @Column(name = "work_experience", columnDefinition = "TEXT")
    private String workExperience;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String certifications;

    @Column(name = "linkedin_url")
    private String linkedinUrl;

    @Column(name = "github_url")
    private String githubUrl;

    @Column(name = "portfolio_url")
    private String portfolioUrl;

    @Column(name = "expected_salary_min")
    private Long expectedSalaryMin;

    @Column(name = "expected_salary_max")
    private Long expectedSalaryMax;

    @Column(name = "notice_period_days")
    private Integer noticePeriodDays;

    @ElementCollection
    @CollectionTable(name = "candidate_preferred_locations", joinColumns = @JoinColumn(name = "profile_id"))
    @Column(name = "location")
    @Builder.Default
    private List<String> preferredLocations = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "candidate_preferred_categories", joinColumns = @JoinColumn(name = "profile_id"))
    @Column(name = "category")
    @Builder.Default
    private List<String> preferredCategories = new ArrayList<>();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    @PreUpdate
    protected void onSave() {
        this.updatedAt = LocalDateTime.now();
    }
}
