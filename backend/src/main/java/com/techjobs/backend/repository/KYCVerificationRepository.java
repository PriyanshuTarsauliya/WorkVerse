package com.techjobs.backend.repository;

import com.techjobs.backend.entity.KYCVerification;
import com.techjobs.backend.entity.KYCType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface KYCVerificationRepository extends JpaRepository<KYCVerification, Long> {
    List<KYCVerification> findByUserId(Long userId);
    Optional<KYCVerification> findByUserIdAndVerificationType(Long userId, KYCType verificationType);
}
