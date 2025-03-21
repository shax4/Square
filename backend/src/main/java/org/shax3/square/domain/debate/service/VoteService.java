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

import static org.shax3.square.exception.ExceptionCode.*;


@Service
@RequiredArgsConstructor
public class VoteService {
    private final VoteRepository voteRepository;
    private final DebateService debateService;

    @Transactional
    public VoteResponse vote(VoteRequest request, Long debateId, User user) {
        Debate debate = debateService.findDebateById(debateId);

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
        return VoteResponse.of(left, right, total);
    }
}
