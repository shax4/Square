import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { StackParamList } from '../../shared/page-stack/DebatePageStack';
import { debateData as debateList } from '../DebateCardsScreen/DebateCard/card-data';
import colors from '../../../assets/colors';
import VoteButton from '../../components/VoteButton/VoteButton';

import ToggleSwitch from './Components/ToggleSwitch';

import SummaryBoxList from './Components/Summary/SummaryBoxList'
import { SummariesResponse1 } from './Components/Summary';

import OpinionBoxList from './Components/Opinion/OpinionBoxList';
import { opinionResponse1 } from './Components/Opinion/opinion-list-test-data';

type OpinionListScreenRouteProp = RouteProp<StackParamList, 'OpinionListScreen'>;

export default function OpinionListScreen() {
    const route = useRoute<OpinionListScreenRouteProp>();
    const { debateId, showVoteResultModal = false } = route.params;

    const [isSummary, setIsSummary] = useState(true); // ai요약, 의견 토글
    const [selectedTab, setSelectedTab] = useState<'like' | 'comment' | 'recent'>('recent');

    // Axios로 가져와야 함
    const debate = debateList[debateId];

    return (
        <View style={styles.container}>
            {/* 토론 주제 표시 */}
            <View style={styles.topicView}>
                <Text style={styles.topicViewText}>{debate.topic}</Text>
            </View>

            {!isSummary && (
                <View style={styles.tabContainer}>
                    <Text
                        style={[
                            styles.tabButton,
                            selectedTab === 'like' && styles.selectedTabButton
                        ]}
                        onPress={() => setSelectedTab('like')}
                    >
                        좋아요순
                    </Text>
                    <Text
                        style={[
                            styles.tabButton,
                            selectedTab === 'comment' && styles.selectedTabButton
                        ]}
                        onPress={() => setSelectedTab('comment')}
                    >
                        댓글 많은순
                    </Text>
                    <Text
                        style={[
                            styles.tabButton,
                            selectedTab === 'recent' && styles.selectedTabButton
                        ]}
                        onPress={() => setSelectedTab('recent')}
                    >
                        최신순
                    </Text>
                </View>
            )}


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
                    showVoteResultModal={showVoteResultModal}
                />
            </View>

            {/* 참여중 인원 출력 */}
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

    },
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: '#eeeeee',
        borderRadius: 15,
        marginHorizontal: 20,
        padding: 4,
        marginBottom: 10,
        alignItems: 'center',
    },

    tabButton: {
        flex: 1, // <- 동일한 너비로 분할
        textAlign: 'center',
        paddingVertical: 10,
        borderRadius: 10,
        color: '#888',
        fontWeight: '500',
    },

    selectedTabButton: {
        backgroundColor: '#ffffff',
        color: '#000',
    },

});