package org.shax3.square.domain.proposal.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import org.shax3.square.domain.proposal.dto.ProposalDto;
import org.shax3.square.domain.proposal.model.Proposal;

import java.util.List;

public record ProposalsResponse(
        List<ProposalDto> proposals,
        Long nextCursorId,
        Integer nextCursorLikes
) {
    public static ProposalsResponse of(Long newNextCursorId, Integer newNextCursorLikes, List<ProposalDto> proposalDtos) {

        return new ProposalsResponse(proposalDtos, newNextCursorId, newNextCursorLikes);
    }
}

