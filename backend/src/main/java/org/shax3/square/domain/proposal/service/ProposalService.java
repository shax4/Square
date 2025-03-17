package org.shax3.square.domain.proposal.service;

import com.querydsl.jpa.impl.JPAQueryFactory;
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
import java.util.stream.Collectors;

import static org.shax3.square.exception.ExceptionCode.*;

@Service
@RequiredArgsConstructor
public class ProposalService {
    private final ProposalRepository proposalRepository;


    @Transactional
    public CreateProposalsResponse save(CreateProposalRequest request, String token) {

        if (request == null || request.getTopic() == null || request.getTopic().trim().isEmpty()) {
            throw new CustomException(INVALID_REQUEST);
        }

        User user = User.builder().build();
//      User user = 토큰추출기.getuserId(token);

        Proposal proposal = request.toEntity(user);
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
        List<Proposal> proposals;
        if ("likes".equals(sort)) {
            proposals = proposalRepository.findProposalsByLikes(nextCursorId, nextCursorLikes, limit);
        } else {
            proposals = proposalRepository.findProposalsByLatest(nextCursorId, limit);
        }

        Long newNextCursorId = proposals.isEmpty() ? null : proposals.get(proposals.size() - 1).getId();
        Integer newNextCursorLikes = (proposals.isEmpty() || !"likes".equals(sort))
                ? null  // 기본값을 null로 설정
                : proposals.get(proposals.size() - 1).getLikeCount();

        List<ProposalDto> proposalDtos = new ArrayList<>();
        for (Proposal proposal : proposals) {
            proposalDtos.add(ProposalDto.fromEntity(proposal));
        }

        return new ProposalsResponse(proposalDtos, newNextCursorId, newNextCursorLikes);
    }

}



