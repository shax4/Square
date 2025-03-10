package org.shax3.square.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum ExceptionCode {
	INVALID_REQUEST(1000, "유효하지 않은 요청입니다."),
	NOT_FOUND(1001, "자원을 찾을 수가 없습니다."),
	UNSUPPORTED_EXTENSIONS(1002, "지원하지 않는 파일 형식입니다."
		+ " 지원하는 파일 양식(\"jpg\", \"png\", \"gif\", \"jpeg\", \"webp\""),
	DUPLICATED_SOURCE(1003, "입력하는 요소에 중복이 존재합니다. 요소의 명칭을 변경해주세요."),

	UNABLE_TO_GET_USER_INFO(2001, "소셜 로그인 공급자로부터 유저 정보를 받아올 수 없습니다."),
	UNABLE_TO_GET_ACCESS_TOKEN(2002, "소셜 로그인 공급자로부터 인증 토큰을 받아올 수 없습니다."),
	NICKNAME_BLANK_NOT_ALLOW(2003, "닉네임 및 이름에는 빈칸을 허용하지 않습니다."),

	UNAUTHORIZED_ACCESS(3000, "접근할 수 없는 리소스입니다."),
	INVALID_REFRESH_TOKEN(3001, "사용자 식별에 실패했습니다. 다시 로그인해주세요."),
	FAILED_TO_VALIDATE_TOKEN(3002, "토큰 검증에 실패했습니다."),
	INVALID_ACCESS_TOKEN(3003, "사용자 식별에 실패했습니다. 다시 로그인해주세요."),

	NOT_AUTHOR(4001, "작성자만 글을 수정할 수 있습니다."),
	PAGE_LIMIT(4002, "최대 페이지 수를 초과할 수 없습니다."),
	BOARD_LIMIT(4003, "게시판의 최대 게시글 수를 초과했습니다."),
	BOARD_NOT_FOUND(4004, "게시글을 찾을 수 없습니다."),
	COMMENT_NOT_FOUND(4005, "댓글을 찾을 수 없습니다."),
	TEAM_BOARD_NOT_FOUND(4006, "게시판을 찾을 수 없습니다.");

	private final int code;
	private final String message;
}

