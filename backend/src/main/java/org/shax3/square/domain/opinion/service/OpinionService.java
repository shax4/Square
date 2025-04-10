package org.shax3.square.domain.opinion.service;

import lombok.RequiredArgsConstructor;
import org.shax3.square.domain.debate.model.Debate;
import org.shax3.square.domain.opinion.dto.request.CreateOpinionRequest;
import org.shax3.square.domain.opinion.dto.request.UpdateOpinionRequest;
import org.shax3.square.domain.opinion.model.Opinion;
import org.shax3.square.domain.opinion.repository.OpinionRepository;
import org.shax3.square.domain.user.model.User;
import org.shax3.square.exception.CustomException;
import org.shax3.square.exception.ExceptionCode;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OpinionService {
    private final OpinionRepository opinionRepository;

    @Transactional
    public void createOpinion(User user, CreateOpinionRequest request, Debate debate) {
        Opinion opinion = request.to(user, debate);
        opinionRepository.save(opinion);
    }

    @Transactional
    public void updateOpinion(UpdateOpinionRequest request, User user, Long opinionId) {
        Opinion opinion = getOpinion(opinionId);

        if (!opinion.getUser().getId().equals(user.getId())) {
            throw new CustomException(ExceptionCode.NOT_AUTHOR);
        }

        opinion.updateContent(request.content());
    }


    @Transactional
    public void deleteOpinion(User user, Long opinionId) {
        Opinion opinion = getOpinion(opinionId);

        if (!opinion.getUser().getId().equals(user.getId())) {
            throw new CustomException(ExceptionCode.NOT_AUTHOR);
        }

        opinion.softDelete();
    }

    public Opinion getOpinion(Long opinionId) {
        return opinionRepository.findById(opinionId)
                .orElseThrow(() -> new CustomException(ExceptionCode.OPINION_NOT_FOUND));
    }

    public void validateExists(Long opinionId) {
        if (!opinionRepository.existsById(opinionId)) {
            throw new CustomException(ExceptionCode.OPINION_NOT_FOUND);
        }
    }

    @Transactional(readOnly = true)
    public List<Opinion> getMyOpinions(User user, Long nextCursorId, int limit) {
        List<Opinion> opinions = opinionRepository.findMyOpinions(user, nextCursorId, limit + 1);

        if (opinions.size() > limit) {
            return opinions.subList(0, limit);
        }

        return opinions;
    }

    public void increaseLikeCount(Long targetId, int countDiff) {
        Opinion opinion = getOpinion(targetId);
        opinion.increaseLikeCount(countDiff);
    }


    public List<Opinion> findOpinionsByLikes(Long debateId, boolean isLeft, Long nextCursorId, Integer nextCursorLikes, int limit) {
        return opinionRepository.findOpinionsByLikes(debateId, isLeft, nextCursorId, nextCursorLikes, limit);
    }

    public List<Opinion> findOpinionsByComments(Long debateId, boolean isLeft, Long nextCursorId, Integer nextCursorComments, int limit) {
        return opinionRepository.findOpinionsByComments(debateId, isLeft, nextCursorId, nextCursorComments, limit);
    }

    public List<Opinion> findOpinionsByLatest(Long debateId, boolean isLeft, Long nextCursorId, int limit) {
        return opinionRepository.findOpinionsByLatest(debateId, isLeft, nextCursorId, limit);
    }

    public Long findDebateIdByOpinionId(Long opinionId) {
        return opinionRepository.findById(opinionId)
                .map(opinion -> opinion.getDebate().getId())
                .orElseThrow(() -> new CustomException(ExceptionCode.DEBATE_NOT_FOUND));
    }

}
