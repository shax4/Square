package org.shax3.square.domain.post.dto;

import org.shax3.square.domain.post.model.Post;

public record PopularPostDto(
	Long postId,
	String title,
	String createdAt,
	int likeCount,
	int commentCount
) {
	public static PopularPostDto from(Post post, int commentCount) {
		return new PopularPostDto(
			post.getId(),
			post.getTitle(),
			post.getCreatedAt().toString(), // createdAt 필드가 엔티티에 없으면 추가 필요
			post.getLikeCount(),
			commentCount
		);
	}
}