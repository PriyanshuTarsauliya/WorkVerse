package com.techjobs.backend.controller;

import com.techjobs.backend.dto.NotificationDTO;
import com.techjobs.backend.security.CustomUserDetails;
import com.techjobs.backend.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    public ResponseEntity<List<NotificationDTO.NotificationResponse>> getNotifications(
            @AuthenticationPrincipal CustomUserDetails user) {
        return ResponseEntity.ok(notificationService.getUserNotifications(user.getUser().getId()));
    }

    @GetMapping("/unread-count")
    public ResponseEntity<NotificationDTO.UnreadCountResponse> getUnreadCount(
            @AuthenticationPrincipal CustomUserDetails user) {
        long count = notificationService.getUnreadCount(user.getUser().getId());
        return ResponseEntity.ok(new NotificationDTO.UnreadCountResponse(count));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<?> markAsRead(
            @AuthenticationPrincipal CustomUserDetails user,
            @PathVariable Long id) {
        notificationService.markAsRead(user.getUser().getId(), id);
        return ResponseEntity.ok().body("{\"message\":\"Marked as read\"}");
    }

    @PutMapping("/read-all")
    public ResponseEntity<?> markAllAsRead(@AuthenticationPrincipal CustomUserDetails user) {
        notificationService.markAllAsRead(user.getUser().getId());
        return ResponseEntity.ok().body("{\"message\":\"All notifications marked as read\"}");
    }
}
