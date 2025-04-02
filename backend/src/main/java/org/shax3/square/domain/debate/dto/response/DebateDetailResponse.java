package org.shax3.square.domain.debate.dto.response;

import org.shax3.square.domain.debate.model.Debate;
import org.shax3.square.domain.opinion.dto.OpinionDto;

import java.util.List;

public record DebateDetailResponse(
        Long debateId,
        String topic,
        String leftOption,
        String rightOption,
        boolean isScraped,
        boolean hasVoted,
        int leftCount,
        int rightCount,
        List<OpinionDto> opinions,
        Long nextLeftCursorId,
        Integer nextLeftCursorLikes,
        Integer nextLeftCursorComments,
        Long nextRightCursorId,
        Integer nextRightCursorLikes,
        Integer nextRightCursorComments
) {
    public static DebateDetailResponse of(
            Debate debate,
            boolean isScraped,
            boolean hasVoted,
            List<OpinionDto> opinions,
            Long nextLeftCursorId,
            Integer nextLeftCursorLikes,
            Integer nextLeftCursorComments,
            Long nextRightCursorId,
            Integer nextRightCursorLikes,
            Integer nextRightCursorComments,
            VoteResponse voteResponse
    ) {
        return new DebateDetailResponse(
                debate.getId(),
                debate.getTopic(),
                debate.getLeftOption(),
                debate.getRightOption(),
                isScraped,
                hasVoted,
                voteResponse.leftCount(),
                voteResponse.rightCount(),
                opinions,
                nextLeftCursorId,
                nextLeftCursorLikes,
                nextLeftCursorComments,
                nextRightCursorId,
                nextRightCursorLikes,
                nextRightCursorComments
        );
    }
}
