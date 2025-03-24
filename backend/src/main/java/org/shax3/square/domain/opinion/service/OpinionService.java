package org.shax3.square.domain.opinion.service;

import lombok.RequiredArgsConstructor;
import org.shax3.square.domain.debate.model.Debate;
import org.shax3.square.domain.debate.service.DebateService;
import org.shax3.square.domain.opinion.dto.CreateOpinionRequest;
import org.shax3.square.domain.opinion.model.Opinion;
import org.shax3.square.domain.opinion.repository.OpinionRepository;
import org.shax3.square.domain.user.model.User;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class OpinionService {
    private final OpinionRepository opinionRepository;
    private final DebateService debateService;

    public void createOpinion(User user, CreateOpinionRequest request) {
        Debate debate = debateService.findDebateById(request.debateId());

        Opinion opinion = request.to(user,debate);

        opinionRepository.save(opinion);
    }
}
