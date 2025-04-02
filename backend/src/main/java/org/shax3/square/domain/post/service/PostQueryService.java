package org.shax3.square.domain.post.service;

import java.util.List;

import org.shax3.square.domain.post.model.Post;
import org.shax3.square.domain.post.repository.PostRepository;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PostQueryService {

	private final PostRepository postRepository;

	public List<Post> getPopularPosts(int count) {
		return postRepository.findPopularPosts(count);
	}

	// 최신순: id 내림차순
	public List<Post> getPostsByLatestCursor(Long cursorId, int limit) {
		return postRepository.findByLatestCursor(cursorId, limit + 1);
	}

	// 좋아요순: likeCount 내림차순, id 내림차순
	public List<Post> getPostsByLikesCursor(Integer cursorLikes, int limit) {
		return postRepository.findByLikesCursor(cursorLikes, limit + 1);
	}
}
