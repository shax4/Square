package org.shax3.square.domain.debate.service;

import lombok.RequiredArgsConstructor;
import org.shax3.square.domain.debate.dto.request.VoteRequest;
import org.shax3.square.domain.debate.dto.response.VoteResponse;
import org.shax3.square.domain.debate.model.Debate;
import org.shax3.square.domain.debate.model.Vote;
import org.shax3.square.domain.debate.repository.VoteRepository;
import org.shax3.square.domain.user.model.User;
import org.shax3.square.exception.CustomException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import static org.shax3.square.exception.ExceptionCode.ALREADY_VOTED;


@Service
@RequiredArgsConstructor
public class VoteService {
    private final VoteRepository voteRepository;

    @Transactional
    public VoteResponse vote(VoteRequest request, Debate debate, User user) {

        if (voteRepository.existsByDebateAndUser(debate, user)) {
            throw new CustomException(ALREADY_VOTED);
        }

        Vote vote = request.to(debate, user);
        voteRepository.save(vote);

        return calculateVoteResult(debate);
    }

    public VoteResponse calculateVoteResult(Debate debate) {
        int total = voteRepository.countByDebate(debate);
        int left = voteRepository.countByDebateAndLeftTrue(debate);
        int right = total - left;
        return VoteResponse.of(left, right);
    }

    public List<Vote> getVotesByDebate(Debate debate) {
        return voteRepository.findByDebate(debate);
    }

    public Optional<Vote> getVoteByUserAndDebate(User user, Debate debate) {
        return voteRepository.findByDebateAndUser(debate, user);
    }

    public List<Vote> getVotesByUser(User user, Long nextCursorId, int limit) {
        return voteRepository.findByUserOrderByIdDesc(user, nextCursorId, limit);
    }

    public Map<Long, Boolean> getVoteDirectionMap(User user, List<Long> debateIds) {
        if (user == null) {
            return Collections.emptyMap();
        }

        List<Vote> votes = voteRepository.findByUserAndDebateIds(user, debateIds);

        return votes.stream()
                .collect(Collectors.toMap(
                        vote -> vote.getDebate().getId(),
                        Vote::isLeft
                ));
    }
}


