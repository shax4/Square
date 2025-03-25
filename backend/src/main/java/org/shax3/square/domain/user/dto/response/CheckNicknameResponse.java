package org.shax3.square.domain.user.dto.response;

public record CheckNicknameResponse(
        boolean valid
) {
    public static CheckNicknameResponse canCreate(boolean valid) {
        return new CheckNicknameResponse(valid);
    }
}
