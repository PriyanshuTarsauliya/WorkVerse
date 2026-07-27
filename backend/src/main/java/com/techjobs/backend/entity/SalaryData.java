package com.techjobs.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "salary_data")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SalaryData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String role;

    @Column(nullable = false)
    private String location;

    @Column(name = "experience_level", nullable = false)
    private String experienceLevel;

    @Column(name = "salary_min", nullable = false)
    private Long salaryMin;

    @Column(name = "salary_max", nullable = false)
    private Long salaryMax;

    @Column(nullable = false)
    @Builder.Default
    private String currency = "INR";

    @Column(name = "sample_size")
    @Builder.Default
    private Integer sampleSize = 100;

    @Column(name = "last_updated")
    @Builder.Default
    private LocalDateTime lastUpdated = LocalDateTime.now();
}
