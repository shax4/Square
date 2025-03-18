package org.shax3.square.domain.auth.controller;

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
public class AuthController {
    private final AuthService authService;

    //임시 로그인
    @GetMapping("/test")
    public ResponseEntity<UserInfoResponse> loginTest(
            @RequestParam String email,
            HttpServletResponse response
    ) {
        System.out.println("email:" + email);
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