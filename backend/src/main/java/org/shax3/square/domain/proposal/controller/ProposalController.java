package org.shax3.square.domain.proposal.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.shax3.square.domain.proposal.dto.request.CreatePropsalRequest;
import org.shax3.square.domain.proposal.dto.response.ProposalResponse;
import org.shax3.square.domain.proposal.model.Proposal;
import org.shax3.square.domain.proposal.service.ProposalService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/proposal")
@RequiredArgsConstructor
public class ProposalController {
    private final ProposalService proposalService;

    @PostMapping
    public ResponseEntity<ProposalResponse> createProposal(@Valid @RequestBody CreatePropsalRequest request,
                                               @RequestHeader("Authorization") String token) {
        ProposalResponse response = proposalService.save(request, token);
        return ResponseEntity.ok(response);


    }
}
