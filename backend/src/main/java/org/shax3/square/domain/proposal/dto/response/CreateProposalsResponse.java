package org.shax3.square.domain.proposal.dto.response;

public record CreateProposalsResponse(Long proposalId) {

    public static CreateProposalsResponse of(Long id) {
        return new CreateProposalsResponse(id);
    }
}


