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

	public List<Post> getTop3ByLikeCount()
}
