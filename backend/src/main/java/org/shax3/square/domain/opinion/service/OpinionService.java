package org.shax3.square.domain.opinion.service;

import lombok.RequiredArgsConstructor;
import org.shax3.square.domain.debate.model.Debate;
import org.shax3.square.domain.debate.service.DebateService;
import org.shax3.square.domain.opinion.dto.request.CreateOpinionRequest;
import org.shax3.square.domain.opinion.dto.response.CommentResponse;
import org.shax3.square.domain.opinion.dto.response.OpinionDetailsResponse;
import org.shax3.square.domain.opinion.model.Opinion;
import org.shax3.square.domain.opinion.repository.OpinionRepository;
import org.shax3.square.domain.s3.service.S3Service;
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
    private final DebateService debateService;
    private final OpinionCommentService opinionCommentService;
    private final S3Service s3Service;

    @Transactional
    public void createOpinion(User user, CreateOpinionRequest request) {
        Debate debate = debateService.findDebateById(request.debateId());

        Opinion opinion = request.to(user, debate);

        opinionRepository.save(opinion);
    }


    public OpinionDetailsResponse getOpinionDetails(User user, Long opinionId) {
        Opinion opinion = opinionRepository.findById(opinionId)
                .orElseThrow(() -> new CustomException(ExceptionCode.OPINION_NOTFOUND));

        List<CommentResponse> comments = opinionCommentService.getOpinionComments(user, opinionId);
        String opinionUserPresignedUrl = s3Service.generatePresignedGetUrl(opinion.getUser().getS3Key());

        return OpinionDetailsResponse.of(opinion, comments, opinionUserPresignedUrl);
    }
}
