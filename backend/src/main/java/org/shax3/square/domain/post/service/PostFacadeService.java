package org.shax3.square.domain.post.service;

import java.util.List;
import java.util.Map;
import java.util.Set;

import org.shax3.square.common.model.TargetType;
import org.shax3.square.domain.like.service.LikeService;
import org.shax3.square.domain.post.dto.PopularPostDto;
import org.shax3.square.domain.post.dto.PostSummaryDto;
import org.shax3.square.domain.post.dto.response.PostListResponse;
import org.shax3.square.domain.post.model.Post;
import org.shax3.square.domain.s3.service.S3Service;
import org.shax3.square.domain.user.model.User;
import org.shax3.square.exception.CustomException;
import org.shax3.square.exception.ExceptionCode;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PostFacadeService {

	private final PostQueryService postQueryService;
	private final PostCommentService commentService;
	private final LikeService likeService;
	private final S3Service s3Service;

	@Transactional(readOnly = true)
	public PostListResponse getPostList(
		User user,
		String sort,
		Long nextCursorId,
		Integer nextCursorLikes,
		int limit
	) {

		if (user.getType() == null) {
			throw new CustomException(ExceptionCode.USER_TYPE_NOT_FOUND);
		}

		// 상단 인기 게시글 조회 (3개)
		int popularLimit = 3;
		List<Post> popularPosts = postQueryService.getPopularPosts(popularLimit);
		List<Long> popularPostIds = popularPosts.stream().map(Post::getId).toList();
		Map<Long, Integer> popularCommentCounts = commentService.getCommentCounts(popularPostIds);

		List<PopularPostDto> popularDtos = popularPosts.stream()
			.map(post -> PopularPostDto.from(
				post,
				popularCommentCounts.getOrDefault(post.getId(), 0))
			)
			.toList();

		// 정렬 기준에 따라 게시글 조회
		boolean isSortByLikes = "likes".equalsIgnoreCase(sort);
		List<Post> fetchedPosts = isSortByLikes
			? postQueryService.getPostsByLikesCursor(nextCursorLikes, limit)
			: postQueryService.getPostsByLatestCursor(nextCursorId, limit);

		boolean hasNext = fetchedPosts.size() > limit;
		List<Post> posts = hasNext ? fetchedPosts.subList(0, limit) : fetchedPosts;

		List<Long> postIds = posts.stream().map(Post::getId).toList();
		Set<Long> likedPostIds = likeService.getLikedTargetIds(user, TargetType.POST, postIds);
		Map<Long, Integer> commentCounts = commentService.getCommentCounts(postIds);

		List<PostSummaryDto> postDtos = posts.stream()
			.map(post -> PostSummaryDto.from(
				post,
				s3Service.generatePresignedGetUrl(post.getUser().getS3Key()),
				likedPostIds.contains(post.getId()),
				commentCounts.getOrDefault(post.getId(), 0)
			))
			.toList();

		// 커서 처리
		Long newCursorId = hasNext && !posts.isEmpty() ? posts.get(posts.size() - 1).getId() : null;
		Integer newCursorLikes = hasNext && isSortByLikes && !posts.isEmpty()
			? posts.get(posts.size() - 1).getLikeCount()
			: null;

		return PostListResponse.of(
			user.getType().name(),
			popularDtos,
			postDtos,
			newCursorId,
			newCursorLikes
		);
	}
}
