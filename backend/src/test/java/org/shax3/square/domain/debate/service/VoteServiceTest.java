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
import org.springframework.test.util.ReflectionTestUtils;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;
import static org.shax3.square.exception.ExceptionCode.ALREADY_VOTED;

@ExtendWith(MockitoExtension.class)
class VoteServiceTest {

    @Mock
    private VoteRepository voteRepository;

    @InjectMocks
    private VoteService voteService;

    private Debate mockDebate;
    private User mockUser;
    private VoteRequest voteRequest;

    @BeforeEach
    void setUp() {
        mockDebate = Debate.builder()
                .topic("Test Topic")
                .leftOption("Yes")
                .rightOption("No")
                .build();
        ReflectionTestUtils.setField(mockDebate, "id", 1L);

        mockUser = User.builder()
                .nickname("TestUser")
                .build();

        voteRequest = new VoteRequest(true); // 찬성 투표
    }

    @Test
    @DisplayName("투표 성공")
    void vote_success() {
        // given
        when(voteRepository.existsByDebateAndUser(mockDebate, mockUser)).thenReturn(false);
        when(voteRepository.countByDebate(mockDebate)).thenReturn(10);
        when(voteRepository.countByDebateAndLeftTrue(mockDebate)).thenReturn(7);

        // when
        VoteResponse response = voteService.vote(voteRequest, mockDebate, mockUser);

        // then
        assertThat(response).isNotNull();
        assertThat(response.leftCount()).isEqualTo(7);
        assertThat(response.rightCount()).isEqualTo(3);
        verify(voteRepository).save(any(Vote.class));
    }

    @Test
    @DisplayName("투표 실패 - 이미 투표한 경우")
    void vote_alreadyVoted() {
        // given
        when(voteRepository.existsByDebateAndUser(mockDebate, mockUser)).thenReturn(true);

        // then
        assertThatThrownBy(() -> voteService.vote(voteRequest, mockDebate, mockUser))
                .isInstanceOf(CustomException.class)
                .hasMessage(ALREADY_VOTED.getMessage());

        verify(voteRepository, never()).save(any());
    }

    @Test
    @DisplayName("투표 집계 계산")
    void calculateVoteResult() {
        // given
        when(voteRepository.countByDebate(mockDebate)).thenReturn(8);
        when(voteRepository.countByDebateAndLeftTrue(mockDebate)).thenReturn(5);

        // when
        VoteResponse result = voteService.calculateVoteResult(mockDebate);

        // then
        assertThat(result.leftCount()).isEqualTo(5);
        assertThat(result.rightCount()).isEqualTo(3);
    }

    @Test
    @DisplayName("유저-토론 기준 투표 조회")
    void getVoteByUserAndDebate() {
        // given
        Vote vote = Vote.builder().debate(mockDebate).user(mockUser).left(true).build();
        when(voteRepository.findByDebateAndUser(mockDebate, mockUser)).thenReturn(Optional.of(vote));

        // when
        Optional<Vote> result = voteService.getVoteByUserAndDebate(mockUser, mockDebate);

        // then
        assertThat(result).isPresent();
        assertThat(result.get().isLeft()).isTrue();
    }

    @Test
    @DisplayName("유저의 투표 목록 페이징 조회")
    void getVotesByUser() {
        // given
        Vote vote1 = Vote.builder().debate(mockDebate).user(mockUser).left(true).build();
        Vote vote2 = Vote.builder().debate(mockDebate).user(mockUser).left(false).build();

        when(voteRepository.findByUserOrderByIdDesc(mockUser, null, 3))
                .thenReturn(List.of(vote1, vote2));

        // when
        List<Vote> votes = voteService.getVotesByUser(mockUser, null, 3);

        // then
        assertThat(votes).hasSize(2);
    }
}
