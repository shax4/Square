package org.shax3.square.domain.type.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Arrays;
import java.util.List;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.shax3.square.domain.type.dto.response.TypeTestQuestionResponse;
import org.shax3.square.domain.type.model.Question;
import org.shax3.square.domain.type.repository.QuestionRepository;

@ExtendWith(MockitoExtension.class)
public class TypeServiceTest {

    @Mock
    private QuestionRepository questionRepository;

    @InjectMocks
    private TypeService typeService;

    @Test
    @DisplayName("성향테스트 질문 조회")
    public void getQuestions_shouldReturnCorrectResponse() {
        // given
        List<Question> questions = Arrays.asList(
                new Question(1L, "What is your name?", "가치관", true),
                new Question(2L, "What is your quest?", "미래관", false),
                new Question(3L, "What is your favorite color?", "사회관", true)
        );
        when(questionRepository.findAll()).thenReturn(questions);

        // when
        TypeTestQuestionResponse response = typeService.getTypeTestQuestionList();

        // then
        assertThat(response).isNotNull();
        assertThat(response.questions()).hasSize(questions.size());
        for (Question question : questions) {
            assertThat(response.questions())
                    .anyMatch(q -> q.questionId().equals(question.getId())
                            && q.content().equals(question.getContent()));
        }
        verify(questionRepository).findAll();
    }
}
