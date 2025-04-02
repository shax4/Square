package org.shax3.square.domain.post.repository.cumstom;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.shax3.square.domain.post.model.QPostComment;

import com.querydsl.jpa.impl.JPAQueryFactory;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class PostCommentRepositoryImpl implements PostCommentRepositoryCustom {

	private final JPAQueryFactory queryFactory;

	@Override
	public Map<Long, Integer> countByPostIds(List<Long> postIds) {

		QPostComment comment = QPostComment.postComment;

		return queryFactory
			.select(comment.post.id, comment.count())
			.from(comment)
			.where(comment.post.id.in(postIds))
			.groupBy(comment.post.id)
			.fetch()
			.stream()
			.collect(Collectors.toMap(
				tuple -> tuple.get(comment.post.id),
				tuple -> Math.toIntExact(tuple.get(comment.count()))
			));
	}
}
