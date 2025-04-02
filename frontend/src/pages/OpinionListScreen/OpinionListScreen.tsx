import React, { useEffect, useLayoutEffect, useState } from 'react';
import { View, Text, KeyboardAvoidingView, Platform, SafeAreaView, TouchableOpacity } from 'react-native';
import { styles } from './Components/OpinionListScreen.styles'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackParamList } from '../../shared/page-stack/DebatePageStack';
import VoteButton from '../../components/VoteButton/VoteButton';
import ToggleSwitch from './Components/ToggleSwitch';
import SummaryBoxList from './Components/Summary/SummaryBoxList'
import { Summary } from './Components/Summary';
import OpinionBoxList from './Components/Opinion/OpinionBoxList';
import CommentInput from '../../components/CommentInput/CommentInput';
import { getOpinions, createOpinion, updateOpinion, deleteOpinion } from './api/OpinionsApi';
import { Opinion } from './Components/Opinion';
import { getSummaries } from './api/SummariesApi';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import BookmarkButton from '../../components/BookmarkButton/BookmarkButton';
import { Icons } from '../../../assets/icons/Icons';


type OpinionListScreenRouteProp = RouteProp<StackParamList, 'OpinionListScreen'>;

export default function OpinionListScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>();
    const route = useRoute<OpinionListScreenRouteProp>();
    const { debateId, debate, showVoteResultModal = false } = route.params;

    // 정렬 및 토글
    const [isSummary, setIsSummary] = useState(true); // ai요약, 의견 토글
    const [sort, setSort] = useState<'like' | 'comment' | 'recent'>('recent');
    const [commentText, setCommentText] = useState('');

    // 요약 정보
    const [summaries, setSummaries] = useState<Summary[]>([]);

    // 의견 페이징
    const [opinions, setOpinions] = useState<Opinion[]>([]);
    const [nextLeftCursorId, setNextLeftCursorId] = useState<number | null>(null);
    const [nextRightCursorId, setNextRightCursorId] = useState<number | null>(null);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [scrap, setScrap] = useState(debate.isScraped);
    const limit = 5;

    /*
    useEffect(() => {
        initOpinions();
    }, [sort]);
    */
    useEffect(() => {
        initAiSummaries();
    }, []);

    // AI 요약 초기 요약
    const initAiSummaries = () => {
        setSummaries([]);
        fetchSummaries();
    }

    // AI 요약 정보 불러오기
    const fetchSummaries = async () => {
        setLoading(true);
        try {
            const response = await getSummaries(debateId);

            // AI 요약 설정
            setSummaries(response.summaries);
        } catch (e) {
            console.error("AI 요약 불러오기 실패:", e);
        } finally {
            setLoading(false);
        }
    }

    // 의견 초기 리셋
    const initOpinions = () => {
        setOpinions([]);
        setNextLeftCursorId(null);
        setNextRightCursorId(null);
        setHasMore(true);
        fetchOpinions();
    }

    const fetchOpinions = async () => {
        if (loading || !hasMore) return;

        setLoading(true);

        try {
            const response = await getOpinions(debateId, {
                nextLeftCursorId,
                nextRightCursorId,
                limit,
            });

            setOpinions((prev) => [...prev, ...response.opinions]);
            setNextLeftCursorId(response.nextLeftCursorId);
            setNextRightCursorId(response.nextRightCursorId);

            // 다음 커서가 모두 null이면 더 이상 불러올 게 없음
            if (!response.nextLeftCursorId && !response.nextRightCursorId) {
                setHasMore(false);
            }
        } catch (e) {
            console.error("의견 불러오기 실패:", e);
        } finally {
            setLoading(false);
        }
    };

    const handleScrap = () => {
        setScrap(!scrap);
        // Axios 북마크 요청
    }

    // 상단 탭에 공유 및 북마크 버튼 추가
    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <View style={styles.headerRightItems}>
                    <TouchableOpacity onPress={() => console.log('공유')}>
                        <Icons.share />
                    </TouchableOpacity>
                    <BookmarkButton
                        isScraped={scrap}
                        onPressScrap={handleScrap}
                    />
                </View>
            ),
        });
    }, [scrap]);

    const handleOpinionPosting = async () => {
        if (debate.isLeft == null) {
            console.debug("투표해야 의견 입력 가능");
            return;
        }
        try {
            const response = await createOpinion(debateId, debate.isLeft, commentText);
            setCommentText('');
        } catch (e) {
            console.debug("OpinionListScreen.handleOpinionPosting 실패:", e);
        } finally {

        }

    }

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
                                sort === 'like' && styles.selectedTabButton
                            ]}
                            onPress={() => setSort('like')}
                        >
                            좋아요순
                        </Text>
                        <Text
                            style={[
                                styles.tabButton,
                                sort === 'comment' && styles.selectedTabButton
                            ]}
                            onPress={() => setSort('comment')}
                        >
                            댓글 많은순
                        </Text>
                        <Text
                            style={[
                                styles.tabButton,
                                sort === 'recent' && styles.selectedTabButton
                            ]}
                            onPress={() => setSort('recent')}
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
                        />
                    ) : (
                        <OpinionBoxList
                            data={opinions}
                            onEndReached={() => { console.log("페이징 끝 도달") }}
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
                        onSubmit={handleOpinionPosting}
                        value={commentText}
                        placeholder='의견을 입력하세요...'
                    />
                )}
            </SafeAreaView>
        </KeyboardAvoidingView>
    )
}