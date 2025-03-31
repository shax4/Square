package org.shax3.square.domain.opinion.service;

import lombok.RequiredArgsConstructor;

import org.shax3.square.common.model.TargetType;
import org.shax3.square.domain.debate.model.Debate;
import org.shax3.square.domain.debate.service.DebateService;
import org.shax3.square.domain.like.service.LikeService;
import org.shax3.square.domain.opinion.dto.request.CreateOpinionRequest;
import org.shax3.square.domain.opinion.dto.request.UpdateOpinionRequest;
import org.shax3.square.domain.opinion.dto.response.MyOpinionResponse;
import org.shax3.square.domain.opinion.model.Opinion;
import org.shax3.square.domain.opinion.repository.OpinionRepository;
import org.shax3.square.domain.s3.service.S3Service;
import org.shax3.square.domain.user.model.User;
import org.shax3.square.exception.CustomException;
import org.shax3.square.exception.ExceptionCode;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class OpinionService {
    private final OpinionRepository opinionRepository;
    private final DebateService debateService;
    private final LikeService likeService;

    @Transactional
    public void createOpinion(User user, CreateOpinionRequest request) {
        Debate debate = debateService.findDebateById(request.debateId());

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

    public void validateOpinionExists(Long opinionId) {
        if (!opinionRepository.existsById(opinionId)) {
            throw new CustomException(ExceptionCode.OPINION_NOT_FOUND);
        }
    }

    @Transactional(readOnly = true)
    public MyOpinionResponse getMyOpinions(User user, Long nextCursorId, int limit) {
        List<Opinion> opinions = opinionRepository.findMyOpinions(user, nextCursorId, limit + 1);
        boolean hasNext = opinions.size() > limit;

        if (hasNext) {
            opinions = opinions.subList(0, limit);
        }

        List<Long> opinionIds = opinions.stream()
            .map(Opinion::getId)
            .toList();

        Set<Long> likedOpinionIds = likeService.getLikedTargetIds(user, TargetType.OPINION, opinionIds);

        return MyOpinionResponse.of(opinions, likedOpinionIds);
    }

    public void increaseLikeCount(Long targetId, int countDiff) {
        Opinion opinion = getOpinion(targetId);
        opinion.increaseLikeCount(countDiff);
    }
}
