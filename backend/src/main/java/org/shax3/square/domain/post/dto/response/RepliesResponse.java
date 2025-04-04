package org.shax3.square.domain.post.dto.response;

import java.util.List;

import org.shax3.square.domain.post.dto.ReplyDto;

public record RepliesResponse(
	List<ReplyDto> replies,
	Long nextCursorId
) {
}
