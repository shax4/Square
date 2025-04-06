package org.shax3.square.domain.notification.service;

import org.shax3.square.domain.notification.model.Notification;
import org.shax3.square.domain.notification.model.NotificationType;
import org.shax3.square.domain.notification.repository.NotificationRepository;
import org.shax3.square.domain.user.model.User;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NotificationService {

	private final NotificationRepository notificationRepository;

	public void createNotification(User receiver, String title, String message, NotificationType type, Long targetId) {
		Notification notification = Notification.builder()
			.user(receiver)
			.title(title)
			.message(message)
			.type(type)
			.targetId(targetId)
			.build();

		notificationRepository.save(notification);

		// TODO: FCM 푸시 알림 전송
	}
}
