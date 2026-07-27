package com.techjobs.backend.repository;

import com.techjobs.backend.entity.Referral;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReferralRepository extends JpaRepository<Referral, Long> {
    List<Referral> findByReferrerIdOrderByCreatedAtDesc(Long referrerId);
    Optional<Referral> findByReferralCode(String referralCode);
}
