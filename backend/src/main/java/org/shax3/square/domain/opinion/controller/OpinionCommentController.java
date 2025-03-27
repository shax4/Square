package org.shax3.square.domain.opinion.controller;


import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.shax3.square.domain.auth.annotation.AuthUser;
import org.shax3.square.domain.opinion.dto.request.CreateOpinionCommentRequest;
import org.shax3.square.domain.opinion.dto.request.UpdateOpinionRequest;
import org.shax3.square.domain.opinion.dto.response.CreateOpinionCommentResponse;
import org.shax3.square.domain.opinion.service.OpinionCommentService;
import org.shax3.square.domain.opinion.service.OpinionFacadeService;
import org.shax3.square.domain.user.model.User;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/opinions/comments")
@RequiredArgsConstructor
@Tag(name = "OpinionComment", description = "의견 답글 API")

public class OpinionCommentController {
    private final OpinionCommentService opinionCommentService;
    private final OpinionFacadeService opinionFacadeService;

    @Operation(
            summary = "답글 생성",
            description = "사용자가 특정 의견에 답글을 작성합니다."
    )
    @PostMapping
    public ResponseEntity<CreateOpinionCommentResponse> create(@AuthUser User user, @Valid @RequestBody CreateOpinionCommentRequest request) {
        CreateOpinionCommentResponse response = opinionFacadeService.createOpinionComment(user, request);
        return ResponseEntity.ok(response);
    }

    @Operation(
            summary = "답글 삭제",
            description = "사용자가 의견에 달린 자신의 답글을 삭제합니다."
    )
    @DeleteMapping("/{commentId}")
    public ResponseEntity<Void> delete(@AuthUser User user, @PathVariable Long commentId) {
        opinionCommentService.deleteOpinionComment(user, commentId);
        return ResponseEntity.ok().build();
    }

    @Operation(
            summary = "답글 수정",
            description = "사용자가 자신의 답글 내용을 수정합니다."
    )
    @PutMapping("/{commentId}")
    public ResponseEntity<Void> update(@AuthUser User user, @Valid @RequestBody UpdateOpinionRequest request, @PathVariable Long commentId) {
        opinionCommentService.updateOpinionComment(user, request, commentId);
        return ResponseEntity.ok().build();
    }


}
