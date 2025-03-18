package org.shax3.square.domain.proposal.dto.response;

import org.shax3.square.domain.proposal.dto.ProposalDto;
import java.util.List;

public record ProposalsResponse(
        List<ProposalDto> proposals,
        Long nextCursorId,
        Integer nextCursorLikes
) {
}
