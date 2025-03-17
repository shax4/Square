package org.shax3.square.domain.proposal.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.shax3.square.domain.proposal.dto.ProposalDto;

import java.util.List;

@Getter
@AllArgsConstructor
public class ProposalsResponse {
    private List<ProposalDto> proposals;
    private Long nextCursorId;
    private Integer nextCursorLikes;
}

