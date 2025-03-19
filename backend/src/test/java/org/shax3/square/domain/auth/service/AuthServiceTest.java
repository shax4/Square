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
import org.shax3.square.exception.CustomException;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.AssertionsForClassTypes.assertThatThrownBy;
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

    // 1. 액세스 토큰이 유효한 경우
    @Test
    void reissueAccessToken_whenAccessTokenIsValid_thenReturnAccessToken() {
        // Given
        String validAccessToken = "validAccessToken";
        String authHeader = "Bearer " + validAccessToken;
        String dummyRefreshToken = "dummyRefreshToken"; // 사용되지 않음

        when(tokenUtil.isAccessTokenValid(validAccessToken)).thenReturn(true);

        // When
        String result = authService.reissueAccessToken(dummyRefreshToken, authHeader);

        // Then
        assertThat(result).isEqualTo(validAccessToken);
        verify(tokenUtil, times(1)).isAccessTokenValid(validAccessToken);
        verify(tokenUtil, never()).isAccessTokenExpired(anyString());
        verify(refreshTokenJpaRepository, never()).findByUserId(anyLong());
        verify(tokenUtil, never()).createLoginToken(anyLong());
    }

    // 2. 액세스 토큰이 만료되어 새 토큰을 발급하는 경우
    @Test
    void reissueAccessToken_whenAccessTokenExpired_thenReturnNewAccessToken() {
        // Given
        String expiredAccessToken = "expiredAccessToken";
        String authHeader = "Bearer " + expiredAccessToken;
        String providedRefreshToken = "providedRefreshToken";
        Long userId = 1L;

        when(tokenUtil.isAccessTokenValid(expiredAccessToken)).thenReturn(false);
        when(tokenUtil.isAccessTokenExpired(expiredAccessToken)).thenReturn(userId);

        RefreshToken foundRefreshToken = mock(RefreshToken.class);
        when(foundRefreshToken.getToken()).thenReturn(providedRefreshToken);
        when(refreshTokenJpaRepository.findByUserId(userId)).thenReturn(Optional.of(foundRefreshToken));

        UserTokenDto newTokens = mock(UserTokenDto.class);
        String newAccessToken = "newAccessToken";
        RefreshToken newRefreshToken = mock(RefreshToken.class);
        when(newTokens.accessToken()).thenReturn(newAccessToken);
        when(newTokens.refreshToken()).thenReturn(newRefreshToken);
        when(tokenUtil.createLoginToken(userId)).thenReturn(newTokens);

        // When
        String result = authService.reissueAccessToken(providedRefreshToken, authHeader);

        // Then
        assertThat(result).isEqualTo(newAccessToken);
        verify(tokenUtil, times(1)).isAccessTokenValid(expiredAccessToken);
        verify(tokenUtil, times(1)).isAccessTokenExpired(expiredAccessToken);
        verify(refreshTokenJpaRepository, times(1)).findByUserId(userId);
        verify(tokenUtil, times(1)).createLoginToken(userId);
        verify(foundRefreshToken, times(1)).reissueRefreshToken(newRefreshToken);
    }

    // 3. 액세스 토큰이 유효하지 않고, 만료 토큰에서 userId가 null인 경우 => FAILED_TO_VALIDATE_TOKEN 예외 발생
    @Test
    void reissueAccessToken_whenAccessTokenNotValidAndNotExpired_thenThrowFailedToValidateToken() {
        // Given
        String invalidAccessToken = "invalidAccessToken";
        String authHeader = "Bearer " + invalidAccessToken;
        String dummyRefreshToken = "dummyRefreshToken";

        when(tokenUtil.isAccessTokenValid(invalidAccessToken)).thenReturn(false);
        when(tokenUtil.isAccessTokenExpired(invalidAccessToken)).thenReturn(null);

        // When & Then
        assertThatThrownBy(() -> authService.reissueAccessToken(dummyRefreshToken, authHeader))
                .isInstanceOf(CustomException.class)
                .hasMessageContaining("토큰 검증에 실패했습니다.");
    }

    // 4. refresh token 불일치 => INVALID_REQUEST 예외 발생
    @Test
    void reissueAccessToken_whenRefreshTokenMismatch_thenThrowInvalidRequest() {
        // Given
        String expiredAccessToken = "expiredAccessToken";
        String authHeader = "Bearer " + expiredAccessToken;
        String providedRefreshToken = "providedRefreshToken";
        Long userId = 1L;

        when(tokenUtil.isAccessTokenValid(expiredAccessToken)).thenReturn(false);
        when(tokenUtil.isAccessTokenExpired(expiredAccessToken)).thenReturn(userId);

        RefreshToken foundRefreshToken = mock(RefreshToken.class);
        // DB에 저장된 refresh token과 전달받은 값이 다름
        when(foundRefreshToken.getToken()).thenReturn("differentRefreshToken");
        when(refreshTokenJpaRepository.findByUserId(userId)).thenReturn(Optional.of(foundRefreshToken));

        // When & Then
        assertThatThrownBy(() -> authService.reissueAccessToken(providedRefreshToken, authHeader))
                .isInstanceOf(CustomException.class)
                .hasMessageContaining("유효하지 않은 요청입니다.");
    }

    // 5. 해당 userId로 DB에서 refresh token을 찾지 못한 경우 => INVALID_REFRESH_TOKEN 예외 발생
    @Test
    void reissueAccessToken_whenNoRefreshTokenFound_thenThrowInvalidRefreshToken() {
        // Given
        String expiredAccessToken = "expiredAccessToken";
        String authHeader = "Bearer " + expiredAccessToken;
        String providedRefreshToken = "providedRefreshToken";
        Long userId = 1L;

        when(tokenUtil.isAccessTokenValid(expiredAccessToken)).thenReturn(false);
        when(tokenUtil.isAccessTokenExpired(expiredAccessToken)).thenReturn(userId);
        when(refreshTokenJpaRepository.findByUserId(userId)).thenReturn(Optional.empty());

        // When & Then
        assertThatThrownBy(() -> authService.reissueAccessToken(providedRefreshToken, authHeader))
                .isInstanceOf(CustomException.class)
                .hasMessageContaining("사용자 식별에 실패했습니다. 다시 로그인해주세요.");
    }
}
