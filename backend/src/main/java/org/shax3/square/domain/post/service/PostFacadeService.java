package org.shax3.square.domain.post.service;

import java.util.List;
import java.util.Map;
import java.util.Set;

import org.shax3.square.common.model.TargetType;
import org.shax3.square.domain.like.service.LikeService;
import org.shax3.square.domain.post.dto.CommentDto;
import org.shax3.square.domain.post.dto.PopularPostDto;
import org.shax3.square.domain.post.dto.PostImageDto;
import org.shax3.square.domain.post.dto.PostSummaryDto;
import org.shax3.square.domain.post.dto.ReplyDto;
import org.shax3.square.domain.post.dto.response.PostDetailResponse;
import org.shax3.square.domain.post.dto.response.PostListResponse;
import org.shax3.square.domain.post.model.Post;
import org.shax3.square.domain.post.model.PostComment;
import org.shax3.square.domain.s3.service.S3Service;
import org.shax3.square.domain.scrap.service.ScrapService;
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
	private final PostService postService;
	private final ScrapService scrapService;

	/**
	 * 게시글 목록 조회
	 * @param user
	 * @param sort
	 * @param nextCursorId
	 * @param nextCursorLikes
	 * @param limit
	 * @return
	 */
	@Transactional(readOnly = true)
	public PostListResponse getPostList(
		User user,
		String sort,
		Long nextCursorId,
		Integer nextCursorLikes,
		int limit
	) {

		// 성향테스트 해야만 게시글 조회 가능
		if (user.getType() == null) {
			throw new CustomException(ExceptionCode.USER_TYPE_NOT_FOUND);
		}

		// 상단 인기 게시글 조회 (3개)
		List<PopularPostDto> popularDtos = toPopularDtos(postQueryService.getPopularPosts(3));

		// 정렬 기준에 따라 게시글 조회
		boolean isSortByLikes = "likes".equalsIgnoreCase(sort);
		List<Post> fetchedPosts = isSortByLikes
			? postQueryService.getPostsByLikesCursor(nextCursorLikes, nextCursorId, limit)
			: postQueryService.getPostsByLatestCursor(nextCursorId, limit);

		boolean hasNext = fetchedPosts.size() > limit;
		List<Post> posts = hasNext ? fetchedPosts.subList(0, limit) : fetchedPosts;

		List<PostSummaryDto> postDtos = toPostDtos(posts, user);

		return PostListResponse.of(
			user.getType().name(),
			popularDtos,
			postDtos,
			getNextCursorId(posts, hasNext),
			getNextCursorLikes(posts, hasNext, isSortByLikes)
		);
	}

	/**
	 * 내가 쓴 게시글 조회
	 * @param user
	 * @param nextCursorId
	 * @param limit
	 * @return
	 */
	@Transactional(readOnly = true)
	public MyPostResponse getMyPostList(User user, Long nextCursorId, int limit) {

		List<Post> fetchedPosts = postQueryService.getMyPosts(user, nextCursorId, limit);

		boolean hasNext = fetchedPosts.size() > limit;
		List<Post> posts = hasNext ? fetchedPosts.subList(0, limit) : fetchedPosts;

		List<PostSummaryDto> postDtos = toPostDtos(posts, user);

		return MyPostResponse.of(postDtos, getNextCursorId(posts, hasNext));
	}

	/**
	 * 내가 좋아요한 게시글 조회
	 * @param user
	 * @param nextCursorId
	 * @param limit
	 * @return
	 */
	@Transactional(readOnly = true)
	public MyPostResponse getMyLikedPostList(User user, Long nextCursorId, int limit) {

		List<Post> fetchedPosts = postQueryService.getMyLikedPosts(user, nextCursorId, limit);

		boolean hasNext = fetchedPosts.size() > limit;
		List<Post> posts = hasNext ? fetchedPosts.subList(0, limit) : fetchedPosts;

		List<PostSummaryDto> postDtos = toPostDtos(posts, user);

		return MyPostResponse.of(postDtos, getNextCursorId(posts, hasNext));
	}

	/**
	 * 내가 스크랩한 게시글 조회
	 * @param user
	 * @param nextCursorId
	 * @param limit
	 * @return
	 */
	@Transactional(readOnly = true)
	public MyPostResponse getMyScrapPostList(User user, Long nextCursorId, int limit) {
		List<Post> fetchedPosts = postQueryService.getMyScrapPosts(user, nextCursorId, limit + 1);

		boolean hasNext = fetchedPosts.size() > limit;
		List<Post> posts = hasNext ? fetchedPosts.subList(0, limit) : fetchedPosts;

		List<PostSummaryDto> postDtos = toPostDtos(posts, user);

		return MyPostResponse.of(postDtos, getNextCursorId(posts, hasNext));
	}


	private List<PopularPostDto> toPopularDtos(List<Post> popularPosts) {
		List<Long> popularPostIds = popularPosts.stream().map(Post::getId).toList();

		// key: postId, value: commentCount
		Map<Long, Integer> commentCounts = commentService.getCommentCounts(popularPostIds);

		return popularPosts.stream()
			.map(post -> PopularPostDto.from(
				post,
				commentCounts.getOrDefault(post.getId(), 0)
			))
			.toList();
	}

	private List<PostSummaryDto> toPostDtos(List<Post> posts, User user) {
		List<Long> postIds = posts.stream().map(Post::getId).toList();
		Set<Long> likedPostIds = likeService.getLikedTargetIds(user, TargetType.POST, postIds);

		// key: postId, value: commentCount
		Map<Long, Integer> commentCounts = commentService.getCommentCounts(postIds);

		return posts.stream()
			.map(post -> PostSummaryDto.from(
				post,
				s3Service.generatePresignedGetUrl(post.getUser().getS3Key()),
				likedPostIds.contains(post.getId()),
				commentCounts.getOrDefault(post.getId(), 0)
			))
			.toList();
	}

	private Long getNextCursorId(List<Post> posts, boolean hasNext) {
		return hasNext && !posts.isEmpty() ? posts.get(posts.size() - 1).getId() : null;
	}

	private Integer getNextCursorLikes(List<Post> posts, boolean hasNext, boolean isSortByLikes) {
		if (!hasNext || posts.isEmpty() || !isSortByLikes) return null;
		return posts.get(posts.size() - 1).getLikeCount();
	}

	/**
	 * 게시글 상세 조회
	 * @param user
	 * @param postId
	 * @return
	 */
	@Transactional(readOnly = true)
	public PostDetailResponse getPostDetail(User user, Long postId) {
		Post post = postService.getPost(postId);

		// 이미지 DTO 변환
		List<PostImageDto> imageDtos = post.getPostImages().stream()
			.map(image -> PostImageDto.of(
				s3Service.generatePresignedGetUrl(image.getS3Key()),
				image.getS3Key()))
			.toList();

		// 좋아요/스크랩 여부
		boolean isLiked = likeService.isTargetLiked(user, TargetType.POST, postId);
		boolean isScraped = scrapService.isTargetScraped(user, postId, TargetType.POST);

		// 댓글 목록 (parent만)
		List<PostComment> comments = commentService.getParentComments(post);
		List<Long> commentIds = comments.stream().map(PostComment::getId).toList();

		// 대댓글 개수 및 3개씩 조회
		Map<Long, Integer> replyCounts = commentService.getReplyCounts(commentIds);
		Map<Long, List<PostComment>> replyMap = commentService.getFirstNRepliesByCommentIds(commentIds, 3);

		// 댓글, 대댓글 좋아요 정보
		Set<Long> likedCommentIds = likeService.getLikedTargetIds(user, TargetType.POST_COMMENT, commentIds);
		Set<Long> likedReplyIds = likeService.getLikedTargetIds(user, TargetType.POST_COMMENT,
			replyMap.values().stream().flatMap(List::stream).map(PostComment::getId).toList());


		List<CommentDto> commentDtos = comments.stream()
			.map(comment -> CommentDto.from(
				comment,
				s3Service.generatePresignedGetUrl(comment.getUser().getS3Key()),
				likedCommentIds.contains(comment.getId()),
				replyCounts.getOrDefault(comment.getId(), 0),
				replyMap.getOrDefault(comment.getId(), List.of()).stream()
					.map(reply -> ReplyDto.from(
						reply,
						s3Service.generatePresignedGetUrl(reply.getUser().getS3Key()),
						likedReplyIds.contains(reply.getId())))
					.toList()
			))
			.toList();

		return PostDetailResponse.from(
			post,
			imageDtos,
			isLiked,
			isScraped,
			commentDtos,
			commentDtos.size()
		);
	}
}
