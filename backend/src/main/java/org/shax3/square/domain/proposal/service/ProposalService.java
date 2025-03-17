package org.shax3.square.domain.proposal.service;

import lombok.RequiredArgsConstructor;
import org.shax3.square.domain.proposal.dto.request.CreateProposalRequest;
import org.shax3.square.domain.proposal.dto.response.ProposalResponse;
import org.shax3.square.domain.proposal.model.Proposal;
import org.shax3.square.domain.proposal.repository.ProposalRepository;
import org.shax3.square.domain.user.model.User;
import org.shax3.square.exception.CustomException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.shax3.square.exception.ExceptionCode.INVALID_REQUEST;
import static org.shax3.square.exception.ExceptionCode.PROPOSAL_NOT_FOUND;

@Service
@RequiredArgsConstructor
public class ProposalService {

    private final ProposalRepository proposalRepository;

    @Transactional
    public ProposalResponse save(CreateProposalRequest request, String token) {

        if (request == null || request.getTopic() == null || request.getTopic().trim().isEmpty()) {
            throw new CustomException(INVALID_REQUEST);
        }

        User user = User.builder().build();
//      User user = 토큰추출기.getuserId(token);

        Proposal proposal = request.toEntity(user);
        proposalRepository.save(proposal);

        return new ProposalResponse(proposal.getId());
    }

    @Transactional(readOnly = true)
    public List<Proposal> findAll() {
        return proposalRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Proposal findOne(Long id) {
        return proposalRepository.findById(id)
                .orElseThrow(() -> new CustomException(PROPOSAL_NOT_FOUND));
    }


}
