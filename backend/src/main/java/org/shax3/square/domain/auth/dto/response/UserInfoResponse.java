package org.shax3.square.domain.auth.dto.response;

import lombok.Builder;
import org.shax3.square.domain.auth.dto.UserLoginDto;
import org.shax3.square.domain.user.model.State;
import org.shax3.square.domain.user.model.Type;

@Builder
public record UserInfoResponse(
        String nickname,
        Type userType,
        State state,
        boolean isMember
) {
    public static UserInfoResponse from(UserLoginDto userLoginDto) {
        return UserInfoResponse.builder()
                .nickname(userLoginDto.nickname())
                .userType(userLoginDto.userType())
                .state(userLoginDto.state())
                .isMember(userLoginDto.isMember())
                .build();
    }
}
