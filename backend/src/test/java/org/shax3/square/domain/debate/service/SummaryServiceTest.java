package org.shax3.square.domain.debate.service;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.shax3.square.domain.debate.dto.SummaryDto;
import org.shax3.square.domain.debate.dto.request.VoteRequest;
import org.shax3.square.domain.debate.model.Debate;
import org.shax3.square.domain.debate.model.Summary;
import org.shax3.square.domain.debate.repository.SummaryRepository;
import org.shax3.square.domain.user.model.User;
import org.springframework.test.util.ReflectionTestUtils;


import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SummaryServiceTest {

    @Mock
    private SummaryRepository summaryRepository;

    @InjectMocks
    private SummaryService summaryService;

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
    @DisplayName("요약 리스트를 정상적으로 반환한다")
    void testGetSummariesByDebateId() {
        List<Summary> summaries = List.of(
                Summary.builder()
                        .id(1L)
                        .content("요약1")
                        .left(true)
                        .debate(mockDebate)
                        .build(),
                Summary.builder()
                        .id(2L)
                        .content("요약2")
                        .left(false)
                        .debate(mockDebate)
                        .build()
        );

        when(summaryRepository.findByDebateId(mockDebate.getId())).thenReturn(summaries);

        // when
        List<SummaryDto> result = summaryService.getSummariesByDebateId(mockDebate.getId());

        // then
        assertThat(result).hasSize(2);
        assertThat(result.get(0).content()).isEqualTo("요약1");
        assertThat(result.get(1).isLeft()).isFalse();
    }
}
