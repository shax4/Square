package org.shax3.square.domain.debate.dto;

import java.util.Map;

public record VoteResultDto(
        Map<String, Integer> gender,
        Map<String, Integer> ageRange,
        Map<String, Integer> userType,
        Map<String, Integer> region,
        Map<String, Integer> religion
) {}
