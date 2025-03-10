package org.shax3.square.exception;

import lombok.Getter;

@Getter
public class CustomException extends RuntimeException{
	int code;
	String message;

	public CustomException(int code, String message) {
		this.code = code;
		this.message = message;
	}
}
