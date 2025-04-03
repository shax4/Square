package org.shax3.square.domain.post.service;

import static org.assertj.core.api.Assertions.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.List;
import java.util.Map;
import java.util.Set;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.shax3.square.common.model.TargetType;
import org.shax3.square.domain.like.service.LikeService;
import org.shax3.square.domain.post.dto.response.MyPostResponse;
import org.shax3.square.domain.post.dto.response.PostListResponse;
import org.shax3.square.domain.post.model.Post;
import org.shax3.square.domain.s3.service.S3Service;
import org.shax3.square.domain.user.model.Type;
import org.shax3.square.domain.user.model.User;
import org.springframework.test.util.ReflectionTestUtils;

@ExtendWith(MockitoExtension.class)
class PostFacadeServiceTest {

	@Mock
	private PostQueryService postQueryService;

	@Mock
	private PostCommentService postCommentService;

	@Mock
	private LikeService likeService;

	@Mock
	private S3Service s3Service;

	@InjectMocks
	private PostFacadeService postFacadeService;

	private User user;
	private List<Post> posts;

	@BeforeEach
	void setUp() {
		user = User.builder()
			.nickname("test-user")
			.type(Type.PNTB)
			.s3Key("user/profile.jpg")
			.build();
		ReflectionTestUtils.setField(user, "id", 1L);

		Post post1 = Post.builder().user(user).title("title1").content("content1").build();
		Post post2 = Post.builder().user(user).title("title2").content("content2").build();
		Post post3 = Post.builder().user(user).title("title3").content("content3").build();

		ReflectionTestUtils.setField(post1, "id", 101L);
		ReflectionTestUtils.setField(post2, "id", 102L);
		ReflectionTestUtils.setField(post3, "id", 103L);
		ReflectionTestUtils.setField(post1, "likeCount", 5);
		ReflectionTestUtils.setField(post2, "likeCount", 10);
		ReflectionTestUtils.setField(post3, "likeCount", 15);

		posts = List.of(post1, post2, post3);
	}

	@DisplayName("최신순 게시글 3개 조회 성공")
	@Test
	void getPostListSortedByLatest() {
		// given
		List<Long> postIds = posts.stream().map(Post::getId).toList();
		when(postQueryService.getPopularPosts(3)).thenReturn(List.of());
		when(postQueryService.getPostsByLatestCursor(null, 3)).thenReturn(posts);
		when(postCommentService.getCommentCounts(List.of())).thenReturn(Map.of());
		when(postCommentService.getCommentCounts(postIds)).thenReturn(Map.of(
			101L, 1,
			102L, 2,
			103L, 3
		));
		when(likeService.getLikedTargetIds(eq(user), eq(TargetType.POST), anyList())).thenReturn(Set.of(102L));
		when(s3Service.generatePresignedGetUrl("user/profile.jpg")).thenReturn("https://s3.com/user/profile.jpg");

		// when
		PostListResponse response = postFacadeService.getPostList(user, "latest", null, null, 3);

		// then
		assertThat(response.posts()).hasSize(3);
		assertThat(response.posts()).extracting("title")
			.containsExactly("title1", "title2", "title3");
		assertThat(response.posts()).extracting("isLiked")
			.containsExactly(false, true, false);
		assertThat(response.posts()).extracting("commentCount")
			.containsExactly(1, 2, 3);
		assertThat(response.nextCursorId()).isNull();
		assertThat(response.nextCursorLikes()).isNull();
	}

	@DisplayName("좋아요순 게시글 3개 조회 성공")
	@Test
	void getPostListSortedByLikes() {
		// given
		List<Long> postIds = posts.stream().map(Post::getId).toList();
		when(postQueryService.getPopularPosts(3)).thenReturn(List.of());
		when(postCommentService.getCommentCounts(List.of())).thenReturn(Map.of());
		when(postQueryService.getPostsByLikesCursor(null, null,3)).thenReturn(posts);
		when(postCommentService.getCommentCounts(postIds)).thenReturn(Map.of(
			101L, 1,
			102L, 2,
			103L, 3
		));
		when(likeService.getLikedTargetIds(eq(user), eq(TargetType.POST), anyList())).thenReturn(Set.of(101L, 103L));
		when(s3Service.generatePresignedGetUrl("user/profile.jpg")).thenReturn("https://s3.com/user/profile.jpg");

		// when
		PostListResponse response = postFacadeService.getPostList(user, "likes", null, null, 3);

		// then
		assertThat(response.posts()).hasSize(3);
		assertThat(response.posts()).extracting("title")
			.containsExactly("title1", "title2", "title3");
		assertThat(response.posts()).extracting("isLiked")
			.containsExactly(true, false, true);
		assertThat(response.posts()).extracting("commentCount")
			.containsExactly(1, 2, 3);
		assertThat(response.nextCursorId()).isNull();
		assertThat(response.nextCursorLikes()).isNull();
	}

	@DisplayName("내가 작성한 게시글 조회 성공")
	@Test
	void getMyPosts_success() {
		// given
		List<Long> postIds = posts.stream().map(Post::getId).toList();

		when(postQueryService.getMyPosts(user, null, 3)).thenReturn(posts);
		when(postCommentService.getCommentCounts(postIds)).thenReturn(Map.of(
			101L, 1,
			102L, 2,
			103L, 3
		));
		when(likeService.getLikedTargetIds(eq(user), eq(TargetType.POST), anyList())).thenReturn(Set.of(101L));
		when(s3Service.generatePresignedGetUrl("user/profile.jpg")).thenReturn("https://s3.com/user/profile.jpg");

		// when
		MyPostResponse response = postFacadeService.getMyPostList(user, null, 3);

		// then
		assertThat(response.posts()).hasSize(3);
		assertThat(response.posts()).extracting("title")
			.containsExactly("title1", "title2", "title3");
		assertThat(response.posts()).extracting("isLiked")
			.containsExactly(true, false, false);
		assertThat(response.posts()).extracting("commentCount")
			.containsExactly(1, 2, 3);
		assertThat(response.nextCursorId()).isNull();
	}

	@DisplayName("내가 좋아요한 게시글 조회 성공")
	@Test
	void getMyLikedPosts_success() {
		// given
		List<Long> postIds = posts.stream().map(Post::getId).toList();

		when(postQueryService.getMyLikedPosts(user, null, 3)).thenReturn(posts);
		when(postCommentService.getCommentCounts(postIds)).thenReturn(Map.of(
			101L, 1,
			102L, 2,
			103L, 3
		));
		when(likeService.getLikedTargetIds(eq(user), eq(TargetType.POST), anyList())).thenReturn(Set.of(103L));
		when(s3Service.generatePresignedGetUrl("user/profile.jpg")).thenReturn("https://s3.com/user/profile.jpg");

		// when
		MyPostResponse response = postFacadeService.getMyLikedPostList(user, null, 3);

		// then
		assertThat(response.posts()).hasSize(3);
		assertThat(response.posts()).extracting("title")
			.containsExactly("title1", "title2", "title3");
		assertThat(response.posts()).extracting("isLiked")
			.containsExactly(false, false, true);
		assertThat(response.posts()).extracting("commentCount")
			.containsExactly(1, 2, 3);
		assertThat(response.nextCursorId()).isNull();
	}

	@DisplayName("내가 스크랩한 게시글 조회 성공")
	@Test
	void getMyScrapPosts_success() {
		// given
		List<Long> postIds = posts.stream().map(Post::getId).toList();

		when(postQueryService.getMyScrapPosts(user, null, 4)).thenReturn(posts);
		when(postCommentService.getCommentCounts(postIds)).thenReturn(Map.of(
			101L, 1,
			102L, 2,
			103L, 3
		));
		when(likeService.getLikedTargetIds(eq(user), eq(TargetType.POST), anyList())).thenReturn(Set.of(102L, 103L));
		when(s3Service.generatePresignedGetUrl("user/profile.jpg")).thenReturn("https://s3.com/user/profile.jpg");

		// when
		MyPostResponse response = postFacadeService.getMyScrapPostList(user, null, 3);

		// then
		assertThat(response.posts()).hasSize(3);
		assertThat(response.posts()).extracting("title")
			.containsExactly("title1", "title2", "title3");
		assertThat(response.posts()).extracting("isLiked")
			.containsExactly(false, true, true);
		assertThat(response.posts()).extracting("commentCount")
			.containsExactly(1, 2, 3);
		assertThat(response.nextCursorId()).isNull();
	}
}