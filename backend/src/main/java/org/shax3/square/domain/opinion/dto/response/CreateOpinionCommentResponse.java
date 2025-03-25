package org.shax3.square.domain.opinion.dto.response;

import org.shax3.square.domain.opinion.model.OpinionComment;

public record CreateOpinionCommentResponse(
        Long commentId,
        String profileUrl
) {

    public static CreateOpinionCommentResponse of(OpinionComment comment, String profileUrl) {
        return new CreateOpinionCommentResponse(comment.getId(), profileUrl);
    }
}
