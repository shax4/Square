package org.shax3.square.domain.auth.dto;

import lombok.Builder;
import lombok.Getter;
import org.shax3.square.domain.auth.domain.RefreshToken;
import org.shax3.square.domain.user.model.SocialType;
import org.shax3.square.domain.user.model.Type;
import org.shax3.square.domain.user.model.User;
import org.shax3.square.domain.user.model.State;

@Builder
@Getter
public class UserLoginDto {
    private final String accessToken;
    private final RefreshToken refreshToken;
    private final String nickname;
    private final Type userType;
    private final State state;
    private final SocialType socialType;
    private boolean isMember;

    public static UserLoginDto createMemberLoginDto(UserTokenDto userTokenDto, User user) {
        return UserLoginDto.builder()
                .accessToken(userTokenDto.accessToken())
                .refreshToken(userTokenDto.refreshToken())
                .nickname(user.getNickname())
                .userType(user.getType())
                .state(user.getState())
                .socialType((user.getSocialType()))
                .isMember(true)
                .build();
    }

    public static UserLoginDto createNotMemberLoginDto() {
        return UserLoginDto.builder()
                .accessToken(null)
                .refreshToken(null)
                .nickname(null)
                .userType(null)
                .state(null)
                .socialType(null)
                .isMember(false)
                .build();
    }
}
