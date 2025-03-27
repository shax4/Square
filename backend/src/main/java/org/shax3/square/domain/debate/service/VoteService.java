package org.shax3.square.domain.debate.service;

import lombok.RequiredArgsConstructor;
import org.shax3.square.domain.debate.dto.DebateDto;
import org.shax3.square.domain.debate.dto.request.VoteRequest;
import org.shax3.square.domain.debate.dto.response.MyVotedDebatesResponse;
import org.shax3.square.domain.debate.dto.response.VoteResponse;
import org.shax3.square.domain.debate.model.Debate;
import org.shax3.square.domain.debate.model.Vote;
import org.shax3.square.domain.debate.repository.VoteRepository;
import org.shax3.square.domain.scrap.service.ScrapService;
import org.shax3.square.domain.user.model.User;
import org.shax3.square.exception.CustomException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.shax3.square.exception.ExceptionCode.*;


@Service
@RequiredArgsConstructor
public class VoteService {
    private final VoteRepository voteRepository;
    private final DebateService debateService;
    private final ScrapService scrapService;

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

    @Transactional(readOnly = true)
    public MyVotedDebatesResponse getMyVotedDebates(User user, Long nextCursorId, int limit) {
        List<Vote> votes = voteRepository.findByUserOrderByIdDesc(user, nextCursorId, limit + 1);

        boolean hasNext = votes.size() > limit;
        List<Vote> pageVotes = hasNext ? votes.subList(0, limit) : votes;

        List<DebateDto> debates = pageVotes.stream()
                .map(vote -> {
                    Debate debate = vote.getDebate();
                    boolean isScraped = scrapService.isDebateScraped(user, debate.getId());
                    VoteResponse voteResponse = calculateVoteResult(debate);
                    return DebateDto.of(user,vote,voteResponse,isScraped);
                })
                .toList();

        Long newNextCursorId = hasNext && !pageVotes.isEmpty() ? pageVotes.get(pageVotes.size() - 1).getId() : null;

        return new MyVotedDebatesResponse(debates, newNextCursorId);
    }
}


