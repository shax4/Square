package org.shax3.square.domain.like.service;

import org.shax3.square.common.model.TargetType;
import org.shax3.square.domain.like.dto.LikeRequest;
import org.shax3.square.domain.like.model.Like;
import org.shax3.square.domain.like.repository.LikeRepository;
import org.shax3.square.domain.opinion.service.OpinionCommentService;
import org.shax3.square.domain.opinion.service.OpinionService;
import org.shax3.square.domain.proposal.service.ProposalService;
import org.shax3.square.domain.user.model.User;
import org.shax3.square.exception.CustomException;
import org.shax3.square.exception.ExceptionCode;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class LikeService {

	private final LikeRepository likeRepository;
	private final OpinionService opinionService;
	private final OpinionCommentService opinionCommentService;
	private final ProposalService proposalService;

	@Transactional
	public void like(User user, LikeRequest likeRequest) {

		Long targetId = likeRequest.targetId();
		TargetType targetType = likeRequest.targetType();

		if (!isPresent(targetId, targetType)) {
			throw new CustomException(ExceptionCode.NOT_FOUND);
		}

		likeRepository.findByUserAndTargetIdAndTargetType(user, targetId, targetType)
			.ifPresentOrElse(
				Like::toggleLike,
				() -> likeRepository.save(likeRequest.to(user)));
	}

	public boolean isPresent(Long targetId, TargetType targetType) {
		return switch (targetType) {
			case OPINION -> opinionService.isOpinionExists(targetId);
			case OPINION_COMMENT -> opinionCommentService.isOpinionCommentExists(targetId);
			case PROPOSAL -> proposalService.isProposalExists(targetId);
			case POST -> false; // TODO: post 개발 후 구현
			case POST_COMMENT -> false;
			default -> throw new CustomException(ExceptionCode.INVALID_TARGET_TYPE);
		};
	}

}
