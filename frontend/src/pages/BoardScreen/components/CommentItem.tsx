import { useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import ProfileImage from "../../../components/ProfileImage/ProfileImage";
import PersonalityTag from "../../../components/PersonalityTag/PersonalityTag";
import LikeButton from "../../../components/LikeButton";
import { BoardAPI } from "../Api/boardApi";
import { Comment, Reply } from "../board.types";
import { Icons } from "../../../../assets/icons/Icons";
import { useAuth } from "../../../shared/hooks/useAuth";
import { getTimeAgo } from "../../../shared/utils/timeAge/timeAge";

interface CommentItemProps {
  comment: Comment; // 댓글 타입 (대댓글은 재귀 호출 시 prop 이름 변경 고려)
  onCommentChange: () => void; // 부모 컴포넌트에 변경사항 알림 콜백
  isReply?: boolean; // 이 컴포넌트가 대댓글을 랜더링하는지 여부 (스타일링용)
}

export default function CommentItem({
  comment,
  onCommentChange,
  isReply = false,
}: CommentItemProps) {
  const user = {
    nickname: "반짝이는하마",
  }; // 현재 사용자(mock 테스트용)
  // const { user } = useAuth(); // 현재 사용자 (api 연결 시 사용)
  const [isEditing, setIsEditing] = useState(false); // 수정 모드 상태
  const [editedContent, setEditedContent] = useState(comment.content); // 수정 내용 상태

  // comment.replies는 초기 로드된 대댓글 목록
  const [loadedReplies, setLoadedReplies] = useState<Reply[]>(
    comment.replies || []
  );
  const [replyLoading, setReplyLoading] = useState(false);
  // !! 실제 API는 커서 기반 페이지네이션 필요. 여기서는 단순화를 위해 다음 로드할 개수 등으로 처리 가능 !!
  const [nextReplyCursor, setNextReplyCursor] = useState<number | null>(
    // 초기 로드된 마지막 대댓글 ID + 1 또는 다른 기준
    comment.replies && comment.replies.length > 0
      ? comment.replies[comment.replies.length - 1].commentId + 1
      : null
  );
  const [isReplying, setIsReplying] = useState(false); // 답글 입력창 표시 상태
  const [replyText, setReplyText] = useState(""); // 답글 내용 상태

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
  // 대댓글 활성화 함수
  const handleReplyPress = () => {
    setIsReplying(true);
  };
  // 대댓글 취소 함수
  const handleCancelReply = () => {
    setIsReplying(false);
    setReplyText("");
  };
  // 대댓글 작성 함수
  const handleSubmitReply = async () => {
    if (!replyText.trim()) return;
    console.log(
      `[Mock Submit] Replying to ${comment.commentId} with: ${replyText}`
    );
    // --- 실제 API 호출 (API 준비 후 구현) ---
    // try {
    //   await BoardAPI.createComment(postId, replyText, comment.commentId); // parentId 전달
    //   setReplyText("");
    //   setIsReplying(false);
    //   onCommentChange(); // 목록 새로고침
    // } catch (error) { ... }
    // --- 임시 처리 ---
    Alert.alert("알림", "대댓글 생성 API는 아직 준비 중입니다.");
    setIsReplying(false);
    setReplyText("");
  };
  // 대댓글 더보기 함수
  const handleLoadMoreReplies = useCallback(async () => {
    if (replyLoading || !comment.commentId) return; // commentId 확인

    setReplyLoading(true);
    try {
      // 목업 API 호출 (실제 API는 커서 필요)
      const response = await BoardAPI.getMoreReplies(
        comment.commentId,
        nextReplyCursor
      ); // getMoreReplies 구현 필요

      // !! 실제 API 응답 구조에 맞춰 수정 !!
      // 예시: response.data 가 { replies: Reply[], nextCursorId: number | null } 형태라고 가정
      const newReplies = response.data.replies || [];
      const nextCursor = response.data.nextCursorId;

      setLoadedReplies((prevReplies) => [...prevReplies, ...newReplies]);
      setNextReplyCursor(nextCursor);
    } catch (error) {
      console.error("대댓글 로드 실패:", error);
      Alert.alert("오류", "대댓글을 불러오는 중 오류가 발생했습니다.");
    } finally {
      setReplyLoading(false);
    }
  }, [comment.commentId, replyLoading, nextReplyCursor]); // 의존성 배열

  // 표시할 대댓글 수와 전체 대댓글 수 비교
  const hasMoreReplies = comment.replyCount > loadedReplies.length;

  return (
    <View style={[styles.container, isReply && styles.replyContainer]}>
      {/* 1. 상단 영역 (메인 내용 + 좋아요 버튼) */}
      <View style={styles.topContainer}>
        {/* 1-1. 메인 내용 블록 (사용자 정보 + 댓글 내용/수정) */}
        <View style={styles.mainContentBlock}>
          {/* 사용자 정보 */}
          <View style={styles.userInfoContainer}>
            <ProfileImage imageUrl={comment.profileUrl} variant="small" />
            <View style={styles.userInfoText}>
              <Text style={styles.nickname}>{comment.nickname}</Text>
              <PersonalityTag personality={comment.userType} nickname={comment.nickname} />
            </View>
            {/* 시간은 푸터로 이동 */}
          </View>

          {/* 댓글 내용 또는 수정 UI */}
          {isEditing ? (
            <View style={styles.editContainer}>
              {/* TextInput 및 저장/취소 버튼 (이전과 동일) */}
              <TextInput
                style={styles.textInput}
                value={editedContent}
                onChangeText={setEditedContent}
                autoFocus={true}
                multiline={true}
              />
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  onPress={handleCancelPress}
                  style={styles.button}
                >
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
          {/* 답글 달기 버튼 */}
          {!isEditing && ( // 수정 중 아닐 때만 표시
            <TouchableOpacity onPress={handleReplyPress}>
              <Text style={styles.replyButtonText}>답글 달기</Text>
            </TouchableOpacity>
          )}
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
      {/* --- 대댓글 영역 --- */}
      {loadedReplies && loadedReplies.length > 0 && (
        <View style={styles.repliesContainer}>
          {loadedReplies.map((reply) => (
            // CommentItem 재귀 호출 (또는 ReplyItem 컴포넌트 사용)
            // !! 중요: key는 reply의 고유 ID (commentId) 사용 !!
            <CommentItem
              key={reply.commentId}
              comment={reply as any} // 타입 단언 또는 ReplyItem 사용 필요
              onCommentChange={onCommentChange} // 콜백 전달
              isReply={true} // 대댓글임을 표시
            />
          ))}
        </View>
      )}
      {/* --- 답글 입력창 (isReplying 상태에 따라 표시) --- */}
      {isReplying && (
        <View style={[
          styles.replyInputArea,
          !isReply && styles.replyInputAreaIndent // isReply가 false일 때만 들여쓰기 스타일 추가
          ]}>
          <TextInput
            style={styles.replyInput}
            value={replyText}
            onChangeText={setReplyText}
            placeholder={`${comment.nickname}에게 답글 달기...`}
            autoFocus={true}
            multiline={true}
          />
          <View style={styles.replyButtonContainer}>
            <TouchableOpacity onPress={handleCancelReply} style={styles.button}>
              <Text>취소</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSubmitReply}
              style={[styles.button, styles.saveButton]}
            >
              <Text style={styles.saveButtonText}>등록</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      {/* 대댓글 더보기 버튼 */}
      {hasMoreReplies && (
        <TouchableOpacity
          onPress={handleLoadMoreReplies}
          style={styles.loadMoreButton}
          disabled={replyLoading}
        >
          {replyLoading ? (
            <ActivityIndicator size="small" />
          ) : (
            <Text style={styles.loadMoreText}>
              답글 {comment.replyCount - loadedReplies.length}개 더보기
            </Text>
          )}
        </TouchableOpacity>
      )}

      {/* --- 답글 달기 UI (API 준비되면 기능 구현) --- */}
      {/* '답글 달기' 버튼 및 클릭 시 나타날 입력창 UI 추가 */}
    </View>
  );
}

// --- 스타일 정의 (수정) ---
const styles = StyleSheet.create({
  container: {
    // 전체 댓글 아이템 컨테이너
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  replyContainer: {
    // 대댓글 들여쓰기
    marginLeft: 30, // 예시 값
    paddingLeft: 10, // 예시 값
    borderLeftWidth: 1, // 구분선 (선택적)
    borderLeftColor: "#eee", // 구분선 색상
    marginTop: 10, // 위 댓글과의 간격
  },
  topContainer: {
    // 상단 영역: 내용 블록과 좋아요 버튼을 가로로 배치
    flexDirection: "row",
    alignItems: "center", // 좋아요 버튼 세로 중앙 정렬
    marginBottom: 8, // 상단 영역과 푸터 영역 사이 간격
  },
  mainContentBlock: {
    // 사용자 정보 + 댓글 내용/수정 영역
    flex: 1, // 가능한 공간 모두 차지하여 좋아요 버튼을 오른쪽으로 밀어냄
    marginRight: 12, // 좋아요 버튼과의 간격
  },
  userInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4, // 사용자 정보와 댓글 내용 사이 간격
  },
  userInfoText: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 8,
  },
  nickname: { fontWeight: "bold", marginRight: 6 },
  contentText: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 4, // 사용자 정보 바로 아래부터 시작
  },
  editContainer: { marginVertical: 4 },
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
  likeButton: {
    // 특별한 위치 지정보다는 alignItems: 'center' 에 의해 정렬되도록 함
    // 필요시 padding 등으로 터치 영역 확보
    padding: 4, // 예시
  },
  footerContainer: {
    // 하단 푸터 영역
    flexDirection: "row",
    justifyContent: "space-between", // 왼쪽 그룹과 오른쪽 그룹을 양 끝으로
    alignItems: "center",
    marginTop: 8, // 댓글 내용과 푸터 사이 간격
  },
  leftFooterGroup: {
    // 시간 + 답글 버튼 그룹
    flexDirection: "row",
    alignItems: "center",
  },
  time: {
    fontSize: 12,
    color: "#888",
    marginRight: 16, // 시간과 답글 버튼 사이 간격
  },
  replyButtonText: {
    fontSize: 12,
    color: "#555", // 약간 더 진하게
    fontWeight: "500",
  },
  authorButtons: {
    // 수정 + 삭제 버튼 그룹
    flexDirection: "row",
  },
  actionText: {
    fontSize: 12,
    color: "#888",
    marginLeft: 12, // 수정 버튼과 삭제 버튼 사이 간격
  },
  repliesContainer: {
    // 대댓글 목록 감싸는 컨테이너
    marginTop: 10,
  },
  loadMoreButton: {
    marginTop: 10,
    paddingVertical: 4,
    // alignItems: 'center',
  },
  loadMoreText: {
    color: "#555",
    fontSize: 12,
    fontWeight: "500",
  },
  replyInputArea: {
    marginTop: 10,
  },
  replyInputAreaIndent: { // 최상위 댓글의 답글일 때만 들여쓰기 (스타일 조정 필요)
    marginLeft: 40,
  },
  replyInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    padding: 8,
    minHeight: 50,
    textAlignVertical: "top",
    marginBottom: 8,
    backgroundColor: "#f9f9f9",
  },
  replyButtonContainer: { flexDirection: "row", justifyContent: "flex-end" },
});
