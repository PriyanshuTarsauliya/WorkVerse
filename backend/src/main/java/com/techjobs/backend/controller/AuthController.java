package com.techjobs.backend.controller;

import com.techjobs.backend.dto.JwtResponse;
import com.techjobs.backend.dto.LoginRequest;
import com.techjobs.backend.dto.SignupRequest;
import com.techjobs.backend.dto.ProfileDTO;
import com.techjobs.backend.entity.User;
import com.techjobs.backend.repository.UserRepository;
import com.techjobs.backend.security.CustomUserDetails;
import com.techjobs.backend.security.JwtUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    private final JwtUtils jwtUtils;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

        return ResponseEntity.ok(new JwtResponse(jwt,
                userDetails.getUser().getId(),
                userDetails.getUser().getName(),
                userDetails.getUser().getEmail(),
                userDetails.getUser().getRole()));
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody SignupRequest signUpRequest) {
        if (userRepository.findByEmail(signUpRequest.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email is already in use!"));
        }

        // Determine role
        String role = signUpRequest.getRole();
        if (role == null || role.isEmpty()) {
            role = "ROLE_USER";
        } else if (!role.startsWith("ROLE_")) {
            role = "ROLE_" + role.toUpperCase();
        }

        // Create new user's account
        User user = User.builder()
                .name(signUpRequest.getName())
                .email(signUpRequest.getEmail())
                .password(passwordEncoder.encode(signUpRequest.getPassword()))
                .role(role)
                .build();

        userRepository.save(user);

        return ResponseEntity.ok(Map.of("message", "User registered successfully!"));
    }

    /**
     * GET /api/auth/me
     * Return current authenticated user's info
     */
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@AuthenticationPrincipal CustomUserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
        }
        User user = userDetails.getUser();
        return ResponseEntity.ok(Map.of(
                "id", user.getId(),
                "name", user.getName(),
                "email", user.getEmail(),
                "role", user.getRole(),
                "kycVerified", user.getKycVerified() != null ? user.getKycVerified() : false
        ));
    }

    /**
     * POST /api/auth/refresh
     * Refresh JWT token (re-authenticate with current credentials)
     */
    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(@AuthenticationPrincipal CustomUserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
        }
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String newJwt = jwtUtils.generateJwtToken(authentication);
        User user = userDetails.getUser();
        return ResponseEntity.ok(new JwtResponse(newJwt,
                user.getId(), user.getName(), user.getEmail(), user.getRole()));
    }

    /**
     * POST /api/auth/verify-otp
     * Simulate OTP verification for signup (mock — accepts any 6-digit code)
     */
    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOTP(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String otp = request.get("otp");
        if (otp != null && otp.length() == 6) {
            return ResponseEntity.ok(Map.of(
                    "verified", true,
                    "message", "OTP verified successfully for " + email
            ));
        }
        return ResponseEntity.badRequest().body(Map.of(
                "verified", false,
                "message", "Invalid OTP. Please enter a valid 6-digit code."
        ));
    }
}
