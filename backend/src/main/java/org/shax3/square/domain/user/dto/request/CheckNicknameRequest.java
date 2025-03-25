package org.shax3.square.domain.user.dto.request;

import jakarta.validation.constraints.NotBlank;

public record CheckNicknameRequest(
        @NotBlank(message = "닉네임을 입력해주세요.")
        String nickname
) {
}
