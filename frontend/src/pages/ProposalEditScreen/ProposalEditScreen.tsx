import React, { useState } from "react";
import { View, StyleSheet, TextInput, Alert } from "react-native";
import colors from "../../../assets/colors";
import { Button } from "../../components";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { DebateStackParamList } from "../../shared/page-stack/DebatePageStack";
import { styles as VoteButtonStyle } from '../../components/VoteButton/VoteButton.styles'
import { createDebate } from "../ProposalCreateScreen/Api/proposalAPI";

export default function ProposalEditScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<DebateStackParamList>>();
    const route = useRoute<RouteProp<DebateStackParamList, 'ProposalEditScreen'>>();
    const { proposal } = route.params;
    const [debateTopic, setDebateTopic] = useState(proposal.topic);

    const [leftOption, setLeftOption] = useState('');
    const [rightOption, setRightOption] = useState('');

    const confirmCreateDebate = () => {
        // 저장 로직
        createDebateAPi(debateTopic);

        // 저장되었습니다 모달 클릭해 돌아가도록
        Alert.alert(
            "등록 완료",
            "청원이 정상적으로 등록되었습니다.",
            [
                {
                    text: "확인",
                    onPress: () => {
                        navigation.pop(2);
                        navigation.navigate("ProposalListScreen")
                    },
                }
            ]
        );
    }

    const createDebateAPi = async (topic: string) => {
        try {
            const debateData = {
                proposalId: proposal.proposalId,
                topic: debateTopic,
                leftOption: leftOption,
                rightOption: rightOption,
            };
            const response = await createDebate(debateData);
        } catch (error) {
            Alert.alert(
                "등록 실패",
                "청원 등록 중 문제가 발생했습니다. 잠시후 다시 실행해주세요.",
                [
                    {
                        text: "확인"
                    }
                ]
            );
        }
    }


    return (
        <View style={styles.Container}>
            {/* 토론 주제 입력 */}
            <View style={styles.TopicTypingView}>
                <TextInput style={styles.TopicTextInput}
                    placeholder="토론 주제를 입력하세요"
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
                            placeholder="왼쪽 선택지 입력..."
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
                            placeholder="오른쪽 선택지 입력..."
                        />

                    </View>
                </View>
            </View>

            <View style={styles.CreateButtonView}>
                <Button
                    label="논쟁 등록"
                    onPress={confirmCreateDebate}
                />
            </View>
            <View style={styles.BottomBlankView}>

            </View>

        </View>
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
    }

});
