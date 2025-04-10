package org.shax3.square.domain.scrap.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.shax3.square.common.model.TargetType;
import org.shax3.square.domain.auth.annotation.AuthUser;
import org.shax3.square.domain.debate.service.DebateService;
import org.shax3.square.domain.post.service.PostService;
import org.shax3.square.domain.scrap.dto.request.CreateScrapRequest;
import org.shax3.square.domain.scrap.service.ScrapFacadeService;
import org.shax3.square.domain.user.model.User;
import org.shax3.square.exception.CustomException;
import org.shax3.square.exception.ExceptionCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/scraps")
@RequiredArgsConstructor
@Tag(name = "Scrap", description = "스크랩 관련 API")
public class ScrapController {

    private final ScrapFacadeService scrapFacadeService;
    private final DebateService debateService;
    private final PostService postService;

    @Operation(
            summary = "스크랩 생성 api",
            description = "targetId, 타겟 타입을 입력하면 스크랩을 생성해줍니다."
    )
    @PostMapping
    public ResponseEntity<Void> createScrap(
            @AuthUser User user,
            @Valid @RequestBody CreateScrapRequest request
    ) {
        switch (request.targetType()) {
            case DEBATE -> debateService.findDebateById(request.targetId());
            case POST -> postService.getPost(request.targetId());
            // 향후 다른 타입들도 추가 가능
            default -> throw new CustomException(ExceptionCode.INVALID_TARGET_TYPE);
        }

        scrapFacadeService.create(user, request);

        return ResponseEntity.ok().build();
    }

    @Operation(
            summary = "스크랩 삭제 api",
            description = "targetId, targetType을 query string으로 보내면 해당 스크랩을 삭제합니다."
    )
    @DeleteMapping
    public ResponseEntity<Void> deleteScrap(
            @AuthUser User user,
            @RequestParam("targetId") Long targetId,
            @RequestParam("targetType") TargetType targetType
    ) {
        scrapFacadeService.delete(user, targetId, targetType);

        return ResponseEntity.ok().build();
    }
}
