package org.shax3.square.domain.auth.dto;

import org.shax3.square.domain.auth.domain.RefreshToken;

public record UserTokenDto(
        String accessToken,
        RefreshToken refreshToken
) {
}
