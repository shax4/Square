package org.shax3.square.domain.user.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import org.shax3.square.domain.user.model.Region;
import org.shax3.square.domain.user.model.Religion;

public record UpdateProfileRequest(
        @NotBlank(message = "닉네임을 입력해주세요.")
        @Pattern(regexp = "^[a-zA-Z0-9가-힣]{2,8}$", message = "닉네임은 영문, 숫자, 한글로만 구성되어 있으며, 길이는 2자리 이상 8자리 이하이어야 합니다.")
        String nickname,
        String s3Key,
        @NotNull(message = "지역을 입력해주세요.")
        Region region,
        @NotNull(message = "종교를 입력해주세요.")
        Religion religion
) {
}
