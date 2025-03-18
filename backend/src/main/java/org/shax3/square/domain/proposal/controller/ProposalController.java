package org.shax3.square.domain.proposal.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.shax3.square.domain.proposal.dto.request.CreateProposalRequest;
import org.shax3.square.domain.proposal.dto.response.CreateProposalsResponse;
import org.shax3.square.domain.proposal.dto.response.ProposalsResponse;
import org.shax3.square.domain.proposal.service.ProposalService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Proposal", description = "주제 청원 API")
@RestController
@RequestMapping("/proposals")
@RequiredArgsConstructor
public class ProposalController {
    private final ProposalService proposalService;

    @Operation(
            summary = "논쟁 주제 제안",
            description = "사용자가 새로운 논쟁 주제를 제안하는 API입니다. JWT 토큰이 필요합니다."
    )
    @PostMapping
    public ResponseEntity<CreateProposalsResponse> createProposal(@Valid @RequestBody CreateProposalRequest request,
                                                           @RequestHeader("Authorization") String token) {
        CreateProposalsResponse response = proposalService.save(request, token);
        return ResponseEntity.ok(response);
    }

    @Operation(
            summary = "청원 목록 조회",
            description = "청원에 등록된 주제를 최신순 또는 인기순으로 조회하는 API입니다. 커서 기반 페이지네이션을 지원합니다."
    )
    @GetMapping
    public ResponseEntity<ProposalsResponse> getProposals(
            @RequestParam(defaultValue = "latest") String sort,
            @RequestParam(required = false) Long nextCursorId,
            @RequestParam(required = false) Integer nextCursorLikes,
            @RequestParam(defaultValue = "5") int limit
    ) {
        ProposalsResponse response = proposalService.getProposals(sort, nextCursorId, nextCursorLikes, limit);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{proposalId}")
    public ResponseEntity<Void> deleteProposal(@PathVariable Long proposalId) {
        proposalService.deleteProposal(proposalId);
        return ResponseEntity.ok().build();
    }

}
