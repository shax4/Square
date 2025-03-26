package org.shax3.square.domain.type.service;

import lombok.RequiredArgsConstructor;
import org.shax3.square.domain.type.dto.response.TypeTestQuestion;
import org.shax3.square.domain.type.dto.response.TypeTestQuestionResponse;
import org.shax3.square.domain.type.model.Question;
import org.shax3.square.domain.type.repository.QuestionRepository;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TypeService {

    private final QuestionRepository questionRepository;

    @Cacheable(value = "questionList", cacheManager = "cacheManager")
    public TypeTestQuestionResponse getTypeTestQuestionList() {
        List<Question> questions = questionRepository.findAll();
        Collections.shuffle(questions);

        List<TypeTestQuestion> questionList = questions.stream()
                .map(q -> new TypeTestQuestion(q.getId(), q.getContent()))
                .toList();

        return TypeTestQuestionResponse.from(questionList);
    }
}
