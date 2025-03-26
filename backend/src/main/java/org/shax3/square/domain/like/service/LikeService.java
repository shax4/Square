package org.shax3.square.domain.like.service;

import org.shax3.square.domain.like.dto.LikeRequest;
import org.shax3.square.domain.like.model.Like;
import org.shax3.square.domain.like.repository.LikeRepository;
import org.shax3.square.domain.user.model.User;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class LikeService {

	private final LikeRepository likeRepository;

	@Transactional
	public void like(User user, LikeRequest likeRequest) {
		Like like = likeRepository.findByUserAndTargetIdAndTargetType(user, likeRequest.targetId(), likeRequest.targetType())
			.map(existingLike -> {
				existingLike.toggleLike();
				return existingLike;
			})
			.orElseGet(() -> likeRequest.to(user));

		likeRepository.save(like);
	}

}
