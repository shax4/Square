package org.shax3.square.domain.s3.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.shax3.square.domain.s3.dto.request.PresignedPutUrlRequest;
import org.shax3.square.domain.s3.dto.response.PresignedGetUrlResponse;
import org.shax3.square.domain.s3.dto.response.PresignedPutUrlResponse;
import org.shax3.square.domain.s3.service.S3Service;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/s3")
public class S3Controller {

    private final S3Service s3Service;

    @PostMapping("/presigned-put")
    public ResponseEntity<PresignedPutUrlResponse> getPresignedPutUrl(
            @Valid @RequestBody PresignedPutUrlRequest presignedPutUrlRequest
    ) {
        PresignedPutUrlResponse response = s3Service.generatePresignedPutUrl(presignedPutUrlRequest);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/presigned-get")
    public ResponseEntity<PresignedGetUrlResponse> getPresignedGetUrl(@RequestParam String fileName) {
        PresignedGetUrlResponse response = s3Service.generatePresignedGetUrl(fileName);
        return ResponseEntity.ok(response);
    }
}
