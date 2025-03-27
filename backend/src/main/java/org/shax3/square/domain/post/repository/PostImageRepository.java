package org.shax3.square.domain.post.repository;

import org.shax3.square.domain.post.model.PostImage;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PostImageRepository extends JpaRepository<PostImage, Long> {
}
