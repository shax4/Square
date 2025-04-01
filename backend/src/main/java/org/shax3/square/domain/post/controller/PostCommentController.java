package org.shax3.square.domain.post.controller;

import org.shax3.square.domain.auth.annotation.AuthUser;
import org.shax3.square.domain.post.dto.request.CreatePostCommentRequest;
import org.shax3.square.domain.post.dto.request.UpdatePostCommetRequest;
import org.shax3.square.domain.post.dto.request.UpdatePostRequest;
import org.shax3.square.domain.post.dto.response.PostCommentResponse;
import org.shax3.square.domain.post.service.PostCommentService;
import org.shax3.square.domain.user.model.User;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/comments")
@RequiredArgsConstructor
@Tag(name = "PostComment", description = "게시글 댓글 관련 API")
public class PostCommentController {

	private final PostCommentService postCommentService;

	@Operation(
		summary = "게시글 댓글 생성 api",
		description = "게시글 댓글을 생성합니다."
	)
	@PostMapping
	public ResponseEntity<PostCommentResponse> createPost(
		@AuthUser User user,
		@Valid @RequestBody CreatePostCommentRequest request
	) {
		PostCommentResponse response = postCommentService.createPostComment(request, user);

		return ResponseEntity.ok(response);
	}

	@Operation(
		summary = "게시글 댓글 수정 api",
		description = "게시글 댓글을 수정합니다."
	)
	@PutMapping("/{commentId}")
	public ResponseEntity<Void> updatePost(
		@AuthUser User user,
		@PathVariable Long commentId,
		@Valid @RequestBody UpdatePostCommetRequest request
	) {
		postCommentService.updatePostComment(user, request, commentId);

		return ResponseEntity.ok().build();
	}

	@Operation(
		summary = "게시글 댓글 삭제 api",
		description = "게시글 댓글을 삭제합니다."
	)
	@DeleteMapping("/{commentId}")
	public ResponseEntity<Void> deletePost(
		@AuthUser User user,
		@PathVariable Long commentId
	) {
		postCommentService.deletePostComment(user, commentId);

		return ResponseEntity.ok().build();
	}
}
