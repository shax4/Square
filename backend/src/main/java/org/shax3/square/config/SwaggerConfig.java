package org.shax3.square.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.Components;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    private static final String JWT_SCHEME_NAME = "JWT";

    @Bean
    public OpenAPI openAPI() {


        SecurityScheme securityScheme = new SecurityScheme()
                .name(JWT_SCHEME_NAME)
                .type(SecurityScheme.Type.HTTP) // HTTP 인증 방식
                .scheme("bearer") // Bearer Token 방식
                .bearerFormat("JWT"); // JWT 형식

        return new OpenAPI()
                .info(apiInfo())
                .components(new Components().addSecuritySchemes(JWT_SCHEME_NAME, securityScheme)) // 보안 스키마 추가
                .addSecurityItem(new SecurityRequirement().addList(JWT_SCHEME_NAME)); // 보안 요구사항 적용
    }


    private Info apiInfo() {
        return new Info()
                .title("Square API Documentation") // API 제목
                .description("Square 프로젝트의 API가 설명되어 있습니다.") // 설명
                .version("1.0.0"); // 버전
    }
}
