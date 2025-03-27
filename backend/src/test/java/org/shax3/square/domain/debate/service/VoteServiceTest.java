package org.shax3.square.domain.debate.service;

import org.aspectj.util.Reflection;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.shax3.square.domain.debate.dto.request.VoteRequest;
import org.shax3.square.domain.debate.dto.response.MyVotedDebatesResponse;
import org.shax3.square.domain.debate.dto.response.VoteResponse;
import org.shax3.square.domain.debate.model.Debate;
import org.shax3.square.domain.debate.model.Vote;
import org.shax3.square.domain.debate.repository.VoteRepository;
import org.shax3.square.domain.scrap.service.ScrapService;
import org.shax3.square.domain.user.model.User;
import org.shax3.square.domain.user.service.UserService;
import org.shax3.square.exception.CustomException;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.List;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;
import static org.shax3.square.exception.ExceptionCode.ALREADY_VOTED;

@ExtendWith(MockitoExtension.class)
class VoteServiceTest {

    @Mock
    private VoteRepository voteRepository;

    @Mock
    private DebateService debateService;

    @Mock
    private ScrapService scrapService;

    @InjectMocks
    private VoteService voteService;

    private Debate mockDebate;
    private User mockUser;
    private VoteRequest voteRequest;

    @BeforeEach
    void setUp() {
        mockDebate = Debate.builder()
                .topic("test topic")
                .leftOption("맞다")
                .rightOption("아니다")
                .build();
        mockUser = User.builder()
                .nickname("TestUser")
                .build();

        voteRequest = new VoteRequest(true); // 찬성 선택
    }


    @Test
    @DisplayName("투표 성공 테스트")
    void vote_Success() {
        // Given
        when(debateService.findDebateById(1L)).thenReturn(mockDebate);
        when(voteRepository.existsByDebateAndUser(mockDebate, mockUser)).thenReturn(false);
        when(voteRepository.countByDebate(mockDebate)).thenReturn(11);
        when(voteRepository.countByDebateAndLeftTrue(mockDebate)).thenReturn(7);

        // When
        VoteResponse response = voteService.vote(voteRequest, 1L, mockUser);

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
        when(debateService.findDebateById(1L)).thenReturn(mockDebate);
        when(voteRepository.existsByDebateAndUser(mockDebate, mockUser)).thenReturn(true);

        // When & Then
        assertThatThrownBy(() -> voteService.vote(voteRequest, 1L, mockUser))
                .isInstanceOf(CustomException.class)
                .hasMessage(ALREADY_VOTED.getMessage());

        verify(voteRepository, never()).save(any(Vote.class));
    }

    @Test
    @DisplayName("내가 투표한 논쟁 목록 조회 성공 테스트")
    void getMyVotedDebates_Success() {
        // Given
        Vote mockVote1 = Vote.builder()
                .debate(mockDebate)
                .user(mockUser)
                .left(true)
                .build();

        Vote mockVote2 = Vote.builder()
                .debate(mockDebate)
                .user(mockUser)
                .left(false)
                .build();

        when(voteRepository.findByUserOrderByIdDesc(mockUser, null, 3))
                .thenReturn(List.of(mockVote1, mockVote2));
        when(voteRepository.countByDebate(mockDebate)).thenReturn(2);
        when(voteRepository.countByDebateAndLeftTrue(mockDebate)).thenReturn(1);
        when(scrapService.isDebateScraped(eq(mockUser), eq(mockDebate.getId())))
                .thenReturn(false);

        // When
        MyVotedDebatesResponse response = voteService.getMyVotedDebates(mockUser, null, 2);

        // Then
        assertThat(response).isNotNull();
        assertThat(response.debates()).hasSize(2);
        assertThat(response.nextCursorId()).isEqualTo(mockVote2.getId());

        verify(voteRepository).findByUserOrderByIdDesc(mockUser, null, 3);
        verify(scrapService, times(2)).isDebateScraped(any(), any());
    }

    @Test
    @DisplayName("내가 투표한 논쟁 목록 조회 실패 테스트 - 사용자가 투표한 데이터가 없는 경우")
    void getMyVotedDebates_Fails_When_No_Votes() {
        // Given
        User mockUser = User.builder()
                .nickname("TestUser")
                .build();

        when(voteRepository.findByUserOrderByIdDesc(mockUser, null, 3)).thenReturn(List.of());

        // When
        MyVotedDebatesResponse response = voteService.getMyVotedDebates(mockUser, null, 2);

        // Then
        assertThat(response).isNotNull();
        assertThat(response.debates()).isEmpty();
        assertThat(response.nextCursorId()).isNull();

        verify(voteRepository).findByUserOrderByIdDesc(mockUser, null, 3);
    }
}