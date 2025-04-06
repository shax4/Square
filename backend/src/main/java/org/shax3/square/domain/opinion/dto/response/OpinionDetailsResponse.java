package org.shax3.square.domain.opinion.dto.response;

import org.shax3.square.domain.opinion.model.Opinion;

import java.time.LocalDateTime;
import java.util.List;

public record OpinionDetailsResponse(
        Long opinionId,
        String nickname,
        String profileUrl,
        String userType,
        LocalDateTime createdAt,
        String content,
        int likeCount,
        int commentCount,
        boolean isLiked,
        List<CommentResponse> comments
) {
    public static OpinionDetailsResponse of(Opinion opinion, List<CommentResponse> comments, String presignedUrl, boolean isLiked, int likeCount) {
        return new OpinionDetailsResponse(
                opinion.getId(),
                opinion.getUser().getNickname(),
                presignedUrl,
                opinion.getUser().getType().name(),
                opinion.getCreatedAt(),
                opinion.getContent(),
                likeCount,
                comments.size(),
                isLiked,
                comments
        );
    }
}
