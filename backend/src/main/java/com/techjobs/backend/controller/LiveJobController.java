package com.techjobs.backend.controller;

import com.techjobs.backend.dto.RemotiveJobDto;
import com.techjobs.backend.service.RemotiveIntegrationService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequestMapping("/api/jobs")
public class LiveJobController {

    private final RemotiveIntegrationService remotiveService;

    public LiveJobController(RemotiveIntegrationService remotiveService) {
        this.remotiveService = remotiveService;
    }

    @GetMapping("/live")
    public List<RemotiveJobDto> getLiveJobs() {
        return remotiveService.getLiveTechJobs();
    }
}
