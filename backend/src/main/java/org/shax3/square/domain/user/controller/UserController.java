package org.shax3.square.domain.user.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.shax3.square.domain.user.dto.UserSignUpDto;
import org.shax3.square.domain.user.dto.request.SignUpRequest;
import org.shax3.square.domain.user.dto.response.SignUpUserInfoResponse;
import org.shax3.square.domain.user.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/users")
@RequiredArgsConstructor
@Tag(name = "User", description = "유저 관련 API")
public class UserController {

    private final UserService userService;

    @Operation(
            summary = "회원가입 API",
            description = "회원가입을 위한 정보를 보내주시면 AccessToken과 RefreshToken을 발급해줍니다"
    )
    @PostMapping
    public ResponseEntity<SignUpUserInfoResponse> userSignUp(
            HttpServletResponse response,
            @CookieValue("sign-up-token") String signUpToken,
            @RequestBody SignUpRequest signUpRequest
    ) {
        UserSignUpDto userSignUpDto = userService.signUp(signUpRequest,signUpToken);

        Cookie cookie = new Cookie("refresh-token", userSignUpDto.refreshToken().getToken());
        cookie.setHttpOnly(true);
        cookie.setSecure(false);
        cookie.setPath("/");
        response.addCookie(cookie);
        response.setHeader("Authorization", "Bearer " + userSignUpDto.accessToken());

        return ResponseEntity.ok().body(SignUpUserInfoResponse.from(userSignUpDto));
    }
}
