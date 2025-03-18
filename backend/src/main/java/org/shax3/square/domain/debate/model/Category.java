package org.shax3.square.domain.debate.model;

import java.util.HashMap;
import java.util.Map;

public enum Category {
    POLITICS("정치"),
    ECONOMY("경제"),
    TECHNOLOGY("기술"),
    SOCIETY("사회"),
    ENVIRONMENT("환경");

    private final String koreanName;
    private static final Map<String, Category> KOREAN_NAME_TO_CATEGORY_MAP = new HashMap<>();

    Category(String koreanName) {
        this.koreanName = koreanName;
    }

    public static Category fromKoreanName(String koreanName) {
        return KOREAN_NAME_TO_CATEGORY_MAP.get(koreanName);
    }

}
