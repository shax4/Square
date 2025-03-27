package org.shax3.square.domain.type.dto.response;

public record TypeInfoResponse(
    String nickname,
    String userType,
    int score1,
    int score2,
    int score3,
    int score4
) {
    public static TypeInfoResponse of() {

    }
}
