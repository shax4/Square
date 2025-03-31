package org.shax3.square.domain.post.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.shax3.square.domain.post.dto.request.CreatePostRequest;
import org.shax3.square.domain.post.model.Post;
import org.shax3.square.domain.post.model.PostImage;
import org.shax3.square.domain.post.repository.PostImageRepository;
import org.shax3.square.domain.post.repository.PostRepository;
import org.shax3.square.domain.user.model.User;
import org.shax3.square.exception.CustomException;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;
import static org.shax3.square.exception.ExceptionCode.POST_IMAGE_LIMIT;

@ExtendWith(MockitoExtension.class)
@DisplayName("PostService 테스트")
public class PostServiceTest {

    @Mock
    private PostRepository postRepository;

    @Mock
    private PostImageRepository postImageRepository;

    @InjectMocks
    private PostService postService;

    private User user;
    private Post dummyPost;

    @BeforeEach
    void setUp() {
        user = User.builder().build();
        dummyPost = Post.builder().build();
    }

    @Test
    @DisplayName("이미지 정보가 없는 경우: postImageRepository.saveAll() 호출 없이 postRepository.save() 호출")
    void createPostWithoutImages_shouldSavePostWithoutPostImages() {
        // given
        CreatePostRequest request = mock(CreatePostRequest.class);
        when(request.to(user)).thenReturn(dummyPost);
        when(request.postImages()).thenReturn(null);

        // when
        postService.createPost(request, user);

        // then
        verify(postImageRepository, never()).saveAll(any());
        verify(postRepository).save(dummyPost);
    }

    @Test
    @DisplayName("유효한 이미지 정보가 있는 경우: 올바른 PostImage 목록 저장")
    void createPostWithValidImages_shouldSavePostWithPostImages() {
        // given
        List<String> s3Keys = Arrays.asList("s3Key1", "s3Key2");
        CreatePostRequest request = mock(CreatePostRequest.class);
        when(request.to(user)).thenReturn(dummyPost);
        when(request.postImages()).thenReturn(s3Keys);

        // when
        postService.createPost(request, user);

        // then
        @SuppressWarnings("unchecked")
        ArgumentCaptor<List<PostImage>> postImageListCaptor = ArgumentCaptor.forClass(List.class);
        verify(postImageRepository).saveAll(postImageListCaptor.capture());
        List<PostImage> savedImages = postImageListCaptor.getValue();

        assertThat(savedImages).hasSize(s3Keys.size());
        for (int i = 0; i < s3Keys.size(); i++) {
            PostImage pi = savedImages.get(i);
            assertThat(pi.getS3Key()).isEqualTo(s3Keys.get(i));
            assertThat(pi.getPost()).isEqualTo(dummyPost);
        }
        verify(postRepository).save(dummyPost);
    }

    @Test
    @DisplayName("이미지 정보가 3개 초과인 경우: CustomException 발생 및 저장 메서드 호출 없음")
    void createPostWithTooManyImages_shouldThrowCustomException() {
        // given
        List<String> s3Keys = Arrays.asList("s3Key1", "s3Key2", "s3Key3", "s3Key4");
        CreatePostRequest request = mock(CreatePostRequest.class);
        when(request.to(user)).thenReturn(dummyPost);
        when(request.postImages()).thenReturn(s3Keys);

        // when & then
        assertThatThrownBy(() -> postService.createPost(request, user))
                .isInstanceOf(CustomException.class)
                .satisfies(ex -> {
                    CustomException customEx = (CustomException) ex;
                    assertThat(customEx.getCode()).isEqualTo(POST_IMAGE_LIMIT.getCode());
                });

        verify(postImageRepository, never()).saveAll(any());
    }
}
