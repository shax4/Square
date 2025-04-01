package org.shax3.square.domain.debate.dto.response;

import org.shax3.square.domain.debate.dto.MainDebateDto;

import java.util.List;

public record DebatesResponse(
        List<MainDebateDto> debates,
        Long nextCursorId
) {
}
