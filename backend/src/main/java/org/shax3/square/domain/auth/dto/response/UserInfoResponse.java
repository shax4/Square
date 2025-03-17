package org.shax3.square.domain.auth.dto.response;

import lombok.Builder;
import lombok.Getter;
import org.shax3.square.domain.auth.dto.UserLoginDto;
import org.shax3.square.domain.user.model.SocialType;
import org.shax3.square.domain.user.model.State;
import org.shax3.square.domain.user.model.Type;

@Getter
@Builder
public class UserInfoResponse {
    private String nickname;
    private Type userType;
    private State state;
    private SocialType socialType;
    private boolean isMember;

    public static UserInfoResponse from(UserLoginDto userLoginDto) {
        return UserInfoResponse.builder()
                .nickname(userLoginDto.getNickname())
                .userType(userLoginDto.getUserType())
                .state(userLoginDto.getState())
                .socialType(userLoginDto.getSocialType())
                .isMember(userLoginDto.isMember())
                .build();
    }
}
