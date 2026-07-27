package com.techjobs.backend.service;

import com.techjobs.backend.dto.NotificationDTO;
import com.techjobs.backend.entity.NotificationType;
import java.util.List;

public interface NotificationService {
    void createNotification(Long userId, NotificationType type, String title, String message, String referenceId);
    List<NotificationDTO.NotificationResponse> getUserNotifications(Long userId);
    void markAsRead(Long userId, Long notificationId);
    void markAllAsRead(Long userId);
    long getUnreadCount(Long userId);
}
