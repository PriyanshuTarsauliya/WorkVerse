package com.techjobs.backend.service;

import com.techjobs.backend.dto.RemotiveJobDto;
import com.techjobs.backend.dto.RemotiveResponseDto;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.ResponseEntity;
import lombok.extern.slf4j.Slf4j;
import java.util.List;
import java.util.ArrayList;

@Slf4j
@Service
public class RemotiveIntegrationService {

    private final RestTemplate restTemplate;
    private static final String REMOTIVE_API_URL = "https://remotive.com/api/remote-jobs?category=software-dev&limit=15";

    public RemotiveIntegrationService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public List<RemotiveJobDto> getLiveTechJobs() {
        try {
            ResponseEntity<RemotiveResponseDto> response = restTemplate.getForEntity(REMOTIVE_API_URL, RemotiveResponseDto.class);
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                return response.getBody().getJobs();
            }
        } catch (Exception e) {
            log.error("Failed to fetch live jobs from Remotive: {}", e.getMessage());
        }
        return new ArrayList<>();
    }
}
