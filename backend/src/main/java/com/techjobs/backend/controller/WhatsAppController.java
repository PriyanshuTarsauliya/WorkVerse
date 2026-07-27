package com.techjobs.backend.controller;

import com.techjobs.backend.security.CustomUserDetails;
import com.techjobs.backend.service.WhatsAppNotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/notifications/whatsapp")
@RequiredArgsConstructor
public class WhatsAppController {

    private final WhatsAppNotificationService whatsAppService;

    @PostMapping("/test-interview-alert")
    public ResponseEntity<?> sendTestInterviewAlert(
            @AuthenticationPrincipal CustomUserDetails user,
            @RequestBody Map<String, String> payload) {
        String phone = payload.getOrDefault("phone", user.getUser().getPhone() != null ? user.getUser().getPhone() : "+919876543210");
        String candidateName = payload.getOrDefault("candidateName", user.getUser().getName());
        String jobTitle = payload.getOrDefault("jobTitle", "Senior Software Engineer");
        String companyName = payload.getOrDefault("companyName", "Razorpay");
        String time = payload.getOrDefault("scheduledTime", "Tomorrow at 2:00 PM IST");
        String link = payload.getOrDefault("meetingLink", "https://meet.google.com/wv-interview-demo");

        boolean sent = whatsAppService.sendWhatsAppInterviewAlert(phone, candidateName, jobTitle, companyName, time, link);
        return ResponseEntity.ok(Map.of(
                "success", sent,
                "recipient", phone,
                "message", "WhatsApp interview alert dispatched via Twilio/Gupshup API gateway."
        ));
    }
}
