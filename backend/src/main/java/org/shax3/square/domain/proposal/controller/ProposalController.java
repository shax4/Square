package org.shax3.square.domain.proposal.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.shax3.square.domain.proposal.dto.request.CreateProposalRequest;
import org.shax3.square.domain.proposal.dto.response.CreateProposalsResponse;
import org.shax3.square.domain.proposal.dto.response.ProposalsResponse;
import org.shax3.square.domain.proposal.service.ProposalService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/proposals")
@RequiredArgsConstructor
public class ProposalController {
    private final ProposalService proposalService;

    @PostMapping
    public ResponseEntity<CreateProposalsResponse> createProposal(@Valid @RequestBody CreateProposalRequest request,
                                                           @RequestHeader("Authorization") String token) {
        CreateProposalsResponse response = proposalService.save(request, token);
        return ResponseEntity.ok(response);
    }
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
