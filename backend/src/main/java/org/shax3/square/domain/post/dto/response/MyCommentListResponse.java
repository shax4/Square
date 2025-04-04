package org.shax3.square.domain.post.dto.response;

import java.util.List;

import org.shax3.square.domain.post.dto.MyCommentDto;

public record MyCommentListResponse(
	List<MyCommentDto> comments,
	Long nextCursorId
) {
}
