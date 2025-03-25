package org.shax3.square.domain.scrap.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.shax3.square.domain.auth.annotation.AuthUser;
import org.shax3.square.domain.scrap.dto.request.CreateScrapRequest;
import org.shax3.square.domain.scrap.model.TargetType;
import org.shax3.square.domain.scrap.service.ScrapService;
import org.shax3.square.domain.user.model.User;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/scraps")
@RequiredArgsConstructor
@Tag(name = "Scrap", description = "스크랩 관련 API")
public class ScrapController {

    private final ScrapService scrapService;

    @Operation(
            summary = "스크랩 생성 api",
            description = "targetId, 타겟 타입을 입력하면 스크랩을 생성해줍니다."
    )
    @PostMapping
    public ResponseEntity<Void> createScrap(
            @AuthUser User user,
            @Valid @RequestBody CreateScrapRequest createScrapRequest
    ) {
        scrapService.createScrap(user, createScrapRequest);

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
            @RequestParam("targetType")TargetType targetType
    ) {
        scrapService.deleteScrap(user, targetId, targetType);

        return ResponseEntity.ok().build();
    }
}
