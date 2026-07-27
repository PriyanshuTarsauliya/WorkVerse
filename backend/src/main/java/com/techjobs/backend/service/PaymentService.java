package com.techjobs.backend.service;

import com.techjobs.backend.dto.PaymentDTO;
import com.techjobs.backend.entity.PlanType;
import java.util.List;

public interface PaymentService {
    PaymentDTO.CreateOrderResponse createOrder(Long userId, PaymentDTO.CreateOrderRequest request);
    PaymentDTO.SubscriptionResponse verifyPayment(Long userId, PaymentDTO.VerifyPaymentRequest request);
    PaymentDTO.SubscriptionResponse getActiveSubscription(Long userId);
    List<PaymentDTO.InvoiceResponse> getUserInvoices(Long userId);
    PaymentDTO.InvoiceResponse getInvoice(Long userId, Long subscriptionId);
}
