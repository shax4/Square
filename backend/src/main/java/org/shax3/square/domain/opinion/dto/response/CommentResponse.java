package org.shax3.square.domain.opinion.dto.response;

import org.shax3.square.domain.opinion.model.OpinionComment;

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
    public static CommentResponse of(OpinionComment comment, String profileUrl, boolean isLiked, int likeCount) {
        return new CommentResponse(
                comment.getId(),
                comment.getUser().getNickname(),
                profileUrl,
                comment.getUser().getType().name(),
                comment.getCreatedAt(),
                likeCount,
                comment.getContent(),
                isLiked
        );
    }
}
