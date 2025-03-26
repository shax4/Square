package org.shax3.square.domain.scrap.service;

import lombok.RequiredArgsConstructor;
import org.shax3.square.domain.debate.service.DebateService;
import org.shax3.square.domain.scrap.dto.request.CreateScrapRequest;
import org.shax3.square.domain.scrap.model.Scrap;
import org.shax3.square.common.model.TargetType;
import org.shax3.square.domain.scrap.repository.ScrapRepository;
import org.shax3.square.domain.user.model.User;
import org.shax3.square.exception.CustomException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import static org.shax3.square.common.model.TargetType.DEBATE;
import static org.shax3.square.common.model.TargetType.POST;
import static org.shax3.square.exception.ExceptionCode.SCRAP_ALREADY_EXISTS;

@Service
@RequiredArgsConstructor
public class ScrapService {

    private final ScrapRepository scrapRepository;
    private final DebateService debateService;

    @Transactional
    public void createScrap(User user, CreateScrapRequest createScrapRequest) {
        findTarget(createScrapRequest);
        Optional<Scrap> foundScrap = scrapRepository.findByUserAndTargetIdAndTargetType(
                user,
                createScrapRequest.targetId(),
                createScrapRequest.targetType()
        );
        if (foundScrap.isPresent()) {
            throw new CustomException(SCRAP_ALREADY_EXISTS);
        }

        Scrap scrap = createScrapRequest.to(user);
        scrapRepository.save(scrap);
    }

    @Transactional
    public void deleteScrap(User user, Long targetId, TargetType targetType) {
        scrapRepository.deleteByUserAndTargetIdAndTargetType(user, targetId, targetType);
    }

    private void findTarget(CreateScrapRequest createScrapRequest) {
        TargetType targetType = createScrapRequest.targetType();
        if (targetType.equals(DEBATE)) {
            debateService.findDebateById(createScrapRequest.targetId());
            return;
        }

        //TODO: 포스트 서비스에서 찾기
    }

    @Transactional(readOnly = true)
    public List<Long> getDebateScrap(User user) {
        return getScrap(user, DEBATE);
    }

    @Transactional(readOnly = true)
    public List<Long> getPostScrap(User user) {
        return getScrap(user, POST);
    }

    @Transactional(readOnly = true)
    public boolean isDebateScraped(User user, Long debateId) {
        return isTargetScraped(user, debateId, DEBATE);
    }

    @Transactional(readOnly = true)
    public boolean isPostScraped(User user, Long postId) {
        return isTargetScraped(user, postId, POST);
    }

    private List<Long> getScrap(User user, TargetType targetType) {
        List<Scrap> scraps = scrapRepository.findByUserAndTargetType(user, targetType);
        return scraps
                .stream()
                .map(Scrap::getTargetId)
                .collect(Collectors.toList());
    }

    private boolean isTargetScraped(User user, Long targetId, TargetType targetType) {
        Optional<Scrap> scrap = scrapRepository.findByUserAndTargetIdAndTargetType(user, targetId, targetType);
        return scrap.isPresent();
    }
}
