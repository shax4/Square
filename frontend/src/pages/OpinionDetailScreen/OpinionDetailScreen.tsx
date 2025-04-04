import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { Text, TouchableOpacity, View, ScrollView, Alert, } from "react-native";
import { StackParamList } from "../../shared/page-stack/DebatePageStack";
import ProfileBox from "../../components/ProfileBox/ProfileBox";
import { Icons } from "../../../assets/icons/Icons";
import { LikeButton } from "../../components";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { styles } from './Components/OpinionDetailScreen.styles'
import CommentInput from "../../components/CommentInput/CommentInput";
import { getOpinionDetail, createComment } from "./api/CommentApi";
import { deleteOpinion } from "../OpinionListScreen/api/OpinionApi";
import { OpinionsResponse } from "./Components/OpinionsResponse.types";
import { Comment } from "./Components/Comment.types";
import { useAuthStore } from "../../shared/stores";
type OpinionDetailRouteProp = RouteProp<StackParamList, 'OpinionDetailScreen'>;

export default function OpinionDetailScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>();
    const route = useRoute<OpinionDetailRouteProp>();
    const { opinionId } = route.params;

    const { loggedIn, user } = useAuthStore();

    // 의견 상세페이지 정보
    const [opinionDetail, setOpinionDetail] = useState<OpinionsResponse | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);

    // 댓글 입력창 텍스트
    const [commentText, setCommentText] = useState("");

    // 로딩 여부
    const [loading, setLoading] = useState(true);

    // 텍스트 입력할 때 마다 실행
    const onChangeText = (text: string) => {
        setCommentText(text);
    }
    const onPressCreateComment = () => {
        clearCommentInputField;
    }

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
    }, [opinionId]);


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
                                        opinionId,
                                        content: opinionDetail.content ?? '',
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
                    onPress: () => { deleteOpinion(opinionId) },
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
                    //imageUrl={opinionDetail!.profileUrl}
                    nickname={opinionDetail!.nickname}
                    userType={opinionDetail!.userType}
                    createdAt={opinionDetail!.createdAt}
                    variant="medium"
                />
            </View>

            {/* 의견 컨텐츠 */}
            <View style={styles.OpinionContentView}>
                <Text style={styles.OpinionContentText}>
                    {opinionDetail!.content}
                </Text>
            </View>

            {/* 좋아요 및 댓글 수 */}
            <View style={styles.LikeAndCommentCountView}>
                <LikeButton initialCount={opinionDetail!.likeCount} initialLiked={opinionDetail!.isLiked} isVertical={false} />

                <View style={styles.CommentCountButton}>
                    <Icons.comment />
                    <Text style={styles.CountText}>{opinionDetail!.commentCount}</Text>
                </View>
            </View>

            {/* 의견 댓글 구분선 */}
            <View style={styles.Separator} />

            {/* 댓글 스크롤 뷰 */}
            <ScrollView
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
                                    <Text style={styles.CommentText}>{comment.content}</Text>
                                </View>
                            </View>

                            {/* 좋아요 버튼 */}
                            <View style={styles.CommentLikeView}>
                                <LikeButton
                                    initialCount={comment.likeCount}
                                    initialLiked={comment.isLiked}
                                    size="small"
                                />
                            </View>
                        </View>

                        {/* 댓글 구분선 */}
                        <View style={styles.CommentSeparator} />
                    </React.Fragment>
                ))}
            </ScrollView>

            <CommentInput
                onSubmit={() => { }}
                onChangeText={setCommentText}
                value={commentText}
                placeholder="댓글을 입력하세요..."
            />
        </View>
    )

}
