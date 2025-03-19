package org.shax3.square.domain.auth.repository;

import org.shax3.square.domain.auth.domain.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RefreshTokenJpaRepository extends JpaRepository<RefreshToken, String> {
}
