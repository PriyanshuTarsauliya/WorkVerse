package com.techjobs.backend.controller;

import com.techjobs.backend.dto.ReferralDTO;
import com.techjobs.backend.security.CustomUserDetails;
import com.techjobs.backend.service.ReferralService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/referrals")
@RequiredArgsConstructor
public class ReferralController {

    private final ReferralService referralService;

    @PostMapping
    public ResponseEntity<ReferralDTO.ReferralResponse> createReferral(
            @AuthenticationPrincipal CustomUserDetails user,
            @RequestBody ReferralDTO.CreateReferralRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(referralService.createReferral(user.getUser().getId(), request));
    }

    @GetMapping
    public ResponseEntity<List<ReferralDTO.ReferralResponse>> getUserReferrals(
            @AuthenticationPrincipal CustomUserDetails user) {
        return ResponseEntity.ok(referralService.getUserReferrals(user.getUser().getId()));
    }

    @GetMapping("/validate/{code}")
    public ResponseEntity<ReferralDTO.ValidateResponse> validateCode(@PathVariable String code) {
        return ResponseEntity.ok(referralService.validateReferralCode(code));
    }
}
