package org.shax3.square.domain.opinion.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.shax3.square.domain.auth.annotation.AuthUser;
import org.shax3.square.domain.opinion.dto.CreateOpinionRequest;
import org.shax3.square.domain.opinion.service.OpinionService;
import org.shax3.square.domain.user.model.User;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Opinion", description = "의견 API")
@RestController
@RequestMapping("/opinions")
@RequiredArgsConstructor
public class OpinionController {
    private final OpinionService opinionService;

    @Operation(
            summary = "의견 작성",
            description = "사용자가 특정 논쟁 주제에 대해 의견을 작성하는 API입니다. 인증이 필요합니다."
    )
    @PostMapping
    public ResponseEntity<Void> create(@AuthUser User user, @Valid @RequestBody CreateOpinionRequest request) {
        opinionService.createOpinion(user, request);
        return ResponseEntity.ok().build();
    }
}