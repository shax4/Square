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
		System.out.println("▶ 찬성 요약");
		for (int i = 0; i < 3; i++) {
			String prompt = generatePrompt(topic, leftOption, i + 1);
			String result = chatClient.call(prompt).getResult().getOutput().getContent();
			System.out.println("찬성 #" + (i + 1) + ": " + result);
		}

		System.out.println("▶ 반대 요약");
		for (int i = 0; i < 3; i++) {
			String prompt = generatePrompt(topic, rightOption, i + 1);
			String result = chatClient.call(prompt).getResult().getOutput().getContent();
			System.out.println("반대 #" + (i + 1) + ": " + result);
		}
	}

	private String generatePrompt(String topic, String option, int index) {
		return String.format(
			"""
			주제: "%s"

			위 주제에 대해 %s 측의 누구나 동감할 수 있을만한 대표적인 주장 중 하나를 요약해줘.
			- 감정적인 표현을 피하고, 객관적이고 논란이 적은 내용을 담아야 해.
			- 너무 공격적이거나 논쟁을 유발할 수 있는 문장은 제외해줘.
			- 요약은 70자 이내로 해줘.
			- 요약 #%d (총 3개 중 %d번째)
			""",
			topic, option, index, index
		);
	}
}