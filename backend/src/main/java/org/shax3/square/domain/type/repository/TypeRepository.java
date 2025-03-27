package org.shax3.square.domain.type.repository;

import org.shax3.square.domain.type.model.TypeResult;
import org.shax3.square.domain.user.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TypeRepository extends JpaRepository<TypeResult, Long> {
    void deleteByUser(User user);
}
