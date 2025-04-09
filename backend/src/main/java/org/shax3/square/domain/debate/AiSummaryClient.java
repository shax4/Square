package org.shax3.square.domain.debate;

import org.shax3.square.domain.debate.service.SummaryService;
import org.springframework.ai.openai.OpenAiChatClient;
import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class AiSummaryClient {

	private final SummaryService summaryService;
	private final OpenAiChatClient chatClient;

	public void generateSummaries(String topic, String leftOption, String rightOption) {
		String prompt = generatePrompt(topic, leftOption, rightOption);
		String result = chatClient.call(prompt);
		System.out.println(result);
	}

	private String generatePrompt(String topic, String leftOption, String rightOption) {
		return String.format(
			"""
			주제: "%s"

			위 주제에 대해 누구나 동감할 수 있을만한 %s 측의 대표적인 주장 3개와 %s 측의 대표적인 주장 3개를 요약해줘.
			- 감정적인 표현을 피하고, 객관적이고 논란이 적은 내용을 담아야 해.
			- 너무 공격적이거나 논쟁을 유발할 수 있는 문장은 제외해줘.
			- 요약은 주장 하냐당 70자 이내로 해줘.
			- 각 요약은 코드에서 split 할 수 있도록 쉼표로 구분해주고, 한쪽 의견 먼저 3개 추출 한 후, 반대쪽 의견 3개를 추출해줘.
			""",
			topic, leftOption, rightOption
		);
	}
}