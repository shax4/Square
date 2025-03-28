package org.shax3.square.domain.debate.dto.response;

public record VoteResponse(
        int leftCount,
        int rightCount,
        int leftPercent,
        int rightPercent,
        int totalVoteCount
) {
    public static VoteResponse of(int leftCount, int rightCount, int totalVoteCount) {

        int leftPercent = (int) Math.round((leftCount * 100.0) / totalVoteCount);
        int rightPercent = 100 - leftPercent;

        return new VoteResponse(leftCount, rightCount, leftPercent, rightPercent, totalVoteCount);

    }

    public static VoteResponse create() {
        return new VoteResponse(0, 0, 0, 0, 0);
    }
}
