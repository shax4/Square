package org.shax3.square.domain.notification.controller;

import lombok.RequiredArgsConstructor;
import org.shax3.square.domain.auth.annotation.AuthUser;
import org.shax3.square.domain.notification.dto.response.NotificationResponseDto;
import org.shax3.square.domain.notification.service.NotificationService;
import org.shax3.square.domain.user.model.User;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    public ResponseEntity<List<NotificationResponseDto>> getMyNotifications(@AuthUser User user) {
        return ResponseEntity.ok(notificationService.getNotifications(user.getId()));
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<Void> markAsRead(@PathVariable Long id, @AuthUser User user) {
        notificationService.markAsRead(id, user.getId());
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/read-all")
    public ResponseEntity<Void> markAllAsRead(@AuthUser User user) {
        notificationService.markAllAsRead(user.getId());
        return ResponseEntity.noContent().build();
    }
}
