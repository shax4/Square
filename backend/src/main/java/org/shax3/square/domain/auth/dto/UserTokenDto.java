package org.shax3.square.domain.auth.dto;

import org.shax3.square.domain.auth.model.RefreshToken;

public record UserTokenDto(
        String accessToken,
        RefreshToken refreshToken
) {
}
