package org.shax3.square.domain.debate.service;

import lombok.RequiredArgsConstructor;
import org.shax3.square.common.model.TargetType;
import org.shax3.square.domain.debate.dto.DebateDto;
import org.shax3.square.domain.debate.dto.response.MyScrapedDebatesResponse;
import org.shax3.square.domain.debate.dto.response.MyVotedDebatesResponse;
import org.shax3.square.domain.debate.dto.response.VoteResponse;
import org.shax3.square.domain.debate.model.Debate;
import org.shax3.square.domain.debate.model.Vote;
import org.shax3.square.domain.scrap.model.Scrap;
import org.shax3.square.domain.scrap.service.ScrapFacadeService;
import org.shax3.square.domain.user.model.User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class DebateFacadeService {
    private final ScrapFacadeService scrapFacadeService;
    private final DebateService debateService;
    private final VoteService voteService;

    @Transactional(readOnly = true)
    public MyScrapedDebatesResponse getScrapedDebates(User user, Long nextCursorId, int limit) {
        List<Scrap> scraps = scrapFacadeService.getPaginatedDebateScraps(user, nextCursorId, limit + 1);

        boolean hasNext = scraps.size() > limit;
        List<Scrap> pageScraps = hasNext ? scraps.subList(0, limit) : scraps;

        List<DebateDto> debates = pageScraps.stream()
                .map(scrap -> {
                    Debate debate = debateService.findDebateById(scrap.getTargetId());
                    Optional<Vote> userVote = voteService.getVoteByUserAndDebate(user, debate);
                    Boolean isLeft = userVote.map(Vote::isLeft).orElse(null);
                    VoteResponse voteResponse = userVote.isPresent()
                            ? voteService.calculateVoteResult(debate)
                            : VoteResponse.create();

                    return DebateDto.of(debate, isLeft, voteResponse, true);
                })
                .toList();

        Long newNextCursorId = hasNext && !pageScraps.isEmpty() ? pageScraps.get(pageScraps.size() - 1).getId() : null;

        return new MyScrapedDebatesResponse(debates, newNextCursorId);
    }

    @Transactional(readOnly = true)
    public MyVotedDebatesResponse getMyVotedDebates(User user, Long nextCursorId, int limit) {
        List<Vote> votes = voteService.getVotesByUser(user, nextCursorId, limit + 1);
        //다음 페이지가 있는지 (repository에서 +1 하기 때문에 다음 페이지가 있다면 size가 더 커야함
        boolean hasNext = votes.size() > limit;
        //다음 페이지가 있다면, 하나를 자름
        List<Vote> pageVotes = hasNext ? votes.subList(0, limit) : votes;

        List<Long> userScraps = scrapFacadeService.getScrapIds(user, TargetType.DEBATE);

        List<DebateDto> debates = pageVotes.stream()
                .map(vote -> {
                    Debate debate = vote.getDebate();
                    boolean isScraped = userScraps.contains(debate.getId());
                    VoteResponse voteResponse = voteService.calculateVoteResult(debate);
                    return DebateDto.of(vote, voteResponse, isScraped);
                })
                .toList();

        Long newNextCursorId = hasNext && !pageVotes.isEmpty() ? pageVotes.get(pageVotes.size() - 1).getId() : null;

        return new MyVotedDebatesResponse(debates, newNextCursorId);
    }


}
