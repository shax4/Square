package org.shax3.square.domain.user.model;

public interface DisplayableEnum {
    default String getKoreanName() {
        return ((Enum<?>) this).name();
    }
}
