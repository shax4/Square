package org.shax3.square.domain.debate.dto.response;

import org.shax3.square.domain.debate.dto.VoteResultDto;

public record VoteResponse(
        int leftCount,
        int rightCount,
        int leftPercent,
        int rightPercent,
        int totalVoteCount
        )
{
        public static VoteResponse of(VoteResultDto dto) {

                int leftCount = dto.leftVotes();
                int rightCount = dto.rightVotes();
                int totalVoteCount = dto.totalVotes();
                int leftPercent = (int) Math.round((leftCount * 100.0) / totalVoteCount);
                int rightPercent = 100 - leftPercent;

                return new VoteResponse(leftCount, rightCount, leftPercent, rightPercent, totalVoteCount);

        }
}
