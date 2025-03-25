package org.shax3.square.domain.scrap.repository;

import org.shax3.square.domain.scrap.model.Scrap;
import org.shax3.square.domain.scrap.model.TargetType;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ScrapRepository extends JpaRepository<Scrap, Long> {

    void deleteByUserIdAndTargetIdAndTargetType(Long userId, Long targetId, TargetType targetType);
}
