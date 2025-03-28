package org.shax3.square.domain.auth.dto.response;

import lombok.Builder;
import org.shax3.square.domain.auth.dto.UserLoginDto;
import org.shax3.square.domain.user.model.State;
import org.shax3.square.domain.user.model.Type;

@Builder
public record TestUserInfoResponse(
        String nickname,
        Type userType,
        State state,
        boolean isMember,
        String accessToken,
        String refreshToken
) {
    public static TestUserInfoResponse from(UserLoginDto userLoginDto, String accessToken, String refreshToken) {
        return TestUserInfoResponse.builder()
                .nickname(userLoginDto.nickname())
                .userType(userLoginDto.userType())
                .state(userLoginDto.state())
                .isMember(userLoginDto.isMember())
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .build();
    }
}
