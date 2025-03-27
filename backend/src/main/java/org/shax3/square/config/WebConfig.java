package org.shax3.square.config;

import lombok.RequiredArgsConstructor;
import org.shax3.square.domain.auth.AuthenticationArgumentResolver;
import org.shax3.square.domain.auth.GuestAuthenticationArgumentResolver;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.List;

@Configuration
@RequiredArgsConstructor
public class WebConfig implements WebMvcConfigurer {
    private final AuthenticationArgumentResolver authenticationArgumentResolver;
    private final GuestAuthenticationArgumentResolver guestAuthenticationArgumentResolver;

    @Override
    public void addArgumentResolvers(List<HandlerMethodArgumentResolver> argumentResolvers) {
        argumentResolvers.add(authenticationArgumentResolver);
        argumentResolvers.add(guestAuthenticationArgumentResolver);
    }
}
