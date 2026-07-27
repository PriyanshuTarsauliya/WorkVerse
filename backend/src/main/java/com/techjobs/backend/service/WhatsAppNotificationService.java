package com.techjobs.backend.service;

public interface WhatsAppNotificationService {
    boolean sendWhatsAppInterviewAlert(String candidatePhone, String candidateName, String jobTitle, String companyName, String scheduledTime, String meetingLink);
    boolean sendWhatsAppOfferAlert(String candidatePhone, String candidateName, String jobTitle, String companyName, String offerDetails);
}
