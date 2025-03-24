package org.shax3.square.domain.opinion.repository;

import org.shax3.square.domain.opinion.model.Opinion;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OpinionRepository extends JpaRepository<Opinion, Long> {
}
