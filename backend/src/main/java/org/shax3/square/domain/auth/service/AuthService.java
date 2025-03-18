package org.shax3.square.domain.auth.service;

import lombok.RequiredArgsConstructor;
import org.shax3.square.domain.auth.TokenUtil;
import org.shax3.square.domain.auth.dto.UserLoginDto;
import org.shax3.square.domain.auth.dto.UserTokenDto;
import org.shax3.square.domain.auth.repository.RefreshTokenJpaRepository;
import org.shax3.square.domain.user.model.User;
import org.shax3.square.domain.user.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RefreshTokenJpaRepository refreshTokenJpaRepository;
    private final TokenUtil tokenUtil;
    private final GoogleAuthService googleAuthService;


    public UserLoginDto loginTest(String email) {
        Optional<User> user = userRepository.findByEmail(email);

        if (user.isPresent()) {
            User loginUser = user.get();
            UserTokenDto userTokens = tokenUtil.createLoginToken(loginUser.getId());
            refreshTokenJpaRepository.save(userTokens.refreshToken());

            return UserLoginDto.createMemberLoginDto(userTokens, loginUser);
        }

        return UserLoginDto.createNotMemberLoginDto(email);
    }

    public UserLoginDto googleLogin(String code) {

        String email = googleAuthService.googleCallback(code);

        Optional<User> user = userRepository.findByEmail(email);

        if (user.isPresent()) {
            User loginUser = user.get();
            UserTokenDto userTokens = tokenUtil.createLoginToken(loginUser.getId());
            refreshTokenJpaRepository.save(userTokens.refreshToken());

            return UserLoginDto.createMemberLoginDto(userTokens, loginUser);
        }

        return UserLoginDto.createNotMemberLoginDto(email);
    }


}
