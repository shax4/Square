package org.shax3.square.domain.s3.service;

import lombok.RequiredArgsConstructor;
import org.shax3.square.domain.s3.dto.request.PresignedPutUrlRequest;
import org.shax3.square.domain.s3.dto.response.PresignedPutUrlResponse;
import org.shax3.square.exception.CustomException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;
import software.amazon.awssdk.services.s3.presigner.model.PresignedGetObjectRequest;
import software.amazon.awssdk.services.s3.presigner.model.PresignedPutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.model.PutObjectPresignRequest;

import java.time.Duration;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

import static org.shax3.square.exception.ExceptionCode.UNSUPPORTED_EXTENSIONS;

@Service
@RequiredArgsConstructor
public class S3Service {

    private final S3Presigner s3Presigner;

    @Value("${cloud.aws.s3.bucket}")
    private String bucketName;

    private static final List<String> ALLOWED_EXTENSIONS = Arrays.asList(".jpg", ".jpeg", ".png", ".gif", ".webp");

    public PresignedPutUrlResponse generatePresignedPutUrl(PresignedPutUrlRequest presignedPutUrlRequest) {

        String fileName = presignedPutUrlRequest.fileName();
        String contentType = presignedPutUrlRequest.contentType();

        validateImage(fileName, contentType);
        String generatedFileName = generateFileName(fileName, presignedPutUrlRequest.folder());

        PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(generatedFileName)
                .contentType(contentType)
                .build();

        PutObjectPresignRequest presignRequest = PutObjectPresignRequest.builder()
                .signatureDuration(Duration.ofMinutes(10))
                .putObjectRequest(putObjectRequest)
                .build();

        PresignedPutObjectRequest presignedPutObjectRequest = s3Presigner.presignPutObject(presignRequest);

        String presignedUrl = presignedPutObjectRequest.url().toString();

        return PresignedPutUrlResponse.of(presignedUrl, generatedFileName);
    }

    public String generatePresignedGetUrl(String s3Key) {
        GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                .bucket(bucketName)
                .key(s3Key)
                .build();

        GetObjectPresignRequest getObjectPresignRequest = GetObjectPresignRequest.builder()
                .signatureDuration(Duration.ofMinutes(10))
                .getObjectRequest(getObjectRequest)
                .build();

        PresignedGetObjectRequest presignedGetObjectRequest = s3Presigner.presignGetObject(getObjectPresignRequest);

        return presignedGetObjectRequest.url().toString();
    }

    private String generateFileName(String originalFileName, String folder) {
        String extension = "";
        int dotIndex = originalFileName.lastIndexOf(".");
        if (dotIndex != -1) {
            extension = originalFileName.substring(dotIndex);
        }

        String uuid = UUID.randomUUID().toString();

        return folder + "/" + uuid + extension;
    }

    private void validateImage(String originalFileName, String contentType) {
        if (contentType == null || !contentType.toLowerCase().startsWith("image/")) {
            throw new IllegalArgumentException("Only image content types are allowed.");
        }

        int dotIndex = originalFileName.lastIndexOf(".");
        if (dotIndex != -1) {
            String extension = originalFileName.substring(dotIndex).toLowerCase();
            if (!ALLOWED_EXTENSIONS.contains(extension)) {
                throw new CustomException(UNSUPPORTED_EXTENSIONS);
            }
        }
    }
}
