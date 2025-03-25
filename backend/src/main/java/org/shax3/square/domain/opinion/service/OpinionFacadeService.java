package org.shax3.square.domain.opinion.service;

import lombok.RequiredArgsConstructor;
import org.shax3.square.domain.opinion.dto.request.CreateOpinionCommentRequest;
import org.shax3.square.domain.opinion.dto.response.CommentResponse;
import org.shax3.square.domain.opinion.dto.response.CreateOpinionCommentResponse;
import org.shax3.square.domain.opinion.dto.response.OpinionDetailsResponse;
import org.shax3.square.domain.opinion.model.Opinion;
import org.shax3.square.domain.opinion.model.OpinionComment;
import org.shax3.square.domain.s3.service.S3Service;
import org.shax3.square.domain.user.model.User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@RequiredArgsConstructor
@Service
public class OpinionFacadeService {
    private final OpinionService opinionService;
    private final OpinionCommentService commentService;
    private final S3Service s3Service;

    @Transactional
    public CreateOpinionCommentResponse createOpinionComment(User user, CreateOpinionCommentRequest request) {
        Opinion opinion = opinionService.getOpinion(request.opinionId());
        String profileUrl = s3Service.generatePresignedGetUrl(user.getS3Key());

        OpinionComment newComment = commentService.createComment(request, opinion, user);
        return CreateOpinionCommentResponse.of(newComment, profileUrl);
    }

    @Transactional(readOnly = true)
    public OpinionDetailsResponse getOpinionDetails(User user, Long opinionId) {
        Opinion opinion = opinionService.getOpinion(opinionId);
        List<CommentResponse> comments = commentService.getOpinionComments(user, opinionId);
        String profileUrl = s3Service.generatePresignedGetUrl(user.getS3Key());

        return OpinionDetailsResponse.of(opinion, comments, profileUrl);
    }
}

