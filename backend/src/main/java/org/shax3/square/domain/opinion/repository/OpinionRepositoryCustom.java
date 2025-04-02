package org.shax3.square.domain.opinion.repository;

import org.shax3.square.domain.opinion.model.Opinion;
import org.shax3.square.domain.user.model.User;

import java.util.List;

public interface OpinionRepositoryCustom {
    List<Opinion> findMyOpinions(User user, Long nextCursorId, int limit);
    List<Opinion> findByIdCursor(Long debateId, boolean isLeft, Long cursorId, int limit);
    List<Opinion> findByLikes(Long debateId, boolean isLeft, Long cursorId, Integer cursorLikes, int limit);
    List<Opinion> findByComments(Long debateId, boolean isLeft, Long cursorId, Integer cursorComments, int limit);

}