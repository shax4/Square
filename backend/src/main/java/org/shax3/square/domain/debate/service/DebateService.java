package org.shax3.square.domain.debate.service;

import lombok.RequiredArgsConstructor;
import org.shax3.square.domain.debate.model.Debate;
import org.shax3.square.domain.debate.repository.DebateRepository;
import org.shax3.square.exception.CustomException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import static org.shax3.square.exception.ExceptionCode.*;

@Service
@RequiredArgsConstructor
public class DebateService {

    private final DebateRepository debateRepository;

    @Transactional(readOnly = true)
    public Debate findDebateById(Long debateId) {
        return debateRepository.findById(debateId)
                .orElseThrow(() -> new CustomException(DEBATE_NOT_FOUND));
    }
}
