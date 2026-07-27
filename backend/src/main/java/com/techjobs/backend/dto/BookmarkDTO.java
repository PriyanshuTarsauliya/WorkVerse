package com.techjobs.backend.dto;

import lombok.*;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookmarkDTO {
    private Long id;
    private Long jobId;
    private boolean bookmarked;
    private LocalDateTime createdAt;
    private JobResponseDTO job;
}
