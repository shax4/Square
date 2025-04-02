package org.shax3.square.domain.debate.repository.custom;

import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.shax3.square.domain.debate.model.Debate;
import org.shax3.square.domain.debate.model.QDebate;

import java.util.List;

@RequiredArgsConstructor
public class DebateRepositoryImpl implements DebateRepositoryCustom {

    private final JPAQueryFactory queryFactory;


    @Override
    public List<Debate> findDebatesForMain(Long nextCursorId, int limit) {
        QDebate debate = QDebate.debate;

        return queryFactory
                .selectFrom(debate)
                .join(debate.category).fetchJoin()
                .where(
                        nextCursorId != null ? debate.id.lt(nextCursorId) : null
                )
                .orderBy(debate.id.desc())
                .limit(limit)
                .fetch();
    }
}
