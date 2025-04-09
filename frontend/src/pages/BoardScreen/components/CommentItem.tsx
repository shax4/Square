import React, { useState, useCallback, Fragment, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  FlatList,
} from "react-native";
import ProfileImage from "../../../components/ProfileImage/ProfileImage";
import PersonalityTag from "../../../components/PersonalityTag/PersonalityTag";
import LikeButton from "../../../components/LikeButton";
import { Comment, Reply } from "../board.types";
import { Icons } from "../../../../assets/icons/Icons";
import { useAuth } from "../../../shared/hooks/useAuth";
import { getTimeAgo } from "../../../shared/utils/timeAge/timeAge";
import { useLikeButton } from "../../../shared/hooks/useLikeButton";
import { useComment } from "../../../shared/hooks";
import ReplyItem from "./ReplyItem";

interface CommentItemProps {
  postId: number; // 게시글 ID
  comment: Comment; // 댓글 타입 (대댓글은 재귀 호출 시 prop 이름 변경 고려)
  onCommentChange: () => void; // 부모 컴포넌트에 변경사항 알림 콜백
}

export default function CommentItem({
  postId,
  comment,
  onCommentChange,
}: CommentItemProps) {
  const user = {
    nickname: "반짝이는하마",
  }; // 현재 사용자(mock 테스트용)
  // const { user } = useAuth(); // 현재 사용자 (api 연결 시 사용)
  const [isEditing, setIsEditing] = useState(false); // 수정 모드 상태
  const [editedContent, setEditedContent] = useState(comment.content); // 수정 내용 상태

  // comment.replies는 초기 로드된 대댓글 목록
  const [displayedReplies, setDisplayedReplies] = useState<Reply[]>(
    () => (comment.replies ? comment.replies.slice(0, 3) : []) // 초기 3개
  );
  const [nextReplyCursor, setNextReplyCursor] = useState<number | null>(() =>
    comment.replies && comment.replies.length > 3
      ? comment.replies[2].replyId
      : null
  );
  const [isLoadingMore, setIsLoadingMore] = useState(false); // 더보기 로딩
  const [isReplying, setIsReplying] = useState(false); // 답글 입력창 표시 상태
  const [replyText, setReplyText] = useState(""); // 답글 내용 상태

  // 현재 사용자가 댓글 작성자인지 확인
  const isAuthor = user?.nickname === comment.nickname;

  // useComment 훅 사용
  const {
    commentText,
    setCommentText,
    submitting,
    createComment,
    updateComment,
    deleteComment,
    loadReplies,
  } = useComment();

  // 댓글 수정 시작 함수
  const handleEditPress = () => {
    setEditedContent(comment.content);
    setIsEditing(true);
  };
  // 댓글 수정 취소 함수
  const handleCancelPress = () => {
    setIsEditing(false);
  };
  // 댓글 수정 저장 함수
  const handleSavePress = async () => {
    // 유효성 검사 (빈 내용, 변경 없음)
    if (editedContent.trim() === "" || editedContent === comment.content) {
      setIsEditing(false); // 수정 모드 종료
      return;
    }

    try {
      // 훅의 updateComment 함수 사용
      const success = await updateComment(comment.commentId, editedContent);

      if (success) {
        setIsEditing(false); // 수정 모드 종료
        onCommentChange(); // 부모 컴포넌트에 변경사항 알림 콜백 (데이터 새로고침)
      } else {
        Alert.alert("오류", "댓글 수정에 실패했습니다.");
      }
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
            // 훅의 deleteComment 함수 사용
            const success = await deleteComment(comment.commentId);

            if (success) {
              onCommentChange();
            } else {
              Alert.alert("오류", "댓글 삭제에 실패했습니다.");
            }
          } catch (error) {
            console.error("댓글 삭제에 실패했습니다:", error);
            Alert.alert("오류", "댓글 삭제 중 오류가 발생했습니다.");
          }
        },
      },
    ]);
  };
  // 대댓글 생성 시작 함수
  const handleReplyPress = () => {
    setIsReplying(true);
    // 훅의 commentText 사용을 위해 초기화
    setCommentText("");
  };
  // 대댓글 생성 취소 함수
  const handleCancelReply = () => {
    setIsReplying(false);
    setCommentText("");
  };
  // 대댓글 생성 저장 함수
  const handleSubmitReply = async () => {
    if (!commentText.trim()) return;

    try {
      // 훅의 createComment 함수 사용
      const success = await createComment(postId, comment.commentId);

      if (success) {
        // 입력창 초기화
        setCommentText("");
        // 답글 입력 모드 종료
        setIsReplying(false);
        // 댓글 목록 갱신 (부모 컴포넌트에 알림)
        onCommentChange();
      } else {
        Alert.alert("오류", "답글을 등록하는데 실패했습니다.");
      }
    } catch (error) {
      // 오류 처리
      console.error("답글 작성 실패:", error);
      Alert.alert("오류", "답글을 등록하는 중 문제가 발생했습니다.");
    }
  };
  // 대댓글 더보기 함수
  const handleLoadMoreReplies = useCallback(async () => {
    if (isLoadingMore || nextReplyCursor === null) return;
    console.log(
      `답글 더보기 요청: commentId=${comment.commentId}, cursor=${nextReplyCursor}`
    );
    setIsLoadingMore(true);
    try {
      const response = await loadReplies(comment.commentId, nextReplyCursor);
      if (response && response.replies && response.replies.length > 0) {
        const newReplies = response.replies.map(convertToReply); // API -> 내부 타입 변환
        setDisplayedReplies((prevReplies) => [...prevReplies, ...newReplies]);
        setNextReplyCursor(response.nextCursorId ?? null);
        console.log(
          `답글 ${newReplies.length}개 추가됨, 다음 커서: ${
            response.nextCursorId ?? "없음"
          }`
        );
      } else {
        setNextReplyCursor(null);
        console.log("더 이상 가져올 답글 없음.");
      }
    } catch (error) {
      console.error("답글 더보기 처리 중 오류:", error);
      Alert.alert("오류", "답글을 불러오는 중 오류가 발생했습니다.");
    } finally {
      setIsLoadingMore(false);
    }
  }, [comment.commentId, isLoadingMore, nextReplyCursor, loadReplies]);

  // 더 보여줄 답글이 있는지 계산
  const hasMoreReplies = comment.replyCount > displayedReplies.length;

  // 댓글용 좋아요 버튼 props 생성
  const commentLikeProps = useLikeButton(
    comment.commentId,
    "POST_COMMENT",
    comment.isLiked,
    comment.likeCount,
    onCommentChange
  );

  // 서비스에서 반환하는 Reply 타입을 내부 Reply 타입으로 변환
  const convertToReply = (apiReply: any): Reply => {
    return {
      replyId: apiReply.replyId,
      parentId: apiReply.parentId,
      nickname: apiReply.nickname,
      profileUrl: apiReply.profileUrl,
      userType: apiReply.userType || "",
      createdAt: apiReply.createdAt,
      content: apiReply.content,
      likeCount: apiReply.likeCount,
      isLiked: apiReply.isLiked,
    };
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ProfileImage imageUrl={comment.profileUrl} variant="medium" />
        <View style={styles.authorInfo}>
          <View style={styles.nameContainer}>
            <Text style={styles.authorName}>{comment.nickname}</Text>
            <PersonalityTag
              personality={comment.userType || ""}
              nickname={comment.nickname || ""}
            />
          </View>
          <Text style={styles.date}>{getTimeAgo(comment.createdAt)}</Text>
        </View>
      </View>
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
              style={styles.actionButton}
            >
              <Text style={styles.actionText}>저장</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleCancelPress}
              style={styles.actionButton}
            >
              <Text style={styles.actionText}>취소</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <Text style={styles.content}>{comment.content}</Text>
      )}
      <View style={styles.footer}>
        <LikeButton {...commentLikeProps} size="small" isVertical={false} />
        <TouchableOpacity
          onPress={handleReplyPress}
          style={styles.actionButton}
        >
          <Text style={styles.actionText}>답글달기</Text>
        </TouchableOpacity>
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
      </View>

      {isReplying && (
        <View style={styles.replyInputContainer}>
          <TextInput
            style={styles.replyInput}
            placeholder={`@${comment.nickname}에게 답글 남기기`}
            value={commentText}
            onChangeText={setCommentText}
            autoFocus
            multiline
          />
          <TouchableOpacity
            onPress={handleSubmitReply}
            disabled={submitting || !commentText.trim()}
            style={styles.replySubmitButton}
          >
            <Text>등록</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleCancelReply}
            style={styles.replyCancelButton}
          >
            <Text>취소</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* *** 답글 목록 렌더링 (ReplyItem 사용) *** */}
      {displayedReplies.length > 0 && (
        <View style={styles.repliesContainer}>
          {displayedReplies.map((reply) => (
            <ReplyItem
              key={reply.replyId}
              postId={postId}
              reply={reply}
              onCommentChange={onCommentChange}
            />
          ))}
        </View>
      )}

      {/* *** 더보기 버튼 (기존 로직 유지) *** */}
      {hasMoreReplies && (
        <TouchableOpacity
          style={styles.loadMoreButton}
          onPress={handleLoadMoreReplies}
          disabled={isLoadingMore}
        >
          {isLoadingMore ? (
            <ActivityIndicator size="small" color="#888" />
          ) : (
            <Text style={styles.loadMoreText}>
              답글 {comment.replyCount - displayedReplies.length}개 더보기
            </Text>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
}

// --- 스타일 정의 (수정) ---
const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
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
  content: {
    fontSize: 14,
    lineHeight: 20,
    color: "#333",
    marginBottom: 8,
    marginLeft: 40, // 들여쓰기
  },
  editingContainer: {
    marginLeft: 40, // 들여쓰기
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
    minHeight: 60,
    textAlignVertical: "top",
  },
  editActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    marginLeft: 40, // 들여쓰기
  },
  actionButton: {
    marginLeft: 12,
    paddingVertical: 4,
  },
  actionText: {
    fontSize: 12,
    color: "#555",
  },
  replyInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    marginLeft: 40, // 댓글 내용과 맞춤
    paddingLeft: 0, // ReplyItem의 replyContainer와 구분
  },
  replyInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 6,
    marginRight: 8,
    fontSize: 13,
  },
  replySubmitButton: {
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 4,
    marginRight: 4,
    backgroundColor: "#eee", // 임시 스타일
  },
  replyCancelButton: {
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 4,
    backgroundColor: "#eee", // 임시 스타일
  },
  repliesContainer: {
    marginTop: 10,
    // marginLeft 등은 ReplyItem 내부에서 처리
  },
  loadMoreButton: {
    marginLeft: 40, // 답글 들여쓰기 고려
    marginTop: 8,
    paddingVertical: 6,
    alignSelf: "flex-start",
  },
  loadMoreText: {
    fontSize: 13,
    color: "#007bff",
    fontWeight: "bold",
  },
});
