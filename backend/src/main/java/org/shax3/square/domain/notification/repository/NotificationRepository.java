package org.shax3.square.domain.notification.repository;

import org.shax3.square.domain.notification.model.Notification;
import org.shax3.square.domain.user.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findAllByUser(User user);

    List<Notification> findAllByUserOrderByCreatedAtDesc(User user);

}
