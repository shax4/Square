package org.shax3.square.domain.notification.dto.response;

import org.shax3.square.domain.notification.model.Notification;

import java.time.LocalDateTime;

public record NotificationResponseDto(
        Long id,
        String title,
        String message,
        String type,
        Long targetId,
        boolean isRead,
        LocalDateTime createdAt
) {
    public static NotificationResponseDto from(Notification notification) {
        return new NotificationResponseDto(
                notification.getId(),
                notification.getTitle(),
                notification.getMessage(),
                notification.getType().name(),
                notification.getTargetId(),
                notification.isRead(),
                notification.getCreatedAt()
        );
    }
}
