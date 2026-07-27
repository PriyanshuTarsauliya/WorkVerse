package com.techjobs.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "subscriptions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Subscription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Enumerated(EnumType.STRING)
    @Column(name = "plan_type", nullable = false)
    @Builder.Default
    private PlanType planType = PlanType.FREE;

    @Column(name = "razorpay_subscription_id")
    private String razorpaySubscriptionId;

    @Column(nullable = false)
    @Builder.Default
    private String status = "ACTIVE";

    @Column(name = "start_date")
    private LocalDateTime startDate;

    @Column(name = "end_date")
    private LocalDateTime endDate;

    @Column(nullable = false)
    @Builder.Default
    private Long amount = 0L;

    @Column(name = "gst_amount")
    @Builder.Default
    private Long gstAmount = 0L;

    @Column(name = "total_amount")
    @Builder.Default
    private Long totalAmount = 0L;

    @Column(name = "invoice_number")
    private String invoiceNumber;

    @Column(name = "sac_code")
    @Builder.Default
    private String sacCode = "998311";

    @Column(name = "created_at", nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @PrePersist
    protected void onCreate() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
    }
}
