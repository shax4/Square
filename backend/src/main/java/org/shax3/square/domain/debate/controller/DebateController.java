package org.shax3.square.domain.debate.controller;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.shax3.square.domain.auth.annotation.AuthUser;
import org.shax3.square.domain.debate.dto.request.VoteRequest;
import org.shax3.square.domain.debate.dto.response.VoteResponse;
import org.shax3.square.domain.debate.service.DebateService;
import org.shax3.square.domain.debate.service.VoteService;
import org.shax3.square.domain.user.model.User;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/debate")
@RequiredArgsConstructor
public class DebateController {
    private final DebateService debateService;
    private final VoteService voteService;


    @Operation(summary = "토론 투표 API ",
            description = "해당 토론 주제에 대해 투표를 할 수 있는 기능입니다. 인증을 필요로 합니다."
    )
    @PostMapping("/vote/{debateId}")
    public ResponseEntity<VoteResponse> vote(@Valid @RequestBody VoteRequest request, @AuthUser User user, @PathVariable Long debateId) {
        VoteResponse response = voteService.vote(request, debateId, user);
        return ResponseEntity.ok(response);
    }
}
