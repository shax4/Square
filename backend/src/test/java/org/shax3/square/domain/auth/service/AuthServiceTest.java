package org.shax3.square.domain.auth.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.shax3.square.domain.auth.TokenUtil;
import org.shax3.square.domain.auth.domain.RefreshToken;
import org.shax3.square.domain.auth.dto.UserLoginDto;
import org.shax3.square.domain.auth.dto.UserTokenDto;
import org.shax3.square.domain.auth.repository.RefreshTokenJpaRepository;
import org.shax3.square.domain.user.model.User;
import org.shax3.square.domain.user.repository.UserRepository;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private RefreshTokenJpaRepository refreshTokenJpaRepository;

    @Mock
    private GoogleAuthService googleAuthService;

    @Mock
    private TokenUtil tokenUtil;

    @InjectMocks
    private AuthService authService;

    @Test
    void loginTest_whenUserExists_thenReturnMemberLoginDto() {
        // Given
        String email = "test@example.com";
        User user = User.builder()
                .email(email)
                .build();

        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));

        // DTO는 Mock이 아니라 실제 객체 생성
        RefreshToken refreshToken = RefreshToken.builder().build();
        UserTokenDto userTokenDto = new UserTokenDto("accessToken", refreshToken);

        when(tokenUtil.createLoginToken(user.getId())).thenReturn(userTokenDto);

        // When
        UserLoginDto result = authService.loginTest(email);

        // Then
        verify(userRepository, times(1)).findByEmail(email);
        verify(tokenUtil, times(1)).createLoginToken(user.getId());
        verify(refreshTokenJpaRepository, times(1)).save(refreshToken);

        // 명확한 값 검증
        assertThat(result).isNotNull();
        assertThat(result.accessToken()).isEqualTo("accessToken");
        assertThat(result.email()).isNull();
    }

    @Test
    void loginTest_whenUserDoesNotExist_thenReturnNotMemberLoginDto() {
        // Given
        String email = "notfound@example.com";
        when(userRepository.findByEmail(email)).thenReturn(Optional.empty());

        // When
        UserLoginDto result = authService.loginTest(email);

        // Then
        verify(userRepository, times(1)).findByEmail(email);
        verifyNoInteractions(tokenUtil);
        verifyNoInteractions(refreshTokenJpaRepository);

        assertThat(result).isNotNull();
        assertThat(result.accessToken()).isNull();
        assertThat(result.email()).isEqualTo(email);
    }

    @Test
    void googleLogin_whenUserExists_thenReturnMemberLoginDto() {
        // Given
        String code = "authCode";
        String email = "test@example.com";
        User user = User.builder()
                .email(email)
                .build();

        when(googleAuthService.googleCallback(code)).thenReturn(email);
        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));

        RefreshToken refreshToken = RefreshToken.builder().build();
        UserTokenDto userTokenDto = new UserTokenDto("accessToken", refreshToken);

        when(tokenUtil.createLoginToken(user.getId())).thenReturn(userTokenDto);

        // When
        UserLoginDto result = authService.googleLogin(code);

        // Then
        verify(googleAuthService, times(1)).googleCallback(code);
        verify(userRepository, times(1)).findByEmail(email);
        verify(tokenUtil, times(1)).createLoginToken(user.getId());
        verify(refreshTokenJpaRepository, times(1)).save(refreshToken);

        assertThat(result).isNotNull();
        assertThat(result.accessToken()).isEqualTo("accessToken");
        assertThat(result.email()).isNull();
    }

    @Test
    void googleLogin_whenUserDoesNotExist_thenReturnNotMemberLoginDto() {
        // Given
        String code = "authCode";
        String email = "newuser@example.com";

        when(googleAuthService.googleCallback(code)).thenReturn(email);
        when(userRepository.findByEmail(email)).thenReturn(Optional.empty());

        // When
        UserLoginDto result = authService.googleLogin(code);

        // Then
        verify(googleAuthService, times(1)).googleCallback(code);
        verify(userRepository, times(1)).findByEmail(email);
        verifyNoInteractions(tokenUtil);
        verifyNoInteractions(refreshTokenJpaRepository);

        assertThat(result).isNotNull();
        assertThat(result.accessToken()).isNull();
        assertThat(result.email()).isEqualTo(email);
    }
}
