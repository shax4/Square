import React, { useState } from "react";
import { View, KeyboardAvoidingView, ScrollView, Platform, StyleSheet, TextInput, Alert, Text } from "react-native";
import colors from "../../../assets/colors";
import { Button } from "../../components";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { DebateStackParamList } from "../../shared/page-stack/DebatePageStack";
import { styles as VoteButtonStyle } from '../../components/VoteButton/VoteButton.styles'
import { createDebate } from "../ProposalCreateScreen/Api/proposalAPI";
import CategoryDropdown from "./components/CategoryModalProps";

export default function ProposalEditScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<DebateStackParamList>>();
    const route = useRoute<RouteProp<DebateStackParamList, 'ProposalEditScreen'>>();
    const { proposal } = route.params;
    const [debateTopic, setDebateTopic] = useState(proposal.topic);

    const [leftOption, setLeftOption] = useState('');
    const [rightOption, setRightOption] = useState('');
    const [category, setCategory] = useState('');
    const [warnMessage, setWarnMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const confirmCreateDebate = () => {
        if (isSubmitting) return; // 중복 클릭 방지

        const topicLength = debateTopic.trim().length;
        const leftLength = leftOption.trim().length;
        const rightLength = rightOption.trim().length;

        if (!category) {
            setWarnMessage('카테고리를 선택해주세요.');
            hideWarnMessageAfterDelay();
            return;
        }

        if (topicLength < 10 || topicLength > 30) {
            setWarnMessage('주제는 10자 이상 30자 이하여야 합니다.');
            hideWarnMessageAfterDelay();
            return;
        }

        if (leftLength === 0 || rightLength === 0) {
            setWarnMessage('선택지를 모두 입력해주세요.');
            hideWarnMessageAfterDelay();
            return;
        }

        if (leftLength > 3 || rightLength > 3) {
            setWarnMessage('선택지는 3자 이하여야 합니다.');
            hideWarnMessageAfterDelay();
            return;
        }

        setIsSubmitting(true); // 등록 시도 시작
        // 저장 로직
        createDebateAPI(debateTopic);
    }


    const hideWarnMessageAfterDelay = () => {
        setTimeout(() => setWarnMessage(''), 3000);
    };

    const createDebateAPI = async (topic: string) => {
        try {
            const debateData = {
                proposalId: proposal.proposalId,
                topic: debateTopic,
                leftOption: leftOption,
                rightOption: rightOption,
                categoryName: category,
            };
            const response = await createDebate(debateData);
            // 저장되었습니다 모달 클릭해 돌아가도록
            Alert.alert(
                "등록 완료",
                "청원이 정상적으로 등록되었습니다.",
                [
                    {
                        text: "확인",
                        onPress: () => {
                            setIsSubmitting(false); // 등록 완료
                            navigation.pop(2);
                            navigation.navigate("ProposalListScreen")
                        },
                    }
                ]
            );
        } catch (error) {
            setIsSubmitting(false); // 등록 실패
            Alert.alert(
                "등록 실패",
                String(error),
                //"청원 등록 중 문제가 발생했습니다. 잠시후 다시 실행해주세요.",
                [
                    {
                        text: "확인"
                    }
                ]
            );
        }
    }

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0} // 헤더 높이에 따라 조정
        >
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <View style={styles.Container}>
                    <View style={styles.Container}>

                        {/* 카테고리 선택 모달 */}
                        <CategoryDropdown
                            category={category}
                            setCategory={setCategory}
                        />

                        {/* 토론 주제 입력 */}
                        <View style={styles.TopicTypingView}>
                            <TextInput style={styles.TopicTextInput}
                                placeholder="토론 주제를 입력하세요(10 ~ 30글자)"
                                value={debateTopic}
                                onChangeText={setDebateTopic}
                                maxLength={100} //토론 주제 최대 길이 제한
                            />
                        </View>

                        {/* 좌 우 의견 작성 */}
                        <View style={styles.VoteButtonView}>
                            <View style={VoteButtonStyle.Container}>

                                <View
                                    style={[
                                        VoteButtonStyle.VoteButtonBase, VoteButtonStyle.VoteNotSelectedLeft]}
                                >
                                    <TextInput
                                        style={VoteButtonStyle.VoteContents}
                                        value={leftOption}
                                        onChangeText={setLeftOption}
                                        placeholder="3 글자 이내 선택지 입력"
                                    />
                                </View>

                                <View
                                    style={[
                                        VoteButtonStyle.VoteButtonBase, VoteButtonStyle.VoteNotSelectedRight]}
                                >
                                    <TextInput
                                        style={VoteButtonStyle.VoteContents}
                                        value={rightOption}
                                        onChangeText={setRightOption}
                                        placeholder="3 글자 이내 선택지 입력"
                                    />

                                </View>
                            </View>
                        </View>

                        <View style={{ alignItems: 'center', marginTop: 10 }}>
                            {warnMessage !== '' && (
                                <Text style={{ fontSize: 15 }}>{warnMessage}</Text>
                            )}
                        </View>

                        <View style={styles.CreateButtonView}>
                            <Button
                                label={isSubmitting ? "등록 중..." : "논쟁 등록"}
                                onPress={confirmCreateDebate}
                                disabled={isSubmitting}
                            />
                        </View>
                        <View style={styles.BottomBlankView}>

                        </View>

                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>

    );
}

const styles = StyleSheet.create({
    Container: {
        flex: 1,
        backgroundColor: colors.white,
    },
    TopicTypingView: {
        flex: 5,
        marginTop: 20,
        marginHorizontal: 20,
        borderRadius: 15,
        backgroundColor: colors.hashtag,
    },
    TopicTextInput: {
        flex: 1,
        margin: 20,
        fontSize: 20,

    },
    OptionTextInput: {
        fontSize: 15,
    },
    VoteButtonView: {
        flex: 3,

    },
    CreateButtonView: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center',

    },
    BottomBlankView: {
        flex: 5,
    },
    CategoryPickerView: {
        marginTop: 20,
        marginHorizontal: 20,
        backgroundColor: colors.hashtag,
        borderRadius: 15,
        overflow: 'hidden',
    },

    Picker: {
        height: 50,
        paddingHorizontal: 10,
    },

});
