package org.shax3.square.domain.user.dto;

import lombok.Builder;
import org.shax3.square.domain.auth.dto.UserTokenDto;
import org.shax3.square.domain.auth.model.RefreshToken;
import org.shax3.square.domain.user.model.SocialType;
import org.shax3.square.domain.user.model.State;
import org.shax3.square.domain.user.model.Type;
import org.shax3.square.domain.user.model.User;

@Builder
public record UserSignUpDto(
        String accessToken,
        RefreshToken refreshToken,
        String nickname,
        Type userType,
        State state,
        SocialType socialType
) {
    public static UserSignUpDto createSignUpDto(UserTokenDto userTokenDto, User user) {
        return UserSignUpDto.builder()
                .accessToken(userTokenDto.accessToken())
                .refreshToken(userTokenDto.refreshToken())
                .nickname(user.getNickname())
                .userType(user.getType())
                .state(user.getState())
                .socialType((user.getSocialType()))
                .build();
    }
}
