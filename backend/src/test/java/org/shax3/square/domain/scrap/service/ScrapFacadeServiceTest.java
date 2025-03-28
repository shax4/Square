package org.shax3.square.domain.scrap.service;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.shax3.square.common.model.TargetType;
import org.shax3.square.domain.debate.service.DebateService;
import org.shax3.square.domain.scrap.dto.request.CreateScrapRequest;
import org.shax3.square.domain.user.model.User;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ScrapFacadeServiceTest {

    @Mock
    private ScrapService scrapService;
    @Mock
    private DebateService debateService;

    @InjectMocks
    private ScrapFacadeService scrapFacadeService;

    @Test
    @DisplayName("스크랩 생성 테스트 (DEBATE)")
    void testCreateScrapDebate() {
        User user = User.builder().build();
        CreateScrapRequest request = mock(CreateScrapRequest.class);

        when(request.targetType()).thenReturn(TargetType.DEBATE);
        when(request.targetId()).thenReturn(1L);

        // When
        scrapFacadeService.create(user, request);

        verify(debateService).findDebateById(1L);
        verify(scrapService).createScrap(user, request);
    }

    @Test
    @DisplayName("스크랩 삭제 테스트")
    void testDeleteScrap() {
        User user = User.builder().build();
        scrapFacadeService.delete(user, 10L, TargetType.DEBATE);
        verify(scrapService).deleteScrap(user, 10L, TargetType.DEBATE);
    }

    @Test
    @DisplayName("스크랩 존재 여부 확인 테스트")
    void testIsScrapExist() {
        User user = User.builder().build();
        when(scrapService.isTargetScraped(user, 1L, TargetType.DEBATE)).thenReturn(true);

        boolean result = scrapFacadeService.isScrapExist(user, 1L, TargetType.DEBATE);
        assertThat(result).isTrue();
    }

    @Test
    @DisplayName("스크랩 ID 목록 조회 테스트")
    void testGetScrapIds() {
        User user = User.builder().build();
        when(scrapService.getScrapIds(user, TargetType.DEBATE)).thenReturn(List.of(1L, 2L));
        List<Long> ids = scrapFacadeService.getScrapIds(user, TargetType.DEBATE);
        assertThat(ids).containsExactly(1L, 2L);
    }
}
