package org.shax3.square.domain.user.dto.response;

import lombok.Builder;

import java.util.List;

@Builder
public record UserChoiceResponse(
    List<String> regions,
    List<String> genders,
    List<String> religions,
    String userState
) {
    public static UserChoiceResponse of(List<String> regions, List<String> genders, List<String> religions) {
        return UserChoiceResponse.builder()
                .regions(regions)
                .genders(genders)
                .religions(religions)
                .userState("ADMIN")
                .build();
    }
}
