package com.techjobs.backend.service;

import com.techjobs.backend.dto.PaymentDTO;
import com.techjobs.backend.entity.*;
import com.techjobs.backend.exception.ResourceNotFoundException;
import com.techjobs.backend.repository.PaymentTransactionRepository;
import com.techjobs.backend.repository.SubscriptionRepository;
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
public class PaymentServiceImpl implements PaymentService {

    private final SubscriptionRepository subscriptionRepository;
    private final PaymentTransactionRepository paymentRepository;
    private final UserRepository userRepository;

    private static final long PRO_PRICE = 99900L; // ₹999 in paise
    private static final long ENTERPRISE_PRICE = 499900L; // ₹4999 in paise
    private static final double GST_RATE = 0.18;

    @Override
    @Transactional
    public PaymentDTO.CreateOrderResponse createOrder(Long userId, PaymentDTO.CreateOrderRequest request) {
        long baseAmount = switch (request.getPlanType()) {
            case PRO -> PRO_PRICE;
            case ENTERPRISE -> ENTERPRISE_PRICE;
            default -> 0L;
        };

        long gstAmount = Math.round(baseAmount * GST_RATE);
        long totalAmount = baseAmount + gstAmount;

        // Create mock Razorpay order
        String orderId = "order_" + UUID.randomUUID().toString().substring(0, 16);

        PaymentTransaction transaction = PaymentTransaction.builder()
                .userId(userId)
                .razorpayOrderId(orderId)
                .amount(totalAmount)
                .currency("INR")
                .status(PaymentStatus.CREATED)
                .build();
        paymentRepository.save(transaction);

        return PaymentDTO.CreateOrderResponse.builder()
                .razorpayOrderId(orderId)
                .amount(baseAmount)
                .gstAmount(gstAmount)
                .totalAmount(totalAmount)
                .currency("INR")
                .sacCode("998311")
                .build();
    }

    @Override
    @Transactional
    public PaymentDTO.SubscriptionResponse verifyPayment(Long userId, PaymentDTO.VerifyPaymentRequest request) {
        // Simulate HMAC-SHA256 signature verification — always pass in mock mode
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        // Create subscription
        long baseAmount = PRO_PRICE;
        long gstAmount = Math.round(baseAmount * GST_RATE);
        String invoiceNumber = "WV-INV-" + System.currentTimeMillis();

        Subscription subscription = Subscription.builder()
                .userId(userId)
                .planType(PlanType.PRO)
                .razorpaySubscriptionId(request.getRazorpayPaymentId())
                .status("ACTIVE")
                .startDate(LocalDateTime.now())
                .endDate(LocalDateTime.now().plusMonths(1))
                .amount(baseAmount)
                .gstAmount(gstAmount)
                .totalAmount(baseAmount + gstAmount)
                .invoiceNumber(invoiceNumber)
                .build();
        subscriptionRepository.save(subscription);

        return PaymentDTO.SubscriptionResponse.builder()
                .id(subscription.getId())
                .planType(subscription.getPlanType())
                .status(subscription.getStatus())
                .startDate(subscription.getStartDate())
                .endDate(subscription.getEndDate())
                .amount(subscription.getAmount())
                .gstAmount(subscription.getGstAmount())
                .totalAmount(subscription.getTotalAmount())
                .invoiceNumber(subscription.getInvoiceNumber())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public PaymentDTO.SubscriptionResponse getActiveSubscription(Long userId) {
        Subscription sub = subscriptionRepository.findTopByUserIdOrderByCreatedAtDesc(userId)
                .orElse(Subscription.builder().planType(PlanType.FREE).status("ACTIVE").build());
        return PaymentDTO.SubscriptionResponse.builder()
                .id(sub.getId())
                .planType(sub.getPlanType())
                .status(sub.getStatus())
                .startDate(sub.getStartDate())
                .endDate(sub.getEndDate())
                .amount(sub.getAmount())
                .gstAmount(sub.getGstAmount())
                .totalAmount(sub.getTotalAmount())
                .invoiceNumber(sub.getInvoiceNumber())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public List<PaymentDTO.InvoiceResponse> getUserInvoices(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        return subscriptionRepository.findByUserId(userId).stream()
                .filter(s -> s.getInvoiceNumber() != null)
                .map(s -> buildInvoice(s, user))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public PaymentDTO.InvoiceResponse getInvoice(Long userId, Long subscriptionId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        Subscription sub = subscriptionRepository.findById(subscriptionId)
                .orElseThrow(() -> new ResourceNotFoundException("Subscription", "id", subscriptionId));
        if (!sub.getUserId().equals(userId)) throw new RuntimeException("Unauthorized");
        return buildInvoice(sub, user);
    }

    private PaymentDTO.InvoiceResponse buildInvoice(Subscription sub, User user) {
        long cgst = sub.getGstAmount() / 2;
        long sgst = sub.getGstAmount() - cgst;
        return PaymentDTO.InvoiceResponse.builder()
                .invoiceNumber(sub.getInvoiceNumber())
                .subscriberName(user.getName())
                .subscriberEmail(user.getEmail())
                .planType(sub.getPlanType())
                .baseAmount(sub.getAmount())
                .cgstAmount(cgst)
                .sgstAmount(sgst)
                .igstAmount(0L)
                .totalAmount(sub.getTotalAmount())
                .sacCode(sub.getSacCode())
                .currency("INR")
                .invoiceDate(sub.getStartDate())
                .build();
    }
}
