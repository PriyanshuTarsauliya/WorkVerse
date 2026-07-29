package com.techjobs.backend.controller;

import com.techjobs.backend.dto.MarketDemandDto;
import com.techjobs.backend.service.CareerjetIntegrationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/insights")
public class MarketDemandController {

    private final CareerjetIntegrationService careerjetService;

    public MarketDemandController(CareerjetIntegrationService careerjetService) {
        this.careerjetService = careerjetService;
    }

    @GetMapping("/market-demand")
    public ResponseEntity<MarketDemandDto> getMarketDemand(
            @RequestParam(defaultValue = "Software Engineer") String keywords,
            @RequestParam(defaultValue = "London") String location
    ) {
        MarketDemandDto demand = careerjetService.getMarketDemand(keywords, location);
        return ResponseEntity.ok(demand);
    }
}
