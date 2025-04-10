import React, { useEffect, useLayoutEffect, useState, useCallback, useRef } from 'react';
import { View, KeyboardAvoidingView, Platform, SafeAreaView, TouchableOpacity, Image } from 'react-native';
import { styles } from './Components/OpinionListScreen.styles'
import { RouteProp, useNavigation, useRoute, useFocusEffect, useIsFocused } from '@react-navigation/native';
import { DebateStackParamList } from '../../shared/page-stack/DebatePageStack';
import VoteButton from '../../components/VoteButton/VoteButton';
import ToggleSwitch from './Components/ToggleSwitch';
import SummaryBoxList from './Components/Summary/SummaryBoxList'
import { Summary } from './Components/Summary';
import OpinionBoxList from './Components/Opinion/OpinionBoxList';
import CommentInput from '../../components/CommentInput/CommentInput';
import { getOpinions, createOpinion } from './api/OpinionApi';
import { Opinion } from './Components/Opinion';
import { getSummaries } from './api/SummariesApi';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import ScrapButton from '../../components/ScrapButton/ScrapButton';
import { Icons } from '../../../assets/icons/Icons';
import { useDebateStore } from '../../shared/stores/debates';
import { SortType } from './Components/OpinionSortType';
import { useAuthStore } from '../../shared/stores';
import Text from '../../components/Common/Text';

type OpinionListScreenRouteProp = RouteProp<DebateStackParamList, 'OpinionListScreen'>;

const emptyCursor = {
    nextLeftCursorId: null,
    nextLeftCursorLikes: null,
    nextLeftCursorComments: null,
    nextRightCursorId: null,
    nextRightCursorLikes: null,
    nextRightCursorComments: null,
}

interface PagingCursor {
    // 왼쪽 의견 커서
    nextLeftCursorId: number | null;
    nextLeftCursorLikes: number | null;
    nextLeftCursorComments: number | null;
    // 오른쪽 의견 커서
    nextRightCursorId: number | null;
    nextRightCursorLikes: number | null;
    nextRightCursorComments: number | null;
}

export default function OpinionListScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<DebateStackParamList>>();

    const { loggedIn, user } = useAuthStore();

    const route = useRoute<OpinionListScreenRouteProp>();
    const { debateId, showVoteResultModal = false, showSummaryFirst = true } = route.params;

    const { debates, updateDebate } = useDebateStore();
    const debate = debates.find((d) => d.debateId === debateId);
    if (!debate) return <Text>Wrong debateId</Text>;

    // 로딩을 통한 데이터 초기화 중 렌더링 방지 
    const [loading, setLoading] = useState(false);

    // 스크랩 버튼 관리
    const [scrap, setScrap] = useState(false);
    useEffect(() => {
        if (debate) {
            setScrap(debate.isScraped);
        } else {
            setScrap(false);
        }
    }, [debate]);

    const [isSummary, setIsSummary] = useState(true);
    const [commentText, setCommentText] = useState('');
    const [summaries, setSummaries] = useState<Summary[]>([]);

    // 페이징 커서 관리
    const [cursor, setCursor] = useState<PagingCursor>(emptyCursor);
    const limit = 5;

    const [sort, setSort] = useState<SortType>(SortType.Latest);
    const [opinionStateMap, setOpinionStateMap] = useState<Record<SortType, {
        opinions: Opinion[];
        hasMore: boolean;
    }>>({
        latest: {
            opinions: [],
            hasMore: true
        },
        likes: {
            opinions: [],
            hasMore: true
        },
        comments: {
            opinions: [],
            hasMore: true
        },
    });


    // 햔재 탭의 의견
    const currentOpinions = opinionStateMap[sort].opinions;

    useEffect(() => {
        setIsSummary(showSummaryFirst);
    }, [showSummaryFirst]);

    // 화면 새로 도달 시 새로고침
    useFocusEffect(
        useCallback(() => {

            // AI 요약 초기화
            setSummaries([]);
            initAiSummaries();

            if (!loggedIn) return;

            // 의견 목록 초기화 및 다시 불러오기
            setOpinionStateMap({
                latest: { opinions: [], hasMore: true },
                likes: { opinions: [], hasMore: true },
                comments: { opinions: [], hasMore: true },
            });
            setCursor(emptyCursor);

            fetchAllSorts();

        }, [debateId, loggedIn])
    );

    // 처음 로드 시 각 정렬 방식에 맞춰 의견들 가져오기
    const fetchAllSorts = useCallback(async () => {
        for (const sortType of [SortType.Latest, SortType.Likes, SortType.Comments] as SortType[]) {
            await fetchOpinionsBySort(sortType, true);
        }
    }, [debateId, cursor]); // 필요한 의존성 추가

    // 정렬 방식에 맞춰 의견 목록 조회 요청
    const fetchOpinionsBySort = async (sortType: SortType, force = false) => {
        const current = opinionStateMap[sortType];
        if (!current.hasMore || loading || !loggedIn) return;

        setLoading(true);

        try {
            const response = await getOpinions(debateId, {
                sort: sortType,
                nextLeftCursorId: force ? null : cursor.nextLeftCursorId,
                nextLeftCursorLikes: force ? null : cursor.nextLeftCursorLikes,
                nextLeftCursorComments: force ? null : cursor.nextLeftCursorComments,

                nextRightCursorId: force ? null : cursor.nextRightCursorId,
                nextRightCursorLikes: force ? null : cursor.nextRightCursorLikes,
                nextRightCursorComments: force ? null : cursor.nextRightCursorComments,

                limit,
            });

            let hasMoreData = false;

            // 이전 커서 ID와 현재 응답의 커서 ID 비교해 더 불러올 데이터가 존재하는지 판단
            if (sortType === SortType.Latest) {
                hasMoreData =
                    response.nextLeftCursorId !== cursor.nextLeftCursorId ||
                    response.nextRightCursorId !== cursor.nextRightCursorId;
            } else if (sortType === SortType.Likes) {
                hasMoreData =
                    response.nextLeftCursorLikes !== cursor.nextLeftCursorLikes ||
                    response.nextRightCursorLikes !== cursor.nextRightCursorLikes;
            } else if (sortType === SortType.Comments) {
                hasMoreData =
                    response.nextLeftCursorComments !== cursor.nextLeftCursorComments ||
                    response.nextRightCursorComments !== cursor.nextRightCursorComments;
            }

            // 새 커서로 설정
            setCursor({
                nextLeftCursorId: response.nextLeftCursorId,
                nextLeftCursorLikes: response.nextLeftCursorLikes,
                nextLeftCursorComments: response.nextLeftCursorComments,

                nextRightCursorId: response.nextRightCursorId,
                nextRightCursorLikes: response.nextRightCursorLikes,
                nextRightCursorComments: response.nextRightCursorComments,
            })

            if (force) {
                setOpinionStateMap(prev => ({
                    ...prev,
                    [sortType]: {
                        opinions: response.opinions,
                        hasMore: hasMoreData
                    }
                }));
            } else {
                // 중복 방지를 위한 필터링
                const existingIds = new Set(current.opinions.map(op => op.opinionId));
                const newOpinions = response.opinions.filter(op => !existingIds.has(op.opinionId));

                setOpinionStateMap(prev => ({
                    ...prev,
                    [sortType]: {
                        opinions: [...prev[sortType].opinions, ...newOpinions],
                        hasMore: hasMoreData
                    }
                }));
            }

        } catch (e) {
            console.debug(`의견 불러오기 실패 (${sortType}):`, e);
        } finally {
            setLoading(false);
        }
    };

    // AI 요약 초기 업데이트
    const initAiSummaries = useCallback(() => {
        setSummaries([]);
        fetchSummaries();
    }, [debateId]);


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

    // 스크랩 북마크 요청
    const handleScrap = () => {
        const newScrap = !scrap;
        setScrap(newScrap);
        updateDebate(debateId, { isScraped: newScrap });
        // axios 추가 필요
    };

    // 상단바 기능 버튼 추가
    useLayoutEffect(() => {
        if (!debate) return;

        navigation.setOptions({
            headerRight: () => (
                <View style={styles.headerRightItems}>
                    <TouchableOpacity onPress={() => console.log('공유')}>
                        <Icons.share />
                    </TouchableOpacity>
                    <ScrapButton
                        isScraped={debate.isScraped}
                        onPressScrap={handleScrap}
                    />
                </View>
            ),
        });
    }, [debate?.isScraped]);


    // 투표한 사람만 입력 가능하도록 검사 후 의견 등록
    const handleOpinionPosting = async () => {
        if (debate!.isLeft == null) {
            console.debug("투표해야 의견 입력 가능");
            return;
        }

        try {
            await createOpinion(debateId, debate!.isLeft, commentText);
            setCommentText('');

            // 의견 상태 맵 초기화 먼저 수행
            setOpinionStateMap({
                latest: { opinions: [], hasMore: true },
                likes: { opinions: [], hasMore: true },
                comments: { opinions: [], hasMore: true },
            });
            // 페이징 커서 초기화
            setCursor(emptyCursor);

            // 초기화 후 데이터 다시 불러오기
            await fetchAllSorts();

        } catch (e) {
            console.debug("OpinionListScreen.handleOpinionPosting 실패:", e);
        }
    };

    if (!debate) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.container}>
                    <Text>불러오는 중...</Text>
                </View>
            </SafeAreaView>
        );
    }
    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.container}>
                <View style={styles.topicView}>
                    <Text style={styles.topicViewText}>{debate!.topic}</Text>
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

                {/* 옵션 양쪽 내용 */}
                <View style={styles.optionView}>
                    <View style={[styles.optionBox, styles.optionBoxLeft]}>
                        <Image
                            source={require('../../../assets/images/agree.png')}
                            style={styles.optionImage}
                        />
                        <Text style={[styles.optionText, styles.optionTextLeft]}>
                            {debate!.leftOption}
                        </Text>
                    </View>

                    <View style={[styles.optionBox, styles.optionBoxRight]}>
                        <Image
                            source={require('../../../assets/images/disagree.png')}
                            style={styles.optionImage}
                        />
                        <Text style={[styles.optionText, styles.optionTextRight]}>
                            {debate!.rightOption}
                        </Text>
                    </View>
                </View>

                {/* 의견 리스트 */}
                <View style={styles.opinionView}>
                    {isSummary ? (
                        <SummaryBoxList data={summaries} />
                    ) : (
                        <OpinionBoxList
                            opinions={currentOpinions}
                            debateId={debateId}
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
                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        style={isSummary ? styles.VoteButtonView : styles.VoteButtonViewSmall}
                        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 100}
                    >
                        <VoteButton
                            debateId={debateId}
                            showVoteResultModal={showVoteResultModal}
                        />
                    </KeyboardAvoidingView>

                    {isSummary && (
                        <View style={styles.TotalVoteCountView}>
                            <Text>지금까지 {debate!.totalVoteCount}명 참여중</Text>
                        </View>
                    )}

                    {(!isSummary && debate.isLeft == null) && (
                        <View style={styles.TotalVoteCountView}>
                            <Text>성향 테스트 및 투표 후 의견 등록 가능합니다.</Text>
                        </View>
                    )}
                </View>

                {(!isSummary && debate.isLeft != null && user?.userType != null) && (
                    <CommentInput
                        onChangeText={setCommentText}
                        onSubmit={handleOpinionPosting}
                        value={commentText}
                        placeholder='의견을 입력하세요...'
                        contentMinSize={10}
                        contentMaxSize={150}
                    />
                )}
            </SafeAreaView>
        </View>

    );
}
