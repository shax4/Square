package org.shax3.square.domain.debate.service;

import lombok.RequiredArgsConstructor;
import org.shax3.square.domain.debate.dto.SummaryDto;
import org.shax3.square.domain.debate.model.Summary;
import org.shax3.square.domain.debate.repository.SummaryRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SummaryService {
    private final SummaryRepository summaryRepository;

    public List<SummaryDto> getSummariesByDebateId(Long debateId) {
        List<Summary> summaries = summaryRepository.findByDebateId(debateId);
        return SummaryDto.of(summaries);
    }
}
