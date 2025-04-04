package org.shax3.square.domain.post.dto;

import java.time.LocalDateTime;
import java.util.List;

import org.shax3.square.domain.post.model.PostComment;

public record CommentDto(
	Long commentId,
	String nickname,
	String profileUrl,
	String userType,
	LocalDateTime createdAt,
	String content,
	int likeCount,
	boolean isLiked,
	int replyCount,
	List<ReplyDto> replies
) {
	public static CommentDto from(
		PostComment comment,
		String profileUrl,
		boolean isLiked,
		int replyCount,
		List<ReplyDto> replies,
		int likeCount
	) {
		return new CommentDto(
			comment.getId(),
			comment.getUser().getNickname(),
			profileUrl,
			comment.getUser().getType().name(),
			comment.getCreatedAt(),
			comment.getContent(),
			likeCount,
			isLiked,
			replyCount,
			replies
		);
	}
}
