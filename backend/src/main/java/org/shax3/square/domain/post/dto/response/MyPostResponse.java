package org.shax3.square.domain.post.dto.response;

import java.util.List;

import org.shax3.square.domain.post.dto.PostSummaryDto;

public record MyPostResponse(
	List<PostSummaryDto> posts,
	Long nextCursorId
) {
	public static MyPostResponse of(List<PostSummaryDto> posts, Long nextCursorId) {
		return new MyPostResponse(posts, nextCursorId);
	}
}
