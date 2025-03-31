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
import org.shax3.square.domain.opinion.dto.response.MyOpinionResponse;
import org.shax3.square.domain.opinion.model.Opinion;
import org.shax3.square.domain.opinion.repository.OpinionRepository;
import org.shax3.square.domain.proposal.model.Proposal;
import org.shax3.square.domain.user.model.Type;
import org.shax3.square.domain.user.model.User;
import org.shax3.square.exception.CustomException;
import org.shax3.square.exception.ExceptionCode;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
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

    @Test
    @DisplayName("내 의견 목록 조회 - 첫 페이지 (데이터 있음)")
    void getMyOpinions_FirstPage_WithData() {
        // Given
        Long nextCursorId = null; // 첫 페이지
        int limit = 3;

        List<Opinion> opinions = createTestOpinions(5L, 4L, 3L);
        when(opinionRepository.findMyOpinions(mockUser, nextCursorId, limit+1)).thenReturn(opinions);

        // When
        MyOpinionResponse response = opinionService.getMyOpinions(mockUser, nextCursorId, limit);

        // Then
        assertThat(response).isNotNull();
        assertThat(response.opinions()).hasSize(3);
        assertThat(response.opinions().get(0).opinionId()).isEqualTo(5L);
        assertThat(response.opinions().get(1).opinionId()).isEqualTo(4L);
        assertThat(response.opinions().get(2).opinionId()).isEqualTo(3L);
        assertThat(response.nextCursorId()).isEqualTo(3L); // 다음 페이지 커서는 마지막 항목의 ID
    }

    @Test
    @DisplayName("내 의견 목록 조회 - 두 번째 페이지 (데이터 있음)")
    void getMyOpinions_SecondPage_WithData() {
        // Given
        Long nextCursorId = 3L; // 이전 페이지의 마지막 ID
        int limit = 3;

        List<Opinion> opinions = createTestOpinions(2L, 1L);
        when(opinionRepository.findMyOpinions(mockUser, nextCursorId, limit+1)).thenReturn(opinions);

        // When
        MyOpinionResponse response = opinionService.getMyOpinions(mockUser, nextCursorId, limit);

        // Then
        assertThat(response).isNotNull();
        assertThat(response.opinions()).hasSize(2);
        assertThat(response.opinions().get(0).opinionId()).isEqualTo(2L);
        assertThat(response.opinions().get(1).opinionId()).isEqualTo(1L);
        assertThat(response.nextCursorId()).isEqualTo(1L); // 다음 페이지 커서는 마지막 항목의 ID
    }

    @Test
    @DisplayName("내 의견 목록 조회 - 마지막 페이지 (더 이상 데이터 없음)")
    void getMyOpinions_LastPage_NoMoreData() {
        // Given
        Long nextCursorId = 1L; // 이전 페이지의 마지막 ID
        int limit = 3;

        List<Opinion> opinions = List.of(); // 더 이상 데이터 없음
        when(opinionRepository.findMyOpinions(mockUser, nextCursorId, limit+1)).thenReturn(opinions);

        // When
        MyOpinionResponse response = opinionService.getMyOpinions(mockUser, nextCursorId, limit);

        // Then
        assertThat(response).isNotNull();
        assertThat(response.opinions()).isEmpty();
        assertThat(response.nextCursorId()).isNull(); // 더 이상 데이터가 없으므로 null
    }

    @Test
    @DisplayName("내 의견 목록 조회 - 데이터가 없는 경우")
    void getMyOpinions_NoData() {
        // Given
        Long nextCursorId = null;
        int limit = 3;

        List<Opinion> opinions = List.of(); // 데이터 없음
        when(opinionRepository.findMyOpinions(mockUser, nextCursorId, limit+1)).thenReturn(opinions);

        // When
        MyOpinionResponse response = opinionService.getMyOpinions(mockUser, nextCursorId, limit);

        // Then
        assertThat(response).isNotNull();
        assertThat(response.opinions()).isEmpty();
        assertThat(response.nextCursorId()).isNull(); // 데이터가 없으므로 null
    }

    @Test
    @DisplayName("내 의견 목록 조회 - 정확히 limit 개수만큼 데이터가 있는 경우")
    void getMyOpinions_ExactlyLimitData() {
        // Given
        Long nextCursorId = null;
        int limit = 3;

        List<Opinion> opinions = createTestOpinions(5L, 4L, 3L);
        when(opinionRepository.findMyOpinions(mockUser, nextCursorId, limit+1)).thenReturn(opinions);

        // When
        MyOpinionResponse response = opinionService.getMyOpinions(mockUser, nextCursorId, limit);

        // Then
        assertThat(response).isNotNull();
        assertThat(response.opinions()).hasSize(3);
        assertThat(response.nextCursorId()).isEqualTo(3L); // 다음 페이지 커서는 마지막 항목의 ID
    }




    // 테스트용 Opinion 목록 생성 헬퍼 메서드
    private List<Opinion> createTestOpinions(Long... ids) {
        List<Opinion> opinions = new ArrayList<>();

        for (Long id : ids) {
            Opinion opinion = Opinion.builder()
                    .user(mockUser)
                    .debate(mockDebate)
                    .content("테스트 내용 " + id)
                    .build();
            ReflectionTestUtils.setField(opinion, "id", id);
            ReflectionTestUtils.setField(opinion, "valid", true);
            opinions.add(opinion);
        }
        return opinions;
    }


    @Test
    @DisplayName("의견 존재하면 정상 반환")
    void getOpinion_whenPresent() {
        // given
        Long opinionId = 1L;
        Opinion opinion = Opinion.builder()
            .content("test")
            .build();
        ReflectionTestUtils.setField(opinion, "id", opinionId);

        when(opinionRepository.findById(opinionId)).thenReturn(Optional.of(opinion));

        // when
        Opinion result = opinionService.getOpinion(opinionId);

        // then
        assertThat(result).isEqualTo(opinion);
    }

    @Test
    @DisplayName("의견 존재하지 않으면 예외 발생")
    void getOpinion_whenNotPresent() {
        // given
        Long opinionId = 2L;

        when(opinionRepository.findById(opinionId)).thenReturn(Optional.empty());

        // when & then
        assertThatThrownBy(() -> opinionService.getOpinion(opinionId))
            .isInstanceOf(CustomException.class)
            .hasMessage(ExceptionCode.OPINION_NOT_FOUND.getMessage());
    }

    @Test
    @DisplayName("의견이 존재하는 경우 true 반환")
    void isOpinionExists_whenPresent() {
        // given
        Long opinionId = 3L;
        when(opinionRepository.existsById(opinionId)).thenReturn(true);

        // when & then
        assertThatCode(() -> opinionService.validateOpinionExists(opinionId))
            .doesNotThrowAnyException();
    }

    @Test
    @DisplayName("의견이 존재하지 않는 경우 false 반환")
    void isOpinionExists_whenNotPresent() {
        // given
        Long opinionId = 4L;
        when(opinionRepository.existsById(opinionId)).thenReturn(false);

        // when & then
        assertThatThrownBy(() -> opinionService.validateOpinionExists(opinionId))
            .isInstanceOf(CustomException.class)
            .hasMessage(ExceptionCode.OPINION_NOT_FOUND.getMessage());
    }

    @Test
    @DisplayName("increaseLikeCount - likeCount 증가 로직이 잘 호출되는지 확인")
    void increaseLikeCount_success() {
        // given
        Opinion opinion = mock(Opinion.class);
        when(opinionRepository.findById(10L)).thenReturn(Optional.of(opinion));

        // when
        opinionService.increaseLikeCount(10L, 3);

        // then
        verify(opinion).increaseLikeCount(3);
    }
}

