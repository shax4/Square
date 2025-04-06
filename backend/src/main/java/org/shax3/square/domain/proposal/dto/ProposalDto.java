package org.shax3.square.domain.proposal.dto;

import org.shax3.square.domain.proposal.model.Proposal;

public record ProposalDto(
        Long proposalId,
        String topic,
        int likeCount,
        boolean isLiked
) {
    public static ProposalDto from(Proposal proposal, boolean isLiked, int likeCount) {
        if (proposal == null) {
            return null;
        }
        return new ProposalDto(
                proposal.getId(),
                proposal.getTopic(),
                likeCount,
                isLiked
        );
    }
}
