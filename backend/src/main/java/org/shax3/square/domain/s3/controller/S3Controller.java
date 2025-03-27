package org.shax3.square.domain.s3.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.shax3.square.domain.s3.dto.request.PresignedPutUrlRequest;
import org.shax3.square.domain.s3.dto.response.PresignedPutUrlResponse;
import org.shax3.square.domain.s3.service.S3Service;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/s3")
@Tag(name = "S3", description = "s3 관련 API")
public class S3Controller {

    private final S3Service s3Service;

    @Operation(
            summary = "이미지 등록용 API",
            description = "fileName과 contentType을 입력하면 presignedPutUrl과 새로운 fileName을 반환해줍니다."
    )
    @PostMapping("/presigned-put")
    public ResponseEntity<PresignedPutUrlResponse> getPresignedPutUrl(
            @Valid @RequestBody PresignedPutUrlRequest presignedPutUrlRequest
    ) {
        PresignedPutUrlResponse response = s3Service.generatePresignedPutUrl(presignedPutUrlRequest);

        return ResponseEntity.ok(response);
    }
}
