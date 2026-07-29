package com.techjobs.backend.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import java.util.List;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class LiveJobDto {
    private String id;
    private String url;
    private String title;
    
    @JsonProperty("company_name")
    private String companyName;
    
    @JsonProperty("company_logo")
    private String companyLogoUrl;
    
    private String category;
    
    @JsonProperty("candidate_required_location")
    private String location;
    
    private String salary;
    private List<String> tags;
    
    @JsonProperty("publication_date")
    private String publicationDate;
}
