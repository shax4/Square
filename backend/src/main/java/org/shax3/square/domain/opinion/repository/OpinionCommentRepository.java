package org.shax3.square.domain.opinion.repository;

import org.shax3.square.domain.opinion.model.OpinionComment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OpinionCommentRepository extends JpaRepository<OpinionComment, Long> {
}
