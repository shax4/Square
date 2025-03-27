package org.shax3.square.domain.proposal.service;

import lombok.RequiredArgsConstructor;
import org.shax3.square.domain.proposal.dto.request.CreateProposalRequest;
import org.shax3.square.domain.proposal.dto.response.CreateProposalsResponse;
import org.shax3.square.domain.proposal.dto.response.ProposalsResponse;
import org.shax3.square.domain.proposal.model.Proposal;
import org.shax3.square.domain.proposal.repository.ProposalRepository;
import org.shax3.square.domain.user.model.User;
import org.shax3.square.exception.CustomException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.shax3.square.exception.ExceptionCode.*;

@Service
@RequiredArgsConstructor
public class ProposalService {
    private final ProposalRepository proposalRepository;

    @Transactional
    public CreateProposalsResponse save(CreateProposalRequest request, User user) {

        Proposal proposal = request.to(user);
        proposalRepository.save(proposal);

        return CreateProposalsResponse.of(proposal.getId());
    }

    @Transactional(readOnly = true)
    public ProposalsResponse getProposals(String sort, Long nextCursorId, Integer nextCursorLikes, int limit) {
        List<Proposal> proposals = findProposalsBySort(sort, nextCursorId, nextCursorLikes, limit + 1);
        boolean hasNext = proposals.size() > limit;

        if (hasNext) {
            proposals = proposals.subList(0, limit);
        }

        return ProposalsResponse.of(proposals, sort);
    }
    private List<Proposal> findProposalsBySort(String sort, Long nextCursorId, Integer nextCursorLikes, int limit) {
        if ("likes".equals(sort)) {
            return proposalRepository.findProposalsByLikes(nextCursorId, nextCursorLikes, limit);
        }
        return proposalRepository.findProposalsByLatest(nextCursorId, limit);
    }

    @Transactional
    public void deleteProposal(Long id) {
        Proposal proposal = proposalRepository.findById(id)
                .orElseThrow(() -> new CustomException(PROPOSAL_NOT_FOUND));

        if (!proposal.isValid()) {
            throw new CustomException(ALREADY_DELETED);
        }
        proposal.softDelete();
    }

    public boolean isProposalExists(Long proposalId) {
        return proposalRepository.existsById(proposalId);
    }
}



