package com.techjobs.backend.controller;

import com.techjobs.backend.dto.SalaryGuideDTO;
import com.techjobs.backend.service.SalaryGuideService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/salary-guide")
@RequiredArgsConstructor
public class SalaryGuideController {

    private final SalaryGuideService salaryGuideService;

    @GetMapping
    public ResponseEntity<List<SalaryGuideDTO.SalaryResponse>> searchSalaries(
            @RequestParam(required = false) String role,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String experienceLevel) {
        return ResponseEntity.ok(salaryGuideService.searchSalaries(role, location, experienceLevel));
    }

    @GetMapping("/roles")
    public ResponseEntity<SalaryGuideDTO.RolesListResponse> getAvailableRoles() {
        return ResponseEntity.ok(new SalaryGuideDTO.RolesListResponse(salaryGuideService.getAvailableRoles()));
    }
}
