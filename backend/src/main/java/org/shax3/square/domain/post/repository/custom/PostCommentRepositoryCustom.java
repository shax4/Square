package org.shax3.square.domain.post.repository.custom;

import java.util.List;
import java.util.Map;

public interface PostCommentRepositoryCustom {
	Map<Long, Integer> countByPostIds(List<Long> postIds);
}
