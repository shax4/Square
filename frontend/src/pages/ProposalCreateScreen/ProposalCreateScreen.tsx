import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, FlatList, TouchableOpacity, ListRenderItem, TextInput } from "react-native";
import colors from "../../../assets/colors";
import { Button } from "../../components";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackParamList } from "../../shared/page-stack/DebatePageStack";
import { VoteCreateButtonView } from "../../components/VoteButton/VoteCreateButton";

export default function ProposalCreateScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>();
    const [debateTopic, setDebateTopic] = useState('');

    const confirmCreateProposal = () => {
        // 저장 로직
        console.log(debateTopic);
        navigation.navigate("ProposalListScreen");
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
