package org.shax3.square.domain.user.repository;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Repository;

import java.util.concurrent.TimeUnit;

@Repository
@RequiredArgsConstructor
public class UserRedisRepository {

    private final RedisTemplate<String, Object> redisTemplate;

    @Value("${spring.auth.jwt.sign-up-token-expiry}")
    private long nicknameExpiry;

    public boolean reserveNickname(String nickname) {
        String key = "nickname:" + nickname;
        Boolean success = redisTemplate.opsForValue().setIfAbsent(key, "reserved", nicknameExpiry, TimeUnit.MILLISECONDS);
        return Boolean.TRUE.equals(success);
    }
}
