package org.shax3.square.domain.user.dto.response;

public record ProfileUrlResponse(
        String profileUrl
) {
    public static ProfileUrlResponse from(String profileUrl) {
        return new ProfileUrlResponse(profileUrl);
    }
}
