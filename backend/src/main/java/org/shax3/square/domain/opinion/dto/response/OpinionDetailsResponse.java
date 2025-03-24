package org.shax3.square.domain.opinion.dto.response;

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
}
