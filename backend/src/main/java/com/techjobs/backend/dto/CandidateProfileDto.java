package com.techjobs.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CandidateProfileDto {
    private String name;
    private String headline;
    private String role;
    private String location;
    private Integer experienceYears;
    private List<Object> skills; // Can be strings or objects with 'name' property
}
