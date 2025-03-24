package org.shax3.square.domain.opinion.dto.response;

import java.time.LocalDateTime;

public record CommentResponse(
        Long commentId,
        String nickname,
        String profileUrl,
        String userType,
        LocalDateTime createdAt,
        int likeCount,
        String content,
        boolean isLiked
) {
}
