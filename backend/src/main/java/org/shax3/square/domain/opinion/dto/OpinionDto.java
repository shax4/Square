package org.shax3.square.domain.opinion.dto;

import org.shax3.square.domain.opinion.model.Opinion;
import org.shax3.square.domain.user.model.User;

import java.time.LocalDateTime;

public record OpinionDto(
        Long opinionId,
        String content,
        int likeCount,
        int commentCount,
        boolean isLeft,
        LocalDateTime createdAt,
        String nickname,
        String profileUrl,
        String userType,
        boolean isLiked
) {
    public static OpinionDto of(Opinion opinion, boolean isLiked, int commentCount, User user, String profileUrl, int likeCount) {
        return new OpinionDto(
                opinion.getId(),
                opinion.getContent(),
                likeCount,
                commentCount,
                opinion.isLeft(),
                opinion.getCreatedAt(),
                user.getNickname(),
                profileUrl,
                user.getType().name(),
                isLiked
        );
    }
}
