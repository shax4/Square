package org.shax3.square.domain.opinion.dto.response;

import org.shax3.square.domain.opinion.dto.MyOpinionDto;
import org.shax3.square.domain.opinion.model.Opinion;

import java.util.List;

public record MyOpinionResponse(
        List<MyOpinionDto> opinions,
        Long nextCursorId
) {
    public static MyOpinionResponse of(List<Opinion> opinions) {
        Long newNextCursorId = opinions.isEmpty() ? null : opinions.get(opinions.size() - 1).getId();
        boolean isLiked = false; //TODO : 추가구현 필요

        List<MyOpinionDto> opinionDtos = opinions.stream()
                .map(opinion ->
                        MyOpinionDto.from(opinion, false))
                .toList();

        return new MyOpinionResponse(opinionDtos, newNextCursorId);
    }
}


