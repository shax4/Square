package org.shax3.square.domain.opinion.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.shax3.square.domain.debate.model.Debate;
import org.shax3.square.domain.opinion.dto.response.CommentResponse;
import org.shax3.square.domain.opinion.model.OpinionComment;
import org.shax3.square.domain.opinion.repository.OpinionCommentRepository;
import org.shax3.square.domain.s3.service.S3Service;
import org.shax3.square.domain.user.model.Type;
import org.shax3.square.domain.user.model.User;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class OpinionCommentServiceTest {

    @Mock
    private OpinionCommentRepository opinionCommentRepository;

    @Mock
    private S3Service s3Service;

    @InjectMocks
    private OpinionCommentService opinionCommentService;

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
        assertNotNull(responses);
        assertEquals(1, responses.size());
        assertEquals("Nice!", responses.get(0).content());
        assertEquals(5, responses.get(0).likeCount());
        assertEquals("TestUser", responses.get(0).nickname());
        assertEquals("presigned-url", responses.get(0).profileUrl());
    }

    @Test
    @DisplayName("댓글이 없는 경우 빈 리스트 반환 테스트")
    void getOpinionComments_emptyList() {
        // Given
        when(opinionCommentRepository.findByOpinionIdAndValidTrue(1L)).thenReturn(List.of());

        // When
        List<CommentResponse> responses = opinionCommentService.getOpinionComments(mockUser, 1L);

        // Then
        assertNotNull(responses);
        assertTrue(responses.isEmpty());
    }
}

