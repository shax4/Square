import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native';
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
import CommentInput from '../../components/CommentInput/CommentInput';

type OpinionListScreenRouteProp = RouteProp<StackParamList, 'OpinionListScreen'>;

export default function OpinionListScreen() {
    const route = useRoute<OpinionListScreenRouteProp>();
    const { debateId, showVoteResultModal = false } = route.params;

    const [isSummary, setIsSummary] = useState(true); // ai요약, 의견 토글
    const [selectedTab, setSelectedTab] = useState<'like' | 'comment' | 'recent'>('recent');
    const [commentText, setCommentText] = useState('');

    const [summaries, setSummaries] = useState(SummariesResponse1);
    const [opinions, setOpinions] = useState(opinionResponse1);

    // Axios로 가져와야 함
    const debate = debateList[debateId];

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
        >
            <SafeAreaView style={styles.container}>
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
                    <Text style={styles.optionTextLeft}>{debate.leftOption}</Text>
                    <Text style={styles.optionTextRight}>{debate.rightOption}</Text>
                </View>

                {/* 의견 텍스트 버블: isSummary 토글에 따라 보여주는 텍스트 버블 타입이 달라짐 */}
                <View style={styles.opinionView}>
                    {isSummary ? (
                        <SummaryBoxList
                            data={summaries}
                            onEndReached={() => { console.log("end of Data") }}
                        />
                    ) : (
                        <OpinionBoxList
                            data={opinions}
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

                {/* 하단 영역: 투표 버튼과 댓글 입력창 */}

                <View style={styles.bottomContainer}>
                    {/* 좌 우 투표 버튼 */}
                    <View style={isSummary ? styles.VoteButtonView : styles.VoteButtonViewSmall}>
                        <VoteButton
                            debate={debate}
                            showVoteResultModal={showVoteResultModal}
                        />
                    </View>

                    {/* 참여중 인원 출력 */}
                    {isSummary && (
                        <View style={styles.TotalVoteCountView}>
                            <Text>지금까지 {debate.totalVoteCount}명 참여중</Text>
                        </View>
                    )}

                </View>
                {!isSummary && (
                    <CommentInput
                        onChangeText={setCommentText}
                        onSubmit={() => {
                            console.log("Comment submitted:", commentText);
                            setCommentText('');
                        }}
                        value={commentText}
                        placeholder='의견을 입력하세요...'
                    />
                )}
            </SafeAreaView>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },
    topicView: {
        maxHeight: 100,
        minHeight: 60,
        alignItems: 'flex-start',
        margin: 12,
        flexWrap: 'wrap',
    },
    topicViewText: {
        margin: 10,
        fontSize: 30,
        fontWeight: '600',
    },
    optionView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginLeft: 20,
        marginRight: 20,
        marginBottom: 10,
    },
    optionTextLeft: {
        width: '30%',
        height: 40,
        lineHeight: 40,
        backgroundColor: colors.yesLight,
        fontSize: 15,
        borderRadius: 15,
        textAlign: 'center',
    },
    optionTextRight: {
        width: '30%',
        height: 40,
        lineHeight: 40,
        backgroundColor: colors.noLight,
        fontSize: 15,
        borderRadius: 15,
        textAlign: 'center',
    },
    opinionView: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    opinionTypeToggleView: {
        position: 'absolute',
        bottom: 10,
        backgroundColor: 'rgba(0, 0, 0, 0)',
    },
    bottomContainer: {
        width: '100%',
    },
    VoteButtonView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.white,
        paddingVertical: 15,
    },
    VoteButtonViewSmall: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.white,
        paddingVertical: 10,
    },
    TotalVoteCountView: {
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: colors.white,
        paddingBottom: 15,
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
        flex: 1,
        textAlign: 'center',
        paddingVertical: 10,
        borderRadius: 12,
        color: '#888',
        fontWeight: '500',
    },
    selectedTabButton: {
        backgroundColor: '#ffffff',
        color: '#000',
    },
});