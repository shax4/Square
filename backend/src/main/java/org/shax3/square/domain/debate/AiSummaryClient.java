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
			"%s" 주제에 대해 %s 측과 %s 측의 대표적인 주장 3개씩 총 6개를 요약해줘.
	
			- 하나의 주장을 100자 이내로 작성해줘.
			- 문장은 너무 공격적이지 않고 객관적인 표현으로 구성해줘.
			- 모든 6개의 주장은 슬래시(/)로 구분해서 하나의 줄로 이어서 출력해줘. 절대 띄어쓰기나 다른 기호를 넣지 말아줘.
			- 제목, 번호, 기호 없이 주장 6개만 한줄로 출력해줘.
			- 먼저 %s 측 3개, 그 다음 %s 측 3개를 출력해줘.
			
			예시:
			주장1/ 주장2/ 주장3/ 주장4/ 주장5/ 주장6
			""",
			topic, leftOption, rightOption, leftOption, rightOption
		);
	}
}