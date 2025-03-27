package org.shax3.square.domain.debate.dto;

import org.shax3.square.domain.debate.dto.response.VoteResponse;
import org.shax3.square.domain.debate.model.Debate;
import org.shax3.square.domain.debate.model.Vote;
import org.shax3.square.domain.user.model.User;

public record DebateDto(
          Long debateId,
          String topic,
          boolean isLeft,
          int leftCount,
          int rightCount,
          int leftPercent,
          int rightPercent,
          boolean isScraped
) {

    public static DebateDto of(Vote vote, VoteResponse voteResponse, boolean isScraped) {
        return new DebateDto(
                vote.getDebate().getId(),
                vote.getDebate().getTopic(),
                vote.isLeft(),
                voteResponse.leftCount(),
                voteResponse.rightCount(),
                voteResponse.leftPercent(),
                voteResponse.rightPercent(),
                isScraped
        );
    }

    public static DebateDto of(Debate debate, boolean isLeft, VoteResponse voteResponse, boolean isScraped) {
        return new DebateDto(
                debate.getId(),
                debate.getTopic(),
                isLeft,
                voteResponse.leftCount(),
                voteResponse.rightCount(),
                voteResponse.leftPercent(),
                voteResponse.rightPercent(),
                isScraped
        );
    }

}
