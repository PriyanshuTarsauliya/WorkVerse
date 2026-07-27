package com.techjobs.backend.controller;

import com.techjobs.backend.dto.KYCDTO;
import com.techjobs.backend.security.CustomUserDetails;
import com.techjobs.backend.service.KYCService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/kyc")
@RequiredArgsConstructor
public class KYCController {

    private final KYCService kycService;

    @PostMapping("/initiate")
    public ResponseEntity<KYCDTO.DigilockerRedirectResponse> initiateKYC(
            @AuthenticationPrincipal CustomUserDetails user,
            @RequestBody KYCDTO.InitiateKYCRequest request) {
        return ResponseEntity.ok(kycService.initiateKYC(user.getUser().getId(), request));
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<KYCDTO.KYCResponse> verifyOTP(
            @AuthenticationPrincipal CustomUserDetails user,
            @RequestBody KYCDTO.VerifyOTPRequest request) {
        return ResponseEntity.ok(kycService.verifyOTP(user.getUser().getId(), request));
    }

    @PostMapping("/verify-pan")
    public ResponseEntity<KYCDTO.KYCResponse> verifyPAN(
            @AuthenticationPrincipal CustomUserDetails user,
            @RequestBody KYCDTO.VerifyPANRequest request) {
        return ResponseEntity.ok(kycService.verifyPAN(user.getUser().getId(), request));
    }

    @PostMapping("/verify-gstin")
    public ResponseEntity<KYCDTO.KYCResponse> verifyGSTIN(
            @AuthenticationPrincipal CustomUserDetails user,
            @RequestBody KYCDTO.VerifyGSTINRequest request) {
        return ResponseEntity.ok(kycService.verifyGSTIN(user.getUser().getId(), request));
    }

    @GetMapping("/status")
    public ResponseEntity<KYCDTO.KYCStatusResponse> getKYCStatus(
            @AuthenticationPrincipal CustomUserDetails user) {
        return ResponseEntity.ok(kycService.getKYCStatus(user.getUser().getId()));
    }
}
