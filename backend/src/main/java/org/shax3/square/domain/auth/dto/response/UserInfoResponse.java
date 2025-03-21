package org.shax3.square.domain.auth.dto.response;

import lombok.Builder;
import org.shax3.square.domain.auth.dto.UserLoginDto;
import org.shax3.square.domain.user.model.SocialType;
import org.shax3.square.domain.user.model.State;
import org.shax3.square.domain.user.model.Type;

@Builder
public record UserInfoResponse(
        String nickname,
        Type userType,
        State state,
        SocialType socialType,
        boolean isMember
) {
    public static UserInfoResponse from(UserLoginDto userLoginDto) {
        return UserInfoResponse.builder()
                .nickname(userLoginDto.nickname())
                .userType(userLoginDto.userType())
                .state(userLoginDto.state())
                .socialType(userLoginDto.socialType())
                .isMember(userLoginDto.isMember())
                .build();
    }
}
