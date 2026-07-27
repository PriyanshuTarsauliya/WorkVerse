package com.techjobs.backend.repository;

import com.techjobs.backend.entity.Subscription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {
    Optional<Subscription> findTopByUserIdOrderByCreatedAtDesc(Long userId);
    List<Subscription> findByUserId(Long userId);
}
