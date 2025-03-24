package org.shax3.square.domain.opinion.controller;

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

@RestController
@RequestMapping("/opinions")
@RequiredArgsConstructor
public class OpinionController {
    private final OpinionService opinionService;


    @PostMapping
    public ResponseEntity<Void> create(@AuthUser User user, @Valid @RequestBody CreateOpinionRequest request) {
        opinionService.createOpinion(user,request);

        return ResponseEntity.ok().build();
    }
}
