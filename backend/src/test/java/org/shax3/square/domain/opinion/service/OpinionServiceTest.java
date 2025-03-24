package org.shax3.square.domain.opinion.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.shax3.square.domain.debate.model.Debate;
import org.shax3.square.domain.debate.service.DebateService;
import org.shax3.square.domain.opinion.dto.CreateOpinionRequest;
import org.shax3.square.domain.opinion.model.Opinion;
import org.shax3.square.domain.opinion.repository.OpinionRepository;
import org.shax3.square.domain.user.model.User;
import org.shax3.square.exception.CustomException;
import org.shax3.square.exception.ExceptionCode;
import org.springframework.test.util.ReflectionTestUtils;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OpinionServiceTest {

    @Mock
    private OpinionRepository opinionRepository;

    @Mock
    private DebateService debateService;

    @InjectMocks
    private OpinionService opinionService;

    private User mockUser;
    private Debate mockDebate;

    @BeforeEach
    void setUp() {
        mockUser = User.builder()
                .nickname("TestUser")
                .build();
        ReflectionTestUtils.setField(mockUser, "id", 1L);

        mockDebate = Debate.builder()
                .topic("Sample Debate")
                .build();
        ReflectionTestUtils.setField(mockDebate, "id", 1L);
    }

    @Test
    @DisplayName("의견 저장 성공 테스트")
    void createOpinion_success() {
        // Given
        CreateOpinionRequest request = new CreateOpinionRequest(1L, true, "Sample Opinion");
        when(debateService.findDebateById(1L)).thenReturn(mockDebate);

        // When
        opinionService.createOpinion(mockUser, request);

        // Then
        verify(opinionRepository, times(1)).save(any(Opinion.class));
    }

    @Test
    @DisplayName("의견 저장 시 Debate가 존재하지 않으면 예외 발생")
    void createOpinion_debateNotFound() {
        // Given
        CreateOpinionRequest request = new CreateOpinionRequest(1L, true, "Sample Opinion");
        when(debateService.findDebateById(1L)).thenThrow(new CustomException(ExceptionCode.DEBATE_NOT_FOUND));

        // When / Then
        try {
            opinionService.createOpinion(mockUser, request);
        } catch (CustomException e) {
            assertThat(e.getCode()).isEqualTo(ExceptionCode.DEBATE_NOT_FOUND.getCode());
        }

        verify(opinionRepository, never()).save(any(Opinion.class));
    }
}
