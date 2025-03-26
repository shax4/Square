import * as React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { StackParamList } from '../../shared/page-stack/DebatePageStack';
import { debateData as debateList } from '../../components/DebateCard/card-data';
import colors from '../../../assets/colors';
import { AfterVoteButtonView, BeforeVoteButtonView } from '../../components/VoteButton/VoteButton';

import { OpinionBubble } from '../../components/OpinionBubble';
import { opinionResponse1 } from '../../components/OpinionBubble';

import ToggleSwitch from './Components/ToggleSwitch';
import OpinionBubbleList from '../../components/OpinionBubble/OpinionBubbleList';

type OpinionListScreenRouteProp = RouteProp<StackParamList, 'OpinionListScreen'>;

export default function OpinionListScreen() {
    const route = useRoute<OpinionListScreenRouteProp>();
    const { debateId } = route.params;

    // Axios로 가져와야 함
    const debate = debateList[debateId];

    return (

        <View style={styles.container}>
            {/* 토론 주제 표시 */}
            <View style={styles.topicView}>
                <Text style={styles.topicViewText}>{debate.topic}</Text>
            </View>

            {/* 좌 우 의견 태그 */}
            <View style={styles.optionView}>
                <Text style={styles.optionText}>{debate.leftOption}</Text>
                <Text style={styles.optionText}>{debate.rightOption}</Text>
            </View>

            {/* 의견 텍스트 버블: 토글에 따라 보여주는 텍스트 버블 타입이 달라짐 */}
            <View style={styles.opinionView}>
                <OpinionBubbleList
                    data={opinionResponse1}
                    onEndReached={() => {console.log("end of Data")}}
                />
            </View>

            {/* AI 요약 및 전체 의견 텍스트 토글 */}
            <View style={styles.opinionTypeToggleView}>
                <ToggleSwitch />
            </View>

            {/* 좌 우 투표 버튼 */}
            <View style={styles.VoteButtonView}>
                {debate.isLeft != null ?
                    <AfterVoteButtonView
                        debate={debate}
                        onSelectLeft={() => { console.log("left Voted") }}
                        onSelectRight={() => { console.log("left Voted") }}
                    />
                    :
                    <BeforeVoteButtonView
                        debate={debate}
                        onSelectLeft={() => { console.log("left not Voted") }}
                        onSelectRight={() => { console.log("left not Voted") }}
                    />
                }
            </View>

            {/* 참여중 인원 출력력 */}
            <View style={styles.TotalVoteCountView}>
                <Text>지금까지 {debate.totalVoteCount}명 참여중</Text>
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    topicView: {
        height: 100,
        alignItems: 'flex-start',
        margin: 20,
        flexWrap: 'wrap',
    },
    topicViewText: {
        fontSize: 30,
        fontWeight: 600,
    },
    optionView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginLeft: 20,
        marginRight: 20,
    },
    optionText: {
        width: '30%',
        height: 40,
        lineHeight: 40,
        backgroundColor: colors.hashtag,
        fontSize: 15,
        borderRadius: 15,
        textAlign: 'center',
    },
    opinionView: {
        flex: 8,
    },
    opinionTypeToggleView: {
        flex: 1.2,
    },
    VoteButtonView: {
        flex: 3,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.white,
    },
    TotalVoteCountView: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.white,
    }
});