package org.shax3.square.domain.like.service;

import org.shax3.square.common.model.TargetType;
import org.shax3.square.domain.like.dto.LikeRequest;
import org.shax3.square.domain.like.model.Like;
import org.shax3.square.domain.like.repository.LikeRepository;
import org.shax3.square.domain.opinion.service.OpinionCommentService;
import org.shax3.square.domain.opinion.service.OpinionService;
import org.shax3.square.domain.user.model.User;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class LikeService {

	private final LikeRepository likeRepository;
	private final OpinionService opinionService;
	private final OpinionCommentService opinionCommentService;

	@Transactional
	public void like(User user, LikeRequest likeRequest) {

		Long targetId = likeRequest.targetId();

		TargetType targetType = likeRequest.targetType();

		Like like = likeRepository.findByUserAndTargetIdAndTargetType(user, targetId, targetType)
			.map(existingLike -> {
				existingLike.toggleLike();
				return existingLike;
			})
			.orElseGet(() -> likeRequest.to(user));

		likeRepository.save(like);
	}

	public boolean isPresent(Long targetId, TargetType targetType) {
		switch (targetType) {
			case OPINION -> opinionService.getOpinion(targetId);
			case OPINION_COMMENT -> opinionCommentService.getOpinionComment(targetId);
			case PROPOSAL ->

		}
	}

}
