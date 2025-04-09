package org.shax3.square.domain.debate.dto;

import org.shax3.square.common.model.DisplayableEnum;
import org.shax3.square.domain.debate.model.Vote;
import org.shax3.square.domain.user.model.*;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.function.Function;
import java.util.stream.Collectors;

public record VoteResultDto(
        Map<String, Integer> gender,
        Map<String, Integer> ageRange,
        Map<String, Integer> userType,
        Map<String, Integer> region,
        Map<String, Integer> religion
) {

    // 주어진 투표 목록에서 각 기준별로 통계 정보를 생성해 VoteResultDto로 반환
    public static VoteResultDto fromVotes(List<Vote> votes) {
        return new VoteResultDto(
                aggregateEnum(votes, Vote::getGender, Gender.class),
                aggregateEnum(votes, Vote::getAgeRange, AgeRange.class),
                aggregateEnum(votes, Vote::getType, Type.class),
                aggregateEnum(votes, Vote::getRegion, Region.class),
                aggregateEnum(votes, Vote::getReligion, Religion.class)
        );
    }

    /*
    T extends Enum<T> & DisplayableEnum: 제네릭으로 enum 타입 제한
    Function<Vote, T> getter: 성별, 나이, 지역 등을 추출하는 함수 전달
     */
    private static <T extends Enum<T> & DisplayableEnum> Map<String, Integer> aggregateEnum(
            List<Vote> votes, Function<Vote, T> getter, Class<T> enumClass) {

        // Enum의 모든 값에 대해 기본 카운트 0으로 초기화
        Map<String, Integer> result = new LinkedHashMap<>();
        for (T constant : enumClass.getEnumConstants()) {
            result.put(constant.getKoreanName(), 0);
        }

        // 실제 투표 데이터 기반으로 값 증가
        votes.stream()
                .map(getter)
                .filter(Objects::nonNull)
                .collect(Collectors.groupingBy(DisplayableEnum::getKoreanName, Collectors.counting()))
                .forEach((key, count) -> result.put(key, count.intValue()));

        return result;
    }
}
