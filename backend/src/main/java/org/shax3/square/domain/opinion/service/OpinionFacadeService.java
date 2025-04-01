package org.shax3.square.domain.opinion.service;

import lombok.RequiredArgsConstructor;

import org.shax3.square.common.model.TargetType;
import org.shax3.square.domain.like.service.LikeService;
import org.shax3.square.domain.opinion.dto.request.CreateOpinionCommentRequest;
import org.shax3.square.domain.opinion.dto.response.CommentResponse;
import org.shax3.square.domain.opinion.dto.response.CreateOpinionCommentResponse;
import org.shax3.square.domain.opinion.dto.response.MyOpinionResponse;
import org.shax3.square.domain.opinion.dto.response.OpinionDetailsResponse;
import org.shax3.square.domain.opinion.model.Opinion;
import org.shax3.square.domain.opinion.model.OpinionComment;
import org.shax3.square.domain.s3.service.S3Service;
import org.shax3.square.domain.user.model.User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;

@RequiredArgsConstructor
@Service
public class OpinionFacadeService {
    private final OpinionService opinionService;
    private final OpinionCommentService opinionCommentService;
    private final S3Service s3Service;
    private final LikeService likeService;

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
        List<OpinionComment> comments = opinionCommentService.getOpinionComments(opinionId);

        // 좋아요 여부 판단
        boolean isLiked = likeService.getLikedTargetIds(user, TargetType.OPINION, List.of(opinionId))
            .contains(opinionId);

        List<Long> commentIds = comments.stream()
            .map(OpinionComment::getId)
            .toList();

        Set<Long> likedCommentIds = likeService.getLikedTargetIds(user, TargetType.OPINION_COMMENT, commentIds);

        List<CommentResponse> commentResponses = comments.stream()
            .map(comment -> CommentResponse.of(
                comment,
                s3Service.generatePresignedGetUrl(comment.getUser().getS3Key()),
                likedCommentIds.contains(comment.getId())
            ))
            .toList();

        String profileUrl = s3Service.generatePresignedGetUrl(user.getS3Key());

        return OpinionDetailsResponse.of(opinion, commentResponses, profileUrl,isLiked);
    }

    @Transactional(readOnly = true)
    public MyOpinionResponse getMyOpinions(User user, Long nextCursorId, int limit) {
        List<Opinion> opinions = opinionService.getMyOpinions(user, nextCursorId, limit);

        List<Long> opinionIds = opinions.stream()
            .map(Opinion::getId)
            .toList();

        Set<Long> likedOpinionIds = likeService.getLikedTargetIds(user, TargetType.OPINION, opinionIds);

        return MyOpinionResponse.of(opinions, likedOpinionIds);
    }
}

