package org.shax3.square.domain.debate.dto;

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
}
