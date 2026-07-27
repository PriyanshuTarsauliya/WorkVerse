package com.techjobs.backend.dto;

import com.techjobs.backend.entity.Notification;
import com.techjobs.backend.entity.NotificationType;
import lombok.*;

import java.time.LocalDateTime;

public class NotificationDTO {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class NotificationResponse {
        private Long id;
        private NotificationType type;
        private String title;
        private String message;
        private Boolean isRead;
        private String referenceId;
        private LocalDateTime createdAt;

        public static NotificationResponse fromEntity(Notification n) {
            return NotificationResponse.builder()
                    .id(n.getId())
                    .type(n.getType())
                    .title(n.getTitle())
                    .message(n.getMessage())
                    .isRead(n.getIsRead())
                    .referenceId(n.getReferenceId())
                    .createdAt(n.getCreatedAt())
                    .build();
        }
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UnreadCountResponse {
        private long unreadCount;
    }
}
