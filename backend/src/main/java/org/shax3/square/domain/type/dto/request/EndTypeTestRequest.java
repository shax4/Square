package org.shax3.square.domain.type.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record EndTypeTestRequest(
        @NotNull(message = "답변 리스트는 필수값입니다.")
        List<@Valid TypeTestAnswer> answers
) {
}
