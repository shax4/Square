package org.shax3.square.domain.post.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.shax3.square.domain.auth.annotation.AuthUser;
import org.shax3.square.domain.post.dto.request.CreatePostRequest;
import org.shax3.square.domain.post.service.PostService;
import org.shax3.square.domain.user.model.User;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/posts")
@RequiredArgsConstructor
@Tag(name = "Post", description = "게시글 관련 API")
public class PostController {

    private final PostService postService;

    @Operation(
            summary = "게시글 생성 api",
            description = "게시글 제목, 내용, 이미지(선택)를 넣어주면 게시글을 생성해줍니다."
    )
    @PostMapping
    public ResponseEntity<Void> createPost(
            @AuthUser User user,
            @Valid @RequestBody CreatePostRequest createPostRequest
    ) {
        postService.createPost(createPostRequest, user);

        return ResponseEntity.ok().build();
    }
}
