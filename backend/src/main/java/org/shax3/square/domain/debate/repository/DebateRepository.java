package org.shax3.square.domain.debate.repository;

import org.shax3.square.domain.debate.model.Debate;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DebateRepository extends JpaRepository<Debate, Long> {
}
