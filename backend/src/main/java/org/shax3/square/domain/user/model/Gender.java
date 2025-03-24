package org.shax3.square.domain.user.model;

import lombok.Getter;

@Getter
public enum Gender {
    MALE("MALE"),
    FEMALE("FEMALE"),
    NONE("NONE");

    private final String value;

    Gender(String value) {
        this.value = value;
    }

}
