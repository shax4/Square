import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StyleSheet, Text, TouchableOpacity, View, ScrollView, KeyboardAvoidingView, Platform, TextInputComponent, TextInput } from "react-native";
import { StackParamList } from "../../shared/page-stack/DebatePageStack";
import opinionDetailTestData from './Components/opinion-detail-test-data';
import ProfileBox from "../../components/ProfileBox/ProfileBox";
import colors from "../../../assets/colors";
import { Icons } from "../../../assets/icons/Icons";
import { LikeButton, ProfileImage, TextField } from "../../components";
import { useLayoutEffect, useState } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type OpinionDetailRouteProp = RouteProp<StackParamList, 'OpinionDetailScreen'>;

export default function OpinionDetailScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>();
    const route = useRoute<OpinionDetailRouteProp>();
    const { opinionId } = route.params;
    const response = opinionDetailTestData;

    // 테스트용: 실제 APp 사용자 닉네임 가져와야 함
    const userNickname = response.nickname;

    // 댓글 리스트
    const [comments, setComments] = useState(response.comments);

    // 새로 입력하는 댓글
    const [commentText, setCommentText] = useState("");

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


    // 상단 탭에 수정 및 신고 버튼 설정 
    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <View style={styles.headerRightItems}>
                    {response.nickname === userNickname ? (
                        <>
                            <TouchableOpacity onPress={() => navigation.navigate('OpinionEditScreen', { opinionId, content: response.content },)}>
                                <Icons.edit />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => console.log('삭제')}>
                                <Icons.delete />
                            </TouchableOpacity>
                        </>
                    ) : (
                        <>
                            <TouchableOpacity onPress={() => console.log('신고')}>
                                <Icons.report />
                            </TouchableOpacity>
                        </>
                    )}
                </View>
            ),
        });
    }, []);


    return (
        <View style={styles.Container}>

            {/* 의견 작성자 프로필 */}
            <View style={styles.ProfileBoxView}>
                <ProfileBox
                    //imageUrl={response.profileUrl}
                    nickname={response.nickname}
                    userType={response.userType}
                    createdAt={response.createdAt}
                    variant="medium"
                />
            </View>

            {/* 의견 컨텐츠 */}
            <View style={styles.OpinionContentView}>
                <Text style={styles.OpinionContentText}>
                    {response.content}
                </Text>
            </View>

            {/* 좋아요 및 댓글 수 */}
            <View style={styles.LikeAndCommentCountView}>
                <LikeButton initialCount={response.likeCount} initialLiked={response.isLiked} isVertical={false} />

                <View style={styles.CommentCountButton}>
                    <Icons.comment />
                    <Text style={styles.CountText}>{response.commentCount}</Text>
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
                    <View key={comment.commentId} style={styles.CommentView}>
                        {/* 프로필 및 댓글 */}
                        <View style={styles.ProfileAndCommentView}>
                            <ProfileBox
                                //imageUrl={response.comments[index].profileUrl}
                                nickname={comments[index].nickname}
                                userType={comments[index].userType}
                                createdAt={comments[index].createdAt}
                                variant="small"
                            />
                            <View style={styles.CommentTextView}>
                                <Text style={styles.CommentText}>{comments[index].content}</Text>
                            </View>
                        </View>
                        {/* 좋아요 카운트 */}
                        <View style={styles.CommentLikeView}>
                            <LikeButton initialCount={comments[index].likeCount} initialLiked={comments[index].isLiked} size="small" />
                        </View>


                    </View>
                ))}
            </ScrollView>


            {/* 키보드 위로 올라가야 하는 뷰 */}
            <KeyboardAvoidingView
                style={styles.CommentCreateView}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
            >
                <View style={styles.CommentProfileImage}>
                    <ProfileImage
                        variant="small"
                    //imageUrl={response.profileUrl}
                    />
                </View>

                <TextInput
                    style={styles.commentInput}
                    placeholder="댓글을 입력하세요..."
                    value={commentText}
                    onChangeText={setCommentText}
                    multiline
                />
                <TouchableOpacity style={styles.CommentSendButton}
                    onPress={commentText.trim() !== '' ? onPressCreateComment : () => { }}
                >
                    <Icons.send />
                </TouchableOpacity>

            </KeyboardAvoidingView>

        </View>


    )
}

export const styles = StyleSheet.create({
    Container: {
        flex: 1,
        backgroundColor: colors.white,
    },
    ProfileBoxView: {
        margin: 12,
        marginTop: 20,
    },
    OpinionContentView: {
        margin: 15,
    },
    OpinionContentText: {
        fontSize: 17,
    },
    LikeAndCommentCountView: {
        flexDirection: 'row',
        marginHorizontal: 15,
        marginTop: 15,
    },
    CommentCountButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 20,
    },
    CountText: {
        color: colors.grayText,
        fontSize: 14,
    },
    Separator: {
        height: 0.7,
        backgroundColor: colors.disabledText,
        margin: 12,
    },
    ScrollViewContent: {
        flex: 1,
    },
    CommentView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: 20,
    },
    ProfileAndCommentView: {
    },
    CommentLikeView: {
        flex: 1,
        alignItems: 'flex-end',
    },
    CommentTextView: {
        marginVertical: 15,
        marginLeft: 20,
    },
    CommentText: {
        fontSize: 15,
    },
    CommentCreateView: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.white,
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderTopWidth: 0.5,
        marginBottom: 20,
        borderTopColor: colors.disabledText,
    },
    CommentProfileImage: {
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    commentInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: "#e1e1e1",
        borderRadius: 20,
        padding: 10,
        maxHeight: 80,
    },
    CommentSendButton: {
        marginLeft: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerRightItems: {
        flexDirection: 'row',
        gap: 12,
    },
});