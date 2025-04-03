package org.shax3.square.domain.post.dto;

public record PostImageDto(
	String imageUrl,
	String s3Key
) {
	public static PostImageDto of(String imageUrl, String s3Key) {
		return new PostImageDto(imageUrl, s3Key);
	}
}
