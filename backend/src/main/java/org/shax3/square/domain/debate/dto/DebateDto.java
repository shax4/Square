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

    public static DebateDto of(User user, Vote vote, VoteResponse voteResponse, boolean isScraped) {
        Debate debate = vote.getDebate();

        return new DebateDto(
                debate.getId(),
                debate.getTopic(),
                vote.isLeft(),
                voteResponse.leftCount(),
                voteResponse.rightCount(),
                voteResponse.leftPercent(),
                voteResponse.rightPercent(),
                isScraped
        );
    }
}
