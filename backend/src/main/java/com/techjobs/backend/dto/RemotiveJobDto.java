package com.techjobs.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RemotiveJobDto {
    private Long id;
    private String url;
    private String title;
    @JsonProperty("company_name")
    private String companyName;
    @JsonProperty("company_logo")
    private String companyLogo;
    private String category;
    private List<String> tags;
    @JsonProperty("job_type")
    private String jobType;
    @JsonProperty("publication_date")
    private String publicationDate;
    @JsonProperty("candidate_required_location")
    private String candidateRequiredLocation;
    private String salary;
    private String description;
}
