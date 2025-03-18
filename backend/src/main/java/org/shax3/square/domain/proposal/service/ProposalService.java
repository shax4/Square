package org.shax3.square.domain.proposal.service;

import lombok.RequiredArgsConstructor;
import org.shax3.square.domain.proposal.dto.ProposalDto;
import org.shax3.square.domain.proposal.dto.request.CreateProposalRequest;
import org.shax3.square.domain.proposal.dto.response.CreateProposalsResponse;
import org.shax3.square.domain.proposal.dto.response.ProposalsResponse;
import org.shax3.square.domain.proposal.model.Proposal;
import org.shax3.square.domain.proposal.repository.ProposalRepository;
import org.shax3.square.domain.user.model.User;
import org.shax3.square.exception.CustomException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

import static org.shax3.square.exception.ExceptionCode.*;

@Service
@RequiredArgsConstructor
public class ProposalService {
    private final ProposalRepository proposalRepository;

    @Transactional
    public CreateProposalsResponse save(CreateProposalRequest request, String token) {

        User user = User.builder().build();
//      User user = 토큰추출기.getuserId(token);

        Proposal proposal = request.to(user);
        proposalRepository.save(proposal);

        return new CreateProposalsResponse(proposal.getId());
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

    @Transactional(readOnly = true)
    public ProposalsResponse getProposals(String sort, Long nextCursorId, Integer nextCursorLikes, int limit) {

        List<Proposal> proposals = findProposalsBySort(sort, nextCursorId, nextCursorLikes, limit);

        Long newNextCursorId = proposals.isEmpty() ? null : proposals.get(proposals.size() - 1).getId();
        Integer newNextCursorLikes = (proposals.isEmpty() || !"likes".equals(sort))
                ? null  // 기본값을 null로 설정
                : proposals.get(proposals.size() - 1).getLikeCount();

        List<ProposalDto> proposalDtos = new ArrayList<>();
        for (Proposal proposal : proposals) {
            proposalDtos.add(ProposalDto.from(proposal));
        }

        return new ProposalsResponse(proposalDtos, newNextCursorId, newNextCursorLikes);
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

        proposal.softDelete();
    }
}



