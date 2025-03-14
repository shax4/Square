package org.shax3.square.domain.user.model;

import com.fasterxml.jackson.annotation.JsonValue;

import java.util.HashMap;
import java.util.Map;

public enum Religion {
    NONE("없음"),
    CHRISTIANITY("기독교"),
    BUDDHISM("불교"),
    CATHOLICISM("천주교"),
    OTHER("기타");

    private final String koreanName;
    private static final Map<String, Religion> KOREAN_NAME_TO_RELIGION_MAP = new HashMap<>();

    static {
        for (Religion religion : values()) {
            KOREAN_NAME_TO_RELIGION_MAP.put(religion.koreanName, religion);
        }
    }

    Religion(String koreanName) {
        this.koreanName = koreanName;
    }

    @JsonValue
    public String getKoreanName() {
        return koreanName;
    }

    public static Religion fromKoreanName(String koreanName) {
        return KOREAN_NAME_TO_RELIGION_MAP.get(koreanName);
    }
}
