package org.shax3.square.domain.scrap.service;

import lombok.RequiredArgsConstructor;
import org.shax3.square.common.model.TargetType;
import org.shax3.square.domain.debate.service.DebateService;
import org.shax3.square.domain.scrap.dto.request.CreateScrapRequest;
import org.shax3.square.domain.scrap.model.Scrap;
import org.shax3.square.domain.user.model.User;
import org.shax3.square.exception.CustomException;
import org.shax3.square.exception.ExceptionCode;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ScrapFacadeService {

    private final ScrapService scrapService;
    private final DebateService debateService;
//    private final PostService postService;

    @Transactional
    public void create(User user, CreateScrapRequest request) {
        switch (request.targetType()) {
            case DEBATE -> debateService.findDebateById(request.targetId());
            //TODO: post 개발 후 구현
//            case POST -> postService.findPostById(request.targetId());
            default -> throw new CustomException(ExceptionCode.NOT_FOUND);
        }

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

}
