package org.shax3.square.domain.debate.dto;

public record VoteResultDto(int leftVotes, int rightVotes) {
    public int totalVotes() {
        return leftVotes + rightVotes;
    }
}

