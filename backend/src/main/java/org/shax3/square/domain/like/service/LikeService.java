package org.shax3.square.domain.like.service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.shax3.square.common.model.TargetType;
import org.shax3.square.domain.like.dto.LikeRequest;
import org.shax3.square.domain.like.handler.LikeTargetHandler;
import org.shax3.square.domain.like.model.Like;
import org.shax3.square.domain.like.repository.LikeRepository;
import org.shax3.square.domain.user.model.User;
import org.shax3.square.domain.user.service.UserService;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class LikeService {

	private final LikeRepository likeRepository;
	private final RedisTemplate<String, Object> batchRedisTemplate;
	private final UserService userService;
	private final LikeTargetHandler likeTargetHandler;

	/**
	 * Redis에 좋아요 저장
	 * @param user
	 * @param likeRequest
	 */
	public void like(User user, LikeRequest likeRequest) {

		Long targetId = likeRequest.targetId();
		TargetType targetType = likeRequest.targetType();

		likeTargetHandler.validateTargetExists(targetId, targetType); // 좋아요를 누를 타겟이 있는지 확인

		toggleLikeInRedis(user, targetId, targetType); // Redis에 좋아요 저장
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
		if (users.isEmpty()) return;

		List<Like> existsLikes = likeRepository.findByTargetIdAndTargetTypeAndUserIn(targetId, targetType, users);

		Set<Long> existsUserIds = existsLikes.stream()
			.map(like -> like.getUser().getId())
			.collect(Collectors.toSet());

		long toggledUp = existsLikes.stream().filter(like -> !like.isLike()).count();
		long toggledDown = existsLikes.stream().filter(Like::isLike).count();

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

		int likeDiff = (int) (newLikes.size() + toggledUp - toggledDown);
		likeTargetHandler.updateTargetLikeCount(targetType, targetId, likeDiff);
	}

	/**
	 * 좋아요 여부를 확인하기 위한 메서드
	 * @param user
	 * @param targetType
	 * @param targetIds
	 * @return
	 */
	public Set<Long> getLikedTargetIds(User user, TargetType targetType, List<Long> targetIds) {
		return likeRepository.findLikedTargetIds(user, targetType, targetIds);
	}

	public boolean isTargetLiked(User user, TargetType targetType, Long targetId) {
		return likeRepository.existsByUserAndTargetTypeAndTargetIdAndLikeTrue(user, targetType, targetId);
	}
}
