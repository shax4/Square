package org.shax3.square.domain.post.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.shax3.square.domain.auth.annotation.AuthUser;
import org.shax3.square.domain.post.dto.request.CreatePostRequest;
import org.shax3.square.domain.post.dto.request.UpdatePostRequest;
import org.shax3.square.domain.post.service.PostService;
import org.shax3.square.domain.user.model.User;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
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

    @Operation(
            summary = "게시글 수정 api",
            description = "게시글 제목, 내용, 삭제 이미지, 추가 이미지 리스트를 넣어주면 게시글을 수정합니다."
    )
    @PutMapping("/{postId}")
    public ResponseEntity<Void> updatePost(
            @AuthUser User user,
            @PathVariable Long postId,
            @Valid @RequestBody UpdatePostRequest updatePostRequest
    ) {
        postService.updatePost(user, postId, updatePostRequest);

        return ResponseEntity.ok().build();
    }

    @Operation(
            summary = "게시글 삭제 api",
            description = "path에 포함된 게시글 id로 해당 게시글을 삭제합니다."
    )
    @DeleteMapping("/{postId}")
    public ResponseEntity<Void> deletePost(
            @AuthUser User user,
            @PathVariable Long postId
    ) {
        postService.deletePost(user, postId);

        return ResponseEntity.ok().build();
    }
}
