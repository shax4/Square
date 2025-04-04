package org.shax3.square.domain.post.dto;

import org.shax3.square.domain.post.model.PostComment;

public record MyCommentDto(
	Long commentId,
	String title,
	String content,
	int likeCount,
	boolean isLiked
) {
	public static MyCommentDto from(PostComment comment, boolean isLiked) {
		return new MyCommentDto(
			comment.getId(),
			comment.getPost().getTitle(),
			comment.getContent(),
			comment.getLikeCount(),
			isLiked
		);
	}
}
