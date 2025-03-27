package org.shax3.square.domain.type.dto.request;

import java.util.List;

public record EndTypeTestRequest(
        List<TypeTestAnswer> answers
) {
}
