package org.shax3.square.domain.scrap.service;

import lombok.RequiredArgsConstructor;
import org.shax3.square.common.model.TargetType;
import org.shax3.square.domain.scrap.dto.request.CreateScrapRequest;
import org.shax3.square.domain.scrap.model.Scrap;
import org.shax3.square.domain.scrap.repository.ScrapRepository;
import org.shax3.square.domain.user.model.User;
import org.shax3.square.exception.CustomException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.shax3.square.common.model.TargetType.DEBATE;
import static org.shax3.square.common.model.TargetType.POST;
import static org.shax3.square.exception.ExceptionCode.SCRAP_ALREADY_EXISTS;

@Service
@RequiredArgsConstructor
public class ScrapService {

    private final ScrapRepository scrapRepository;

    @Transactional
    public void createScrap(User user, CreateScrapRequest request) {
        if (scrapRepository.existsByUserAndTargetIdAndTargetType(
                user,
                request.targetId(),
                request.targetType()
        )) {
            throw new CustomException(SCRAP_ALREADY_EXISTS);
        }

        Scrap scrap = request.to(user);
        scrapRepository.save(scrap);
    }

    @Transactional
    public void deleteScrap(User user, Long targetId, TargetType targetType) {
        scrapRepository.deleteByUserAndTargetIdAndTargetType(user, targetId, targetType);
    }

    public List<Long> getDebateScrap(User user) {
        return getScrap(user, DEBATE);
    }

    public List<Long> getPostScrap(User user) {
        return getScrap(user, POST);
    }

    public List<Long> getScrap(User user, TargetType targetType) {
        List<Scrap> scraps = scrapRepository.findByUserAndTargetType(user, targetType);
        return scraps
                .stream()
                .map(Scrap::getTargetId)
                .toList();
    }

    public boolean isTargetScraped(User user, Long targetId, TargetType targetType) {
        return scrapRepository.existsByUserAndTargetIdAndTargetType(user, targetId, targetType);
    }

    @Transactional(readOnly = true)
    public List<Scrap> getPaginatedScraps(User user, TargetType type, Long cursorId, int limit) {
        return scrapRepository.findScrapsByUserAndType(user, type, cursorId, limit);
    }
}
