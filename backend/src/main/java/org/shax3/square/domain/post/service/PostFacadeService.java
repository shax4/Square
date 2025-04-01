package org.shax3.square.domain.post.service;

import java.util.List;

import org.shax3.square.domain.post.dto.PopularPostDto;
import org.shax3.square.domain.post.dto.response.PostListResponse;
import org.shax3.square.domain.post.model.Post;
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

	@Transactional(readOnly = true)
	public PostListResponse getPostList(
		User user,
		String sort,
		Long nextCursorId,
		Integer nextCursorLikes,
		int limit
	) {

		// 1. 타입이 없는 사용자는 예외
		if (user.getType() == null) {
			throw new CustomException(ExceptionCode.USER_TYPE_NOT_FOUND);
		}

		// 2. 상단 인기 게시글 조회 (3개)
		List<Post> popularPosts = postQueryService.getTop3ByLikeCount();
		List<PopularPostDto> popular = popularPosts.stream()
			.map(post -> PopularPostDto.from(post, commentService.getCommentCount(post.getId())))
			.toList();

		return PostListResponse.of(userType, null, null, nextCursorId, nextCursorLikes);
	}


}
