package org.shax3.square.domain.user.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.shax3.square.domain.auth.TokenUtil;
import org.shax3.square.domain.auth.dto.UserTokenDto;
import org.shax3.square.domain.auth.model.RefreshToken;
import org.shax3.square.domain.auth.repository.RefreshTokenRepository;
import org.shax3.square.domain.user.dto.UserSignUpDto;
import org.shax3.square.domain.user.dto.request.SignUpRequest;
import org.shax3.square.domain.user.model.*;
import org.shax3.square.domain.user.repository.UserRepository;
import org.shax3.square.exception.CustomException;

import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class UserServiceTest {

    @Mock
    private TokenUtil tokenUtil;

    @Mock
    private UserRepository userRepository;

    @Mock
    private RefreshTokenRepository refreshTokenRepository;

    @InjectMocks
    private UserService userService;

    @BeforeEach
    void setUp() {
        // Mockito 의 어노테이션(@Mock 등) 초기화
        MockitoAnnotations.openMocks(this);
    }

    @Test
    @DisplayName("signUp 성공 케이스")
    void signUp_success() {
        // given
        String signUpToken = "validToken";
        SignUpRequest request = new SignUpRequest(
                "닉네임",
                "profile/s3KeyPath",
                Region.SEOUL,
                Gender.MALE,
                1992,
                Religion.NONE
        );

        // TokenUtil 모킹
        when(tokenUtil.isTokenValid(signUpToken)).thenReturn(true);
        // getSubject: "이메일:소셜타입" 형태로 가정
        when(tokenUtil.getSubject(signUpToken)).thenReturn("test@example.com:KAKAO");

        // UserRepository: 해당 이메일이 아직 없는 상태라고 가정
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.empty());

        // 토큰 생성 Mock
        RefreshToken refreshToken = mock(RefreshToken.class);
        UserTokenDto userTokenDto = new UserTokenDto("mockAccessToken", refreshToken);
        when(tokenUtil.createLoginToken(nullable(Long.class))).thenReturn(userTokenDto);

        // when
        UserSignUpDto result = userService.signUp(request, signUpToken);

        // then
        assertThat(result).isNotNull();
        assertThat(result.nickname()).isEqualTo("닉네임");
        assertThat(result.accessToken()).isEqualTo("mockAccessToken");
        assertThat(result.refreshToken()).isEqualTo(refreshToken);

        // verify
        verify(userRepository, times(1)).save(any(User.class));
        verify(refreshTokenRepository, times(1)).save(refreshToken);
        verify(tokenUtil, times(1)).createLoginToken(nullable(Long.class));
    }

    @Test
    @DisplayName("signUp 실패 - 토큰 유효성 검증 실패")
    void signUp_fail_invalidToken() {
        // given
        String signUpToken = "invalidToken";
        SignUpRequest request = new SignUpRequest(
                "닉네임",
                "profile/s3KeyPath",
                Region.SEOUL,
                Gender.MALE,
                1992,
                Religion.NONE
        );

        when(tokenUtil.isTokenValid(signUpToken)).thenReturn(false);

        // when & then
        assertThatThrownBy(() -> userService.signUp(request, signUpToken))
                .isInstanceOf(CustomException.class)
                .extracting("code")
                .isEqualTo(2006);

        verify(userRepository, never()).save(any(User.class));
        verify(refreshTokenRepository, never()).save(any(RefreshToken.class));
        verify(tokenUtil, never()).createLoginToken(anyLong());
    }

    @Test
    @DisplayName("signUp 실패 - 이미 존재하는 이메일")
    void signUp_fail_duplicateEmail() {
        // given
        String signUpToken = "validToken";
        SignUpRequest request = new SignUpRequest(
                "닉네임",
                "profile/s3KeyPath",
                Region.SEOUL,
                Gender.MALE,
                1990,
                Religion.NONE
        );

        when(tokenUtil.isTokenValid(signUpToken)).thenReturn(true);
        when(tokenUtil.getSubject(signUpToken)).thenReturn("test@example.com:GOOGLE");

        // 이미 이메일이 존재
        User existingUser = User.builder()
                .email("test@example.com")
                .build();
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(existingUser));

        // when & then
        assertThatThrownBy(() -> userService.signUp(request, signUpToken))
                .isInstanceOf(CustomException.class)
                .extracting("code")
                .isEqualTo(2007);

        verify(userRepository, never()).save(any(User.class));
        verify(refreshTokenRepository, never()).save(any(RefreshToken.class));
        verify(tokenUtil, never()).createLoginToken(anyLong());
    }

    @Test
    @DisplayName("signUp 실패 - 10살 미만 예외 (ex: 2020년생)")
    void signUp_fail_ageLimitFromTen() {
        // given
        String signUpToken = "validToken";
        SignUpRequest request = new SignUpRequest(
                "아기",
                "profile/someS3Key",
                Region.BUSAN,
                Gender.FEMALE,
                2020,
                Religion.NONE
        );

        when(tokenUtil.isTokenValid(signUpToken)).thenReturn(true);
        when(tokenUtil.getSubject(signUpToken)).thenReturn("child@example.com:KAKAO");

        // 이메일 미존재 가정
        when(userRepository.findByEmail("child@example.com")).thenReturn(Optional.empty());

        // when & then
        assertThatThrownBy(() -> userService.signUp(request, signUpToken))
                .isInstanceOf(CustomException.class)
                .extracting("code")
                .isEqualTo(2004);

        verify(userRepository, never()).save(any(User.class));
        verify(refreshTokenRepository, never()).save(any(RefreshToken.class));
        verify(tokenUtil, never()).createLoginToken(anyLong());
    }
}
