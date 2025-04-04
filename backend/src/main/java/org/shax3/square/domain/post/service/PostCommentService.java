package org.shax3.square.domain.post.service;

import java.util.List;
import java.util.Map;
import java.util.Objects;

import org.shax3.square.domain.post.dto.request.CreatePostCommentRequest;
import org.shax3.square.domain.post.dto.request.UpdatePostCommetRequest;
import org.shax3.square.domain.post.dto.response.PostCommentResponse;
import org.shax3.square.domain.post.model.Post;
import org.shax3.square.domain.post.model.PostComment;
import org.shax3.square.domain.post.repository.PostCommentRepository;
import org.shax3.square.domain.s3.service.S3Service;
import org.shax3.square.domain.user.model.User;
import org.shax3.square.exception.CustomException;
import org.shax3.square.exception.ExceptionCode;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PostCommentService {

	private final PostCommentRepository postCommentRepository;
	private final PostService postService;
	private final S3Service s3Service;

	@Transactional
	public PostCommentResponse createPostComment(CreatePostCommentRequest request, User user) {
		Post post = postService.getPost(request.postId());
		Long parentCommentId = request.parentCommentId();

		// 부모 댓글 존재 여부 확인
		PostComment parentComment = null;
		if (parentCommentId != null) {
			parentComment = getPostComment(parentCommentId);

			if (!parentComment.getPost().getId().equals(post.getId())) {
				throw new CustomException(ExceptionCode.INVALID_PARENT_COMMENT);
			}
		}

		PostComment comment = request.to(post, parentComment, user);
		postCommentRepository.save(comment);

		String profileUrl = s3Service.generatePresignedGetUrl(user.getS3Key());

		return PostCommentResponse.from(comment, profileUrl);
	}

	@Transactional
	public void updatePostComment(User user, UpdatePostCommetRequest request, Long commentId) {
		PostComment comment = getPostComment(commentId);

		verifyAuthor(user, comment);

		comment.updateContent(request.content());
	}

	@Transactional
	public void deletePostComment(User user, Long commentId) {
		PostComment comment = getPostComment(commentId);

		verifyAuthor(user, comment);

		comment.softDelete();
	}

	public PostComment getPostComment(Long postCommentId) {
		return postCommentRepository.findById(postCommentId)
			.orElseThrow(() -> new CustomException(ExceptionCode.COMMENT_NOT_FOUND));
	}

	private void verifyAuthor(User user, PostComment comment) {
		if (!Objects.equals(comment.getUser().getId(), user.getId())) {
			throw new CustomException(ExceptionCode.NOT_AUTHOR);
		}
	}

	public void validateExists(Long id) {
		if (!postCommentRepository.existsById(id)) {
			throw new CustomException(ExceptionCode.COMMENT_NOT_FOUND);
		}
	}

	public void increaseLikeCount(Long targetId, int countDiff) {
		PostComment comment = getPostComment(targetId);
		comment.increaseLikeCount(countDiff);
	}

	public Map<Long, Integer> getCommentCounts(List<Long> postIds) {
		return postCommentRepository.countCommentsByPostIds(postIds);
	}

	public Map<Long, Integer> getReplyCounts(List<Long> parentCommentIds) {
		return postCommentRepository.countRepliesByParentIds(parentCommentIds);
	}

	public Map<Long, List<PostComment>> getFirstNRepliesByCommentIds(List<Long> parentCommentIds, int limit) {
		return postCommentRepository.findTopNRepliesByParentIds(parentCommentIds, limit);
	}

	public List<PostComment> getParentComments(Post post) {
		return postCommentRepository.findParentCommentsByPost(post);
	}

	public List<PostComment> getReplies(Long parentId, Long cursorId, int limit) {
		return postCommentRepository.getRepliesByParentId(parentId, cursorId, limit + 1);
	}
}
