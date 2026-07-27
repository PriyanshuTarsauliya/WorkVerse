package com.techjobs.backend.service;

import com.techjobs.backend.dto.ReferralDTO;
import com.techjobs.backend.entity.Referral;
import com.techjobs.backend.entity.User;
import com.techjobs.backend.exception.ResourceNotFoundException;
import com.techjobs.backend.repository.ReferralRepository;
import com.techjobs.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReferralServiceImpl implements ReferralService {

    private final ReferralRepository referralRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public ReferralDTO.ReferralResponse createReferral(Long userId, ReferralDTO.CreateReferralRequest req) {
        String code = "WV-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        Referral referral = Referral.builder()
                .referrerId(userId)
                .refereeEmail(req.getRefereeEmail())
                .jobId(req.getJobId())
                .referralCode(code)
                .build();
        return ReferralDTO.ReferralResponse.fromEntity(referralRepository.save(referral));
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReferralDTO.ReferralResponse> getUserReferrals(Long userId) {
        return referralRepository.findByReferrerIdOrderByCreatedAtDesc(userId).stream()
                .map(ReferralDTO.ReferralResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public ReferralDTO.ValidateResponse validateReferralCode(String code) {
        return referralRepository.findByReferralCode(code)
                .map(referral -> {
                    String referrerName = userRepository.findById(referral.getReferrerId())
                            .map(User::getName).orElse("WorkVerse User");
                    return ReferralDTO.ValidateResponse.builder()
                            .valid(true)
                            .referrerName(referrerName)
                            .message("Valid referral from " + referrerName)
                            .build();
                })
                .orElse(ReferralDTO.ValidateResponse.builder()
                        .valid(false)
                        .message("Invalid referral code.")
                        .build());
    }
}
