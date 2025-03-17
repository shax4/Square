package org.shax3.square.domain.proposal.service;

import com.querydsl.jpa.impl.JPAQueryFactory;
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
import java.util.stream.Collectors;

import static org.shax3.square.domain.proposal.model.QProposal.proposal;
import static org.shax3.square.exception.ExceptionCode.*;

@Service
@RequiredArgsConstructor
public class ProposalService {

    private final ProposalRepository proposalRepository;
    private final JPAQueryFactory queryFactory;


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

    @Transactional(readOnly = true)
    public List<ProposalResponse> getProposals(String sort, Long nextCursorId, Integer nextCursorLikes, String category, int limit) {
        if (limit < 1 || limit > 50) {
            limit = 10;
        }

        var query = queryFactory
                .selectFrom(proposal)
                .where(
                        cursorFilter(nextCursorId, nextCursorLikes, sort),
                        categoryEq(category))
                .limit(limit + 1);

        if ("likes".equals(sort)) {
            return query.orderBy(proposal.likeCount.desc(), proposal.id.desc())
                    .fetch()
                    .stream()
                    .map(p -> new ProposalResponse(p.getId()))
                    .collect(Collectors.toList());
        }

        return query.orderBy(proposal.id.desc())
                .fetch()
                .stream()
                .map(p -> new ProposalResponse(p.getId()))
                .collect(Collectors.toList());
    }

    private com.querydsl.core.types.dsl.BooleanExpression cursorFilter(Long nextCursorId, Integer nextCursorLikes, String sort) {
        if ("likes".equals(sort)) {
            if (nextCursorId == null || nextCursorLikes == null) return null;
            return proposal.likeCount.eq(nextCursorLikes)
                    .and(proposal.id.lt(nextCursorId))
                    .or(proposal.likeCount.lt(nextCursorLikes));
        }
        return ltProposalId(nextCursorId);
    }

    private com.querydsl.core.types.dsl.BooleanExpression ltProposalId(Long nextCursorId) {
        return nextCursorId == null ? null : proposal.id.lt(nextCursorId);
    }

    private com.querydsl.core.types.dsl.BooleanExpression categoryEq(String category) {
        return "all".equals(category) ? null : proposal.category.eq(category);
    }
}



