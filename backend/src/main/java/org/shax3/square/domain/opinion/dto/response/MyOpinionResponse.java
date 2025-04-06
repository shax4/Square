package org.shax3.square.domain.opinion.dto.response;

import org.shax3.square.domain.opinion.dto.MyOpinionDto;
import org.shax3.square.domain.opinion.model.Opinion;

import java.util.List;
import java.util.Set;

public record MyOpinionResponse(
        List<MyOpinionDto> opinions,
        Long nextCursorId
) {
    public static MyOpinionResponse of(List<MyOpinionDto> opinionDtos, Long newNextCursorId) {

        return new MyOpinionResponse(opinionDtos, newNextCursorId);
    }
}


