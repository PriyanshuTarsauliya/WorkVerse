package com.techjobs.backend.controller;

import com.techjobs.backend.dto.JobAlertDTO;
import com.techjobs.backend.security.CustomUserDetails;
import com.techjobs.backend.service.JobAlertService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/alerts")
@RequiredArgsConstructor
public class JobAlertController {

    private final JobAlertService alertService;

    @PostMapping
    public ResponseEntity<JobAlertDTO.AlertResponse> createAlert(
            @AuthenticationPrincipal CustomUserDetails user,
            @RequestBody JobAlertDTO.CreateAlertRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(alertService.createAlert(user.getUser().getId(), request));
    }

    @GetMapping
    public ResponseEntity<List<JobAlertDTO.AlertResponse>> getUserAlerts(@AuthenticationPrincipal CustomUserDetails user) {
        return ResponseEntity.ok(alertService.getUserAlerts(user.getUser().getId()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<JobAlertDTO.AlertResponse> updateAlert(
            @AuthenticationPrincipal CustomUserDetails user,
            @PathVariable Long id,
            @RequestBody JobAlertDTO.CreateAlertRequest request) {
        return ResponseEntity.ok(alertService.updateAlert(user.getUser().getId(), id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAlert(
            @AuthenticationPrincipal CustomUserDetails user,
            @PathVariable Long id) {
        alertService.deleteAlert(user.getUser().getId(), id);
        return ResponseEntity.noContent().build();
    }
}
