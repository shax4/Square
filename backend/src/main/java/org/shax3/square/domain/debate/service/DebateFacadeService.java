package org.shax3.square.domain.debate.service;

import lombok.RequiredArgsConstructor;
import org.shax3.square.common.model.TargetType;
import org.shax3.square.domain.debate.dto.DebateDto;
import org.shax3.square.domain.debate.dto.MainDebateDto;
import org.shax3.square.domain.debate.dto.response.DebatesResponse;
import org.shax3.square.domain.debate.dto.response.MyScrapedDebatesResponse;
import org.shax3.square.domain.debate.dto.response.MyVotedDebatesResponse;
import org.shax3.square.domain.debate.dto.response.VoteResponse;
import org.shax3.square.domain.debate.model.Debate;
import org.shax3.square.domain.debate.model.Vote;
import org.shax3.square.domain.scrap.model.Scrap;
import org.shax3.square.domain.scrap.service.ScrapService;
import org.shax3.square.domain.user.model.User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class DebateFacadeService {
    private final DebateService debateService;
    private final VoteService voteService;
    private final ScrapService scrapService;

    @Transactional(readOnly = true)
    public MyScrapedDebatesResponse getScrapedDebates(User user, Long nextCursorId, int limit) {
        List<Scrap> scraps = scrapService.getPaginatedScraps(user, TargetType.DEBATE, nextCursorId, limit + 1);

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
        boolean hasNext = votes.size() > limit;
        List<Vote> pageVotes = hasNext ? votes.subList(0, limit) : votes;

        List<Long> userScraps = scrapService.getScrapIds(user, TargetType.DEBATE);

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

    //TODO 레디스처리
    @Transactional(readOnly = true)
    public DebatesResponse getDebates(User user, Long nextCursorId, int limit) {
        List<Debate> debates = debateService.findMainDebatesForCursor(nextCursorId, limit + 1);
        boolean hasNext = debates.size() > limit;

        List<Debate> pageDebates = hasNext ? debates.subList(0, limit) : debates;
        List<Long> debateIds = pageDebates.stream()
                .map(Debate::getId)
                .toList();

        Map<Long, Boolean> isLeftMap = voteService.getVoteDirectionMap(user, debateIds);
        Map<Long, Boolean> isScrapedMap = scrapService.getScrapMap(user, debateIds);

        List<MainDebateDto> debateDtos = pageDebates.stream()
                .map(debate -> {
                    VoteResponse voteResponse = voteService.calculateVoteResult(debate);
                    return MainDebateDto.of(debate, isScrapedMap, isLeftMap, voteResponse);
                })
                .toList();

        Long newCursorId = hasNext && !pageDebates.isEmpty()
                ? pageDebates.get(pageDebates.size() - 1).getId()
                : null;

        return new DebatesResponse(debateDtos, newCursorId);
    }

}
