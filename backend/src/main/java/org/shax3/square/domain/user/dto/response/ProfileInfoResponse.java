package org.shax3.square.domain.user.dto.response;

import lombok.Builder;
import org.shax3.square.domain.user.model.User;

@Builder
public record ProfileInfoResponse(
        String profileUrl,
        String region,
        String religion,
        String userState
) {
    public static ProfileInfoResponse of(User user, String profileUrl) {
        return ProfileInfoResponse
                .builder()
                .profileUrl(profileUrl)
                .region(user.getRegion().getKoreanName())
                .religion(user.getReligion().getKoreanName())
                .userState("ADMIN") //TODO
                .build();
    }
}
