package org.shax3.square.domain.scrap.service;

import lombok.RequiredArgsConstructor;
import org.shax3.square.common.model.TargetType;
import org.shax3.square.domain.scrap.dto.request.CreateScrapRequest;
import org.shax3.square.domain.scrap.model.Scrap;
import org.shax3.square.domain.user.model.User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ScrapFacadeService {

    private final ScrapService scrapService;

    @Transactional
    public void create(User user, CreateScrapRequest request) {
        scrapService.createScrap(user, request);
    }

    @Transactional
    public void delete(User user, Long targetId, TargetType targetType) {
        scrapService.deleteScrap(user, targetId, targetType);
    }

    public List<Scrap> getPaginatedDebateScraps(User user, Long nextCursorId, int limit) {
        return scrapService.getPaginatedScraps(user, TargetType.DEBATE, nextCursorId, limit + 1);
    }

    public boolean isScrapExist(User user, Long targetId, TargetType targetType) {
        return scrapService.isTargetScraped(user, targetId, targetType);
    }

    public List<Long> getScrapIds(User user, TargetType targetType) {
        return scrapService.getScrapIds(user, targetType);
    }

    public Map<Long, Boolean> getScrapMap(User user, List<Long> debateIds) {
        List<Long> allScrapedIds = getScrapIds(user, TargetType.DEBATE); // 또는 user 객체 그대로 넘기기
        return debateIds.stream()
                .filter(allScrapedIds::contains)
                .collect(Collectors.toMap(id -> id, id -> true));
    }


}
