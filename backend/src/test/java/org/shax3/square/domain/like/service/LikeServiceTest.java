package org.shax3.square.domain.like.service;

import static org.assertj.core.api.Assertions.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
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

@ExtendWith(MockitoExtension.class)
class LikeServiceTest {

	@Mock
	private LikeRepository likeRepository;
	@Mock
	private OpinionService opinionService;
	@Mock
	private OpinionCommentService opinionCommentService;
	@Mock
	private ProposalService proposalService;

	@InjectMocks
	private LikeService likeService;

	private User user;

	@BeforeEach
	void setUp() {
		user = User.builder()
			.nickname("TestUser")
			.build();
	}

	@Test
	@DisplayName("좋아요 생성 - 좋아요가 존재하지 않을 때")
	void like_create() {
		// Given
		Long targetId = 100L;
		TargetType targetType = TargetType.OPINION;
		LikeRequest request = new LikeRequest(targetId, targetType);

		when(opinionService.isOpinionExists(targetId)).thenReturn(true);
		when(likeRepository.findByUserAndTargetIdAndTargetType(user, targetId, targetType))
			.thenReturn(Optional.empty());

		// When
		likeService.like(user, request);

		// Then
		verify(likeRepository).save(argThat(like ->
			like.getUser().equals(user)
				&& like.getTargetId().equals(targetId)
				&& like.getTargetType() == targetType
				&& like.isLike()
		));
	}

	@Test
	@DisplayName("좋아요 토글 - 좋아요가 이미 존재할 때")
	void like_cancel() {
		// Given
		Long targetId = 200L;
		TargetType targetType = TargetType.OPINION;

		Like existingLike = Like.builder()
			.user(user)
			.targetId(targetId)
			.targetType(targetType)
			.build();

		LikeRequest request = new LikeRequest(targetId, targetType);

		when(opinionService.isOpinionExists(targetId)).thenReturn(true);
		when(likeRepository.findByUserAndTargetIdAndTargetType(user, targetId, targetType))
			.thenReturn(Optional.of(existingLike));

		// When
		likeService.like(user, request);

		// Then
		assertThat(existingLike.isLike()).isFalse();
		verify(likeRepository, never()).save(any(Like.class));
	}

	@Test
	@DisplayName("예외 - 존재하지 않은 타겟에 좋아요 생성")
	void like_create_notExistsTarget() {
		// Given
		Long targetId = 300L;
		TargetType targetType = TargetType.OPINION;
		LikeRequest request = new LikeRequest(targetId, targetType);

		when(opinionService.isOpinionExists(targetId)).thenReturn(false);

		// When & Then
		assertThatThrownBy(() -> likeService.like(user, request))
			.isInstanceOf(CustomException.class)
			.hasMessage(ExceptionCode.NOT_FOUND.getMessage());
	}

}