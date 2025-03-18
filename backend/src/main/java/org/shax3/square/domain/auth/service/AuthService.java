package org.shax3.square.domain.auth.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import okhttp3.FormBody;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;
import org.shax3.square.domain.auth.TokenUtil;
import org.shax3.square.domain.auth.dto.UserLoginDto;
import org.shax3.square.domain.auth.dto.UserTokenDto;
import org.shax3.square.domain.auth.repository.RefreshTokenJpaRepository;
import org.shax3.square.domain.user.model.User;
import org.shax3.square.domain.user.repository.UserRepository;
import org.shax3.square.exception.CustomException;
import org.shax3.square.exception.ExceptionCode;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService {

    @Value("${GOOGLE_REDIRECT_URI}")
    private String googleRedirectUri;

    @Value("${GOOGLE_CLIENT_ID}")
    private String googleClientId;

    @Value("${GOOGLE_CLIENT_SECRET}")
    private String googleClientSecret;

    private static final String TOKEN_URL = "https://oauth2.googleapis.com/token";

    private static final String USER_INFO_URL = "https://www.googleapis.com/oauth2/v2/userinfo";

    private final UserRepository userRepository;
    private final RefreshTokenJpaRepository refreshTokenJpaRepository;
    private final TokenUtil tokenUtil;

    private final OkHttpClient client = new OkHttpClient();

    public UserLoginDto loginTest(String email) {
        Optional<User> user = userRepository.findByEmail(email);

        if (user.isPresent()) {
            User loginUser = user.get();
            UserTokenDto userTokens = tokenUtil.createLoginToken(loginUser.getId());
            refreshTokenJpaRepository.save(userTokens.refreshToken());

            return UserLoginDto.createMemberLoginDto(userTokens, loginUser);
        }

        return UserLoginDto.createNotMemberLoginDto(email);
    }

    public UserLoginDto googleLogin(String code) {

        String email = googleCallback(code);

        Optional<User> user = userRepository.findByEmail(email);

        if (user.isPresent()) {
            User loginUser = user.get();
            UserTokenDto userTokens = tokenUtil.createLoginToken(loginUser.getId());
            refreshTokenJpaRepository.save(userTokens.refreshToken());

            return UserLoginDto.createMemberLoginDto(userTokens, loginUser);
        }

        return UserLoginDto.createNotMemberLoginDto(email);
    }

    private String googleCallback(String code) {
        RequestBody requestBody = new FormBody.Builder()
                .add("code", code)
                .add("client_id", googleClientId)
                .add("client_secret", googleClientSecret)
                .add("redirect_uri", googleRedirectUri)
                .add("grant_type", "authorization_code")
                .build();

        Request request = new Request.Builder()
                .url(TOKEN_URL)
                .post(requestBody)
                .build();

        String accessToken;
        try {
            Response response = client.newCall(request).execute();
            String responseBody = response.body().string();
            ObjectMapper mapper = new ObjectMapper();
            JsonNode jsonNode = mapper.readTree(responseBody);
            accessToken = jsonNode.get("access_token").asText();
        } catch (IOException e) {
            throw new CustomException(ExceptionCode.UNABLE_TO_GET_ACCESS_TOKEN);
        }

        Request userInfoRequest = new Request.Builder()
                .url(USER_INFO_URL)
                .addHeader("Authorization", "Bearer " + accessToken)
                .build();

        String email;
        try {
            Response userInfoResponse = client.newCall(userInfoRequest).execute();
            String userInfo = userInfoResponse.body().string();
            ObjectMapper mapper = new ObjectMapper();
            JsonNode jsonNode = mapper.readTree(userInfo);
            email = jsonNode.get("email").asText();
        } catch(IOException e) {
            throw new CustomException((ExceptionCode.UNABLE_TO_GET_USER_INFO));
        }

        return email;
    }
}
