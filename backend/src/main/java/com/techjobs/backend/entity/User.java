package com.techjobs.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    @Builder.Default
    private String role = "ROLE_USER";

    // ── Extended Profile Fields ──
    private String phone;

    private String headline;

    private String location;

    @Column(name = "experience_years")
    private Integer experienceYears;

    @ElementCollection
    @CollectionTable(name = "user_skills", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "skill")
    @Builder.Default
    private List<String> skills = new ArrayList<>();

    @Column(name = "preferred_remote")
    @Builder.Default
    private Boolean preferredRemote = false;

    @Column(name = "resume_url")
    private String resumeUrl;

    @Column(name = "avatar_url")
    private String avatarUrl;

    // ── KYC Fields ──
    @Column(name = "kyc_verified")
    @Builder.Default
    private Boolean kycVerified = false;

    @Column(name = "kyc_token")
    private String kycToken;

    // ── DPDP Compliance Fields ──
    @Column(name = "dpdp_consent_given")
    @Builder.Default
    private Boolean dpdpConsentGiven = false;

    @Column(name = "dpdp_consent_date")
    private LocalDateTime dpdpConsentDate;

    @Column(name = "created_at", nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @PrePersist
    protected void onCreate() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
    }
}
