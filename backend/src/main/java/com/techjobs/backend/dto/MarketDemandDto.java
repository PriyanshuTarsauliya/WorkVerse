package com.techjobs.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MarketDemandDto {
    
    @JsonProperty("posting_count")
    private long postingCount;
    
    @JsonProperty("posting_count_level")
    private String postingCountLevel;
}
