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
import java.util.Map;
import java.util.stream.Collectors;

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

    public List<Long> getScrapIds(User user, TargetType targetType) {
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

    public Map<Long, Boolean> getScrapMap(User user, List<Long> debateIds) {
        List<Long> allScrapedIds = getScrapIds(user, TargetType.DEBATE);
        return debateIds.stream()
                .filter(allScrapedIds::contains)
                .collect(Collectors.toMap(id -> id, id -> true));
    }
}
