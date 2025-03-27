package org.shax3.square.domain.opinion.dto.request;


import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.shax3.square.domain.debate.model.Debate;
import org.shax3.square.domain.opinion.model.Opinion;
import org.shax3.square.domain.user.model.User;

public record CreateOpinionRequest(
        @NotNull
        Long debateId,

        boolean isLeft,
        @NotNull
        @Size(min = 10, max = 150, message = "의견은 최소 10자 이상, 최대 150자 이하이어야 합니다.")
        String content) {

    public Opinion to(User user, Debate debate) {
        return Opinion.builder()
                .user(user)
                .debate(debate)
                .left(isLeft)
                .content(content)
                .build();
    }
}

