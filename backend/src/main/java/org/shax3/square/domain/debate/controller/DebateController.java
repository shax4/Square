package org.shax3.square.domain.debate.controller;

import lombok.RequiredArgsConstructor;
import org.shax3.square.domain.debate.service.DebateService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/debate")
@RequiredArgsConstructor
public class DebateController {
    private final DebateService debateService;
}
