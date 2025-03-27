package org.shax3.square.domain.type.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

public record TypeTestAnswer(
        @Min(value = 1, message = "questionId는 최소 1이어야 합니다.")
        @Max(value = 32, message = "questionId는 최대 32이어야 합니다.")
        int questionId,

        @Min(value = 1, message = "answer는 최소 1이어야 합니다.")
        @Max(value = 6, message = "answer는 최대 6이어야 합니다.")
        int answer
) {
}
