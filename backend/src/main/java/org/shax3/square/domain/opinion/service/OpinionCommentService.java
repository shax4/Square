package org.shax3.square.domain.opinion.service;

import lombok.RequiredArgsConstructor;
import org.shax3.square.domain.opinion.dto.response.CommentResponse;
import org.shax3.square.domain.opinion.model.OpinionComment;
import org.shax3.square.domain.opinion.repository.OpinionCommentRepository;
import org.shax3.square.domain.s3.service.S3Service;
import org.shax3.square.domain.user.model.User;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OpinionCommentService {
    private final OpinionCommentRepository opinionCommentRepository;
    private final S3Service s3Service;

    public List<CommentResponse> getOpinionComments(User user, Long opinionId) {
        List<OpinionComment> comments = opinionCommentRepository.findByOpinionIdAndValidTrue(opinionId);

        return comments.stream()
                .map(comment -> CommentResponse.of(
                        comment,
                        s3Service.generatePresignedGetUrl(comment.getUser().getS3Key())
                ))
                .toList();
    }
}
