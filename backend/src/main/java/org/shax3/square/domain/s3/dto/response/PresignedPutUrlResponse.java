package org.shax3.square.domain.s3.dto.response;

public record PresignedPutUrlResponse(
        String presignedPutUrl,
        String fileName
) {
     public static PresignedPutUrlResponse of(String presignedPutUrl,String fileName) {
         return new PresignedPutUrlResponse(presignedPutUrl, fileName);
     }
}
