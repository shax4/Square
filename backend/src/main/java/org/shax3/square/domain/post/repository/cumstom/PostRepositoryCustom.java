package org.shax3.square.domain.post.repository.cumstom;

import java.util.List;

import org.shax3.square.domain.post.model.Post;
import org.shax3.square.domain.user.model.User;

public interface PostRepositoryCustom {
	List<Post> findPopularPosts(int count);
	List<Post> findByLatestCursor(Long cursorId, int limit);
	List<Post> findByLikesCursor(Integer cursorLikes, int limit);
	List<Post> findMyPosts(User user, Long nextCursorId, int limit);
	List<Post> findMyLikedPosts(User user, Long nextCursorId, int limit);
}
