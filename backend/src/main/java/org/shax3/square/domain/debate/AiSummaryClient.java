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
			"%s" 주제에 대해 %s 측과 %s 측의 대표적인 주장 3개씩 총 6개를 추출해야돼.
			
			너의 응답은 항상 아래의 형식을 따라야해.
			- 형식 예시: [주장1/ 주장2/ 주장3/ 주장4/ 주장5/ 주장6]
			- 여기서 하나의 주장을 100자 정도로 작성해줘.
			- 문장은 너무 공격적이지 않고 객관적인 표현으로 구성해줘.
			- 문장의 끝이 "다"로 끝나도록 해줘.
			- 먼저 %s 측 3개, 그 다음 %s 측 3개를 출력해줘.
			""",
			topic, leftOption, rightOption, leftOption, rightOption
		);
	}
}