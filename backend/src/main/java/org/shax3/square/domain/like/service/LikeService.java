package org.shax3.square.domain.like.service;

import org.shax3.square.common.model.TargetType;
import org.shax3.square.domain.like.dto.LikeRequest;
import org.shax3.square.domain.like.model.Like;
import org.shax3.square.domain.like.repository.LikeRepository;
import org.shax3.square.domain.opinion.service.OpinionCommentService;
import org.shax3.square.domain.opinion.service.OpinionService;
import org.shax3.square.domain.proposal.service.ProposalService;
import org.shax3.square.domain.user.model.User;
import org.shax3.square.domain.user.service.UserService;
import org.shax3.square.exception.CustomException;
import org.shax3.square.exception.ExceptionCode;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class LikeService {

	private final LikeRepository likeRepository;
	private final OpinionService opinionService;
	private final OpinionCommentService opinionCommentService;
	private final ProposalService proposalService;
	private final RedisTemplate<String, Object> batchRedisTemplate;
	private final UserService userService;

	/**
	 * Redis에 좋아요 저장
	 * @param user
	 * @param likeRequest
	 */
	public void like(User user, LikeRequest likeRequest) {

		Long targetId = likeRequest.targetId();
		TargetType targetType = likeRequest.targetType();

		if (!isPresent(targetId, targetType)) {
			throw new CustomException(ExceptionCode.NOT_FOUND);
		}

		toggleLikeInRedis(user, targetId, targetType); // Redis에 좋아요 저장
	}

	public boolean isPresent(Long targetId, TargetType targetType) {
		return switch (targetType) {
			case OPINION -> opinionService.isOpinionExists(targetId);
			case OPINION_COMMENT -> opinionCommentService.isOpinionCommentExists(targetId);
			case PROPOSAL -> proposalService.isProposalExists(targetId);
			case POST -> false; // TODO: post 개발 후 구현
			case POST_COMMENT -> false;
			default -> throw new CustomException(ExceptionCode.INVALID_TARGET_TYPE);
		};
	}

	/**
	 * Key:   like:POST:1
	 * Value: Set of userIds (좋아요 누른 사용자들)
	 * Type:  Set
	 */
	public void toggleLikeInRedis(User user, Long targetId, TargetType targetType) {
		String key = generateKey(targetType, targetId);
		String userId = user.getId().toString();

		Boolean alreadyLiked = batchRedisTemplate.opsForSet().isMember(key, userId);
		if (Boolean.TRUE.equals(alreadyLiked)) {
			batchRedisTemplate.opsForSet().remove(key, userId);
		} else {
			batchRedisTemplate.opsForSet().add(key, userId);
		}
	}

	private String generateKey(TargetType targetType, Long targetId) {
		return "like:" + targetType.name() + ":" + targetId;
	}

	@Transactional
	public void persistLike(Long userId, TargetType targetType, Long targetId) {
		User user = userService.findById(userId);

		likeRepository.findByUserAndTargetIdAndTargetType(user, targetId, targetType)
			.ifPresentOrElse(
				Like::toggleLike,
				() -> {
					Like like = Like.builder()
						.user(user)
						.targetId(targetId)
						.targetType(targetType)
						.build();

					likeRepository.save(like);
				}
			);
	}
}
