package org.shax3.square.domain.debate.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.shax3.square.domain.auth.annotation.AuthUser;
import org.shax3.square.domain.auth.annotation.Guest;
import org.shax3.square.domain.debate.dto.DebateVotedResultResponse;
import org.shax3.square.domain.debate.dto.request.VoteRequest;
import org.shax3.square.domain.debate.dto.response.DebatesResponse;
import org.shax3.square.domain.debate.dto.response.MyScrapedDebatesResponse;
import org.shax3.square.domain.debate.dto.response.MyVotedDebatesResponse;
import org.shax3.square.domain.debate.dto.response.SummaryResponse;
import org.shax3.square.domain.debate.dto.response.VoteResponse;
import org.shax3.square.domain.debate.model.Debate;
import org.shax3.square.domain.debate.service.DebateFacadeService;
import org.shax3.square.domain.debate.service.DebateService;
import org.shax3.square.domain.debate.service.VoteService;
import org.shax3.square.domain.user.model.User;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/debates")
@Tag(name = "Debate", description = "논쟁 API")
@RequiredArgsConstructor
public class DebateController {
    private final DebateService debateService;
    private final VoteService voteService;
    private final DebateFacadeService debateFacadeService;

    @Operation(summary = "토론 투표 API ",
            description = "해당 토론 주제에 대해 투표를 할 수 있는 기능입니다. 인증을 필요로 합니다."
    )
    @PostMapping("/vote/{debateId}")
    public ResponseEntity<VoteResponse> vote(@Valid @RequestBody VoteRequest request, @AuthUser User user, @PathVariable Long debateId) {
        Debate debate = debateService.findDebateById(debateId);
        VoteResponse response = voteService.vote(request, debate, user);
        return ResponseEntity.ok(response);
    }


    @Operation(summary = "내가 투표한 논쟁 목록 조회 API ",
            description = "사용자가 투표한 논쟁 목록을 최신순으로 조회하는 API 입니다.")
    @GetMapping("/my-votes")
    public ResponseEntity<MyVotedDebatesResponse> getMyVotedDebates(
            @RequestParam(required = false) Long nextCursorId,
            @RequestParam(defaultValue = "10") int limit,
            @AuthUser User user) {

        MyVotedDebatesResponse response = debateFacadeService.getMyVotedDebates(user, nextCursorId, limit);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "내가 스크랩한 논쟁 목록 조회 API ",
            description = "사용자가 스크랩한 논쟁 목록을 최신순으로 조회하는 API 입니다.")
    @GetMapping("/my-scrap")
    public ResponseEntity<MyScrapedDebatesResponse> getMyScrapedDebates(
            @RequestParam(required = false) Long nextCursorId,
            @RequestParam(defaultValue = "10") int limit,
            @AuthUser User user) {

        MyScrapedDebatesResponse response = debateFacadeService.getScrapedDebates(user, nextCursorId, limit);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "토론에 따른 투표 통계 조회 API",
            description = "토론에 따른 투표 통계 자료를 제공합니다")
    @GetMapping("/{debateId}/result")
    public ResponseEntity<DebateVotedResultResponse> getDebateVotedResult(@AuthUser User user, @PathVariable Long debateId) {

        DebateVotedResultResponse response = debateService.getVoteResult(debateId);

        return ResponseEntity.ok(response);
    }

    @Operation(
            summary = "AI 요약 조회 API",
            description = """
        지정한 논쟁 ID에 해당하는 AI 요약 결과를 조회합니다. \n
        - 로그인하지 않은 경우 `hasVoted`, `isScraped` 값은 `null`로 반환됩니다. \n
        """
    )
    @GetMapping("/{debateId}/summary")
    public ResponseEntity<SummaryResponse> getSummary(@Guest User user, @PathVariable Long debateId){
        SummaryResponse response = debateService.getSummaryResult(debateId, user);
        return ResponseEntity.ok(response);
    }


    @GetMapping("/debates")
    public ResponseEntity<DebatesResponse> getDebates(@Guest User user){

        DebatesResponse response = debateService.getDebates(user);
        return ResponseEntity.ok(response);
    }





}
