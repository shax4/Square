package org.shax3.square.domain.debate.dto.response;

public record VoteResponse(
        int leftCount,
        int rightCount,
        int totalVoteCount
) {
    public static VoteResponse of(int leftCount, int rightCount, int totalVoteCount) {
        return new VoteResponse(leftCount, rightCount,totalVoteCount);
    }

    public static VoteResponse create() {
        return new VoteResponse(0, 0, 0);
    }
}
