package com.techjobs.backend.service;

import com.techjobs.backend.dto.KYCDTO;
import java.util.List;

public interface KYCService {
    KYCDTO.DigilockerRedirectResponse initiateKYC(Long userId, KYCDTO.InitiateKYCRequest request);
    KYCDTO.KYCResponse verifyOTP(Long userId, KYCDTO.VerifyOTPRequest request);
    KYCDTO.KYCResponse verifyPAN(Long userId, KYCDTO.VerifyPANRequest request);
    KYCDTO.KYCResponse verifyGSTIN(Long userId, KYCDTO.VerifyGSTINRequest request);
    KYCDTO.KYCStatusResponse getKYCStatus(Long userId);
}
