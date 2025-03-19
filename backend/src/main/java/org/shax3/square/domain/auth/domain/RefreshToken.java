package org.shax3.square.domain.auth.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.Date;

import static lombok.AccessLevel.PROTECTED;

@Entity
@Getter
@NoArgsConstructor(access = PROTECTED)
@AllArgsConstructor(access = PROTECTED)
@Builder
@Table(
        name = "refresh_token"
)
public class RefreshToken {

    @Id
    @Column(name = "user_id", nullable = false, unique = true)
    private Long userId;

    @Column(name = "token", nullable = false)
    private String token;

    @Column(name = "expiry", nullable = false)
    private Date expiry;

    public static RefreshToken createRefreshToken(Long userId, String refreshToken, Date expiry) {
        return RefreshToken.builder()
                .userId(userId)
                .token(refreshToken)
                .expiry(expiry)
                .build();
    }
}
