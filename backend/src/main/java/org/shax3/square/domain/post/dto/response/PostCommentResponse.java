package org.shax3.square.domain.post.dto.response;

import org.shax3.square.domain.post.model.PostComment;

public record PostCommentResponse(
		Long commenId,
		String profileUrl
) {
	public static PostCommentResponse of(PostComment comment, String profileUrl) {
		return new PostCommentResponse(
			comment.getId(),
			profileUrl
		);
	}
}
