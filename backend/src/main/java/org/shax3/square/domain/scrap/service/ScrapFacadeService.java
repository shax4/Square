package org.shax3.square.domain.scrap.service;

import lombok.RequiredArgsConstructor;
import org.shax3.square.common.model.TargetType;
import org.shax3.square.domain.scrap.dto.request.CreateScrapRequest;
import org.shax3.square.domain.user.model.User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

    public boolean isScrapExist(User user, Long targetId, TargetType targetType) {
        return scrapService.isTargetScraped(user, targetId, targetType);
    }

}
