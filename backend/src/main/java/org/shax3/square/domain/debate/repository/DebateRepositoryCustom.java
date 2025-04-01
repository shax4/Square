package org.shax3.square.domain.debate.repository;

import org.shax3.square.domain.debate.model.Debate;

import java.util.List;

public interface DebateRepositoryCustom {
    List<Debate> findDebatesForMain(Long nextCursorId, int limit);
}
