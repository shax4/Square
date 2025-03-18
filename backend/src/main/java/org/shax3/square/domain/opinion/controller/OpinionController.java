package org.shax3.square.domain.opinion.controller;

import lombok.RequiredArgsConstructor;
import org.shax3.square.domain.opinion.service.OpinionService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/opinions")
@RequiredArgsConstructor
public class OpinionController {
    private final OpinionService opinionService;
}
