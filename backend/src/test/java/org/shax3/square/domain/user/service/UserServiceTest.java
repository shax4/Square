package org.shax3.square.domain.user.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.shax3.square.domain.auth.TokenUtil;
import org.shax3.square.domain.auth.dto.UserTokenDto;
import org.shax3.square.domain.auth.model.RefreshToken;
import org.shax3.square.domain.auth.repository.RefreshTokenRepository;
import org.shax3.square.domain.s3.service.S3Service;
import org.shax3.square.domain.user.dto.UserSignUpDto;
import org.shax3.square.domain.user.dto.request.CheckNicknameRequest;
import org.shax3.square.domain.user.dto.request.SignUpRequest;
import org.shax3.square.domain.user.dto.request.UpdateProfileRequest;
import org.shax3.square.domain.user.dto.response.CheckNicknameResponse;
import org.shax3.square.domain.user.dto.response.ProfileInfoResponse;
import org.shax3.square.domain.user.dto.response.ProfileUrlResponse;
import org.shax3.square.domain.user.model.*;
import org.shax3.square.domain.user.repository.UserRedisRepository;
import org.shax3.square.domain.user.repository.UserRepository;
import org.shax3.square.exception.CustomException;

import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.*;

class UserServiceTest {

    @Mock
    private TokenUtil tokenUtil;

    @Mock
    private UserRepository userRepository;

    @Mock
    private RefreshTokenRepository refreshTokenRepository;

    @Mock
    private UserRedisRepository userRedisRepository;

    @Mock
    private S3Service s3Service;

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

    @Test
    @DisplayName("회원탈퇴 성공")
    void deleteAccount_ShouldDeleteTokenAndCallUserDeleteAccount() {
        // given
        String refreshToken = "sample-refresh-token";
        // spy를 사용하여 deleteAccount() 호출을 검증할 수 있도록 함
        User user = spy(User.builder().build());

        when(userRepository.findById(nullable(Long.class)))
                .thenReturn(Optional.of(user));

        // when
        userService.deleteAccount(user, refreshToken);

        // then
        verify(refreshTokenRepository, times(1)).deleteByToken(refreshToken);
        verify(userRepository, times(1)).findById(user.getId());
        verify(user, times(1)).deleteAccount();
    }

    @Test
    @DisplayName("회원탈퇴 실패 - 유저가 존재하지 않음")
    void deleteAccount_WhenUserNotFound_ShouldThrowCustomException() {
        // given
        String refreshToken = "sample-refresh-token";
        User user = User.builder().build();

        when(userRepository.findById(user.getId()))
                .thenReturn(Optional.empty());

        // when & then: 존재하지 않는 경우 CustomException이 발생함을 검증
        assertThrows(CustomException.class, () -> {
            userService.deleteAccount(user, refreshToken);
        });

        verify(refreshTokenRepository, times(1)).deleteByToken(refreshToken);
        verify(userRepository, times(1)).findById(user.getId());
    }

    @Test
    @DisplayName("닉네임 중복 검사 false - db에 이미 존재함")
    void checkNicknameDuplication_existingNickname_returnsFalse() {
        // given
        String nickname = "existingUser";
        CheckNicknameRequest request = new CheckNicknameRequest(nickname);
        // 이미 존재하는 사용자가 있다고 가정 (더미 User 객체 사용)
        User dummyUser = User.builder().build();
        given(userRepository.findByNickname(nickname)).willReturn(Optional.of(dummyUser));

        // when
        CheckNicknameResponse response = userService.checkNicknameDuplication(request);

        // then
        assertThat(response).isEqualTo(CheckNicknameResponse.canCreate(false));
        verify(userRepository).findByNickname(nickname);
    }

    @Test
    @DisplayName("닉네임 중복검사 true")
    void checkNicknameDuplication_nonExistingNickname_reservationSuccessful_returnsTrue() {
        // given
        String nickname = "newUser";
        CheckNicknameRequest request = new CheckNicknameRequest(nickname);
        given(userRepository.findByNickname(nickname)).willReturn(Optional.empty());
        given(userRedisRepository.reserveNickname(nickname)).willReturn(true);

        // when
        CheckNicknameResponse response = userService.checkNicknameDuplication(request);

        // then
        assertThat(response).isEqualTo(CheckNicknameResponse.canCreate(true));
        verify(userRepository).findByNickname(nickname);
        verify(userRedisRepository).reserveNickname(nickname);
    }

    @Test
    @DisplayName("닉네임 중복검사 false - 레디스에 예약된 닉네임이 있음")
    void checkNicknameDuplication_nonExistingNickname_reservationFails_returnsFalse() {
        // given
        String nickname = "anotherUser";
        CheckNicknameRequest request = new CheckNicknameRequest(nickname);
        given(userRepository.findByNickname(nickname)).willReturn(Optional.empty());
        given(userRedisRepository.reserveNickname(nickname)).willReturn(false);

        // when
        CheckNicknameResponse response = userService.checkNicknameDuplication(request);

        // then
        assertThat(response).isEqualTo(CheckNicknameResponse.canCreate(false));
        verify(userRepository).findByNickname(nickname);
        verify(userRedisRepository).reserveNickname(nickname);
    }

    @Test
    @DisplayName("프로필 정보 조회 테스트")
    void testGetProfileInfo() {
        // given
        User user = User.builder()
                .s3Key("dummyKey")
                .region(Region.BUSAN)
                .religion(Religion.CATHOLICISM)
                .build();

        String expectedUrl = "http://example.com/dummyKey";
        when(s3Service.generatePresignedGetUrl("dummyKey")).thenReturn(expectedUrl);

        // when
        ProfileInfoResponse response = userService.getProfileInfo(user);

        // then
        assertThat(response.region()).isEqualTo(Region.BUSAN.getKoreanName());
        assertThat(response.religion()).isEqualTo(Religion.CATHOLICISM.getKoreanName());
        assertThat(response.profileUrl()).isEqualTo(expectedUrl);
    }

    @Test
    @DisplayName("프로필 정보 수정 테스트(프로필 이미지도 수정)")
    void testUpdateProfileInfo_withProvidedS3Key() {
        // given
        User user = spy(User
                .builder()
                .s3Key("oldS3Key")
                .build());
        UpdateProfileRequest updateProfileRequest = mock(UpdateProfileRequest.class);

        when(userRepository.findById(nullable(Long.class))).thenReturn(Optional.of(user));
        String newS3Key = "newS3Key";
        when(updateProfileRequest.s3Key()).thenReturn(newS3Key);

        String expectedUrl = "http://example.com/" + newS3Key;
        when(s3Service.generatePresignedGetUrl(newS3Key)).thenReturn(expectedUrl);

        // when
        ProfileUrlResponse response = userService.updateProfileInfo(user, updateProfileRequest);

        // then
        assertThat(response.profileUrl()).isEqualTo(expectedUrl);
        // User 객체의 updateProfileInfo 메서드가 올바른 파라미터로 호출되었는지 검증
        verify(user).updateProfileInfo(updateProfileRequest, newS3Key);
    }

    @Test
    @DisplayName("프로필 정보 수정 테스트(프로필 이미지는 수정x)")
    void testUpdateProfileInfo_withoutProvidedS3Key() {
        // given
        User user = spy(User
                .builder()
                .s3Key("existingS3Key")
                .build());
        UpdateProfileRequest updateProfileRequest = mock(UpdateProfileRequest.class);

        when(userRepository.findById(nullable(Long.class))).thenReturn(Optional.of(user));
        when(updateProfileRequest.s3Key()).thenReturn(null);

        String expectedUrl = "http://example.com/" + user.getS3Key();
        when(s3Service.generatePresignedGetUrl(user.getS3Key())).thenReturn(expectedUrl);

        // when
        ProfileUrlResponse response = userService.updateProfileInfo(user, updateProfileRequest);

        // then
        assertThat(response.profileUrl()).isEqualTo(expectedUrl);
        verify(user).updateProfileInfo(eq(updateProfileRequest), eq("existingS3Key"));
    }
}
