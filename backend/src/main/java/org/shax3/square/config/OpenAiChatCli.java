package org.shax3.square.config;

import org.springframework.ai.openai.api.OpenAiApi;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;


import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class OpenAiChatCli {

	@Bean
	public OpenAiApi openAiApi(OpenAiApi.OpenAiApiConfig config) {
		return new OpenAiApi(config);
	}

	@Bean
	public OpenAiApi.OpenAiApiConfig openAiApiConfig() {
		return OpenAiApi.OpenAiApiConfig.builder()
			.withApiKey(System.getenv("OPENAI_API_KEY")) // 또는 application.yml에서 자동 주입 가능
			.withBaseUrl("https://api.openai.com/v1") // 기본 URL
			.build();
	}

	@Bean
	public org.springframework.ai.openai.OpenAiChatClient openAiChatClient(OpenAiApi openAiApi) {
		return new org.springframework.ai.openai.OpenAiChatClient(openAiApi);
	}
}
