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
    private final OpinionCommentService opinionCommentService;
    private final S3Service s3Service;

    /* 답글을 생성하기 위한 메서드
    - 답글에 opinionId가 필요하기 때문에
      이 opinionService와 opinionCommentService 두개를 참조해야하는 함
     */
    @Transactional
    public CreateOpinionCommentResponse createOpinionComment(User user, CreateOpinionCommentRequest request) {
        Opinion opinion = opinionService.getOpinion(request.opinionId());
        String profileUrl = s3Service.generatePresignedGetUrl(user.getS3Key());

        OpinionComment newComment = opinionCommentService.createComment(request, opinion, user);
        return CreateOpinionCommentResponse.of(newComment, profileUrl);
    }

    /*
        의견정보와 그 의견에 달린 답글 모두 조회해야함
     */
    @Transactional(readOnly = true)
    public OpinionDetailsResponse getOpinionDetails(User user, Long opinionId) {
        Opinion opinion = opinionService.getOpinion(opinionId);
        List<CommentResponse> comments = opinionCommentService.getOpinionComments(user, opinionId);
        String profileUrl = s3Service.generatePresignedGetUrl(user.getS3Key());
        boolean isLiked = false; // TODO 추가구현 필요;
        return OpinionDetailsResponse.of(opinion, comments, profileUrl,isLiked);
    }
}

