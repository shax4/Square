package org.shax3.square.domain.user.dto.response;

public record CheckNicknameResponse(
        boolean isDuplicate
) {
    public static CheckNicknameResponse createFalse() {
        return new CheckNicknameResponse(false);
    }

    public static CheckNicknameResponse createTrue() {
        return new CheckNicknameResponse(true);
    }
}
