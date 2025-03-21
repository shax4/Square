package org.shax3.square.domain.debate.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.shax3.square.domain.debate.dto.request.VoteRequest;
import org.shax3.square.domain.debate.dto.response.VoteResponse;
import org.shax3.square.domain.debate.model.Debate;
import org.shax3.square.domain.debate.model.Vote;
import org.shax3.square.domain.debate.repository.VoteRepository;
import org.shax3.square.domain.user.model.User;
import org.shax3.square.exception.CustomException;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;
import static org.shax3.square.exception.ExceptionCode.ALREADY_VOTED;

@ExtendWith(MockitoExtension.class)
class VoteServiceTest {

    @Mock
    private VoteRepository voteRepository;

    @Mock
    private DebateService debateService;

    @InjectMocks
    private VoteService voteService;

    private Debate debate;
    private User user;
    private VoteRequest voteRequest;

    @BeforeEach
    void setUp() {
        debate = Debate.builder()
                .topic("test topic")
                .leftOption("맞다")
                .rightOption("아니다")
                .build();
        user = User.builder()
                .nickname("TestUser")
                .build();

        voteRequest = new VoteRequest(true); // 찬성 선택
    }


    @Test
    @DisplayName("투표 성공 테스트")
    void vote_Success() {
        // Given
        when(debateService.findDebateById(1L)).thenReturn(debate);
        when(voteRepository.existsByDebateAndUser(debate, user)).thenReturn(false);
        when(voteRepository.countByDebate(debate)).thenReturn(11);
        when(voteRepository.countByDebateAndLeftTrue(debate)).thenReturn(7);

        // When
        VoteResponse response = voteService.vote(voteRequest, 1L, user);

        // Then
        assertThat(response).isNotNull();
        assertThat(response.leftCount()).isEqualTo(7);
        assertThat(response.rightCount()).isEqualTo(4);
        assertThat(response.leftPercent()).isEqualTo(64);
        assertThat(response.rightPercent()).isEqualTo(36);
        assertThat(response.totalVoteCount()).isEqualTo(11);

        verify(voteRepository, times(1)).save(any(Vote.class));
    }

    @Test
    @DisplayName("투표 실패 테스트 - 이미 투표한 투표일 경우")
    void vote_Fails_When_User_Already_Voted() {
        // Given
        when(debateService.findDebateById(1L)).thenReturn(debate);
        when(voteRepository.existsByDebateAndUser(debate, user)).thenReturn(true);

        // When & Then
        assertThatThrownBy(() -> voteService.vote(voteRequest, 1L, user))
                .isInstanceOf(CustomException.class)
                .hasMessage(ALREADY_VOTED.getMessage());

        verify(voteRepository, never()).save(any(Vote.class));
    }

}
