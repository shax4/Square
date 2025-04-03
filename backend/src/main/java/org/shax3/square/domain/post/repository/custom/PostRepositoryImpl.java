package org.shax3.square.domain.post.repository.custom;

import java.util.List;

import org.shax3.square.domain.post.model.Post;
import org.shax3.square.domain.post.model.QPost;
import org.shax3.square.domain.user.model.QUser;

import com.querydsl.jpa.impl.JPAQueryFactory;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class PostRepositoryImpl implements PostRepositoryCustom {

	private final JPAQueryFactory query;

	@Override
	public List<Post> findPopularPosts(int count) {
		QPost post = QPost.post;

		return query
			.selectFrom(post)
			.where(post.valid.isTrue())
			.orderBy(post.likeCount.desc())
			.limit(count)
			.fetch();
	}

	@Override
	public List<Post> findByLatestCursor(Long cursorId, int limit) {
		QPost post = QPost.post;
		QUser user = QUser.user;

		return query
			.selectFrom(post)
			.join(post.user, user).fetchJoin()
			.where(
				post.valid.isTrue(),
				cursorId != null ? post.id.lt(cursorId) : null
			)
			.orderBy(post.id.desc())
			.limit(limit)
			.fetch();
	}

	@Override
	public List<Post> findByLikesCursor(Integer cursorLikes, int limit) {
		QPost post = QPost.post;
		QUser user = QUser.user;

		return query
			.selectFrom(post)
			.join(post.user, user).fetchJoin()
			.where(
				post.valid.isTrue(),
				cursorLikes != null ? post.likeCount.lt(cursorLikes) : null
			)
			.orderBy(post.likeCount.desc(), post.id.desc())
			.limit(limit)
			.fetch();
	}
}
