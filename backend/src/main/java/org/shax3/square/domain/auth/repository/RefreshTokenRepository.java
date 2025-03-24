package org.shax3.square.domain.auth.repository;

import org.shax3.square.domain.auth.model.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, String> {
    void deleteByUserId(Long userId);

    Optional<RefreshToken> findByUserId(Long userId);

    void deleteByToken(String refreshToken);
}
