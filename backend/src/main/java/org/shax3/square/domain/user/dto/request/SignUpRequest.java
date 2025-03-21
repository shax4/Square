package org.shax3.square.domain.user.dto.request;

import org.shax3.square.domain.user.model.AgeRange;
import org.shax3.square.domain.user.model.Gender;
import org.shax3.square.domain.user.model.Region;
import org.shax3.square.domain.user.model.Religion;
import org.shax3.square.domain.user.model.SocialType;
import org.shax3.square.domain.user.model.User;

public record SignUpRequest(
        String nickname,
        String s3Key,
        Region region,
        Gender gender,
        int yearOfBirth,
        Religion religion
) {
    public User to(String email, SocialType socialType, AgeRange ageRange) {
        return User.builder()
                .email(email)
                .nickname(this.nickname)
                .s3Key(this.s3Key)
                .region(this.region)
                .gender(this.gender)
                .yearOfBirth(this.yearOfBirth)
                .ageRange(ageRange)
                .religion(this.religion)
                .socialType(socialType)
                .build();
    }
}
