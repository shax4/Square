package org.shax3.square.domain.proposal.dto.response;

import org.shax3.square.domain.proposal.dto.ProposalDto;
import org.shax3.square.domain.proposal.model.Proposal;

import java.util.List;

public record ProposalsResponse(
        List<ProposalDto> proposals,
        Long nextCursorId,
        Integer nextCursorLikes
) {
    public static ProposalsResponse of(List<Proposal> proposals, String sort) {
        Long newNextCursorId = proposals.isEmpty() ? null : proposals.get(proposals.size() - 1).getId();
        Integer newNextCursorLikes = (proposals.isEmpty() || !"likes".equals(sort))
                ? null
                : proposals.get(proposals.size() - 1).getLikeCount();

        List<ProposalDto> proposalDtos = proposals.stream()
                .map(ProposalDto::from)
                .toList();

        return new ProposalsResponse(proposalDtos, newNextCursorId, newNextCursorLikes);
    }
}
