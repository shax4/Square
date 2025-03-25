package org.shax3.square.domain.opinion.controller;


import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.shax3.square.domain.auth.annotation.AuthUser;
import org.shax3.square.domain.opinion.dto.request.CreateOpinionCommentRequest;
import org.shax3.square.domain.opinion.dto.response.CreateOpinionCommentResponse;
import org.shax3.square.domain.opinion.model.OpinionComment;
import org.shax3.square.domain.opinion.service.OpinionCommentService;
import org.shax3.square.domain.user.model.User;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/opinions/comments")
@RequiredArgsConstructor
@Tag(name = "OpinionComment", description = "의견 답글 API")

public class OpinionCommentController {
    private final OpinionCommentService opinionCommentService;

    @PostMapping
    public ResponseEntity<CreateOpinionCommentResponse> create(@AuthUser User user, @Valid @RequestBody CreateOpinionCommentRequest request) {
        CreateOpinionCommentResponse response = opinionCommentService.createOpinionComment(user, request);
        return ResponseEntity.ok(response);
    }


}
