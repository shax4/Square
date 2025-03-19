package org.shax3.square.domain.proposal.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
@AllArgsConstructor
public class CreateProposalsResponse {
    public Long proposalId;
}
