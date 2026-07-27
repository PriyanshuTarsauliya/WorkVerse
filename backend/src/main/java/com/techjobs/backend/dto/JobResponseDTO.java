package com.techjobs.backend.dto;

import com.techjobs.backend.entity.Job;
import com.techjobs.backend.entity.JobType;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobResponseDTO {

    private Long id;
    private String title;
    private String company;
    private String location;
    private JobType jobType;
    private String category;
    private String salaryRange;
    private String description;
    private List<String> techStack;
    private long applicationCount;
    private LocalDateTime createdAt;

    public static JobResponseDTO fromEntity(Job job, long applicationCount) {
        return JobResponseDTO.builder()
                .id(job.getId())
                .title(job.getTitle())
                .company(job.getCompany())
                .location(job.getLocation())
                .jobType(job.getJobType())
                .category(job.getCategory())
                .salaryRange(job.getSalaryRange())
                .description(job.getDescription())
                .techStack(job.getTechStack())
                .applicationCount(applicationCount)
                .createdAt(job.getCreatedAt())
                .build();
    }
}
