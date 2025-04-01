package org.shax3.square.domain.post.dto.response;

import java.util.List;

import org.shax3.square.domain.post.dto.PopularPostDto;
import org.shax3.square.domain.post.dto.PostSummaryDto;

public record PostListResponse(
	String userType,
	List<PopularPostDto> popular,
	List<PostSummaryDto> posts,
	Long nextCursorId,
	Integer nextCursorLikes
) {
	public static PostListResponse of(
		String userType,
		List<PopularPostDto> popular,
		List<PostSummaryDto> posts,
		Long nextCursorId,
		Integer nextCursorLikes
	) {
		return new PostListResponse(userType, popular, posts, nextCursorId, nextCursorLikes);
	}
}
