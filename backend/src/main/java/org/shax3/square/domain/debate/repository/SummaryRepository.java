package org.shax3.square.domain.debate.repository;

import org.shax3.square.domain.debate.model.Summary;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SummaryRepository extends JpaRepository<Summary, Long> {
    List<Summary> findByDebateId(Long debateId);
}
