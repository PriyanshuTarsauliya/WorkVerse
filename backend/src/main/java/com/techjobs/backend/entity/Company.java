package com.techjobs.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "companies")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Company {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String industry;

    private String location;

    @Enumerated(EnumType.STRING)
    @Column(name = "company_size")
    private CompanySize companySize;

    @Column(name = "rating")
    private Double rating;

    @Column(name = "review_count")
    @Builder.Default
    private Integer reviewCount = 0;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "logo_url")
    private String logoUrl;

    @Column(name = "website_url")
    private String websiteUrl;

    @ElementCollection
    @CollectionTable(name = "company_tech_stack", joinColumns = @JoinColumn(name = "company_id"))
    @Column(name = "tech")
    @Builder.Default
    private List<String> techStack = new ArrayList<>();

    @Column(name = "funding_stage")
    private String fundingStage;

    @Column(name = "is_verified")
    @Builder.Default
    private Boolean isVerified = false;
}
