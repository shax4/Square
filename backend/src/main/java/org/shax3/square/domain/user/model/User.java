package org.shax3.square.domain.user.model;

import static jakarta.persistence.EnumType.STRING;
import static jakarta.persistence.GenerationType.IDENTITY;
import static lombok.AccessLevel.PROTECTED;
import static org.shax3.square.domain.user.model.UserStatus.ACTIVE;
import static org.shax3.square.exception.ExceptionCode.AGE_LIMIT_FROM_TEN;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;

import org.shax3.square.common.entity.BaseTimeEntity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.shax3.square.exception.CustomException;
import org.shax3.square.exception.ExceptionCode;

import java.time.LocalDate;

@Entity
@Getter
@NoArgsConstructor(access = PROTECTED)
@AllArgsConstructor(access = PROTECTED)
@Table(
        name = "user"
)
public class User extends BaseTimeEntity {
    @Id
    @GeneratedValue(strategy = IDENTITY)
    @Column(name = "id")
    private Long id;

    @Email
    @Column(name = "email", length = 40, unique = true)
    private String email;

    @Column(name = "nickname", nullable = false, length = 30, unique = true)
    @Pattern(regexp = "^[a-zA-Z0-9가-힣]{2,8}$", message = "닉네임은 영문, 숫자, 한글로만 구성되어 있으며, 길이는 2자리 이상 8자리 이하이어야 합니다.")
    private String nickname;

    @Column(name = "s3_key", nullable = false)
    private String s3Key;

    @Enumerated(STRING)
    @Column(name = "region", nullable = false)
    private Region region;

    @Enumerated(STRING)
    @Column(name = "gender", nullable = false)
    private Gender gender;

    @Column(name = "year_of_birth", nullable = false)
    private int yearOfBirth;

    @Enumerated(STRING)
    @Column(name = "age_range", nullable = false)
    private AgeRange ageRange;

    @Enumerated(STRING)
    @Column(name = "religion", nullable = false)
    private Religion religion;

    @Enumerated(STRING)
    @Column(name = "type")
    private Type type;

    @Enumerated(STRING)
    @Column(name = "social_type", nullable = false)
    private SocialType socialType;

    @Enumerated(STRING)
    @Column(name = "state")
    private UserStatus state;

    @Builder
    public User(
            String email,
            String nickname,
            String profileUrl,
            Region region,
            Gender gender,
            int yearOfBirth,
            Religion religion,
            Type type,
            SocialType socialType
    ) {
        this.email = email;
        this.nickname = nickname;
        this.s3Key = profileUrl;
        this.region = region;
        this.gender = gender;
        this.yearOfBirth = yearOfBirth;
        this.ageRange = catculateAgeRange(yearOfBirth);
        this.religion = religion;
        this.type = type;
        this.socialType = socialType;
        this.state = ACTIVE;
    }

    public boolean updateNickname(String nickname) {
        java.util.regex.Pattern p = java.util.regex.Pattern.compile("^[a-zA-Z0-9가-힣]{2,8}$");
        return p.matcher(nickname).matches();
    }

    private AgeRange catculateAgeRange(int yearOfBirth) {
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
