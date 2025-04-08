import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, FlatList, TouchableOpacity, ListRenderItem, TextInput, Alert } from "react-native";
import colors from "../../../assets/colors";
import { Button } from "../../components";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { DebateStackParamList } from "../../shared/page-stack/DebatePageStack";
import { VoteCreateButtonView } from "../../components/VoteButton/VoteCreateButton";
import { ProposalResponse } from "./Type/ProposalTypes";
import { postProposal } from "./Api/proposalAPI";

export default function ProposalCreateScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<DebateStackParamList>>();
    const [debateTopic, setDebateTopic] = useState('');

    const confirmCreateProposal = () => {
        // 저장 로직
        createProposal(debateTopic);

        // 저장되었습니다 모달 클릭해 돌아가도록
        Alert.alert(
            "작성 완료",
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

    const createProposal = async (topic: string) => {
        try {
            const data: ProposalResponse = await postProposal(topic);

            console.log("신청 완료된 주제 ID : ", data.proposalId);
        } catch (error) {
            console.debug("주제 청원 신청 실패 : ", error);
            Alert.alert(
                "작성 실패패",
                "청원 신청 중 문제가 발생했습니다. 잠시후 다시 실행해주세요.",
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

            <View style={styles.VoteButtonView}>
                <VoteCreateButtonView />
            </View>

            <View style={styles.CreateButtonView}>
                <Button
                    label="작성하기"
                    onPress={confirmCreateProposal}
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
