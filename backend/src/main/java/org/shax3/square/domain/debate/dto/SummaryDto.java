package org.shax3.square.domain.debate.dto;

import org.shax3.square.domain.debate.model.Summary;

import java.util.List;
import java.util.stream.Collectors;

public record SummaryDto(
        Long summaryId,
        String content,
        boolean isLeft
) {
    public static SummaryDto of(Summary summary) {
        return new SummaryDto(
                summary.getId(),
                summary.getContent(),
                summary.isLeft()
        );
    }

    public static List<SummaryDto> of(List<Summary> summaries) {
        return summaries.stream()
                .map(SummaryDto::of)
                .collect(Collectors.toList());
    }
}
