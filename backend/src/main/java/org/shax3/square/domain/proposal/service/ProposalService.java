package org.shax3.square.domain.proposal.service;

import org.shax3.square.domain.proposal.model.Proposal;
import org.shax3.square.domain.proposal.repository.ProposalRepository;
import org.shax3.square.exception.CustomException;
import org.springframework.stereotype.Service;

import java.util.List;

import static org.shax3.square.exception.ExceptionCode.INVALID_REQUEST;
import static org.shax3.square.exception.ExceptionCode.PROPOSAL_NOT_FOUND;

@Service
public class ProposalService {

    private final ProposalRepository proposalRepository;

    public ProposalService(ProposalRepository proposalRepository) {
        this.proposalRepository = proposalRepository;
    }

    public Proposal save(Proposal proposal) {
        if (proposal == null) {
            throw new CustomException(INVALID_REQUEST);
        }
        return proposalRepository.save(proposal);
    }

    public List<Proposal> findAll() {
        return proposalRepository.findAll();
    }

    public Proposal findOne(Long id) {
        if (id == null) {
            throw new CustomException(INVALID_REQUEST);
        }
        return proposalRepository.findProposalById(id)
                .orElseThrow(() -> new CustomException(PROPOSAL_NOT_FOUND));
    }
}
