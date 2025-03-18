package org.shax3.square.domain.proposal.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.shax3.square.domain.proposal.model.Proposal;
import org.shax3.square.domain.user.model.User;

public record CreateProposalRequest(
        @NotBlank(message = "주제는 비어 있을 수 없습니다.")
        @Size(min = 3, max = 100, message = "주제는 최소 3자 이상, 최대 100자 이하이어야 합니다.")
        String topic
) {
    public Proposal to(User user) {
        return Proposal.builder()
                .user(user)
                .topic(topic)
                .build();
    }
}
