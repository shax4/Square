package org.shax3.square.domain.s3.dto.response;

public record PresignedGetUrlResponse(
        String presignedGetUrl
) {
    public static PresignedGetUrlResponse of(String presignedGetUrl) {
        return new PresignedGetUrlResponse(presignedGetUrl);
    }
}
