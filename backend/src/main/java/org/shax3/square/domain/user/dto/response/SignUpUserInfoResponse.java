package org.shax3.square.domain.user.dto.response;

import lombok.Builder;
import org.shax3.square.domain.user.dto.UserSignUpDto;
import org.shax3.square.domain.user.model.State;
import org.shax3.square.domain.user.model.Type;

@Builder
public record SignUpUserInfoResponse(
        String nickname,
        Type userType,
        State state
) {
    public static SignUpUserInfoResponse from(UserSignUpDto userSignUpDto) {
        return SignUpUserInfoResponse.builder()
                .nickname(userSignUpDto.nickname())
                .userType(userSignUpDto.userType())
                .state(userSignUpDto.state())
                .build();
    }
}
