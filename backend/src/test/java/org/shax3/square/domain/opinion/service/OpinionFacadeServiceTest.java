package org.shax3.square.domain.opinion.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.shax3.square.common.model.TargetType;
import org.shax3.square.domain.like.service.LikeService;
import org.shax3.square.domain.opinion.dto.request.CreateOpinionCommentRequest;
import org.shax3.square.domain.opinion.dto.response.CommentResponse;
import org.shax3.square.domain.opinion.dto.response.CreateOpinionCommentResponse;
import org.shax3.square.domain.opinion.dto.response.OpinionDetailsResponse;
import org.shax3.square.domain.opinion.model.Opinion;
import org.shax3.square.domain.opinion.model.OpinionComment;
import org.shax3.square.domain.s3.service.S3Service;
import org.shax3.square.domain.user.model.Type;
import org.shax3.square.domain.user.model.User;
import org.shax3.square.exception.CustomException;
import org.shax3.square.exception.ExceptionCode;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OpinionFacadeServiceTest {

    @Mock
    private OpinionService opinionService;
    @Mock
    private OpinionCommentService opinionCommentService;
    @Mock
    private S3Service s3Service;
    @Mock
    private LikeService likeService;

    @InjectMocks
    private OpinionFacadeService opinionFacadeService;


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
                .user(mockUser)
                .content("Sample Content")
                .build();
        ReflectionTestUtils.setField(mockOpinion, "id", 1L);
        ReflectionTestUtils.setField(mockOpinion, "likeCount", 10);
        ReflectionTestUtils.setField(mockOpinion, "createdAt", LocalDateTime.now());

    }

    @Test
    @DisplayName("답글 생성 성공 테스트")
    void createOpinionComment_success() {
        CreateOpinionCommentRequest request = new CreateOpinionCommentRequest(1L, "Sample Comment Content");
        OpinionComment newComment = OpinionComment.builder()
                .user(mockUser)
                .opinion(mockOpinion)
                .content("Sample Comment Content")
                .build();
        ReflectionTestUtils.setField(newComment, "id", 1L);

        when(opinionService.getOpinion(1L)).thenReturn(mockOpinion);
        when(opinionCommentService.createComment(any(), any(), any())).thenReturn(newComment);
        when(s3Service.generatePresignedGetUrl(any())).thenReturn("presigned-url");

        CreateOpinionCommentResponse response = opinionFacadeService.createOpinionComment(mockUser, request);

        assertThat(response).isNotNull();
        assertThat(response.commentId()).isEqualTo(1L);
        assertThat(response.profileUrl()).isEqualTo("presigned-url");

        verify(opinionService).getOpinion(1L);
        verify(opinionCommentService).createComment(any(), any(), any());
        verify(s3Service).generatePresignedGetUrl(any());
    }


    @Test
    @DisplayName("답글 생성 실패 테스트 - 의견이 존재하지 않을 경우")
    void createOpinionComment_opinionNotFound() {
        CreateOpinionCommentRequest request = new CreateOpinionCommentRequest(999L, "Sample Comment Content");

        when(opinionService.getOpinion(999L)).thenThrow(new CustomException(ExceptionCode.OPINION_NOT_FOUND));

        assertThatThrownBy(() -> opinionFacadeService.createOpinionComment(mockUser, request))
                .isInstanceOf(CustomException.class)
                .hasMessage(ExceptionCode.OPINION_NOT_FOUND.getMessage());

        verify(opinionCommentService, never()).createComment(any(), any(), any());
    }

    @Test
    @DisplayName("의견 상세 조회 성공 테스트")
    void getOpinionDetails_success() {
        // given
        OpinionComment comment = new OpinionComment(1L, mockOpinion, mockUser, "Nice!", 5, true);
        List<OpinionComment> mockOpinionComments = List.of(comment);


        when(opinionService.getOpinion(1L)).thenReturn(mockOpinion);
        when(opinionCommentService.getOpinionComments(1L)).thenReturn(mockOpinionComments);
        when(s3Service.generatePresignedGetUrl("test-key")).thenReturn("presigned-url");

        // opinion에 대해 유저가 좋아요 누른 상태
        when(likeService.getLikedTargetIds(mockUser, TargetType.OPINION, List.of(1L)))
            .thenReturn(Set.of(1L));

        // comment에 대해 좋아요 누른 상태
        when(likeService.getLikedTargetIds(mockUser, TargetType.OPINION_COMMENT, List.of(1L)))
            .thenReturn(Set.of(1L));

        OpinionDetailsResponse response = opinionFacadeService.getOpinionDetails(mockUser, 1L);

        assertThat(response).isNotNull();
        assertThat(response.opinionId()).isEqualTo(1L);
        assertThat(response.userType()).isEqualTo(Type.PNSB.name());
        assertThat(response.nickname()).isEqualTo("TestUser");
        assertThat(response.profileUrl()).isEqualTo("presigned-url");
        assertThat(response.isLiked()).isTrue();
        assertThat(response.comments()).hasSize(1);
        assertThat(response.comments().get(0).isLiked()).isTrue();
    }

    @Test
    @DisplayName("의견 상세 조회 실패 테스트 - 의견이 존재하지 않을 경우")
    void getOpinionDetails_opinionNotFound() {
        when(opinionService.getOpinion(1L)).thenThrow(new CustomException(ExceptionCode.OPINION_NOT_FOUND));

        assertThatThrownBy(() -> opinionFacadeService.getOpinionDetails(mockUser, 1L))
                .isInstanceOf(CustomException.class)
                .hasMessage(ExceptionCode.OPINION_NOT_FOUND.getMessage());

        verify(opinionCommentService, never()).getOpinionComments(any());
    }

    @Test
    @DisplayName("댓글이 없는 경우 의견 상세 조회 성공 테스트")
    void getOpinionDetails_noComments() {
        when(opinionService.getOpinion(1L)).thenReturn(mockOpinion);
        when(opinionCommentService.getOpinionComments(1L)).thenReturn(List.of());
        when(s3Service.generatePresignedGetUrl("test-key")).thenReturn("presigned-url");

        OpinionDetailsResponse response = opinionFacadeService.getOpinionDetails(mockUser, 1L);

        assertThat(response).isNotNull();
        assertThat(response.opinionId()).isEqualTo(1L);
        assertThat(response.comments()).isEmpty();
    }
}



