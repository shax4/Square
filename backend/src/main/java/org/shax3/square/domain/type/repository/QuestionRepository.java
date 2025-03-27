package org.shax3.square.domain.type.repository;

import org.shax3.square.domain.type.model.Question;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QuestionRepository extends JpaRepository<Question, Long> {
}
