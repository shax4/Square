import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { Text, TouchableOpacity, View, ScrollView, KeyboardAvoidingView, Platform, TextInput } from "react-native";
import { StackParamList } from "../../shared/page-stack/DebatePageStack";
import opinionDetailTestData from './Components/opinion-detail-test-data';
import ProfileBox from "../../components/ProfileBox/ProfileBox";
import { Icons } from "../../../assets/icons/Icons";
import { LikeButton, ProfileImage } from "../../components";
import { useLayoutEffect, useState } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { styles } from './Components/OpinionDetailScreen.styles'

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
