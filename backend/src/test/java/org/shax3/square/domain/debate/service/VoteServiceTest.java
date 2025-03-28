package org.shax3.square.domain.debate.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.shax3.square.common.model.TargetType;
import org.shax3.square.domain.debate.dto.request.VoteRequest;
import org.shax3.square.domain.debate.dto.response.MyScrapedDebatesResponse;
import org.shax3.square.domain.debate.dto.response.MyVotedDebatesResponse;
import org.shax3.square.domain.debate.dto.response.VoteResponse;
import org.shax3.square.domain.debate.model.Debate;
import org.shax3.square.domain.debate.model.Vote;
import org.shax3.square.domain.debate.repository.VoteRepository;
import org.shax3.square.domain.scrap.model.Scrap;
import org.shax3.square.domain.scrap.service.ScrapService;
import org.shax3.square.domain.user.model.User;
import org.shax3.square.exception.CustomException;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
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
    private Debate mockDebate1, mockDebate2;
    private Scrap scrap1, scrap2, scrap3;

    @BeforeEach
    void setUp() {
        mockDebate = Debate.builder()
                .topic("test topic")
                .leftOption("맞다")
                .rightOption("아니다")
                .build();

        ReflectionTestUtils.setField(mockDebate, "id", 1L);


        mockUser = User.builder()
                .nickname("TestUser")
                .build();

        voteRequest = new VoteRequest(true); // 찬성 선택

        mockDebate1 = Debate.builder().topic("토론1").build();
        ReflectionTestUtils.setField(mockDebate1, "id", 100L);

        mockDebate2 = Debate.builder().topic("토론2").build();
        ReflectionTestUtils.setField(mockDebate2, "id", 200L);

        scrap1 = Scrap.builder().targetId(100L).targetType(TargetType.DEBATE).build();
        ReflectionTestUtils.setField(scrap1, "id", 1L);

        scrap2 = Scrap.builder().targetId(200L).targetType(TargetType.DEBATE).build();
        ReflectionTestUtils.setField(scrap2, "id", 2L);

        scrap3 = Scrap.builder().targetId(300L).targetType(TargetType.DEBATE).build();
        ReflectionTestUtils.setField(scrap3, "id", 3L);

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
        Vote mockVote1 = Vote.builder().debate(mockDebate).user(mockUser).left(true).build();
        Vote mockVote2 = Vote.builder().debate(mockDebate).user(mockUser).left(false).build();

        when(voteRepository.findByUserOrderByIdDesc(mockUser, null, 3))
                .thenReturn(List.of(mockVote1, mockVote2));
        when(scrapService.getDebateScrap(mockUser)) // (1) 수정된 부분
                .thenReturn(List.of(mockDebate.getId()));

        // When
        MyVotedDebatesResponse response = voteService.getMyVotedDebates(mockUser, null, 2);

        // Then
        assertThat(response.debates())
                .hasSize(2)
                .allSatisfy(dto ->
                        assertThat(dto.isScraped()).isEqualTo(dto.debateId().equals(mockDebate.getId()))
                ); // (2) 스크랩 여부 검증
        verify(scrapService, times(1)).getDebateScrap(mockUser); // (3) 호출 검증
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

    @Test
    @DisplayName("스크랩한 논쟁 목록 조회 - 기본 페이지네이션")
    void getScrapedDebates_normal() {
        // Given
        when(scrapService.getPaginatedScraps(mockUser, TargetType.DEBATE, null, 3))
                .thenReturn(List.of(scrap1, scrap2, scrap3));

        when(debateService.findDebateById(100L)).thenReturn(mockDebate1);
        when(debateService.findDebateById(200L)).thenReturn(mockDebate2);

        // 투표 통계 실제 계산 로직 사용 (모킹 제거)
        when(voteRepository.countByDebate(mockDebate1)).thenReturn(7);
        when(voteRepository.countByDebateAndLeftTrue(mockDebate1)).thenReturn(4);
        when(voteRepository.countByDebate(mockDebate2)).thenReturn(5);
        when(voteRepository.countByDebateAndLeftTrue(mockDebate2)).thenReturn(3);

        // When
        MyScrapedDebatesResponse response = voteService.getScrapedDebates(mockUser, null, 2);

        // Then
        assertThat(response.scraps().get(0).leftCount()).isEqualTo(4); // 검증 추가
        assertThat(response.scraps().get(1).leftCount()).isEqualTo(3);
    }

    @Test
    @DisplayName("스크랩 목록 조회 - 마지막 페이지")
    void getScrapedDebates_lastPage() {
        // Given
        when(scrapService.getPaginatedScraps(mockUser, TargetType.DEBATE, 3L, 3))
                .thenReturn(List.of(scrap1, scrap2));

        when(debateService.findDebateById(100L)).thenReturn(mockDebate1);
        when(debateService.findDebateById(200L)).thenReturn(mockDebate2);

        when(voteRepository.countByDebate(any())).thenReturn(5);
        when(voteRepository.countByDebateAndLeftTrue(any())).thenReturn(3);

        // When
        MyScrapedDebatesResponse response = voteService.getScrapedDebates(mockUser, 3L, 2);

        // Then
        assertThat(response.scraps()).hasSize(2);
        assertThat(response.nextCursorId()).isNull();
    }

    @Test
    @DisplayName("스크랩 목록 조회 - 데이터 없는 경우")
    void getScrapedDebates_empty() {
        // Given
        when(scrapService.getPaginatedScraps(mockUser, TargetType.DEBATE, null, 3))
                .thenReturn(List.of());

        // When
        MyScrapedDebatesResponse response = voteService.getScrapedDebates(mockUser, null, 2);

        // Then
        assertThat(response.scraps()).isEmpty();
        assertThat(response.nextCursorId()).isNull();
    }

}