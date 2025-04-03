package org.shax3.square.domain.post.repository;

import org.shax3.square.domain.post.model.Post;
import org.shax3.square.domain.post.repository.custom.PostRepositoryCustom;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PostRepository extends JpaRepository<Post, Long>, PostRepositoryCustom {
}
