package org.shax3.square.domain.auth;

import jakarta.servlet.http.HttpServletRequest;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.shax3.square.domain.auth.annotation.Guest;
import org.shax3.square.domain.user.model.User;
import org.shax3.square.domain.user.repository.UserRepository;
import org.shax3.square.exception.CustomException;
import org.springframework.core.MethodParameter;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;

import static org.shax3.square.domain.user.model.State.INACTIVE;
import static org.shax3.square.domain.user.model.State.LEAVE;
import static org.shax3.square.exception.ExceptionCode.*;
import static org.springframework.http.HttpHeaders.AUTHORIZATION;

@Component
@RequiredArgsConstructor
@Slf4j
public class GuestAuthenticationArgumentResolver implements HandlerMethodArgumentResolver {
    private final UserRepository userRepository;
    private final TokenUtil tokenUtil;

    @Override
    public boolean supportsParameter(MethodParameter parameter) {
        return parameter.hasParameterAnnotation(Guest.class);
    }

    @Override
    public Object resolveArgument(@NonNull MethodParameter parameter,
                                  ModelAndViewContainer mavContainer,
                                  NativeWebRequest webRequest,
                                  WebDataBinderFactory binderFactory
    ) {
        HttpServletRequest request = webRequest.getNativeRequest(HttpServletRequest.class);

        if (request == null) {
            throw new CustomException(INVALID_REQUEST);
        }

        String authHeader = request.getHeader(AUTHORIZATION);
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return null;
        }

        String accessToken = authHeader.substring(7);
        if (!tokenUtil.isTokenValid(accessToken)) {
            return null;
        }
        return null;
    }

    private String extractAccessToken(HttpServletRequest request) {
        String authHeader = request.getHeader(AUTHORIZATION);
        if (authHeader == null) {
            throw new CustomException(INVALID_ACCESS_TOKEN);
        }
        return authHeader.substring(7);
    }

    private User extractUser(String accessToken) {
        Long userId = Long.valueOf(tokenUtil.getSubject(accessToken));

        return userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(INVALID_REQUEST));
    }

    private void checkState(User user) {
        if (user.getState() == LEAVE) {
            throw new CustomException(USER_DELETED);
        }
        if (user.getState() == INACTIVE) {
            throw new CustomException(USER_INACTIVE);
        }
    }
}
