package org.shax3.square.domain.debate.dto;

import org.shax3.square.domain.debate.dto.response.VoteResponse;
import org.shax3.square.domain.debate.model.Debate;

import java.util.Map;

public record MainDebateDto(
        Long debateId,
        String category,
        String topic,
        String leftOption,
        String rightOption,
        Boolean isScraped,
        Boolean isLeft,
        int leftCount,
        int rightCount
) {
    public static MainDebateDto of(Debate debate,
                                   Map<Long, Boolean> isScrapedMap,
                                   Map<Long, Boolean> isLeftMap,
                                   VoteResponse voteResponse) {
        Long id = debate.getId();

        return new MainDebateDto(
                id,
                debate.getCategory().getName(),
                debate.getTopic(),
                debate.getLeftOption(),
                debate.getRightOption(),
                isScrapedMap.getOrDefault(id, false),
                isLeftMap.getOrDefault(id, null),
                voteResponse.leftCount(),
                voteResponse.rightCount()
        );
    }

}
