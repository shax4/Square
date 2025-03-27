package org.shax3.square.domain.debate.dto.request;

import org.shax3.square.domain.debate.model.Debate;
import org.shax3.square.domain.debate.model.Vote;
import org.shax3.square.domain.user.model.User;

public record VoteRequest(
        boolean isLeft
) {
    public Vote to(Debate debate, User user) {
        return Vote.builder()
                .debate(debate)
                .user(user)
                .region(user.getRegion())
                .gender(user.getGender())
                .ageRange(user.getAgeRange())
                .religion(user.getReligion())
                .type(user.getType())
                .left(isLeft)
                .build();
    }
}
