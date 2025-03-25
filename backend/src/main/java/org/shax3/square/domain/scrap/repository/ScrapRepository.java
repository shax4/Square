package org.shax3.square.domain.scrap.repository;

import org.shax3.square.domain.scrap.model.Scrap;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ScrapRepository extends JpaRepository<Scrap, Long> {
    Optional<Scrap> findByUserIdAndTargetId(Long id, Long targetId);
}
