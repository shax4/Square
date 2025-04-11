package org.shax3.square.domain.auth.controller;

import com.google.firebase.auth.FirebaseToken;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.shax3.square.domain.auth.TokenUtil;
import org.shax3.square.domain.auth.annotation.AuthUser;
import org.shax3.square.domain.auth.dto.UserLoginDto;
import org.shax3.square.domain.auth.dto.UserTokenDto;
import org.shax3.square.domain.auth.dto.request.FirebaseLoginRequest;
import org.shax3.square.domain.auth.dto.response.FirebaseLoginResponse;
import org.shax3.square.domain.auth.dto.response.TestUserInfoResponse;
import org.shax3.square.domain.auth.dto.response.UserInfoResponse;
import org.shax3.square.domain.auth.service.AuthService;
import org.shax3.square.domain.auth.service.FirebaseService;
import org.shax3.square.domain.user.model.User;
import org.shax3.square.domain.user.service.UserDeviceService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Tag(name = "Auth", description = "인증 관련 API")
public class AuthController {

//    @Value("${oauth2.google.redirect-uri}")
//    private String googleRedirectUri;
//
//    @Value("${oauth2.google.client-id}")
//    private String googleClientId;

    private final AuthService authService;
    private final TokenUtil tokenUtil;
    private final UserDeviceService userDeviceService;
    private final FirebaseService firebaseService;

    @Operation(
            summary = "임시 로그인 API",
            description = "email을 입력하면 Access Token과 Refresh Token을 반환합니다."
    )
    @GetMapping("/test1")
    public ResponseEntity<TestUserInfoResponse> loginTest1(
            HttpServletResponse response
    ) {
        UserLoginDto userLoginDto = authService.loginTest("test@test.com");

        return ResponseEntity.ok().body(TestUserInfoResponse.from(userLoginDto, userLoginDto.accessToken(), userLoginDto.refreshToken().getToken()));
    }

    @Operation(
            summary = "엑세스 토큰 재발급 api",
            description = "엑세스 토큰과 리프레쉬 토큰을 받아서 만료됐는지 확인합니다."
    )
    //TODO
    @PostMapping("/reissue")
    public ResponseEntity<UserTokenDto> reissueToken(
            @RequestHeader("Refresh-token") String refreshToken,
            @RequestHeader("Authorization") String authHeader
    ) {
        UserTokenDto tokenDto = authService.reissueTokens(refreshToken, authHeader);

        return ResponseEntity.ok(tokenDto);
    }

    //TODO
    @Operation(
            summary = "로그아웃 api",
            description = "RefreshToken을 만료시킵니다. 프론트엔드에서는 Access-token을 지웁니다."
    )
    @PostMapping("/logout")
    public ResponseEntity<Void> logout(
            @RequestHeader("Refresh-token") String refreshToken,
            @AuthUser User user
    ) {
        authService.logout(user,refreshToken);

        return ResponseEntity.ok().build();
    }
    //TODO
    @PostMapping("/firebase")
    public ResponseEntity<FirebaseLoginResponse> loginWithFirebase(
            @RequestBody FirebaseLoginRequest request
    ) {
        FirebaseToken firebaseUser = firebaseService.verifyIdToken(request.idToken());
        UserLoginDto userLoginDto = authService.firebaseLogin(firebaseUser, request);

        if (userLoginDto.isMember()) {

            userDeviceService.registerOrUpdateDevice(
                    userLoginDto.userId(),
                    request.fcmToken(),
                    request.deviceId(),
                    request.deviceType()
            );

            return ResponseEntity.ok(FirebaseLoginResponse.member(userLoginDto));
        }

        return ResponseEntity.ok(FirebaseLoginResponse.notMember(userLoginDto.email(),userLoginDto.socialType()));
    }


}