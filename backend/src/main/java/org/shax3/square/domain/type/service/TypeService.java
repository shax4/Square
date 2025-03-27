package org.shax3.square.domain.type.service;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.shax3.square.domain.type.dto.request.EndTypeTestRequest;
import org.shax3.square.domain.type.dto.request.TypeTestAnswer;
import org.shax3.square.domain.type.dto.response.TypeInfoResponse;
import org.shax3.square.domain.type.dto.response.TypeTestQuestion;
import org.shax3.square.domain.type.dto.response.TypeTestQuestionResponse;
import org.shax3.square.domain.type.model.Question;
import org.shax3.square.domain.type.model.Type;
import org.shax3.square.domain.type.repository.QuestionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

    @Transactional
    public TypeInfoResponse endTypeTest(EndTypeTestRequest endTypeTestRequest) {
        int[] score = new int[4];

        for (TypeTestAnswer answer : endTypeTestRequest.answers()) {
            calculateScore(score, answer);
        }

        for (int i = 0; i < 4; i++) {
            score[i] = (int)(score[i]/8.0 + 0.5);
            score[i] = checkZero(score[i]);
        }

        String type = (score[0] < 0 ? "P" : "I") +
                (score[1] < 0 ? "N" : "C") +
                (score[2] < 0 ? "T" : "S") +
                (score[3] < 0 ? "B" : "R");

        return null;
    }

    private int checkZero(int score) {
        if (score == 0) {
            return Math.random() < 0.5 ? -1 : 1;
        }
        return score;
    }

    private void calculateScore(int[] score, TypeTestAnswer answer) {
        int questionId = answer.questionId();
        int testAnswer = answer.answer() - 3;

        if (testAnswer <= 0) {
            testAnswer -= 1;
        }

        if (questionId % 2 == 0) {
            testAnswer *= -1;
        }

        int index = ((questionId - 1) / 4) - 1;
        score[index] += testAnswer;
    }
}
