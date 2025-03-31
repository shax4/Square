package org.shax3.square.domain.debate.dto.response;

public record DebatesResponse(
        List<MainDebateDto> debates,
        Long nextCursorId
) {
}
