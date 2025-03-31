package org.shax3.square.domain.like.handler;

import org.shax3.square.common.model.TargetType;
import org.shax3.square.domain.opinion.service.OpinionCommentService;
import org.shax3.square.domain.opinion.service.OpinionService;
import org.shax3.square.domain.post.service.PostService;
import org.shax3.square.domain.proposal.service.ProposalService;
import org.shax3.square.exception.CustomException;
import org.shax3.square.exception.ExceptionCode;
import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class LikeTargetHandler {

	private final OpinionService opinionService;
	private final ProposalService proposalService;
	private final OpinionCommentService opinionCommentService;
	private final PostService postService;

	public void validateTargetExists(Long targetId, TargetType targetType) {
		switch (targetType) {
			case OPINION -> opinionService.validateOpinionExists(targetId);
			case OPINION_COMMENT -> opinionCommentService.validateOpinionCommentExists(targetId);
			case PROPOSAL -> proposalService.validateProposalExists(targetId);
			case POST -> postService.validatePostExists(targetId);
			//TODO : POST_COMMENT 구현 필요
			default -> throw new CustomException(ExceptionCode.INVALID_TARGET_TYPE);
		}
	}

	public void updateTargetLikeCount(TargetType targetType, Long targetId, int diff) {
		switch (targetType) {
			case OPINION -> opinionService.increaseLikeCount(targetId, diff);
			case PROPOSAL -> proposalService.increaseLikeCount(targetId, diff);
			case OPINION_COMMENT -> opinionCommentService.increaseLikeCount(targetId, diff);
			// TODO: POST, POST_COMMENT 등도 나중에 추가
			default -> throw new CustomException(ExceptionCode.INVALID_TARGET_TYPE);
		}
	}
}
