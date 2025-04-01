package org.shax3.square.domain.opinion.dto.response;

import org.shax3.square.domain.opinion.dto.MyOpinionDto;
import org.shax3.square.domain.opinion.model.Opinion;

import java.util.List;
import java.util.Set;

public record MyOpinionResponse(
        List<MyOpinionDto> opinions,
        Long nextCursorId
) {
    public static MyOpinionResponse of(List<Opinion> opinions, Set<Long> likedOpinionIds) {
        Long newNextCursorId = opinions.isEmpty() ? null : opinions.get(opinions.size() - 1).getId();

        List<MyOpinionDto> opinionDtos = opinions.stream()
            .map(opinion -> {
                boolean isLiked = likedOpinionIds.contains(opinion.getId());
                return MyOpinionDto.from(opinion, isLiked);
            })
            .toList();

        return new MyOpinionResponse(opinionDtos, newNextCursorId);
    }
}


