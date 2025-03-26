package org.shax3.square.domain.like.service;

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
import org.shax3.square.domain.like.repository.LikeRepository;
import org.shax3.square.domain.user.model.User;
import org.springframework.test.util.ReflectionTestUtils;

@ExtendWith(MockitoExtension.class)
class LikeServiceTest {

	@Mock
	private LikeRepository likeRepository;

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
	void like_Create() {
		// Given
		LikeRequest request = new LikeRequest(1L, TargetType.POST);

		when(likeRepository.findByUserAndTargetIdAndTargetType(user, 1L, TargetType.POST))
			.thenReturn(Optional.empty());

		// When
		likeService.like(user, request);

		// Then

	}
}