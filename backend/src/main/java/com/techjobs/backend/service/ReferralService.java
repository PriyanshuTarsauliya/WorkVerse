package com.techjobs.backend.service;

import com.techjobs.backend.dto.ReferralDTO;
import java.util.List;

public interface ReferralService {
    ReferralDTO.ReferralResponse createReferral(Long userId, ReferralDTO.CreateReferralRequest request);
    List<ReferralDTO.ReferralResponse> getUserReferrals(Long userId);
    ReferralDTO.ValidateResponse validateReferralCode(String code);
}
