package org.shax3.square.domain.like.service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

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
	 * Key:   like:batch
	 * Value: TargetType:targetId:userId
	 * Type:  Set
	 */
	public void toggleLikeInRedis(User user, Long targetId, TargetType targetType) {
		String key = "like:batch";
		String value = targetType.name() + ":" + targetId + ":" + user.getId();

		Boolean isMember = batchRedisTemplate.opsForSet().isMember(key, value); // Redis에 존재하는지 확인
		if (Boolean.TRUE.equals(isMember)) {
			batchRedisTemplate.opsForSet().remove(key, value);
		} else {
			batchRedisTemplate.opsForSet().add(key, value);
		}
	}

	/**
	 * Redis에 저장된 좋아요를 DB에 저장
	 * @param userIds
	 * @param targetType
	 * @param targetId
	 */
	@Transactional
	public void persistLikes(List<Long> userIds, TargetType targetType, Long targetId) {

		List<User> users = userService.findAllById(userIds);
		List<Like> existsLikes = likeRepository.findByTargetIdAndTargetTypeAndUserIn(targetId, targetType, users);

		Set<Long> existsUserIds = existsLikes.stream()
			.map(like -> like.getUser().getId())
			.collect(Collectors.toSet());

		// 기존 좋아요는 toggle
		existsLikes.forEach(Like::toggleLike);

		// 새로운 좋아요는 생성
		List<Like> newLikes = users.stream()
				.filter(user -> !existsUserIds.contains(user.getId()))
				.map(user -> Like.builder()
						.user(user)
						.targetId(targetId)
						.targetType(targetType)
						.build())
				.toList();

		likeRepository.saveAll(newLikes);
	}
}
