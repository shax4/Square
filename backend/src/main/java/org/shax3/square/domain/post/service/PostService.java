package org.shax3.square.domain.post.service;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.shax3.square.domain.post.dto.request.CreatePostRequest;
import org.shax3.square.domain.post.model.Post;
import org.shax3.square.domain.post.model.PostImage;
import org.shax3.square.domain.post.repository.PostImageRepository;
import org.shax3.square.domain.post.repository.PostRepository;
import org.shax3.square.domain.user.model.User;
import org.shax3.square.exception.CustomException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.shax3.square.exception.ExceptionCode.POST_IMAGE_LIMIT;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final PostImageRepository postImageRepository;

    @Transactional
    public void createPost(@Valid CreatePostRequest createPostRequest, User user) {
        Post post = createPostRequest.to(user);

        List<String> s3Keys = createPostRequest.postImages();
        postRepository.save(post);

        if (s3Keys != null) {
            checkSize(s3Keys);
            List<PostImage> postImages = createPostRequest.postImages().stream()
                    .map(s3Key -> PostImage.builder()
                            .post(post)
                            .s3Key(s3Key)
                            .build())
                    .toList();
            postImageRepository.saveAll(postImages);
        }
    }

    private void checkSize(List<String> postImages) {
        if (postImages.size() > 3) {
            throw new CustomException(POST_IMAGE_LIMIT);
        }
    }

}
