package org.shax3.square.config;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.connection.RedisPassword;
import org.springframework.data.redis.connection.RedisStandaloneConfiguration;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.data.redis.connection.lettuce.LettucePoolingClientConfiguration;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.StringRedisSerializer;

import java.time.Duration;

@Configuration
public class RedisConfig {

    @Bean
    public RedisCacheManager cacheManager(
            LettuceConnectionFactory connectionFactory,
            @Value("${spring.data.redis.ttl-minutes}") long cacheTtlMinutes) {

        RedisCacheConfiguration config = RedisCacheConfiguration.defaultCacheConfig()
                .entryTtl(Duration.ofMinutes(cacheTtlMinutes));

        return RedisCacheManager.builder(connectionFactory).cacheDefaults(config).build();
    }


    @Bean(name = "batchRedisConnectionFactory")
    public LettuceConnectionFactory batchRedisConnectionFactory(BatchRedisProperties props) {
        RedisStandaloneConfiguration config = new RedisStandaloneConfiguration();
        config.setHostName(props.getHost());
        config.setPort(props.getPort());
        config.setUsername(props.getUsername());
        config.setPassword(RedisPassword.of(props.getPassword()));

        LettucePoolingClientConfiguration poolingConfig = LettucePoolingClientConfiguration.builder()
                .commandTimeout(Duration.ofSeconds(5))
                .shutdownTimeout(Duration.ofMillis(100))
                .build();

        return new LettuceConnectionFactory(config, poolingConfig);
    }

    @Bean(name = "batchRedisTemplate")
    public RedisTemplate<String, Object> batchRedisTemplate(
            @Qualifier("batchRedisConnectionFactory") RedisConnectionFactory factory) {

        RedisTemplate<String, Object> template = new RedisTemplate<>();
        template.setConnectionFactory(factory);

        // Key는 문자열 직렬화
        template.setKeySerializer(new StringRedisSerializer());
        template.setHashKeySerializer(new StringRedisSerializer());

        // Value는 JSON 직렬화
        template.setValueSerializer(new GenericJackson2JsonRedisSerializer());
        template.setHashValueSerializer(new GenericJackson2JsonRedisSerializer());

        return template;
    }
}
