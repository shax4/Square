package org.shax3.square.domain.proposal.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import org.shax3.square.domain.proposal.model.Proposal;

@Getter
@Builder
@AllArgsConstructor
public class ProposalDto {
    private Long proposalId;
    private String topic;
    private int likeCount;

    public static ProposalDto fromEntity(Proposal proposal) {
        if (proposal == null) {
            return null;
        }
        return ProposalDto.builder()
                .proposalId(proposal.getId())
                .topic(proposal.getTopic())
                .likeCount(proposal.getLikeCount())
                .build();
    }

}
