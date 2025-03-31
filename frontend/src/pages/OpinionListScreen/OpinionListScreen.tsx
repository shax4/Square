import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { StackParamList } from '../../shared/page-stack/DebatePageStack';
import { debateData, debateData as debateList } from '../DebateCardsScreen/DebateCard/card-data';
import colors from '../../../assets/colors';
import VoteButton from '../../components/VoteButton/VoteButton';

import DebateResultModal from '../DebateResultModal/DebateResultModal';
import { resultData } from './Components/debate-result-test-data';

import ToggleSwitch from './Components/ToggleSwitch';

import SummaryBoxList from './Components/Summary/SummaryBoxList'
import { SummariesResponse1 } from './Components/Summary';

import OpinionBoxList from './Components/Opinion/OpinionBoxList';
import { opinionResponse1 } from './Components/Opinion/opinion-list-test-data';

type OpinionListScreenRouteProp = RouteProp<StackParamList, 'OpinionListScreen'>;

export default function OpinionListScreen() {
    const route = useRoute<OpinionListScreenRouteProp>();
    const { debateId, isDebateModalInitialVisible } = route.params;

    const [isSummary, setIsSummary] = useState(true); // ai요약, 의견 토글
    const [isModalVisible, setIsModalVisible] = useState(isDebateModalInitialVisible);

    const closeDebateResultModal = () => {
        setIsModalVisible(false);
    }

    const openDebateResultModal = () => {
        setIsModalVisible(true);
    }

    useEffect(() => {
        if (isDebateModalInitialVisible) {
            openDebateResultModal();
        } else {
            closeDebateResultModal();
        }
    }, [isDebateModalInitialVisible]);

    // Axios로 가져와야 함
    const debate = debateList[debateId];

    // 투표 통계 데이터
    const [debateResultData, setDebateResultData] = useState(resultData);



    return (
        <View style={styles.container}>
            {/* 토론 주제 표시 */}
            <View style={styles.topicView}>
                <Text style={styles.topicViewText}>{debate.topic}</Text>
            </View>

            {/* 좌 우 의견 옵션 태그 */}
            <View style={styles.optionView}>
                <Text style={styles.optionText}>{debate.leftOption}</Text>
                <Text style={styles.optionText}>{debate.rightOption}</Text>
            </View>

            {/* 의견 텍스트 버블: isSummary 토글에 따라 보여주는 텍스트 버블 타입이 달라짐 */}
            <View style={styles.opinionView}>
                {isSummary ? (
                    <SummaryBoxList
                        data={SummariesResponse1}
                        onEndReached={() => { console.log("end of Data") }}
                    />
                ) : (
                    <OpinionBoxList
                        data={opinionResponse1}
                        onEndReached={() => { console.log("end of Data") }}
                    />
                )}

                {/* AI 요약 및 전체 의견 텍스트 토글 */}
                <View style={styles.opinionTypeToggleView}>
                    <ToggleSwitch
                        isSummary={isSummary}
                        setIsSummary={setIsSummary}
                    />
                </View>
            </View>


            {/* 좌 우 투표 버튼 */}
            <View style={styles.VoteButtonView}>
                <VoteButton
                    debate={debate}
                />
            </View>

            {/* 참여중 인원 출력 */}
            <View style={styles.TotalVoteCountView}>
                <Text>지금까지 {debate.totalVoteCount}명 참여중</Text>
            </View>

            <DebateResultModal
                data={debateResultData}
                leftOption={debate.leftOption}
                rightOption={debate.rightOption}
                visible={isModalVisible}
                onClose={() => closeDebateResultModal()}
                onPressMoreOpinion={() => { }}
            />
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
        marginBottom: 10,
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
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    opinionTypeToggleView: {
        position: 'absolute',
        bottom: 10,
        backgroundColor: 'rgba(0 , 0, 0, 0)',
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
        justifyContent: 'flex-start',
        backgroundColor: colors.white,

    }
});