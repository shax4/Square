import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import ProfileImage from "../../../components/ProfileImage/ProfileImage";
import PersonalityTag from "../../../components/PersonalityTag/PersonalityTag";
import LikeButton from "../../../components/LikeButton";
import { BoardAPI } from "../Api/boardApi";
import { Comment } from "../board.types";
import { Icons } from "../../../../assets/icons/Icons";
import { useAuth } from "../../../shared/hooks/useAuth";
import { getTimeAgo } from "../../../shared/utils/timeAge/timeAge";

interface CommentItemProps {
  comment: Comment; // 댓글 타입
  onCommentChange: () => void; // 부모 컴포넌트에 변경사항 알림 콜백
}

export default function CommentItem({
  comment,
  onCommentChange,
}: CommentItemProps) {
  const user = {
    nickname: '반짝이는하마',
  }; // 현재 사용자(mock 테스트용)
  // const { user } = useAuth(); // 현재 사용자 (api 연결 시 사용)
  const [isEditing, setIsEditing] = useState(false); // 수정 모드 상태
  const [editedContent, setEditedContent] = useState(comment.content); // 수정 내용 상태

  // 현재 사용자가 댓글 작성자인지 확인
  const isAuthor = user?.nickname === comment.nickname;

  // 수정 핸들러 함수
  const handleEditPress = () => {
    setEditedContent(comment.content);
    setIsEditing(true);
  };
  // 취소 핸들러 함수
  const handleCancelPress = () => {
    setIsEditing(false);
  };
  // 저장 핸들러 함수
  const handleSavePress = async () => {
    // 유효성 검사 (빈 내용, 변경 없음)
    if (editedContent.trim() === "" || editedContent === comment.content) {
      setIsEditing(false); // 수정 모드 종료
      return;
    }

    try {
      // API 호출 (commentId 사용)
      await BoardAPI.updateComment(comment.commentId, editedContent);
      setIsEditing(false); // 수정 모드 종료
      onCommentChange(); // 부모 컴포넌트에 변경사항 알림 콜백 (데이터 새로고침)
    } catch (error) {
      console.error("댓글 수정에 실패했습니다:", error);
      Alert.alert("오류", "댓글 수정 중 오류가 발생했습니다.");
    }
  };

  // 댓글 삭제 함수
  const handleDeletePress = () => {
    // 삭제 확인 다이얼로그 표시
    Alert.alert("댓글 삭제", "정말 이 댓글을 삭제하시겠습니까?", [
      {
        text: "취소",
        style: "cancel",
      },
      {
        text: "삭제",
        style: "destructive",
        onPress: async () => {
          try {
            await BoardAPI.deleteComment(comment.commentId);
            onCommentChange();
          } catch (error) {
            console.error("댓글 삭제에 실패했습니다:", error);
            Alert.alert("오류", "댓글 삭제 중 오류가 발생했습니다.");
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      {/* 1. 상단 영역 (메인 내용 + 좋아요 버튼) */}
      <View style={styles.topContainer}>
        {/* 1-1. 메인 내용 블록 (사용자 정보 + 댓글 내용/수정) */}
        <View style={styles.mainContentBlock}>
          {/* 사용자 정보 */}
          <View style={styles.userInfoContainer}>
            <ProfileImage imageUrl={comment.profileUrl} variant="small" />
            <View style={styles.userInfoText}>
              <Text style={styles.nickname}>{comment.nickname}</Text>
              <PersonalityTag personality={comment.userType} />
            </View>
            {/* 시간은 푸터로 이동 */}
          </View>

          {/* 댓글 내용 또는 수정 UI */}
          {isEditing ? (
            <View style={styles.editContainer}>
              {/* TextInput 및 저장/취소 버튼 (이전과 동일) */}
              <TextInput style={styles.textInput} value={editedContent} onChangeText={setEditedContent} autoFocus={true} multiline={true} />
              <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={handleCancelPress} style={styles.button}><Text>취소</Text></TouchableOpacity>
                <TouchableOpacity onPress={handleSavePress} style={[styles.button, styles.saveButton]}><Text style={styles.saveButtonText}>저장</Text></TouchableOpacity>
              </View>
            </View>
          ) : (
            <Text style={styles.contentText}>{comment.content}</Text>
          )}
        </View>

        {/* 1-2. 좋아요 버튼 */}
        <LikeButton
          initialCount={comment.likeCount}
          initialLiked={comment.isLiked}
          size="small" // 또는 아이콘 크기에 맞는 크기
          isVertical={false} // 아이콘만 표시되도록 가정
        />
      </View>

      {/* 2. 하단 푸터 영역 (시간/답글 + 수정/삭제) */}
      <View style={styles.footerContainer}>
        {/* 2-1. 왼쪽 그룹 (시간 + 답글 달기) */}
        <View style={styles.leftFooterGroup}>
          <Text style={styles.time}>{getTimeAgo(comment.createdAt)}</Text>
          {/* 답글 달기 버튼 - 필요시 TouchableOpacity 등으로 감싸기 */}
          <TouchableOpacity>
            <Text style={styles.replyButtonText}>답글 달기</Text>
          </TouchableOpacity>
        </View>

        {/* 2-2. 오른쪽 그룹 (수정/삭제 버튼) */}
        {isAuthor && !isEditing && (
          <View style={styles.authorButtons}>
            <TouchableOpacity onPress={handleEditPress}>
              <Text style={styles.actionText}>수정</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDeletePress}>
              <Text style={styles.actionText}>삭제</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

// --- 스타일 정의 (수정) ---
const styles = StyleSheet.create({
  container: { // 전체 댓글 아이템 컨테이너
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  topContainer: { // 상단 영역: 내용 블록과 좋아요 버튼을 가로로 배치
    flexDirection: 'row',
    alignItems: 'center', // 좋아요 버튼 세로 중앙 정렬
    marginBottom: 8, // 상단 영역과 푸터 영역 사이 간격
  },
  mainContentBlock: { // 사용자 정보 + 댓글 내용/수정 영역
    flex: 1, // 가능한 공간 모두 차지하여 좋아요 버튼을 오른쪽으로 밀어냄
    marginRight: 12, // 좋아요 버튼과의 간격
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4, // 사용자 정보와 댓글 내용 사이 간격
  },
  userInfoText: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  nickname: { fontWeight: 'bold', marginRight: 6 },
  contentText: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 4, // 사용자 정보 바로 아래부터 시작
  },
  editContainer: { marginVertical: 4 },
  textInput: { borderWidth: 1, borderColor: '#ccc', borderRadius: 4, padding: 8, minHeight: 60, textAlignVertical: 'top', marginBottom: 8 },
  buttonContainer: { flexDirection: 'row', justifyContent: 'flex-end' },
  button: { paddingVertical: 6, paddingHorizontal: 12, marginLeft: 8, borderRadius: 4, borderWidth: 1, borderColor: '#ccc' },
  saveButton: { backgroundColor: '#007bff', borderColor: '#007bff' },
  saveButtonText: { color: '#fff' },
  likeButton: {
    // 특별한 위치 지정보다는 alignItems: 'center' 에 의해 정렬되도록 함
    // 필요시 padding 등으로 터치 영역 확보
    padding: 4, // 예시
  },
  footerContainer: { // 하단 푸터 영역
    flexDirection: 'row',
    justifyContent: 'space-between', // 왼쪽 그룹과 오른쪽 그룹을 양 끝으로
    alignItems: 'center',
    marginTop: 8, // 댓글 내용과 푸터 사이 간격
  },
  leftFooterGroup: { // 시간 + 답글 버튼 그룹
    flexDirection: 'row',
    alignItems: 'center',
  },
  time: {
    fontSize: 12,
    color: '#888',
    marginRight: 16, // 시간과 답글 버튼 사이 간격
  },
  replyButtonText: {
    fontSize: 12,
    color: '#555', // 약간 더 진하게
    fontWeight: '500',
  },
  authorButtons: { // 수정 + 삭제 버튼 그룹
    flexDirection: 'row',
  },
  actionText: {
    fontSize: 12,
    color: '#888',
    marginLeft: 12, // 수정 버튼과 삭제 버튼 사이 간격
  }
});