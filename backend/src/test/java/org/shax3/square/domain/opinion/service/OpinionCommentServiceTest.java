package org.shax3.square.domain.opinion.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.shax3.square.domain.opinion.dto.request.CreateOpinionCommentRequest;
import org.shax3.square.domain.opinion.dto.response.CommentResponse;
import org.shax3.square.domain.opinion.dto.response.CreateOpinionCommentResponse;
import org.shax3.square.domain.opinion.model.Opinion;
import org.shax3.square.domain.opinion.model.OpinionComment;
import org.shax3.square.domain.opinion.repository.OpinionCommentRepository;
import org.shax3.square.domain.opinion.service.OpinionCommentService;
import org.shax3.square.domain.s3.service.S3Service;
import org.shax3.square.domain.user.model.Type;
import org.shax3.square.domain.user.model.User;
import org.shax3.square.exception.CustomException;
import org.shax3.square.exception.ExceptionCode;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.bind.MethodArgumentNotValidException;

import java.time.LocalDateTime;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;
import static org.assertj.core.api.Assertions.assertThat;

@ExtendWith(MockitoExtension.class)
class OpinionCommentServiceTest {

    @Mock
    private OpinionCommentRepository opinionCommentRepository;

    @Mock
    private S3Service s3Service;

    @Mock
    private OpinionService opinionService;


    @InjectMocks
    private OpinionCommentService opinionCommentService;

    private User mockUser;
    private Opinion mockOpinion;
    @BeforeEach
    void setUp() {
        mockUser = User.builder()
                .nickname("TestUser")
                .type(Type.PNSB)
                .s3Key("test-key")
                .build();
        ReflectionTestUtils.setField(mockUser, "id", 1L);

        mockOpinion = Opinion.builder()
                .content("Sample Opinion Content")
                .build();
        ReflectionTestUtils.setField(mockOpinion, "id", 1L);

    }

    @Test
    @DisplayName("댓글을 성공적으로 반환하는지 테스트")
    void getOpinionComments_success() {
        // Given
        OpinionComment mockComment = new OpinionComment(1L, null, mockUser, "Nice!", 5, true);
        List<OpinionComment> mockComments = List.of(mockComment);

        when(opinionCommentRepository.findByOpinionIdAndValidTrue(1L)).thenReturn(mockComments);
        when(s3Service.generatePresignedGetUrl("test-key")).thenReturn("presigned-url");

        // When
        List<CommentResponse> responses = opinionCommentService.getOpinionComments(mockUser, 1L);

        // Then
        assertThat(responses).isNotNull().hasSize(1);
        assertThat(responses.get(0).content()).isEqualTo("Nice!");
        assertThat(responses.get(0).likeCount()).isEqualTo(5);
        assertThat(responses.get(0).nickname()).isEqualTo("TestUser");
        assertThat(responses.get(0).profileUrl()).isEqualTo("presigned-url");
    }

    @Test
    @DisplayName("댓글이 없는 경우 빈 리스트 반환 테스트")
    void getOpinionComments_emptyList() {
        // Given
        when(opinionCommentRepository.findByOpinionIdAndValidTrue(1L)).thenReturn(List.of());

        // When
        List<CommentResponse> responses = opinionCommentService.getOpinionComments(mockUser, 1L);

        // Then
        assertThat(responses).isNotNull().isEmpty();
    }

    @Test
    @DisplayName("댓글 생성 성공 테스트")
    void createOpinionComment_success() {
        // Given
        CreateOpinionCommentRequest request = new CreateOpinionCommentRequest(1L, "Sample Comment Content");

        when(opinionService.getOpinion(1L)).thenReturn(mockOpinion);
        when(s3Service.generatePresignedGetUrl(mockUser.getS3Key())).thenReturn("presigned-url");

        OpinionComment savedComment = OpinionComment.builder()
                .opinion(mockOpinion)
                .user(mockUser)
                .content(request.content())
                .likeCount(0)
                .build();

        ReflectionTestUtils.setField(savedComment, "id", 1L);

        when(opinionCommentRepository.save(any(OpinionComment.class))).thenReturn(savedComment);

        // When
        CreateOpinionCommentResponse response = opinionCommentService.createOpinionComment(mockUser, request);

        // Then
        assertThat(response).isNotNull();
        assertThat(response.commentId()).isEqualTo(1L);
        assertThat(response.profileUrl()).isEqualTo("presigned-url");

        verify(opinionService, times(1)).getOpinion(1L);
        verify(opinionCommentRepository, times(1)).save(any(OpinionComment.class));
    }

    @Test
    @DisplayName("댓글 생성 실패 테스트 - 의견이 존재하지 않을 경우")
    void createOpinionComment_opinionNotFound() {
        // Given
        CreateOpinionCommentRequest request = new CreateOpinionCommentRequest(999L, "Sample Comment Content");

        when(opinionService.getOpinion(999L)).thenThrow(new CustomException(ExceptionCode.OPINION_NOTFOUND));

        // When / Then
        assertThatThrownBy(() -> opinionCommentService.createOpinionComment(mockUser, request))
                .isInstanceOf(CustomException.class)
                .hasMessage(ExceptionCode.OPINION_NOTFOUND.getMessage());

        verify(opinionService, times(1)).getOpinion(999L);
        verify(opinionCommentRepository, never()).save(any(OpinionComment.class));
    }

}
