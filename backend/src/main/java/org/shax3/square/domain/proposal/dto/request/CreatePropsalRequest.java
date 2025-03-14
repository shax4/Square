package org.shax3.square.domain.proposal.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.shax3.square.domain.proposal.model.Proposal;

@Getter
@AllArgsConstructor
public class CreatePropsalRequest {

    private String topic;

    public Proposal toEntity(User user){
        return Proposal.builder()
                .user(user)
                .topic(topic)
                .build();
    }
}
