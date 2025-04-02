package org.shax3.square.domain.opinion.repository;

import org.shax3.square.domain.opinion.model.OpinionComment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OpinionCommentRepository extends JpaRepository<OpinionComment, Long> {
    List<OpinionComment> findByOpinionId(Long opinionId);
}
