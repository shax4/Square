package org.shax3.square.domain.user.model;

import static jakarta.persistence.EnumType.STRING;
import static jakarta.persistence.GenerationType.IDENTITY;
import static lombok.AccessLevel.PROTECTED;
import static org.shax3.square.domain.user.model.UserStatus.ACTIVE;

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

    @Column(name = "profile_uri", nullable = false)
    private String profileUri;

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
            String profileUri,
            Region region,
            Gender gender,
            AgeRange ageRange,
            Religion religion,
            Type type,
            SocialType socialType
    ) {
        this.email = email;
        this.nickname = nickname;
        this.profileUri = profileUri;
        this.region = region;
        this.gender = gender;
        this.ageRange = ageRange;
        this.religion = religion;
        this.type = type;
        this.socialType = socialType;
        this.state = ACTIVE;
    }

    public boolean updateNickname(String nickname) {
        java.util.regex.Pattern p = java.util.regex.Pattern.compile("^[a-zA-Z0-9가-힣]{2,8}$");
        return p.matcher(nickname).matches();
    }
}
