package org.shax3.square.domain.type.service;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.shax3.square.domain.type.dto.response.TypeTestQuestion;
import org.shax3.square.domain.type.dto.response.TypeTestQuestionResponse;
import org.shax3.square.domain.type.model.Question;
import org.shax3.square.domain.type.repository.QuestionRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TypeService {

    private static List<Question> staticQuestionList;

    private final QuestionRepository questionRepository;

    @PostConstruct
    public void init() {
        staticQuestionList = questionRepository.findAll();
    }

    public TypeTestQuestionResponse getShuffledQuestionList() {

        List<TypeTestQuestion> questionList = new ArrayList<>(staticQuestionList.stream()
                .map(q -> new TypeTestQuestion(q.getId(), q.getContent()))
                .toList());

        Collections.shuffle(questionList);

        return TypeTestQuestionResponse.from(questionList);
    }
}
