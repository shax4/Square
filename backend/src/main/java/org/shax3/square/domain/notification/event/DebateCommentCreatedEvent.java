package org.shax3.square.domain.notification.event;

import org.shax3.square.domain.user.model.User;

public record DebateCommentCreatedEvent(
        User receiver,
        String commentContent,
        Long opinionId
) {
}
