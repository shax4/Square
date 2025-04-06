package org.shax3.square.domain.post.repository;

import org.shax3.square.domain.post.model.PostComment;
import org.shax3.square.domain.post.repository.custom.PostCommentRepositoryCustom;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PostCommentRepository extends JpaRepository<PostComment, Long>, PostCommentRepositoryCustom {
}
