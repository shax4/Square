package org.shax3.square.domain.post.dto.request;

import jakarta.validation.constraints.NotBlank;
import org.shax3.square.domain.post.model.Post;
import org.shax3.square.domain.user.model.User;

import java.util.List;

public record CreatePostRequest(
        @NotBlank
        String title,
        @NotBlank
        String content,
        List<String> postImages
) {
    public Post to(User user) {
        return Post.builder()
                .title(this.title)
                .content(this.content)
                .user(user)
                .build();
    }
}
