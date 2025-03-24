package org.shax3.square.domain.opinion.dto;


public record CreateOpinionRequest(
        Long debateId,
        boolean left,
        String content) {
}

