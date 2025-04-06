package org.shax3.square.domain.post.dto;

import java.time.LocalDateTime;

import org.shax3.square.domain.post.model.Post;

public record PostSummaryDto(
	Long postId,
	String nickname,
	String profileUrl,
	String userType,
	LocalDateTime createdAt,
	String title,
	String content,
	int likeCount,
	int commentCount,
	boolean isLiked
) {
	public static PostSummaryDto from(Post post, String profileUrl, boolean isLiked, int commentCount, int likeCount) {
		return new PostSummaryDto(
			post.getId(),
			post.getUser().getNickname(),
			profileUrl,
			post.getUser().getType().name(),
			post.getCreatedAt(),
			post.getTitle(),
			post.getContent(),
			likeCount,
			commentCount,
			isLiked
		);
	}
}
