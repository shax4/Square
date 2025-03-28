package org.shax3.square.domain.debate.service;

import lombok.RequiredArgsConstructor;
import org.shax3.square.domain.debate.dto.DebateVotedResultResponse;
import org.shax3.square.domain.debate.dto.VoteResultDto;
import org.shax3.square.domain.debate.model.Debate;
import org.shax3.square.domain.debate.model.Vote;
import org.shax3.square.domain.debate.repository.DebateRepository;
import org.shax3.square.exception.CustomException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static org.shax3.square.exception.ExceptionCode.DEBATE_NOT_FOUND;

@Service
@RequiredArgsConstructor
public class DebateService {

    private final DebateRepository debateRepository;
    private final VoteService voteService;

    public Debate findDebateById(Long debateId) {
        return debateRepository.findById(debateId)
                .orElseThrow(() -> new CustomException(DEBATE_NOT_FOUND));
    }

    @Transactional(readOnly = true)
    public DebateVotedResultResponse getVoteResult(Long debateId) {
        Debate debate = findDebateById(debateId);
        List<Vote> votes = voteService.getVotesByDebate(debate);

        Map<Boolean, List<Vote>> groupedVotes = votes.stream()
                .collect(Collectors.partitioningBy(Vote::isLeft));

        return new DebateVotedResultResponse(
                createVoteResultDto(groupedVotes.get(true)),
                createVoteResultDto(groupedVotes.get(false))
        );
    }

    private VoteResultDto createVoteResultDto(List<Vote> votes) {
        return VoteResultDto.fromVotes(votes);
    }

}
