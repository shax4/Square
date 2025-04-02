package org.shax3.square.domain.opinion.repository;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.shax3.square.domain.opinion.model.Opinion;
import org.shax3.square.domain.opinion.model.QOpinion;
import org.shax3.square.domain.user.model.User;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class OpinionRepositoryImpl implements OpinionRepositoryCustom {
    private final JPAQueryFactory queryFactory;

    @Override
    public List<Opinion> findMyOpinions(User user, Long nextCursorId, int limit) {
        QOpinion opinion = QOpinion.opinion;
        BooleanBuilder builder = new BooleanBuilder();

        builder.and(opinion.user.eq(user));

        if (nextCursorId != null) {
            builder.and(opinion.id.lt(nextCursorId));
        }

        builder.and(opinion.valid.isTrue());

        return queryFactory
                .selectFrom(opinion)
                .where(builder)
                .orderBy(opinion.id.desc())
                .limit(limit)
                .fetch();
    }

    @Override
    public List<Opinion> findByIdCursor(Long debateId, boolean isLeft, Long cursorId, int limit) {
        QOpinion opinion = QOpinion.opinion;
        BooleanBuilder builder = new BooleanBuilder()
                .and(opinion.debate.id.eq(debateId))
                .and(opinion.left.eq(isLeft))
                .and(opinion.valid.isTrue());

        if (cursorId != null) {
            builder.and(opinion.id.lt(cursorId));
        }

        return queryFactory
                .selectFrom(opinion)
                .where(builder)
                .orderBy(opinion.id.desc())
                .limit(limit)
                .fetch();
    }

    @Override
    public List<Opinion> findByLikes(Long debateId, boolean isLeft, Long cursorId, Integer cursorLikes, int limit) {
        QOpinion opinion = QOpinion.opinion;
        BooleanBuilder builder = new BooleanBuilder()
                .and(opinion.debate.id.eq(debateId))
                .and(opinion.left.eq(isLeft))
                .and(opinion.valid.isTrue());

        if (cursorLikes != null && cursorId != null) {
            builder.and(
                    opinion.likeCount.lt(cursorLikes)
                            .or(opinion.likeCount.eq(cursorLikes).and(opinion.id.lt(cursorId)))
            );
        }

        return queryFactory
                .selectFrom(opinion)
                .where(builder)
                .orderBy(opinion.likeCount.desc(), opinion.id.desc())
                .limit(limit)
                .fetch();
    }

    @Override
    public List<Opinion> findByComments(Long debateId, boolean isLeft, Long cursorId, Integer cursorComments, int limit) {
        QOpinion opinion = QOpinion.opinion;
        BooleanBuilder builder = new BooleanBuilder()
                .and(opinion.debate.id.eq(debateId))
                .and(opinion.left.eq(isLeft))
                .and(opinion.valid.isTrue());

        if (cursorComments != null && cursorId != null) {
            builder.and(
                    opinion.commentCount.lt(cursorComments)
                            .or(opinion.commentCount.eq(cursorComments).and(opinion.id.lt(cursorId)))
            );
        }

        return queryFactory
                .selectFrom(opinion)
                .where(builder)
                .orderBy(opinion.commentCount.desc(), opinion.id.desc())
                .limit(limit)
                .fetch();
    }

}
