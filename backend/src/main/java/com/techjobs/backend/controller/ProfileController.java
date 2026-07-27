package com.techjobs.backend.controller;

import com.techjobs.backend.dto.ProfileDTO;
import com.techjobs.backend.security.CustomUserDetails;
import com.techjobs.backend.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;

    @GetMapping
    public ResponseEntity<ProfileDTO.UserProfileResponse> getProfile(@AuthenticationPrincipal CustomUserDetails user) {
        return ResponseEntity.ok(profileService.getProfile(user.getUser().getId()));
    }

    @PutMapping
    public ResponseEntity<ProfileDTO.UserProfileResponse> updateProfile(
            @AuthenticationPrincipal CustomUserDetails user,
            @RequestBody ProfileDTO.UpdateProfileRequest request) {
        return ResponseEntity.ok(profileService.updateProfile(user.getUser().getId(), request));
    }

    @PostMapping("/dpdp-consent")
    public ResponseEntity<?> grantDPDPConsent(@AuthenticationPrincipal CustomUserDetails user) {
        profileService.grantDPDPConsent(user.getUser().getId());
        return ResponseEntity.ok().body("{\"message\":\"DPDP consent recorded\"}");
    }

    @GetMapping("/data-export")
    public ResponseEntity<String> exportUserData(@AuthenticationPrincipal CustomUserDetails user) {
        String data = profileService.exportUserData(user.getUser().getId());
        return ResponseEntity.ok()
                .header("Content-Disposition", "attachment; filename=workverse-data-export.json")
                .body(data);
    }

    @DeleteMapping("/data")
    public ResponseEntity<?> eraseUserData(@AuthenticationPrincipal CustomUserDetails user) {
        profileService.eraseUserData(user.getUser().getId());
        return ResponseEntity.ok().body("{\"message\":\"User data erased per DPDP Act request\"}");
    }
}
