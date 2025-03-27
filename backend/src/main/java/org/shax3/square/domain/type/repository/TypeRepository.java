package org.shax3.square.domain.type.repository;

import org.shax3.square.domain.type.model.TypeResult;
import org.shax3.square.domain.user.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TypeRepository extends JpaRepository<TypeResult, Long> {
    Optional<TypeResult> findByUser(User user);
}
