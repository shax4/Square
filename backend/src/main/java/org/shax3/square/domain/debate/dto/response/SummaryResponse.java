package org.shax3.square.domain.debate.dto.response;

import org.shax3.square.domain.debate.dto.SummaryDto;
import org.shax3.square.domain.debate.model.Debate;

import java.util.List;

public record SummaryResponse(
        String topic,
        Boolean isScraped,
        String leftOption,
        String rightOption,
        Boolean hasVoted,
        Integer leftCount,
        Integer rightCount,
        List<SummaryDto> summaries
) {
    public static SummaryResponse of(Debate debate,
                                     VoteResponse voteResponse,
                                     Boolean hasVoted,
                                     Boolean isScraped,
                                     List<SummaryDto> summaries) {

        Integer leftCount = (voteResponse != null) ? voteResponse.leftCount() : null;
        Integer rightCount = (voteResponse != null) ? voteResponse.rightCount() : null;


        return new SummaryResponse(
                debate.getTopic(),
                isScraped,
                debate.getLeftOption(),
                debate.getRightOption(),
                hasVoted,
                leftCount,
                rightCount,
                summaries
        );
    }
}

