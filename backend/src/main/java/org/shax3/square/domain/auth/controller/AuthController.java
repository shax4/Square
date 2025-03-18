package org.shax3.square.domain.auth.controller;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.shax3.square.domain.auth.TokenUtil;
import org.shax3.square.domain.auth.dto.UserLoginDto;
import org.shax3.square.domain.auth.dto.response.UserInfoResponse;
import org.shax3.square.domain.auth.service.AuthService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    @Value("${GOOGLE_REDIRECT_URI}")
    private String googleRedirectUri;

    @Value("${GOOGLE_CLIENT_ID}")
    private String googleClientId;

    private final AuthService authService;
    private final TokenUtil tokenUtil;

    //임시 로그인
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

    @GetMapping("/google")
    public void loginWithGoogle(HttpServletResponse response) throws IOException {
        String encodedRedirectUri = URLEncoder.encode(googleRedirectUri, StandardCharsets.UTF_8);
        System.out.println(encodedRedirectUri);
        String googleAuthUrl = "https://accounts.google.com/o/oauth2/v2/auth"
                + "?client_id=" + googleClientId
                + "&redirect_uri=" + encodedRedirectUri
                + "&response_type=code"
                + "&scope=email"
                + "&access_type=offline";

        response.sendRedirect(googleAuthUrl);
    }

    @GetMapping("/callback/google")
    public ResponseEntity<UserInfoResponse> redirectGoole(
            @RequestParam("code") String code,
            HttpServletResponse response
    ) {
        UserLoginDto userLoginDto = authService.googleLogin(code);

        if (userLoginDto.refreshToken() != null) {
            Cookie cookie = new Cookie("refresh-token", userLoginDto.refreshToken().getToken());
            cookie.setHttpOnly(true);
            cookie.setSecure(false);
            cookie.setPath("/");
            response.addCookie(cookie);
            response.setHeader("Authorization", userLoginDto.accessToken());

            return ResponseEntity.ok().body(UserInfoResponse.from(userLoginDto));
        }

        String email = userLoginDto.email();
        String signUpToken = tokenUtil.createSignUpToken(email, "GOOGLE");

        Cookie cookie = new Cookie("sign-up-token", signUpToken);
        cookie.setHttpOnly(true);
        cookie.setSecure(false);
        cookie.setPath("/");
        response.addCookie(cookie);

        return ResponseEntity.ok().body(UserInfoResponse.from(userLoginDto));
    }
}