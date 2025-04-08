package org.shax3.square.domain.debate.dto.request;

import org.shax3.square.domain.debate.model.Debate;

public record DebateCreateRequest(
	Long proposalId,
	String topic,
	String leftOption,
	String rightOption
) {
	public Debate to() {
		return Debate.builder()
			.topic(topic)
			.leftOption(leftOption)
			.rightOption(rightOption)
			.build();
	}
}
