package org.shax3.square.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Data
@Component
@ConfigurationProperties(prefix = "batch-redis")
public class BatchRedisProperties {
    private String host;
    private int port;
    private String password;
}
