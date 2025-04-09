import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  // ActivityIndicator, // 답글은 더보기 로딩 없음
  // FlatList, // 답글은 하위 목록 없음
} from "react-native";
import ProfileImage from "../../../components/ProfileImage/ProfileImage";
import PersonalityTag from "../../../components/PersonalityTag/PersonalityTag";
import LikeButton from "../../../components/LikeButton";
import { Reply } from "../board.types"; // *** 타입 변경: Comment -> Reply ***
import { Icons } from "../../../../assets/icons/Icons";
import { useAuth } from "../../../shared/hooks/useAuth";
import { getTimeAgo } from "../../../shared/utils/timeAge/timeAge";
import { useLikeButton } from "../../../shared/hooks/useLikeButton";
import { useComment } from "../../../shared/hooks";

interface ReplyItemProps {
  // *** Props 인터페이스명 변경 ***
  postId: number; // 게시글 ID (답글 생성 시 필요할 수 있음)
  reply: Reply; // *** Prop명 및 타입 변경: comment -> reply ***
  onCommentChange: () => void; // 부모 컴포넌트에 변경사항 알림 콜백 (댓글 목록 새로고침용)
}

// *** 컴포넌트명 변경 ***
export default function ReplyItem({
  postId,
  reply, // *** Prop명 변경 ***
  onCommentChange,
}: ReplyItemProps) {
  // --- 사용자 정보 (mock 또는 실제 useAuth) ---
  // const user = { nickname: "반짝이는하마" }; // 예시 사용자
  const { user } = useAuth();

  // --- 수정 관련 상태 ---
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(reply.content);

  // *** 내용 펼치기/접기 상태 추가 ***
  const [isExpanded, setIsExpanded] = useState(false);

  // --- 작성자 확인 ---
  const isAuthor = user?.nickname === reply.nickname;

  // --- useComment 훅 (수정/삭제용) ---
  const {
    // commentText, setCommentText, // 답글 생성은 ReplyItem에서 직접 처리 안 함
    submitting, // 답글 생성은 ReplyItem에서 직접 처리 안 함
    // createComment, // 답글 생성은 ReplyItem에서 직접 처리 안 함
    updateComment,
    deleteComment,
    // loadingReplies, loadReplies, // 하위 답글 로드 없음
  } = useComment();

  // --- 수정 핸들러 ---
  const handleEditPress = () => {
    setEditedContent(reply.content);
    setIsEditing(true);
  };
  const handleCancelPress = () => {
    setIsEditing(false);
  };
  const handleSavePress = async () => {
    if (editedContent.trim() === "" || editedContent === reply.content) {
      setIsEditing(false);
      return;
    }
    // *** updateComment 호출 시 reply.replyId 사용 ***
    const success = await updateComment(reply.replyId, editedContent);
    if (success) {
      setIsEditing(false);
      onCommentChange();
    }
  };

  // --- 삭제 핸들러 ---
  const handleDeletePress = () => {
    Alert.alert("답글 삭제", "정말 이 답글을 삭제하시겠습니까?", [
      { text: "취소", style: "cancel" },
      {
        text: "삭제",
        style: "destructive",
        onPress: async () => {
          // *** deleteComment 호출 시 reply.replyId 사용 ***
          const success = await deleteComment(reply.replyId);
          if (success) {
            onCommentChange(); // 목록 갱신
          } else {
            Alert.alert("오류", "답글 삭제에 실패했습니다.");
          }
        },
      },
    ]);
  };

  // --- 답글 생성 관련 핸들러 (ReplyItem에서는 불필요) ---
  // const handleReplyPress = () => { ... };
  // const handleCancelReply = () => { ... };
  // const handleSubmitReply = async () => { ... };

  // --- 답글 더보기 관련 핸들러 및 상태 (ReplyItem에서는 불필요) ---
  // const handleLoadMoreReplies = useCallback(async () => { ... });
  // const hasMoreReplies = false; // 답글은 더보기가 없음

  // --- 답글 내용 처리 ---
  const isLongContent = reply.content.length > 100;
  const displayedContent =
    isLongContent && !isExpanded
      ? `${reply.content.substring(0, 100)}...`
      : reply.content;

  // *** 더보기/접기 토글 함수 ***
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  // --- 좋아요 버튼 훅 ---
  const replyLikeProps = useLikeButton(
    reply.replyId,
    "POST_COMMENT", // API가 댓글/답글 구분 없이 ID로 처리한다고 가정
    reply.isLiked,
    reply.likeCount,
    onCommentChange // 좋아요 변경 시 목록 새로고침
  );

  return (
    // *** isReply prop 제거, 기본적으로 답글 스타일 적용 ***
    <View style={[styles.container, styles.replyContainer]}>
      {/* --- 헤더 (reply 데이터 사용) --- */}
      <View style={styles.header}>
        <ProfileImage imageUrl={reply.profileUrl} variant="small" />
        <View style={styles.authorInfo}>
          <View style={styles.nameContainer}>
            <Text style={styles.authorName}>{reply.nickname}</Text>
            <PersonalityTag
              personality={reply.userType || ""}
              nickname={reply.nickname || ""}
            />
          </View>
          <Text style={styles.date}>{getTimeAgo(reply.createdAt)}</Text>
        </View>
      </View>

      {/* --- 내용 (수정 모드 처리) --- */}
      {isEditing ? (
        <View style={styles.editingContainer}>
          <TextInput
            style={styles.editInput}
            value={editedContent}
            onChangeText={setEditedContent}
            autoFocus
            multiline
          />
          <View style={styles.editActions}>
            <TouchableOpacity
              onPress={handleSavePress}
              // *** disabled 조건 강화: 빈 값 또는 5자 미만 ***
              disabled={
                submitting ||
                !editedContent.trim() ||
                editedContent.trim().length < 5
              }
              style={[
                styles.actionButton, // 기존 버튼 스타일
                styles.saveButton, // 저장 버튼 스타일 추가
                (submitting ||
                  !editedContent.trim() ||
                  editedContent.trim().length < 5) &&
                  styles.disabledButton, // 비활성화 스타일
              ]}
            >
              <Text style={styles.buttonText}>저장</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleCancelPress}
              style={[styles.actionButton, styles.cancelButton]} // 취소 버튼 스타일 추가
            >
              <Text style={styles.buttonText}>취소</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.contentContainer}>
          <Text style={styles.content}>{displayedContent}</Text>
          {isLongContent && (
            <TouchableOpacity
              onPress={toggleExpand}
              style={styles.expandButton}
            >
              <Text style={styles.expandButtonText}>
                {isExpanded ? "접기" : "더보기"}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* --- 푸터 (좋아요, 수정/삭제 버튼) --- */}
      <View style={styles.footer}>
        <LikeButton {...replyLikeProps} size="small" isVertical={false} />
        {/* 답글에는 '답글달기' 버튼 없음 */}
        {isAuthor && !isEditing && (
          <>
            <TouchableOpacity
              onPress={handleEditPress}
              style={styles.actionButton}
            >
              <Text style={styles.actionText}>수정</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleDeletePress}
              style={styles.actionButton}
            >
              <Text style={styles.actionText}>삭제</Text>
            </TouchableOpacity>
          </>
        )}
        {/* 수정 중일 때는 저장/취소 버튼이 내용 영역에 표시됨 */}
      </View>

      {/* --- 답글 입력창 (ReplyItem에는 없음) --- */}
      {/* --- 하위 답글 목록 (ReplyItem에는 없음) --- */}
      {/* --- 더보기 버튼 (ReplyItem에는 없음) --- */}
    </View>
  );
}

// --- 스타일 정의 (기존 CommentItem.tsx의 스타일 복사/붙여넣기) ---
// 필요에 따라 ReplyItem에 특화된 스타일 조정 (e.g., replyContainer 내부 패딩/마진)
const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  replyContainer: {
    // 답글 들여쓰기 등 스타일
    marginLeft: 30, // 예시: 왼쪽 마진 추가
    paddingLeft: 10,
    borderBottomWidth: 0, // 답글 사이 구분선 제거 (선택 사항)
    paddingVertical: 8,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  authorInfo: {
    marginLeft: 8,
    flex: 1,
  },
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  authorName: {
    fontSize: 13,
    fontWeight: "bold",
    marginRight: 4,
  },
  date: {
    fontSize: 11,
    color: "#888",
  },
  contentContainer: {
    marginBottom: 6,
  },
  content: {
    fontSize: 14,
    lineHeight: 20,
    color: "#333",
  },
  editingContainer: {
    marginBottom: 8,
  },
  editInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 8,
    marginBottom: 8,
    fontSize: 14,
    lineHeight: 20,
    minHeight: 60, // 여러 줄 입력 가능하도록
    textAlignVertical: "top", // Android에서 상단 정렬
  },
  editActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  actionButton: {
    marginLeft: 10,
    paddingVertical: 6, // 패딩 조정
    paddingHorizontal: 6, // 패딩 조정
    borderRadius: 4, // 둥근 모서리
  },
  actionText: {
    // 기존 actionText 스타일은 유지하거나, buttonText로 통합
    fontSize: 11,
    color: "#555",
  },
  expandButton: {
    alignSelf: "flex-start",
    marginTop: 4,
    paddingVertical: 2,
  },
  expandButtonText: {
    fontSize: 11,
    color: "#007bff",
    fontWeight: "bold",
  },
  // ReplyItem에서 사용하지 않는 스타일 제거 가능
  // replyInputContainer, replyInput, replySubmitButton, replyCancelButton,
  // repliesContainer, loadMoreButton, loadMoreText
  // *** 버튼 스타일 추가 ***
  saveButton: {
    backgroundColor: "#007bff",
  },
  cancelButton: {
    backgroundColor: "#ccc",
  },
  disabledButton: {
    backgroundColor: "#aaa",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 11, // 답글 버튼 텍스트는 약간 작게
  },
});
