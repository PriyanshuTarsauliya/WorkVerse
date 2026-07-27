package com.techjobs.backend.service;

import com.techjobs.backend.dto.KYCDTO;
import com.techjobs.backend.entity.*;
import com.techjobs.backend.exception.ResourceNotFoundException;
import com.techjobs.backend.repository.KYCVerificationRepository;
import com.techjobs.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class KYCServiceImpl implements KYCService {

    private final KYCVerificationRepository kycRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public KYCDTO.DigilockerRedirectResponse initiateKYC(Long userId, KYCDTO.InitiateKYCRequest request) {
        // Create a pending KYC verification record
        KYCVerification verification = KYCVerification.builder()
                .userId(userId)
                .verificationType(request.getVerificationType())
                .status(KYCStatus.PENDING)
                .build();
        kycRepository.save(verification);

        // Return mock Digilocker redirect URL
        String sessionId = UUID.randomUUID().toString();
        return KYCDTO.DigilockerRedirectResponse.builder()
                .redirectUrl("https://digilocker.gov.in/auth?session=" + sessionId)
                .sessionId(sessionId)
                .message("Redirect user to Digilocker for Aadhaar verification. This is a simulated URL.")
                .build();
    }

    @Override
    @Transactional
    public KYCDTO.KYCResponse verifyOTP(Long userId, KYCDTO.VerifyOTPRequest request) {
        KYCVerification verification = kycRepository
                .findByUserIdAndVerificationType(userId, request.getVerificationType())
                .orElseThrow(() -> new ResourceNotFoundException("KYCVerification", "userId", userId));

        // Simulate OTP verification — accept any 6-digit OTP
        if (request.getOtp() != null && request.getOtp().length() == 6) {
            String kycToken = "DL-TOKEN-" + UUID.randomUUID().toString().substring(0, 12).toUpperCase();
            verification.setStatus(KYCStatus.VERIFIED);
            verification.setKycToken(kycToken);
            verification.setVerifiedAt(LocalDateTime.now());
            verification.setVerifierResponse("{\"verified\":true,\"source\":\"DigilockerMockAPI\"}");
            kycRepository.save(verification);

            // Also update user's KYC status
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
            user.setKycVerified(true);
            user.setKycToken(kycToken);
            userRepository.save(user);

            KYCDTO.KYCResponse response = KYCDTO.KYCResponse.fromEntity(verification);
            response.setMessage("Aadhaar verification successful. Tokenized reference stored.");
            return response;
        }

        KYCDTO.KYCResponse response = KYCDTO.KYCResponse.fromEntity(verification);
        response.setMessage("Invalid OTP. Please enter a valid 6-digit OTP.");
        return response;
    }

    @Override
    @Transactional
    public KYCDTO.KYCResponse verifyPAN(Long userId, KYCDTO.VerifyPANRequest request) {
        // Validate PAN format: 5 uppercase letters + 4 digits + 1 uppercase letter
        String pan = request.getPanNumber();
        boolean validFormat = pan != null && pan.matches("[A-Z]{5}[0-9]{4}[A-Z]");

        KYCVerification verification = kycRepository
                .findByUserIdAndVerificationType(userId, KYCType.PAN)
                .orElse(KYCVerification.builder().userId(userId).verificationType(KYCType.PAN).build());

        if (validFormat) {
            verification.setStatus(KYCStatus.VERIFIED);
            verification.setKycToken("PAN-" + pan.substring(0, 3) + "****" + pan.substring(pan.length() - 1));
            verification.setVerifiedAt(LocalDateTime.now());
            verification.setVerifierResponse("{\"verified\":true,\"panValid\":true}");
        } else {
            verification.setStatus(KYCStatus.REJECTED);
            verification.setVerifierResponse("{\"verified\":false,\"reason\":\"Invalid PAN format\"}");
        }
        kycRepository.save(verification);

        KYCDTO.KYCResponse response = KYCDTO.KYCResponse.fromEntity(verification);
        response.setMessage(validFormat ? "PAN verification successful." : "Invalid PAN format. Expected: ABCDE1234F");
        return response;
    }

    @Override
    @Transactional
    public KYCDTO.KYCResponse verifyGSTIN(Long userId, KYCDTO.VerifyGSTINRequest request) {
        // Validate GSTIN format: 2 digits + PAN (10 chars) + 1 digit + Z + 1 char
        String gstin = request.getGstin();
        boolean validFormat = gstin != null && gstin.matches("[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][0-9A-Z]{1}Z[0-9A-Z]");

        KYCVerification verification = kycRepository
                .findByUserIdAndVerificationType(userId, KYCType.GSTIN)
                .orElse(KYCVerification.builder().userId(userId).verificationType(KYCType.GSTIN).build());

        if (validFormat) {
            verification.setStatus(KYCStatus.VERIFIED);
            verification.setKycToken("GSTIN-" + gstin.substring(0, 4) + "****");
            verification.setVerifiedAt(LocalDateTime.now());
            verification.setVerifierResponse("{\"verified\":true,\"gstinValid\":true,\"businessName\":\"Verified Business\"}");
        } else {
            verification.setStatus(KYCStatus.REJECTED);
            verification.setVerifierResponse("{\"verified\":false,\"reason\":\"Invalid GSTIN format\"}");
        }
        kycRepository.save(verification);

        KYCDTO.KYCResponse response = KYCDTO.KYCResponse.fromEntity(verification);
        response.setMessage(validFormat ? "GSTIN verification successful." : "Invalid GSTIN format.");
        return response;
    }

    @Override
    @Transactional(readOnly = true)
    public KYCDTO.KYCStatusResponse getKYCStatus(Long userId) {
        List<KYCVerification> verifications = kycRepository.findByUserId(userId);
        boolean overallVerified = verifications.stream()
                .anyMatch(v -> v.getStatus() == KYCStatus.VERIFIED);
        return KYCDTO.KYCStatusResponse.builder()
                .verifications(verifications.stream().map(KYCDTO.KYCResponse::fromEntity).collect(Collectors.toList()))
                .overallVerified(overallVerified)
                .build();
    }
}
