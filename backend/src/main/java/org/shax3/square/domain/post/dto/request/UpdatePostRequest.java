package org.shax3.square.domain.post.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.shax3.square.domain.post.model.Post;
import org.shax3.square.domain.user.model.User;

import java.util.List;

public record UpdatePostRequest(
        @NotBlank
        String title,
        @NotBlank
        String content,
        @NotNull
        List<String> deletedImages,
        @NotNull
        List<String> addedImages
) {
}
