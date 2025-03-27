package org.shax3.square.domain.post.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.shax3.square.domain.post.dto.request.CreatePostRequest;
import org.shax3.square.domain.post.model.Post;
import org.shax3.square.domain.post.model.PostImage;
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
public class PostServiceTest {

    @Mock
    private PostRepository postRepository;

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
    void createPostWithoutImages_shouldSavePostWithoutPostImages() {
        // given
        CreatePostRequest request = mock(CreatePostRequest.class);
        when(request.to(user)).thenReturn(dummyPost);
        when(request.postImages()).thenReturn(null);

        // when
        postService.createPost(request, user);

        // then
        ArgumentCaptor<Post> postCaptor = ArgumentCaptor.forClass(Post.class);
        verify(postRepository).save(postCaptor.capture());
        Post savedPost = postCaptor.getValue();
        assertThat(savedPost.getPostImages()).isEmpty();
    }

    @Test
    void createPostWithValidImages_shouldSavePostWithPostImages() {
        // given
        List<String> s3Keys = Arrays.asList("s3Key1", "s3Key2");
        CreatePostRequest request = mock(CreatePostRequest.class);
        when(request.to(user)).thenReturn(dummyPost);
        when(request.postImages()).thenReturn(s3Keys);

        // when
        postService.createPost(request, user);

        // then
        ArgumentCaptor<Post> postCaptor = ArgumentCaptor.forClass(Post.class);
        verify(postRepository).save(postCaptor.capture());
        Post savedPost = postCaptor.getValue();

        List<PostImage> postImages = savedPost.getPostImages();
        assertThat(postImages).isNotNull();
        assertThat(postImages).hasSize(s3Keys.size());
        for (int i = 0; i < s3Keys.size(); i++) {
            PostImage postImage = postImages.get(i);
            assertThat(postImage.getS3Key()).isEqualTo(s3Keys.get(i));
            assertThat(postImage.getPost()).isEqualTo(savedPost);
        }
    }

    @Test
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
    }
}
