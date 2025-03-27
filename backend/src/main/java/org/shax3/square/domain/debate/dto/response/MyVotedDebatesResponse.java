package org.shax3.square.domain.debate.dto.response;

import org.shax3.square.domain.debate.dto.DebateDto;

import java.util.List;

public record MyVotedDebatesResponse(
        List<DebateDto> debates,
        Long nextCursorId
) {
}
