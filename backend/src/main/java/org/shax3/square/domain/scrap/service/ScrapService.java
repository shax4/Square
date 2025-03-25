package org.shax3.square.domain.scrap.service;

import lombok.RequiredArgsConstructor;
import org.shax3.square.domain.debate.service.DebateService;
import org.shax3.square.domain.scrap.dto.request.CreateScrapRequest;
import org.shax3.square.domain.scrap.model.Scrap;
import org.shax3.square.domain.scrap.model.TargetType;
import org.shax3.square.domain.scrap.repository.ScrapRepository;
import org.shax3.square.domain.user.model.User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ScrapService {

    private final ScrapRepository scrapRepository;
    private final DebateService debateService;

    @Transactional
    public void createScrap(User user, CreateScrapRequest createScrapRequest) {
        findTarget(createScrapRequest);
        Scrap scrap = createScrapRequest.to(user);
        scrapRepository.save(scrap);
    }

    @Transactional
    public void deleteScrap(User user, Long targetId, TargetType targetType) {
        scrapRepository.deleteByUserIdAndTargetIdAndTargetType(user.getId(), targetId, targetType);
    }

    private void findTarget(CreateScrapRequest createScrapRequest) {
        TargetType targetType = createScrapRequest.targetType();
        if (targetType.equals(TargetType.DEBATE)) {
            debateService.findDebateById(createScrapRequest.targetId());
            return;
        }

        //TODO: 포스트 서비스에서 찾기
    }
}
