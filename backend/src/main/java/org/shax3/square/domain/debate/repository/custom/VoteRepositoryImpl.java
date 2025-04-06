package org.shax3.square.domain.debate.repository.custom;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.shax3.square.domain.debate.model.QVote;
import org.shax3.square.domain.debate.model.Vote;
import org.shax3.square.domain.user.model.User;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class VoteRepositoryImpl implements VoteRepositoryCustom {
    private final JPAQueryFactory queryFactory;

    @Override
    public List<Vote> findByUserOrderByIdDesc(User user, Long nextCursorId, int limit) {
        QVote vote = QVote.vote;
        BooleanBuilder builder = new BooleanBuilder();
        builder.and(vote.user.eq(user));

        if (nextCursorId != null) {
            builder.and(vote.id.lt(nextCursorId));
        }

        return queryFactory
                .selectFrom(vote)
                .join(vote.debate).fetchJoin()
                .where(builder)
                .orderBy(vote.id.desc())
                .limit(limit)
                .fetch();
    }

    @Override
    public List<Vote> findByUserAndDebateIds(User user, List<Long> debateIds) {

        QVote vote = QVote.vote;

        return queryFactory
                .selectFrom(vote)
                .where(
                        vote.user.eq(user),
                        vote.debate.id.in(debateIds)
                )
                .fetch();
    }
}
