package org.shax3.square.domain.debate.service;

import lombok.RequiredArgsConstructor;
import org.shax3.square.domain.debate.dto.DebateVotedResultResponse;
import org.shax3.square.domain.debate.dto.VoteResultDto;
import org.shax3.square.domain.debate.model.Debate;
import org.shax3.square.domain.debate.model.Vote;
import org.shax3.square.domain.debate.repository.DebateRepository;
import org.shax3.square.domain.user.model.*;
import org.shax3.square.exception.CustomException;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.function.Function;
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

    public DebateVotedResultResponse getVoteResult(Debate debate) {
        List<Vote> votes = voteService.getVotesByDebate(debate);

        Map<Boolean, List<Vote>> groupedVotes = votes.stream()
                .collect(Collectors.partitioningBy(Vote::isLeft));

        return new DebateVotedResultResponse(
                createVoteResultDto(groupedVotes.get(true)),
                createVoteResultDto(groupedVotes.get(false))
        );
    }

    private VoteResultDto createVoteResultDto(List<Vote> votes) {
        return new VoteResultDto(
                aggregateEnum(votes, Vote::getGender, Gender.class),
                aggregateEnum(votes, Vote::getAgeRange, AgeRange.class),
                aggregateEnum(votes, Vote::getType, Type.class),
                aggregateEnum(votes, Vote::getRegion, Region.class),
                aggregateEnum(votes, Vote::getReligion, Religion.class)
        );
    }

    private <T extends Enum<T> & DisplayableEnum> Map<String, Integer> aggregateEnum(
            List<Vote> votes, Function<Vote, T> getter, Class<T> enumClass) {

        Map<String, Integer> result = Arrays.stream(enumClass.getEnumConstants())
                .collect(Collectors.toMap(DisplayableEnum::getKoreanName, e -> 0, (a, b) -> b, LinkedHashMap::new));

        votes.stream()
                .map(getter)
                .filter(Objects::nonNull)
                .collect(Collectors.groupingBy(DisplayableEnum::getKoreanName, Collectors.counting()))
                .forEach((key, count) -> result.put(key, count.intValue()));

        return result;
    }
}
