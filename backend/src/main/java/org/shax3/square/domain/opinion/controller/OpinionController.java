package org.shax3.square.domain.opinion.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.shax3.square.domain.auth.annotation.AuthUser;
import org.shax3.square.domain.debate.model.Debate;
import org.shax3.square.domain.debate.service.DebateService;
import org.shax3.square.domain.opinion.dto.request.CreateOpinionRequest;
import org.shax3.square.domain.opinion.dto.request.UpdateOpinionRequest;
import org.shax3.square.domain.opinion.dto.response.MyOpinionResponse;
import org.shax3.square.domain.opinion.dto.response.OpinionDetailsResponse;
import org.shax3.square.domain.opinion.service.OpinionFacadeService;
import org.shax3.square.domain.opinion.service.OpinionService;
import org.shax3.square.domain.user.model.User;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Opinion", description = "의견 API")
@RestController
@RequestMapping("/opinions")
@RequiredArgsConstructor
public class OpinionController {
    private final OpinionService opinionService;
    private final OpinionFacadeService opinionFacadeService;
    private final DebateService debateService;

    @Operation(
            summary = "의견 작성",
            description = "사용자가 특정 논쟁 주제에 대해 의견을 작성하는 API입니다. 인증이 필요합니다."
    )
    @PostMapping
    public ResponseEntity<Void> create(@AuthUser User user, @Valid @RequestBody CreateOpinionRequest request) {
        Debate debate = debateService.findDebateById(request.debateId());
        opinionService.createOpinion(user, request, debate);
        return ResponseEntity.ok().build();
    }

    @Operation(
            summary = "의견 상세 조회",
            description = """
                        특정 의견 ID(opinionId)에 대한 상세 정보를 조회하는 API입니다.
                        사용자 인증이 필요하며, 의견 작성자 정보와 댓글 목록을 포함한 데이터를 반환합니다.
                        댓글 목록에는 사용자의 좋아요 여부가 포함됩니다.
                    """
    )
    @GetMapping("/{opinionId}")
    public ResponseEntity<OpinionDetailsResponse> read(@AuthUser User user, @PathVariable Long opinionId) {
        OpinionDetailsResponse response = opinionFacadeService.getOpinionDetails(user, opinionId);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "의견 수정", description = "사용자가 작성한 의견 내용을 수정하는 API입니다.")
    @PutMapping("/{opinionId}")
    public ResponseEntity<Void> update(@AuthUser User user, @PathVariable Long opinionId, @Valid @RequestBody UpdateOpinionRequest request) {
        opinionService.updateOpinion(request, user, opinionId);

        return ResponseEntity.ok().build();
    }

    @Operation(summary = "의견 삭제", description = "사용자가 작성한 의견을 삭제하는 API입니다.")
    @DeleteMapping("/{opinionId}")
    public ResponseEntity<Void> delete(@AuthUser User user, @PathVariable Long opinionId) {
        opinionService.deleteOpinion(user, opinionId);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "내 의견 목록 조회", description = "사용자가 자신의 의견 목록을 조회하는 API입니다.")
    @GetMapping("/my")
    public ResponseEntity<MyOpinionResponse> readMyOpinions(@AuthUser User user,
                                                            @RequestParam(required = false) Long nextCursorId,
                                                            @RequestParam(defaultValue = "5") int limit
    ) {

        MyOpinionResponse response = opinionFacadeService.getMyOpinions(user, nextCursorId, limit);
        return ResponseEntity.ok(response);
    }

}