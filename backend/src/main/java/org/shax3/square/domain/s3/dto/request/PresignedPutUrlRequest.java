package org.shax3.square.domain.s3.dto.request;

import jakarta.validation.constraints.NotBlank;

public record PresignedPutUrlRequest(
        @NotBlank(message = "파일명은 필수입니다.")
        String fileName,
        @NotBlank(message = "파일 타입은 필수입니다.")
        String contentType,
        @NotBlank(message = "폴더명은 필수입니다.")
        String folder
) {
}
