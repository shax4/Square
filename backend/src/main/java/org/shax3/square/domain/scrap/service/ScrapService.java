package org.shax3.square.domain.scrap.service;

import lombok.RequiredArgsConstructor;
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

    @Transactional
    public void createScrap(User user, CreateScrapRequest createScrapRequest) {
        Scrap scrap = createScrapRequest.to(user);
        scrapRepository.save(scrap);
    }

    @Transactional
    public void deleteScrap(User user, Long targetId, TargetType targetType) {
//        Scrap scrap = scrapRepository.findByUserIdAndTargetId(user.getId(), targetId)
//                .orElseThrow(() -> new CustomException());
    }
}
