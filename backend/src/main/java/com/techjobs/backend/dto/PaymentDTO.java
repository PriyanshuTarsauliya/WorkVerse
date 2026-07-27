package com.techjobs.backend.dto;

import com.techjobs.backend.entity.PlanType;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

public class PaymentDTO {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CreateOrderRequest {
        private PlanType planType;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CreateOrderResponse {
        private String razorpayOrderId;
        private Long amount;
        private Long gstAmount;
        private Long totalAmount;
        private String currency;
        private String sacCode;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class VerifyPaymentRequest {
        private String razorpayPaymentId;
        private String razorpayOrderId;
        private String razorpaySignature;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SubscriptionResponse {
        private Long id;
        private PlanType planType;
        private String status;
        private LocalDateTime startDate;
        private LocalDateTime endDate;
        private Long amount;
        private Long gstAmount;
        private Long totalAmount;
        private String invoiceNumber;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class InvoiceResponse {
        private String invoiceNumber;
        private String subscriberName;
        private String subscriberEmail;
        private PlanType planType;
        private Long baseAmount;
        private Long cgstAmount;
        private Long sgstAmount;
        private Long igstAmount;
        private Long totalAmount;
        private String sacCode;
        private String currency;
        private LocalDateTime invoiceDate;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class InvoiceListResponse {
        private List<InvoiceResponse> invoices;
    }
}
