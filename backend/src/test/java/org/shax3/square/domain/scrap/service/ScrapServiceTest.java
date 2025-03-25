package org.shax3.square.domain.scrap.service;

import org.shax3.square.domain.debate.service.DebateService;
import org.shax3.square.domain.scrap.dto.request.CreateScrapRequest;
import org.shax3.square.domain.scrap.model.Scrap;
import org.shax3.square.domain.scrap.model.TargetType;
import org.shax3.square.domain.scrap.repository.ScrapRepository;
import org.shax3.square.domain.user.model.User;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.Collections;
import java.util.Optional;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("ScrapService 테스트")
public class ScrapServiceTest {

    @Mock
    private ScrapRepository scrapRepository;

    @Mock
    private DebateService debateService;

    @InjectMocks
    private ScrapService scrapService;

    @Test
    @DisplayName("createScrap - 대상이 Debate인 경우, debateService.findDebateById 호출 및 Scrap 저장 확인")
    public void testCreateScrap_whenTargetIsDebate() {
        // given
        User user = User.builder().build();
        Long targetId = 1L;
        CreateScrapRequest request = mock(CreateScrapRequest.class);
        Scrap scrap = mock(Scrap.class);

        when(request.targetType()).thenReturn(TargetType.DEBATE);
        when(request.targetId()).thenReturn(targetId);
        when(request.to(user)).thenReturn(scrap);

        // when
        scrapService.createScrap(user, request);

        // then
        verify(debateService, times(1)).findDebateById(targetId);
        verify(scrapRepository, times(1)).save(scrap);
    }

//    @Test
//    @DisplayName("createScrap - 대상이 Post인 경우, debateService.findDebateById 미호출 및 Scrap 저장 확인")
//    public void testCreateScrap_whenTargetIsPost() {
//        // given
//        User user = User.builder().build();
//        Long targetId = 2L;
//        CreateScrapRequest request = mock(CreateScrapRequest.class);
//        Scrap scrap = mock(Scrap.class);
//
//        when(request.targetType()).thenReturn(TargetType.POST);
//        when(request.targetId()).thenReturn(targetId);
//        when(request.to(user)).thenReturn(scrap);
//
//        // when
//        scrapService.createScrap(user, request);
//
//        // then: POST의 경우 debateService.findDebateById는 호출되지 않아야 합니다.
//        verify(debateService, never()).findDebateById(anyLong());
//        verify(scrapRepository, times(1)).save(scrap);
//    }

    @Test
    @DisplayName("deleteScrap - Scrap 삭제 메소드 호출 확인")
    public void testDeleteScrap() {
        // given
        User user = User.builder().build();
        Long targetId = 3L;
        TargetType targetType = TargetType.DEBATE; // 혹은 POST

        // when
        scrapService.deleteScrap(user, targetId, targetType);

        // then
        verify(scrapRepository, times(1))
                .deleteByUserAndTargetIdAndTargetType(user, targetId, targetType);
    }

    @Test
    @DisplayName("getDebateScrap - 사용자 Debate Scrap 조회 시 올바른 targetId 리스트 반환 확인")
    public void testGetDebateScrap() {
        // given
        User user = User.builder().build();
        Scrap scrap1 = mock(Scrap.class);
        Scrap scrap2 = mock(Scrap.class);
        when(scrap1.getTargetId()).thenReturn(1L);
        when(scrap2.getTargetId()).thenReturn(2L);
        when(scrapRepository.findByUserAndTargetType(user, TargetType.DEBATE))
                .thenReturn(Arrays.asList(scrap1, scrap2));

        // when
        List<Long> result = scrapService.getDebateScrap(user);

        // then
        assertThat(result).containsExactly(1L, 2L);
    }

    @Test
    @DisplayName("getPostScrap - 사용자 Post Scrap 조회 시 올바른 targetId 리스트 반환 확인")
    public void testGetPostScrap() {
        // given
        User user = User.builder().build();
        Scrap scrap = mock(Scrap.class);
        when(scrap.getTargetId()).thenReturn(5L);
        when(scrapRepository.findByUserAndTargetType(user, TargetType.POST))
                .thenReturn(Collections.singletonList(scrap));

        // when
        List<Long> result = scrapService.getPostScrap(user);

        // then
        assertThat(result).containsExactly(5L);
    }

    @Test
    @DisplayName("isDebateScraped - 대상 Debate Scrap이 존재하는 경우 true 반환 확인")
    public void testIsDebateScraped_whenPresent() {
        // given
        User user = User.builder().build();
        Long debateId = 10L;
        Scrap scrap = mock(Scrap.class);
        when(scrapRepository.findByUserAndTargetIdAndTargetType(user, debateId, TargetType.DEBATE))
                .thenReturn(Optional.of(scrap));

        // when
        boolean result = scrapService.isDebateScraped(user, debateId);

        // then
        assertThat(result).isTrue();
    }

    @Test
    @DisplayName("isDebateScraped - 대상 Debate Scrap이 존재하지 않는 경우 false 반환 확인")
    public void testIsDebateScraped_whenNotPresent() {
        // given
        User user = User.builder().build();
        Long debateId = 10L;
        when(scrapRepository.findByUserAndTargetIdAndTargetType(user, debateId, TargetType.DEBATE))
                .thenReturn(Optional.empty());

        // when
        boolean result = scrapService.isDebateScraped(user, debateId);

        // then
        assertThat(result).isFalse();
    }

    @Test
    @DisplayName("isPostScraped - 대상 Post Scrap이 존재하는 경우 true 반환 확인")
    public void testIsPostScraped_whenPresent() {
        // given
        User user = User.builder().build();
        Long postId = 20L;
        Scrap scrap = mock(Scrap.class);
        when(scrapRepository.findByUserAndTargetIdAndTargetType(user, postId, TargetType.POST))
                .thenReturn(Optional.of(scrap));

        // when
        boolean result = scrapService.isPostScraped(user, postId);

        // then
        assertThat(result).isTrue();
    }

    @Test
    @DisplayName("isPostScraped - 대상 Post Scrap이 존재하지 않는 경우 false 반환 확인")
    public void testIsPostScraped_whenNotPresent() {
        // given
        User user = User.builder().build();
        Long postId = 20L;
        when(scrapRepository.findByUserAndTargetIdAndTargetType(user, postId, TargetType.POST))
                .thenReturn(Optional.empty());

        // when
        boolean result = scrapService.isPostScraped(user, postId);

        // then
        assertThat(result).isFalse();
    }
}
