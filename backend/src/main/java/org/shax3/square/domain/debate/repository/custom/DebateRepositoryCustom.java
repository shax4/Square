package org.shax3.square.domain.debate.repository.custom;

import org.shax3.square.domain.debate.model.Debate;

import java.util.List;

public interface DebateRepositoryCustom {
    List<Debate> findDebatesForMain(Long nextCursorId, int limit);
}
