package org.shax3.square.domain.opinion.repository;

import org.shax3.square.domain.debate.model.Debate;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OpinionRepository extends JpaRepository<Debate, Long> {
}
