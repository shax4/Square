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
import org.shax3.square.domain.opinion.dto.request.CreateOpinionRequest;
import org.shax3.square.domain.opinion.dto.request.UpdateOpinionRequest;
import org.shax3.square.domain.opinion.model.Opinion;
import org.shax3.square.domain.opinion.repository.OpinionRepository;
import org.shax3.square.domain.user.model.Type;
import org.shax3.square.domain.user.model.User;
import org.shax3.square.exception.CustomException;
import org.shax3.square.exception.ExceptionCode;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
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
                .type(Type.PNSB)
                .s3Key("test-key")
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
    @DisplayName("의견 수정 성공 테스트 - 작성자가 수정")
    void updateOpinion_success() {
        // Given
        Long opinionId = 1L;
        String updatedContent = "Updated Content";
        UpdateOpinionRequest request = new UpdateOpinionRequest(updatedContent);

        Opinion mockOpinion = Opinion.builder()
                .user(mockUser)
                .content("Original Content")
                .build();
        ReflectionTestUtils.setField(mockOpinion, "id", opinionId);

        when(opinionRepository.findById(opinionId)).thenReturn(Optional.of(mockOpinion));

        // When
        opinionService.updateOpinion(request, mockUser, opinionId);

        // Then
        verify(opinionRepository, times(1)).findById(opinionId);
        assertThat(mockOpinion.getContent()).isEqualTo(updatedContent);
    }

    @Test
    @DisplayName("의견 수정 실패 테스트 - 작성자가 아닌 사용자가 수정 시도")
    void updateOpinion_notAuthor() {
        // Given
        Long opinionId = 1L;
        UpdateOpinionRequest request = new UpdateOpinionRequest("Updated Content");

        User otherUser = User.builder().nickname("OtherUser").build();
        ReflectionTestUtils.setField(otherUser, "id", 2L);

        Opinion mockOpinion = Opinion.builder()
                .user(mockUser)
                .content("Original Content")
                .build();
        ReflectionTestUtils.setField(mockOpinion, "id", opinionId);

        when(opinionRepository.findById(opinionId)).thenReturn(Optional.of(mockOpinion));

        // When / Then
        assertThatThrownBy(() -> opinionService.updateOpinion(request, otherUser, opinionId))
                .isInstanceOf(CustomException.class)
                .hasMessage(ExceptionCode.NOT_AUTHOR.getMessage());

        verify(opinionRepository, times(1)).findById(opinionId);
    }

    @Test
    @DisplayName("의견 수정 실패 테스트 - 의견이 존재하지 않을 경우")
    void updateOpinion_opinionNotFound() {
        // Given
        Long opinionId = 1L;
        UpdateOpinionRequest request = new UpdateOpinionRequest("Updated Content");

        when(opinionRepository.findById(opinionId)).thenReturn(Optional.empty());

        // When / Then
        assertThatThrownBy(() -> opinionService.updateOpinion(request, mockUser, opinionId))
                .isInstanceOf(CustomException.class)
                .hasMessage(ExceptionCode.OPINION_NOT_FOUND.getMessage());

        verify(opinionRepository, times(1)).findById(opinionId);
    }

    @Test
    @DisplayName("의견 삭제 성공 테스트 - 작성자가 삭제")
    void deleteOpinion_success() {
        // Given
        Long opinionId = 1L;

        Opinion mockOpinion = Opinion.builder()
                .user(mockUser)
                .content("Sample Content")
                .build();
        ReflectionTestUtils.setField(mockOpinion, "id", opinionId);

        when(opinionRepository.findById(opinionId)).thenReturn(Optional.of(mockOpinion));

        // When
        opinionService.deleteOpinion(mockUser, opinionId);

        // Then
        verify(opinionRepository, times(1)).findById(opinionId);
        assertThat(mockOpinion.isValid()).isFalse(); // Soft delete 확인
    }

    @Test
    @DisplayName("의견 삭제 실패 테스트 - 작성자가 아닌 사용자가 삭제 시도")
    void deleteOpinion_notAuthor() {
        // Given
        Long opinionId = 1L;

        User otherUser = User.builder().nickname("OtherUser").build();
        ReflectionTestUtils.setField(otherUser, "id", 2L);

        Opinion mockOpinion = Opinion.builder()
                .user(mockUser)
                .content("Sample Content")
                .build();
        ReflectionTestUtils.setField(mockOpinion, "id", opinionId);

        when(opinionRepository.findById(opinionId)).thenReturn(Optional.of(mockOpinion));

        // When / Then
        assertThatThrownBy(() -> opinionService.deleteOpinion(otherUser, opinionId))
                .isInstanceOf(CustomException.class)
                .hasMessage(ExceptionCode.NOT_AUTHOR.getMessage());

        verify(opinionRepository, times(1)).findById(opinionId);
    }

    @Test
    @DisplayName("의견 삭제 실패 테스트 - 의견이 존재하지 않을 경우")
    void deleteOpinion_opinionNotFound() {
        // Given
        Long opinionId = 1L;

        when(opinionRepository.findById(opinionId)).thenReturn(Optional.empty());

        // When / Then
        assertThatThrownBy(() -> opinionService.deleteOpinion(mockUser, opinionId))
                .isInstanceOf(CustomException.class)
                .hasMessage(ExceptionCode.OPINION_NOT_FOUND.getMessage());

        verify(opinionRepository, times(1)).findById(opinionId);
    }


}

