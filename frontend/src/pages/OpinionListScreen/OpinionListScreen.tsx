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
import { getOpinions, createOpinion } from './api/OpinionsApi';
import { Opinion } from './Components/Opinion';
import { getSummaries } from './api/SummariesApi';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import BookmarkButton from '../../components/BookmarkButton/BookmarkButton';
import { Icons } from '../../../assets/icons/Icons';
import { useDebateStore } from '../../shared/stores/debates';
import { SortType } from './OpinionSortType';

type OpinionListScreenRouteProp = RouteProp<StackParamList, 'OpinionListScreen'>;


export default function OpinionListScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>();
    const route = useRoute<OpinionListScreenRouteProp>();
    const { debateId, showVoteResultModal = false } = route.params;

    const { debates, updateDebate } = useDebateStore();
    const debate = debates.find((d) => d.debateId === debateId);
    if (!debate) return <Text>Wrong debateId</Text>;

    const [isSummary, setIsSummary] = useState(true);
    const [sort, setSort] = useState<SortType>(SortType.Latest);
    const [commentText, setCommentText] = useState('');

    const [summaries, setSummaries] = useState<Summary[]>([]);

    const [opinionStateMap, setOpinionStateMap] = useState<Record<SortType, {
        opinions: Opinion[];
        nextLeftCursorId: number | null;
        nextRightCursorId: number | null;
        hasMore: boolean;
    }>>({
        latest: { opinions: [], nextLeftCursorId: null, nextRightCursorId: null, hasMore: true },
        likes: { opinions: [], nextLeftCursorId: null, nextRightCursorId: null, hasMore: true },
        comments: { opinions: [], nextLeftCursorId: null, nextRightCursorId: null, hasMore: true },
    });

    const [loading, setLoading] = useState(false);
    const [scrap, setScrap] = useState(debate.isScraped);
    const limit = 5;

    useEffect(() => {
        fetchAllSorts();
        initAiSummaries();
    }, []);

    const fetchAllSorts = async () => {
        for (const sortType of [SortType.Latest, SortType.Likes, SortType.Comments] as SortType[]) {
            await fetchOpinionsBySort(sortType);
        }
    };

    const fetchOpinionsBySort = async (sortType: SortType) => {
        const current = opinionStateMap[sortType];
        if (!current.hasMore || loading) return;

        setLoading(true);

        try {
            const response = await getOpinions(debateId, {
                sort: sortType,
                nextLeftCursorId: current.nextLeftCursorId,
                nextRightCursorId: current.nextRightCursorId,
                limit,
            });

            setOpinionStateMap(prev => ({
                ...prev,
                [sortType]: {
                    opinions: [...prev[sortType].opinions, ...response.opinions],
                    nextLeftCursorId: response.nextLeftCursorId,
                    nextRightCursorId: response.nextRightCursorId,
                    hasMore: !!(response.nextLeftCursorId || response.nextRightCursorId),
                }
            }));
        } catch (e) {
            console.error(`의견 불러오기 실패 (${sortType}):`, e);
        } finally {
            setLoading(false);
        }
    };

    const initAiSummaries = () => {
        setSummaries([]);
        fetchSummaries();
    };

    const fetchSummaries = async () => {
        setLoading(true);
        try {
            const response = await getSummaries(debateId);
            setSummaries(response.summaries);
        } catch (e) {
            console.error("AI 요약 불러오기 실패:", e);
        } finally {
            setLoading(false);
        }
    };

    const handleScrap = () => {
        const newScrap = !scrap;
        setScrap(newScrap);
        updateDebate(debateId, { isScraped: newScrap });
    };

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <View style={styles.headerRightItems}>
                    <TouchableOpacity onPress={() => console.log('공유')}>
                        <Icons.share />
                    </TouchableOpacity>
                    <BookmarkButton
                        isScraped={debate.isScraped}
                        onPressScrap={() => handleScrap()}
                    />
                </View>
            ),
        });
    }, [debate.isScraped]);

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
        }
    };

    const currentOpinions = opinionStateMap[sort].opinions;

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
        >
            <SafeAreaView style={styles.container}>
                <View style={styles.topicView}>
                    <Text style={styles.topicViewText}>{debate.topic}</Text>
                </View>

                {/* 의견 목록 */}
                {!isSummary && (
                    <View style={styles.tabContainer}>
                        <Text
                            style={[
                                styles.tabButton,
                                sort === SortType.Likes && styles.selectedTabButton
                            ]}
                            onPress={() => setSort(SortType.Likes)}
                        >
                            좋아요순
                        </Text>
                        <Text
                            style={[
                                styles.tabButton,
                                sort === SortType.Comments && styles.selectedTabButton
                            ]}
                            onPress={() => setSort(SortType.Comments)}
                        >
                            댓글 많은순
                        </Text>
                        <Text
                            style={[
                                styles.tabButton,
                                sort === SortType.Latest && styles.selectedTabButton
                            ]}
                            onPress={() => setSort(SortType.Latest)}
                        >
                            최신순
                        </Text>
                    </View>
                )}

                <View style={styles.optionView}>
                    <Text style={styles.optionTextLeft}>{debate.leftOption}</Text>
                    <Text style={styles.optionTextRight}>{debate.rightOption}</Text>
                </View>

                <View style={styles.opinionView}>
                    {isSummary ? (
                        <SummaryBoxList data={summaries} />
                    ) : (
                        <OpinionBoxList
                            data={currentOpinions}
                            onEndReached={() => fetchOpinionsBySort(sort)}
                        />
                    )}

                    <View style={styles.opinionTypeToggleView}>
                        <ToggleSwitch
                            isSummary={isSummary}
                            setIsSummary={setIsSummary}
                        />
                    </View>
                </View>

                <View style={styles.bottomContainer}>
                    <View style={isSummary ? styles.VoteButtonView : styles.VoteButtonViewSmall}>
                        <VoteButton
                            debateId={debateId}
                            showVoteResultModal={showVoteResultModal}
                        />
                    </View>

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
    );
}
