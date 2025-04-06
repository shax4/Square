package org.shax3.square.domain.scrap.repository.custom;

import org.shax3.square.common.model.TargetType;
import org.shax3.square.domain.scrap.model.Scrap;
import org.shax3.square.domain.user.model.User;

import java.util.List;

public interface ScrapRepositoryCustom {
    List<Scrap> findScrapsByUserAndType(User user, TargetType type, Long cursorId, int limit);
}
