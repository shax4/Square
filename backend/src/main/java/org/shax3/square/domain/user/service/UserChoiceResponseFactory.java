package org.shax3.square.domain.user.service;

import org.shax3.square.domain.user.dto.response.UserChoiceResponse;
import org.shax3.square.domain.user.model.Gender;
import org.shax3.square.domain.user.model.Region;
import org.shax3.square.domain.user.model.Religion;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

public class UserChoiceResponseFactory {
    private static final UserChoiceResponse USER_CHOICE_RESPONSE;

    static {
        List<String> genderList = Arrays.stream(Gender.values())
                .map(Gender::name)
                .collect(Collectors.toList());
        List<String> regionList = Arrays.stream(Region.values())
                .map(Region::getKoreanName)
                .collect(Collectors.toList());
        List<String> religionList = Arrays.stream(Religion.values())
                .map(Religion::getKoreanName)
                .collect(Collectors.toList());
        USER_CHOICE_RESPONSE = UserChoiceResponse.of(regionList, genderList, religionList);
    }

    public static UserChoiceResponse getUserChoiceResponse() {
        return USER_CHOICE_RESPONSE;
    }
}
