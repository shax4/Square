package org.shax3.square.domain.auth.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.shax3.square.domain.auth.dto.UserLoginDto;
import org.shax3.square.domain.auth.dto.response.UserInfoResponse;
import org.shax3.square.domain.auth.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Tag(name = "Auth", description = "인증 관련 API")
public class AuthController {
    private final AuthService authService;

    @Operation(
            summary = "임시 로그인 API",
            description = "email을 입력하면 Access Token과 Refresh Token을 반환합니다."
    )
    @GetMapping("/test")
    public ResponseEntity<UserInfoResponse> loginTest(
            @RequestParam String email,
            HttpServletResponse response
    ) {
        UserLoginDto userLoginDto = authService.loginTest(email);

        if (userLoginDto.refreshToken() != null) {
            Cookie cookie = new Cookie("refresh-token", userLoginDto.refreshToken().getToken());
            cookie.setHttpOnly(true);
            cookie.setSecure(false);
            cookie.setPath("/");
            response.addCookie(cookie);
            response.setHeader("Authorization", userLoginDto.accessToken());
        }

        return ResponseEntity.ok().body(UserInfoResponse.from(userLoginDto));
    }
}