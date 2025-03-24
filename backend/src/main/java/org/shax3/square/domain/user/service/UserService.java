package org.shax3.square.domain.user.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.shax3.square.domain.auth.TokenUtil;
import org.shax3.square.domain.auth.dto.UserTokenDto;
import org.shax3.square.domain.auth.repository.RefreshTokenRepository;
import org.shax3.square.domain.user.dto.UserSignUpDto;
import org.shax3.square.domain.user.dto.request.SignUpRequest;
import org.shax3.square.domain.user.model.AgeRange;
import org.shax3.square.domain.user.model.SocialType;
import org.shax3.square.domain.user.model.User;
import org.shax3.square.domain.user.repository.UserRepository;
import org.shax3.square.exception.CustomException;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Optional;

import static org.shax3.square.exception.ExceptionCode.*;

@Service
@RequiredArgsConstructor
public class UserService {

    private final TokenUtil tokenUtil;
    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;

    private static final String DEFAULT_PROFILE_IMG = "profile/0c643827-c958-465b-875d-918c8a22fe01.png";

    @Transactional
    public UserSignUpDto signUp(SignUpRequest signUpRequest, String signUpToken) {

        if (!tokenUtil.isTokenValid(signUpToken)) {
            throw new CustomException(SIGN_UP_TOKEN_INVALID);
        }

        String[] signUpInfo = tokenUtil.getSubject(signUpToken).split(":");
        String email = signUpInfo[0];
        SocialType socialType = SocialType.valueOf(signUpInfo[1]);

        Optional<User> foundUser = userRepository.findByEmail(email);
        if (foundUser.isPresent()) {
            throw new CustomException(DUPLICATE_EMAIL);
        }

        String s3Key = signUpRequest.s3Key();
        if (s3Key == null) {
            s3Key = DEFAULT_PROFILE_IMG;
        }
        AgeRange ageRange = calculateAgeRange(signUpRequest.yearOfBirth());
        User signUpUser = signUpRequest.to(email, socialType, ageRange, s3Key);
        userRepository.save(signUpUser);

        UserTokenDto userTokens = tokenUtil.createLoginToken(signUpUser.getId());
        refreshTokenRepository.save(userTokens.refreshToken());

        return UserSignUpDto.createSignUpDto(userTokens, signUpUser);
    }

    private AgeRange calculateAgeRange(int yearOfBirth) {
        int age = LocalDate.now().getYear() - yearOfBirth;
        age /= 10;

        return switch (age) {
            case 0 -> throw new CustomException(AGE_LIMIT_FROM_TEN);
            case 1 -> AgeRange.TEN;
            case 2 -> AgeRange.TWENTY;
            case 3 -> AgeRange.THIRTY;
            case 4 -> AgeRange.FORTY;
            default -> AgeRange.FIFTY;
        };
    }
}
