package org.shax3.square.domain.debate.repository;

import org.shax3.square.domain.debate.model.Debate;
import org.shax3.square.domain.debate.repository.custom.DebateRepositoryCustom;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DebateRepository extends JpaRepository<Debate, Long>, DebateRepositoryCustom {
    Optional<Debate> findByIdAndValidTrue(Long debateId);
}
