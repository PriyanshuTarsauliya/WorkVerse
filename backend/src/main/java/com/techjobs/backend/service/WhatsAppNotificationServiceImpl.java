package com.techjobs.backend.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class WhatsAppNotificationServiceImpl implements WhatsAppNotificationService {

    @Override
    public boolean sendWhatsAppInterviewAlert(String candidatePhone, String candidateName, String jobTitle, String companyName, String scheduledTime, String meetingLink) {
        log.info("📲 WhatsApp Alert Dispatched to {}: Hi {}, your interview for '{}' at {} has been scheduled for {}. Join: {}",
                candidatePhone, candidateName, jobTitle, companyName, scheduledTime, meetingLink);
        // Simulated WhatsApp Gateway integration (Twilio / Gupshup / Kaleyra API)
        return true;
    }

    @Override
    public boolean sendWhatsAppOfferAlert(String candidatePhone, String candidateName, String jobTitle, String companyName, String offerDetails) {
        log.info("🎉 WhatsApp Offer Alert Dispatched to {}: Congratulations {}! You have received a job offer for '{}' at {}. Details: {}",
                candidatePhone, candidateName, jobTitle, companyName, offerDetails);
        return true;
    }
}
