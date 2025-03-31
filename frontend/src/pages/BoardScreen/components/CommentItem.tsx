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
import { Comment } from "./CommentItem.types";
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
      {/* --- 사용자 정보 영역 --- */}
      <View style={styles.userInfoContainer}>
        <ProfileImage imageUrl={comment.profileUrl} variant="small" />
        <View style={styles.userInfoText}>
          <Text style={styles.nickname}>{comment.nickname}</Text>
          <PersonalityTag personality={comment.userType} />
        </View>
        <Text style={styles.time}>{getTimeAgo(comment.createdAt)}</Text>
      </View>

      {/* --- 댓글 내용 또는 수정 UI --- */}
      {isEditing ? (
        <View style={styles.editContainer}>
          <TextInput
            style={styles.textInput}
            value={editedContent}
            onChangeText={setEditedContent}
            autoFocus={true}
            multiline={true}
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={handleCancelPress} style={styles.button}>
              <Text>취소</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSavePress}
              style={[styles.button, styles.saveButton]}
            >
              <Text style={styles.saveButtonText}>저장</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <Text style={styles.contentText}>{comment.content}</Text>
      )}

      {/* --- 푸터 영역 --- */}
      <View style={styles.footerContainer}>
        <LikeButton
          initialCount={comment.likeCount}
          initialLiked={comment.isLiked}
        />
        {/* 답글 버튼 등 (나중에 추가) */}

        {/* 수정/삭제 버튼 */}
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
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  userInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  userInfoText: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginLeft: 8,
  },
  nickname: { fontWeight: "bold", marginRight: 6 },
  time: { fontSize: 12, color: "#888" },
  editContainer: { marginVertical: 8 },
  textInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 8,
    minHeight: 60,
    textAlignVertical: "top",
    marginBottom: 8,
  },
  buttonContainer: { flexDirection: "row", justifyContent: "flex-end" },
  button: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginLeft: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  saveButton: { backgroundColor: "#007bff", borderColor: "#007bff" },
  saveButtonText: { color: "#fff" },
  contentText: { fontSize: 14, lineHeight: 20, marginVertical: 8 },
  footerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
  },
  authorButtons: { flexDirection: "row" },
  actionText: { fontSize: 12, color: "#888", marginLeft: 12 },
});
