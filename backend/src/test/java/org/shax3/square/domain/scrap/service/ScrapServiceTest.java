package org.shax3.square.domain.scrap.service;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.shax3.square.common.model.TargetType;
import org.shax3.square.domain.scrap.dto.request.CreateScrapRequest;
import org.shax3.square.domain.scrap.model.Scrap;
import org.shax3.square.domain.scrap.repository.ScrapRepository;
import org.shax3.square.domain.user.model.User;
import org.shax3.square.exception.CustomException;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("ScrapService 단위 테스트")
class ScrapServiceTest {

    @Mock
    private ScrapRepository scrapRepository;

    @InjectMocks
    private ScrapService scrapService;

    @Test
    @DisplayName("스크랩 생성 성공")
    void createScrap_success() {
        // given
        User user = User.builder().build();
        CreateScrapRequest request = mock(CreateScrapRequest.class);
        Scrap scrap = mock(Scrap.class);

        when(request.targetType()).thenReturn(TargetType.DEBATE);
        when(request.targetId()).thenReturn(1L);
        when(request.to(user)).thenReturn(scrap);
        when(scrapRepository.existsByUserAndTargetIdAndTargetType(user, 1L, TargetType.DEBATE)).thenReturn(false);

        // when
        scrapService.createScrap(user, request);

        // then
        verify(scrapRepository).save(scrap);
    }

    @Test
    @DisplayName("스크랩 생성 실패 - 이미 존재할 때")
    void createScrap_duplicate() {
        // given
        User user = User.builder().build();
        CreateScrapRequest request = mock(CreateScrapRequest.class);

        when(request.targetType()).thenReturn(TargetType.POST);
        when(request.targetId()).thenReturn(2L);
        when(scrapRepository.existsByUserAndTargetIdAndTargetType(user, 2L, TargetType.POST)).thenReturn(true);

        // when & then
        assertThatThrownBy(() -> scrapService.createScrap(user, request))
                .isInstanceOf(CustomException.class);

        verify(scrapRepository, never()).save(any());
    }

    @Test
    @DisplayName("스크랩 삭제")
    void deleteScrap_success() {
        User user = User.builder().build();
        scrapService.deleteScrap(user, 1L, TargetType.DEBATE);
        verify(scrapRepository).deleteByUserAndTargetIdAndTargetType(user, 1L, TargetType.DEBATE);
    }

    @Test
    @DisplayName("스크랩 목록 조회")
    void getScrapIds_success() {
        User user = User.builder().build();
        Scrap scrap1 = Scrap.builder().targetId(1L).build();
        Scrap scrap2 = Scrap.builder().targetId(2L).build();

        when(scrapRepository.findByUserAndTargetType(user, TargetType.DEBATE))
                .thenReturn(List.of(scrap1, scrap2));

        List<Long> ids = scrapService.getScrapIds(user, TargetType.DEBATE);

        assertThat(ids).containsExactly(1L, 2L);
    }

    @Test
    @DisplayName("스크랩 존재 여부 확인")
    void isScrapExist() {
        User user = User.builder().build();

        when(scrapRepository.existsByUserAndTargetIdAndTargetType(user, 1L, TargetType.DEBATE)).thenReturn(true);

        boolean exists = scrapService.isTargetScraped(user, 1L, TargetType.DEBATE);
        assertThat(exists).isTrue();
    }

    @Test
    @DisplayName("페이지네이션된 스크랩 조회")
    void getPaginatedScraps() {
        User user = User.builder().build();
        Scrap scrap = Scrap.builder().targetId(3L).build();

        when(scrapRepository.findScrapsByUserAndType(user, TargetType.DEBATE, null, 5))
                .thenReturn(List.of(scrap));

        List<Scrap> result = scrapService.getPaginatedScraps(user, TargetType.DEBATE, null, 5);

        assertThat(result).hasSize(1);
    }
}
