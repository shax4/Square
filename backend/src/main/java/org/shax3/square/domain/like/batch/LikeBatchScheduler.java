package org.shax3.square.domain.like.batch;

import java.util.List;
import java.util.Set;

import org.shax3.square.common.model.TargetType;
import org.shax3.square.domain.like.service.LikeService;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@RequiredArgsConstructor
public class LikeBatchScheduler {

	private final RedisTemplate<String, Object> batchRedisTemplate;
	private final LikeService likeService;

	@Scheduled(fixedRate = 300_000)
	public void flushLikes() {
		Set<String> keys = batchRedisTemplate.keys("like:*");

		if (keys.isEmpty()) return; // 키가 비어있으면 리턴

		for (String key : keys) {
			Set<Object> userIdsSet = batchRedisTemplate.opsForSet().members(key);
			if (userIdsSet == null || userIdsSet.isEmpty()) { // 좋아요를 누른 사용자가 없으면 키 삭제
				batchRedisTemplate.delete(key);
				continue;
			}

			String[] parts = key.split(":");
			if (parts.length != 3) {
				log.error("Invalid key: {}", key);
				batchRedisTemplate.delete(key);
				continue;
			}

			String targetType = parts[1];
			Long targetId = Long.valueOf(parts[2]);

			List<Long> userIds = userIdsSet.stream()
				.map(id -> Long.valueOf(id.toString()))
				.toList();

			likeService.persistLikes(userIds, TargetType.valueOf(targetType), targetId);

			batchRedisTemplate.delete(key);
		}
	}
}
