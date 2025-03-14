package org.shax3.square.domain.user.model;

import com.fasterxml.jackson.annotation.JsonValue;

import java.util.HashMap;
import java.util.Map;

public enum AgeRange {
    TEN("10대"),
    TWENTY("20대"),
    THIRTY("30대"),
    FORTY("40대"),
    FIFTY("50대 이상");

    private final String koreanName;
    private static final Map<String, AgeRange> KOREAN_NAME_TO_AGE_RANGE_MAP = new HashMap<>();

    static {
        for (AgeRange ageRange : values()) {
            KOREAN_NAME_TO_AGE_RANGE_MAP.put(ageRange.koreanName, ageRange);
        }
    }

    AgeRange(String koreanName) {
        this.koreanName = koreanName;
    }

    @JsonValue
    public String getKoreanName() {
        return koreanName;
    }

    public static AgeRange fromKoreanName(String koreanName) {
        return KOREAN_NAME_TO_AGE_RANGE_MAP.get(koreanName);
    }
}
