package org.shax3.square.domain.auth.service;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.shax3.square.domain.auth.TokenUtil;
import org.shax3.square.domain.auth.dto.UserLoginDto;
import org.shax3.square.domain.auth.dto.UserTokenDto;
import org.shax3.square.domain.auth.model.RefreshToken;
import org.shax3.square.domain.auth.repository.RefreshTokenRepository;
import org.shax3.square.domain.user.model.SocialType;
import org.shax3.square.domain.user.model.User;
import org.shax3.square.domain.user.repository.UserRepository;
import org.shax3.square.exception.CustomException;
import org.shax3.square.exception.ExceptionCode;

import java.util.Date;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.AssertionsForClassTypes.assertThatThrownBy;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private RefreshTokenRepository refreshTokenRepository;

    @Mock
    private GoogleAuthService googleAuthService;

    @Mock
    private TokenUtil tokenUtil;

    @InjectMocks
    private AuthService authService;

    @Test
    @DisplayName("loginTest - 유저가 존재하는 경우 MemberLoginDto 반환")
    void loginTest_whenUserExists_thenReturnMemberLoginDto() {
        // Given
        String email = "test@example.com";
        User user = User.builder()
                .email(email)
                .build();

        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));

        RefreshToken refreshToken = RefreshToken.builder().build();
        UserTokenDto userTokenDto = new UserTokenDto("accessToken", refreshToken);
        when(tokenUtil.createLoginToken(user.getId())).thenReturn(userTokenDto);

        // When
        UserLoginDto result = authService.loginTest(email);

        // Then
        verify(userRepository, times(1)).findByEmail(email);
        verify(tokenUtil, times(1)).createLoginToken(user.getId());
        verify(refreshTokenRepository, times(1)).save(refreshToken);

        assertThat(result).isNotNull();
        assertThat(result.accessToken()).isEqualTo("accessToken");
        assertThat(result.email()).isNull();
    }

    @Test
    @DisplayName("loginTest - 유저가 존재하지 않는 경우 NotMemberLoginDto 반환")
    void loginTest_whenUserDoesNotExist_thenReturnNotMemberLoginDto() {
        // Given
        String email = "notfound@example.com";
        when(userRepository.findByEmail(email)).thenReturn(Optional.empty());

        // When
        UserLoginDto result = authService.loginTest(email);

        // Then
        verify(userRepository, times(1)).findByEmail(email);
        verifyNoInteractions(tokenUtil);
        verifyNoInteractions(refreshTokenRepository);

        assertThat(result).isNotNull();
        assertThat(result.accessToken()).isNull();
        assertThat(result.email()).isEqualTo(email);
    }

    @Test
    @DisplayName("googleLogin - 유저가 존재하는 경우 MemberLoginDto 반환")
    void googleLogin_whenUserExists_thenReturnMemberLoginDto() {
        // Given
        String code = "authCode";
        String email = "test@example.com";
        User user = User.builder()
                .socialType(SocialType.GOOGLE)
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
        verify(refreshTokenRepository, times(1)).save(refreshToken);

        assertThat(result).isNotNull();
        assertThat(result.accessToken()).isEqualTo("accessToken");
        assertThat(result.email()).isNull();
    }

    @Test
    @DisplayName("googleLogin - 유저가 존재하지 않는 경우 NotMemberLoginDto 반환")
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
        verifyNoInteractions(refreshTokenRepository);

        assertThat(result).isNotNull();
        assertThat(result.accessToken()).isNull();
        assertThat(result.email()).isEqualTo(email);
    }

    @Test
    @DisplayName("reissueAccessToken - 유효한 액세스 토큰일 경우 그대로 반환")
    void reissueAccessToken_whenAccessTokenIsValid_thenReturnAccessToken() {
        // Given
        String validAccessToken = "validAccessToken";
        String authHeader = "Bearer " + validAccessToken;
        String dummyRefreshToken = "dummyRefreshToken";
        Long fakeUserId = 1L;

        RefreshToken dummyRefresh = RefreshToken.createRefreshToken(
                fakeUserId,
                "storedRefreshToken",
                new Date(System.currentTimeMillis() + 1000000L)
        );

        when(tokenUtil.isTokenValid(validAccessToken)).thenReturn(true);
        when(tokenUtil.getSubject(validAccessToken)).thenReturn(String.valueOf(fakeUserId));
        when(refreshTokenRepository.findByUserId(fakeUserId)).thenReturn(Optional.of(dummyRefresh));

        // When
        UserTokenDto result = authService.reissueTokens(dummyRefreshToken, authHeader);

        // Then
        assertThat(result.accessToken()).isEqualTo(validAccessToken);
        assertThat(result.refreshToken()).isEqualTo(dummyRefresh);

        verify(tokenUtil, times(1)).isTokenValid(validAccessToken);
        verify(tokenUtil, never()).createLoginToken(anyLong());

        verify(refreshTokenRepository, times(1)).findByUserId(fakeUserId);

    }


    @Test
    @DisplayName("reissueAccessToken - 액세스 토큰이 만료된 경우 새 토큰 발급")
    void reissueAccessToken_whenAccessTokenExpired_thenReturnNewAccessToken() {
        // Given
        String expiredAccessToken = "expiredAccessToken";
        String authHeader = "Bearer " + expiredAccessToken;
        String providedRefreshToken = "providedRefreshToken";
        Long userId = 1L;

        when(tokenUtil.isTokenValid(expiredAccessToken)).thenReturn(false);
        when(tokenUtil.isAccessTokenExpired(expiredAccessToken)).thenReturn(userId);

        RefreshToken foundRefreshToken = mock(RefreshToken.class);
        when(foundRefreshToken.getToken()).thenReturn(providedRefreshToken);
        when(refreshTokenRepository.findByUserId(userId)).thenReturn(Optional.of(foundRefreshToken));

        UserTokenDto newTokens = mock(UserTokenDto.class);
        String newAccessToken = "newAccessToken";
        RefreshToken newRefreshToken = mock(RefreshToken.class);
        when(newTokens.accessToken()).thenReturn(newAccessToken);
        when(newTokens.refreshToken()).thenReturn(newRefreshToken);
        when(tokenUtil.createLoginToken(userId)).thenReturn(newTokens);

        // When
        String result = authService.reissueTokens(providedRefreshToken, authHeader).accessToken();

        // Then
        assertThat(result).isEqualTo(newAccessToken);
        verify(tokenUtil, times(1)).isTokenValid(expiredAccessToken);
        verify(tokenUtil, times(1)).isAccessTokenExpired(expiredAccessToken);
        verify(refreshTokenRepository, times(1)).findByUserId(userId);
        verify(tokenUtil, times(1)).createLoginToken(userId);
        verify(foundRefreshToken, times(1)).reissueRefreshToken(newRefreshToken);
    }

    @Test
    @DisplayName("reissueAccessToken - 액세스 토큰이 유효하지 않고 만료된 것도 아닐 경우 FAILED_TO_VALIDATE_TOKEN 예외 발생")
    void reissueAccessToken_whenAccessTokenNotValidAndNotExpired_thenThrowFailedToValidateToken() {
        // Given
        String invalidAccessToken = "invalidAccessToken";
        String authHeader = "Bearer " + invalidAccessToken;
        String dummyRefreshToken = "dummyRefreshToken";

        when(tokenUtil.isTokenValid(invalidAccessToken)).thenReturn(false);
        when(tokenUtil.isAccessTokenExpired(invalidAccessToken)).thenReturn(null);

        // When & Then
        assertThatThrownBy(() -> authService.reissueTokens(dummyRefreshToken, authHeader))
                .isInstanceOf(CustomException.class)
                .hasMessageContaining(ExceptionCode.FAILED_TO_VALIDATE_TOKEN.getMessage());
    }

    @Test
    @DisplayName("reissueAccessToken - DB에 저장된 refresh token과 전달받은 값이 다를 경우 INVALID_REQUEST 예외 발생")
    void reissueAccessToken_whenRefreshTokenMismatch_thenThrowInvalidRequest() {
        // Given
        String expiredAccessToken = "expiredAccessToken";
        String authHeader = "Bearer " + expiredAccessToken;
        String providedRefreshToken = "providedRefreshToken";
        Long userId = 1L;

        when(tokenUtil.isTokenValid(expiredAccessToken)).thenReturn(false);
        when(tokenUtil.isAccessTokenExpired(expiredAccessToken)).thenReturn(userId);

        RefreshToken foundRefreshToken = mock(RefreshToken.class);
        when(foundRefreshToken.getToken()).thenReturn("differentRefreshToken");
        when(refreshTokenRepository.findByUserId(userId)).thenReturn(Optional.of(foundRefreshToken));

        // When & Then
        assertThatThrownBy(() -> authService.reissueTokens(providedRefreshToken, authHeader))
                .isInstanceOf(CustomException.class)
                .hasMessageContaining(ExceptionCode.INVALID_REQUEST.getMessage());
    }

    @Test
    @DisplayName("reissueAccessToken - 해당 userId로 refresh token을 찾지 못한 경우 INVALID_REFRESH_TOKEN 예외 발생")
    void reissueAccessToken_whenNoRefreshTokenFound_thenThrowInvalidRefreshToken() {
        // Given
        String expiredAccessToken = "expiredAccessToken";
        String authHeader = "Bearer " + expiredAccessToken;
        String providedRefreshToken = "providedRefreshToken";
        Long userId = 1L;

        when(tokenUtil.isTokenValid(expiredAccessToken)).thenReturn(false);
        when(tokenUtil.isAccessTokenExpired(expiredAccessToken)).thenReturn(userId);
        when(refreshTokenRepository.findByUserId(userId)).thenReturn(Optional.empty());

        // When & Then
        assertThatThrownBy(() -> authService.reissueTokens(providedRefreshToken, authHeader))
                .isInstanceOf(CustomException.class)
                .hasMessageContaining(ExceptionCode.INVALID_REFRESH_TOKEN.getMessage());
    }

    @Test
    @DisplayName("로그아웃 - 잘 작동하는지 확인")
    void logout_ShouldCallDeleteByToken() {
        // given
        String refreshToken = "sample-refresh-token";

        // when
        authService.logout(refreshToken);

        // then
        verify(refreshTokenRepository, times(1)).deleteByToken(refreshToken);
    }
}
