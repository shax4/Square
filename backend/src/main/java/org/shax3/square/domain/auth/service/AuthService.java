package org.shax3.square.domain.auth.service;

import lombok.RequiredArgsConstructor;
import org.shax3.square.domain.auth.TokenUtil;
import org.shax3.square.domain.auth.dto.UserLoginDto;
import org.shax3.square.domain.auth.dto.UserTokenDto;
import org.shax3.square.domain.auth.repository.RefreshTokenJpaRepository;
import org.shax3.square.domain.user.model.User;
import org.shax3.square.domain.user.repository.UserJpaRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserJpaRepository userJpaRepository;
    private final RefreshTokenJpaRepository refreshTokenJpaRepository;
    private final TokenUtil tokenUtil;

    public UserLoginDto loginTest(String email) {
        Optional<User> user = userJpaRepository.findByEmail(email);

        User loginUser;
        if (user.isPresent()) {
            loginUser = user.get();
            UserTokenDto userTokens = tokenUtil.createLoginToken(loginUser.getId());
            refreshTokenJpaRepository.save(userTokens.refreshToken());

            return UserLoginDto.createMemberLoginDto(userTokens, loginUser);
        }

        return UserLoginDto.createNotMemberLoginDto();
    }


}
