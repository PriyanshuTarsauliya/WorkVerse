package com.techjobs.backend.controller;

import com.techjobs.backend.dto.PaymentDTO;
import com.techjobs.backend.security.CustomUserDetails;
import com.techjobs.backend.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/create-order")
    public ResponseEntity<PaymentDTO.CreateOrderResponse> createOrder(
            @AuthenticationPrincipal CustomUserDetails user,
            @RequestBody PaymentDTO.CreateOrderRequest request) {
        return ResponseEntity.ok(paymentService.createOrder(user.getUser().getId(), request));
    }

    @PostMapping("/verify")
    public ResponseEntity<PaymentDTO.SubscriptionResponse> verifyPayment(
            @AuthenticationPrincipal CustomUserDetails user,
            @RequestBody PaymentDTO.VerifyPaymentRequest request) {
        return ResponseEntity.ok(paymentService.verifyPayment(user.getUser().getId(), request));
    }

    @GetMapping("/subscription")
    public ResponseEntity<PaymentDTO.SubscriptionResponse> getSubscription(
            @AuthenticationPrincipal CustomUserDetails user) {
        return ResponseEntity.ok(paymentService.getActiveSubscription(user.getUser().getId()));
    }

    @GetMapping("/invoices")
    public ResponseEntity<List<PaymentDTO.InvoiceResponse>> getInvoices(
            @AuthenticationPrincipal CustomUserDetails user) {
        return ResponseEntity.ok(paymentService.getUserInvoices(user.getUser().getId()));
    }

    @GetMapping("/invoices/{subscriptionId}")
    public ResponseEntity<PaymentDTO.InvoiceResponse> getInvoice(
            @AuthenticationPrincipal CustomUserDetails user,
            @PathVariable Long subscriptionId) {
        return ResponseEntity.ok(paymentService.getInvoice(user.getUser().getId(), subscriptionId));
    }
}
