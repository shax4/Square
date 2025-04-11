import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { TouchableOpacity, View, ScrollView, Alert, Modal, TouchableWithoutFeedback } from "react-native";
import { DebateStackParamList } from "../../shared/page-stack/DebatePageStack";
import ProfileBox from "../../components/ProfileBox/ProfileBox";
import { Icons } from "../../../assets/icons/Icons";
import { LikeButton } from "../../components";
import React, { useEffect, useLayoutEffect, useState, useRef } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { styles } from './Components/OpinionDetailScreen.styles'
import CommentInput from "../../components/CommentInput/CommentInput";
import { getOpinionDetail, createComment, likesComment, deleteComment } from "./api/CommentApi";
import { deleteOpinion } from "../OpinionListScreen/api/OpinionApi";
import { OpinionsResponse } from "./Components/OpinionsResponse.types";
import { Comment } from "./Components/Comment.types";
import { useAuthStore } from "../../shared/stores";
import { likesOpinion } from "./api/OpinionApi";
import Text from '../../components/Common/Text';

type OpinionDetailRouteProp = RouteProp<DebateStackParamList, 'OpinionDetailScreen'>;

export default function OpinionDetailScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<DebateStackParamList>>();
    const route = useRoute<OpinionDetailRouteProp>();
    const { debateId, opinionId } = route.params;

    // 스크롤 관리
    const scrollRef = useRef<ScrollView>(null);

    // 로그인 사용자
    const { user } = useAuthStore();
    // 의견 상세페이지 정보
    const [opinionDetail, setOpinionDetail] = useState<OpinionsResponse | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);

    // 댓글 입력창 텍스트
    const [commentText, setCommentText] = useState("");

    // 로딩 여부
    const [loading, setLoading] = useState(true);

    // 삭제 및 수정을 위해 선택한 댓글 및 모달
    const [selectedCommentId, setSelectedCommentId] = useState<number | null>(null);
    const [commentModalVisible, setCommentModalVisible] = useState(false);

    const handleLongPressComment = (commentId: number, nickname: string) => {
        if (nickname === user?.nickname) {
            setSelectedCommentId(commentId);
            setCommentModalVisible(true);
        }
    };

    const handleEditComment = () => {
        setCommentModalVisible(false);
        // TODO: 댓글 수정 페이지 이동 or 모달 내에서 수정 가능하게 만들기
        Alert.alert('수정 기능 준비 중입니다.');
    };

    // 수정 삭제 모달
    const handleDeleteComment = () => {
        setCommentModalVisible(false);
        Alert.alert(
            '댓글 삭제',
            '정말로 삭제하시겠습니까?',
            [
                { text: '취소', style: 'cancel' },
                {
                    text: '삭제',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            const response = await deleteComment(selectedCommentId!);
                            setComments(prev => prev.filter(comment => comment.commentId !== selectedCommentId));
                            navigation.pop(1)
                            navigation.navigate('OpinionDetailScreen', { debateId: debateId, opinionId: opinionId });
                        } catch (error) {
                            Alert.alert(
                                '삭제 실패',
                                '잠시 후 다시 시도해주세요.',
                                [{ text: '확인', style: 'cancel' }]
                            )
                        }

                    }
                }
            ]
        );
    };

    // 텍스트 입력할 때 마다 실행
    const onChangeText = (text: string) => {
        setCommentText(text);
    }

    const onPressCreateComment = async () => {
        const trimmedComment = commentText.trim();
        if (!trimmedComment || trimmedComment.length < 5 || trimmedComment.length > 150) {
            // 네이티브 모달로 글자 수 보내 경고
            return;
        }

        try {
            const commentResponse = await createComment(opinionId, commentText);
            clearCommentInputField();

            // 새 댓글을 직접 만들어 추가
            const newComment: Comment = {
                commentId: commentResponse.commentId,
                nickname: user?.nickname ?? "사용자",
                profileUrl: commentResponse.profileUrl,
                userType: user!.userType,
                createdAt: new Date().toISOString(),
                content: commentText,
                likeCount: 0,
                isLiked: false,
            };

            // 기존 댓글 리스트에 새 댓글 추가
            setComments((prev) => [...prev, newComment]);

            // 의견 댓글 수 +1 갱신
            setOpinionDetail((prev) =>
                prev
                    ? { ...prev, commentCount: prev.commentCount + 1 }
                    : prev
            );
            // 렌더링 끝난 후 실행
            setTimeout(() => {
                scrollRef.current?.scrollToEnd({ animated: true });
            }, 100);
        } catch (error) {
            console.error(error);
        }
    };

    const clearCommentInputField = () => {
        setCommentText('');
    }

    useEffect(() => {
        const fetchOpinionDetail = async () => {
            try {
                setLoading(true);

                const response = await getOpinionDetail(opinionId);

                // 의견 전체 데이터 저장
                setOpinionDetail(response);

                // 댓글 리스트만 따로 분리
                setComments(response.comments);
            } catch (error) {
                console.error("의견 상세 조회 실패:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOpinionDetail();
    }, [opinionId, opinionId]);


    // 상단 탭에 수정 및 신고 버튼 설정 
    useLayoutEffect(() => {
        if (!opinionDetail) return;

        navigation.setOptions({
            headerRight: () => (
                <View style={styles.headerRightItems}>
                    {opinionDetail.nickname === user?.nickname ? (
                        <>
                            <TouchableOpacity
                                onPress={() =>
                                    navigation.navigate('OpinionEditScreen', {
                                        debateId,
                                        opinionId,
                                        content: opinionDetail.content!,
                                    })
                                }
                            >
                                <Icons.edit />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleDeleteOpinion}>
                                <Icons.delete />
                            </TouchableOpacity>
                        </>
                    ) : (
                        <TouchableOpacity onPress={() => console.log('신고')}>
                            <Icons.report />
                        </TouchableOpacity>
                    )}
                </View>
            ),
        });
    }, [opinionDetail, user]);


    const handleDeleteOpinion = () => {
        Alert.alert(
            '삭제 확인',
            '정말로 이 의견을 삭제하시겠습니까?',
            [
                {
                    text: '취소',
                    onPress: () => console.log('삭제 취소'),
                    style: 'cancel',
                },
                {
                    text: '삭제',
                    onPress: async () => {
                        await deleteOpinion(opinionId);
                        setTimeout(() => {

                            navigation.pop(2);
                            navigation.navigate('OpinionListScreen', {
                                debateId,
                                showSummaryFirst: false,
                            });
                        }, 10);
                    },
                    style: 'destructive',
                },
            ],
            { cancelable: true }
        );
    };


    // 잘못된 응답 혹은 데이터 요청 실패 시,
    if (!loading && opinionDetail === null) {
        return (
            <View style={styles.Container}>
                <Text style={{ color: 'red', fontSize: 16 }}>
                    의견 데이터를 불러올 수 없습니다.
                </Text>
            </View>
        );
    }
    if (loading) {
        return (
            <View style={styles.Container}>
                <Text>로딩 중...</Text>
            </View>
        );
    }

    return (
        <View style={styles.Container}>

            {/* 의견 작성자 프로필 */}
            <View style={styles.ProfileBoxView}>
                <ProfileBox
                    imageUrl={opinionDetail!.profileUrl}
                    nickname={opinionDetail!.nickname}
                    userType={opinionDetail!.userType}
                    createdAt={opinionDetail!.createdAt}
                    variant="medium"
                />
            </View>

            {/* 의견 컨텐츠 */}
            <View style={styles.OpinionContentView}>
                <Text weight="medium" style={styles.OpinionContentText}>
                    {opinionDetail!.content}
                </Text>
            </View>

            {/* 좋아요 및 댓글 수 */}
            <View style={styles.LikeAndCommentCountView}>
                <LikeButton
                    initialCount={opinionDetail!.likeCount}
                    initialLiked={opinionDetail!.isLiked}
                    isVertical={false}
                    onPress={() => { likesOpinion(opinionId) }}
                />

                <View style={styles.CommentCountButton}>
                    <Icons.commentNew />
                    <Text weight="medium" style={styles.CountText}>{opinionDetail!.commentCount}</Text>
                </View>
            </View>

            {/* 의견 댓글 구분선 */}
            <View style={styles.Separator} />

            {/* 댓글 스크롤 뷰 */}
            <ScrollView
                ref={scrollRef}
                style={styles.ScrollViewContent}
                keyboardShouldPersistTaps="handled"
            >
                {comments.map((comment, index) => (
                    <React.Fragment key={comment.commentId}>
                        <View style={styles.CommentView}>
                            {/* 프로필 및 댓글 */}
                            <View style={styles.ProfileAndCommentView}>
                                <ProfileBox
                                    nickname={comment.nickname}
                                    userType={comment.userType}
                                    createdAt={comment.createdAt}
                                    variant="small"
                                />
                                <View style={styles.CommentTextView}>
                                    <TouchableOpacity
                                        activeOpacity={0.4}
                                        onLongPress={() => handleLongPressComment(comment.commentId, comment.nickname)}
                                    >
                                        <Text weight="medium" style={styles.CommentText}>{comment.content}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {/* 좋아요 버튼 */}
                            <View style={styles.CommentLikeView}>
                                <LikeButton
                                    initialCount={comment.likeCount}
                                    initialLiked={comment.isLiked}
                                    size="small"
                                    onPress={() => { likesComment(comment.commentId) }}
                                />
                            </View>
                        </View>

                        {/* 댓글 구분선 */}
                        <View style={styles.CommentSeparator} />
                    </React.Fragment>
                ))}
            </ScrollView>

            <CommentInput
                onSubmit={() => onPressCreateComment()}
                onChangeText={onChangeText}
                value={commentText}
                placeholder="댓글을 입력하세요..."
                contentMinSize={5}
                contentMaxSize={150}
            />

            <Modal
                visible={commentModalVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setCommentModalVisible(false)}
            >
                <TouchableWithoutFeedback onPress={() => setCommentModalVisible(false)}>
                    <View style={styles.modalOverlay}>
                        <TouchableWithoutFeedback onPress={() => { }}>
                            <View style={styles.modalContent}>
                                {/*
                                 <TouchableOpacity onPress={handleEditComment} style={styles.modalButton}>
                                    <Text style={styles.modalButtonText}>수정</Text>
                                </TouchableOpacity>
                                 */}
                                <TouchableOpacity onPress={handleDeleteComment} style={styles.modalButton}>
                                    <Text style={styles.modalCancelButtonText}>삭제</Text>
                                </TouchableOpacity>
                                <View style={styles.ModalPadding} />
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </View>
    )

}
