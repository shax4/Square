package org.shax3.square.common.model;

public interface DisplayableEnum {
    default String getKoreanName() {
        return ((Enum<?>) this).name();
    }
}
