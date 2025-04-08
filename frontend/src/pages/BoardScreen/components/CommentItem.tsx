import React, { useState, useCallback, Fragment, useRef } from "react";
import {
  View,
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
import { useLikeButton } from "../../../shared/hooks/useLikeButton";
import Text from '../../../components/Common/Text';
import colors from "../../../../assets/colors";

interface CommentItemProps {
  postId: number; // 게시글 ID
  comment: Comment; // 댓글 타입 (대댓글은 재귀 호출 시 prop 이름 변경 고려)
  onCommentChange: () => void; // 부모 컴포넌트에 변경사항 알림 콜백
  isReply?: boolean; // 이 컴포넌트가 대댓글을 랜더링하는지 여부 (스타일링용)
}

export default function CommentItem({
  postId,
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
  // !! 실제 API는 커서 기반 페이지네이션 필요. !!
  // nextReplyCursor 초기화: 로드된 마지막 댓글의 ID를 저장
  const [nextReplyCursor, setNextReplyCursor] = useState<number | null>(() => {
    if (comment.replies && comment.replies.length > 0) {
      return comment.replies[comment.replies.length - 1].commentId;
    }
    return null; // 초기 댓글 없으면 null
  });
  const [isReplying, setIsReplying] = useState(false); // 답글 입력창 표시 상태
  const [replyText, setReplyText] = useState(""); // 답글 내용 상태

  const [editingReplyId, setEditingReplyId] = useState<number | null>(null); // 대댓글 수정 모드 상태
  const [editedReplyContent, setEditedReplyContent] = useState(""); // 대댓글 수정 내용 상태

  // 현재 사용자가 댓글 작성자인지 확인
  const isAuthor = user?.nickname === comment.nickname;

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
  // 대댓글 생성 시작 함수
  const handleReplyPress = () => {
    setIsReplying(true);
  };
  // 대댓글 생성 취소 함수
  const handleCancelReply = () => {
    setIsReplying(false);
    setReplyText("");
  };
  // 대댓글 생성 저장 함수
  const handleSubmitReply = async () => {
    // 입력된 텍스트가 비어있는지 확인
    if (!replyText.trim()) return;

    try {
      // 대댓글 생성 API 호출
      // BoardAPI.createComment 함수 호출하여 대댓글 생성
      // 세 번째 인자로 parentCommentId 전달 (이것이 대댓글임을 나타냄)
      await BoardAPI.createComment(postId, replyText, comment.commentId);

      // 입력창 초기화
      setReplyText("");
      // 답글 입력 모드 종료
      setIsReplying(false);
      // 댓글 목록 갱신 (부모 컴포넌트에 알림)
      onCommentChange();
    } catch (error) {
      // 오류 처리
      console.error("답글 작성 실패:", error);
      Alert.alert("오류", "답글을 등록하는 중 문제가 발생했습니다.");
    }
  };
  // 대댓글 더보기 함수 : 현재 커서 전달, 다음 커서 업데이트
  const handleLoadMoreReplies = useCallback(async () => {
    // '더보기' 버튼 자체가 hasMoreReplies 조건으로 렌더링되므로, 여기서 중복 체크 불필요
    if (replyLoading || !comment.commentId) return; // commentId 확인

    setReplyLoading(true);
    try {
      // API 호출 시 현재 nextReplyCursor 상태 값 전달
      const response = await BoardAPI.getMoreReplies(
        comment.commentId,
        nextReplyCursor
      );

      const newReplies = response.data.replies || [];
      // API 응답에서 다음 호출에 사용할 커서 값을 가져옴
      const nextCursorFromServer = response.data.nextCursorId;

      setLoadedReplies((prevReplies) => [...prevReplies, ...newReplies]);
      // 다음 API 호출을 위해 커서 상태 업데이트
      setNextReplyCursor(nextCursorFromServer);
    } catch (error) {
      console.error("대댓글 로드 실패:", error);
      Alert.alert("오류", "대댓글을 불러오는 중 오류가 발생했습니다.");
    } finally {
      setReplyLoading(false);
    }
    // 의존성 배열에서 hasMoreReplies 제거 가능 (버튼 표시 조건으로만 사용)
  }, [comment.commentId, replyLoading, nextReplyCursor]);

  // 표시할 대댓글 수와 전체 대댓글 수 비교
  const hasMoreReplies = comment.replyCount > loadedReplies.length;

  // 대댓글 수정 시작 함수
  const handleEditReply = (reply: Reply) => {
    // 수정할 대댓글 ID 저장
    setEditingReplyId(reply.commentId);
    // 수정할 내용 초기값 설정
    setEditedReplyContent(reply.content);
  };
  // 대댓글 수정 취소 함수
  const handleCancelEditReply = () => {
    // 수정 모드 종료
    setEditingReplyId(null);
    // 수정 내용 초기화
    setEditedReplyContent("");
  };
  // 대댓글 수정 저장 함수
  const handleSaveReply = async (replyId: number) => {
    // 입력 내용이 비어있거나 변경되지 않았는지 확인
    if (!editedReplyContent.trim()) {
      Alert.alert("알림", "내용을 입력해주세요.");
      return;
    }

    try {
      // 대댓글 수정 API 호출
      await BoardAPI.updateComment(replyId, editedReplyContent);

      // 로컬 상태도 직접 업데이트
      setLoadedReplies((prevReplies) =>
        prevReplies.map((reply) =>
          reply.commentId === replyId
            ? { ...reply, content: editedReplyContent }
            : reply
        )
      );

      // 수정 모드 종료
      setEditingReplyId(null);
      // 수정 내용 초기화
      setEditedReplyContent("");
      // 댓글 목록 갱신 (부모 컴포넌트에 알림)
      onCommentChange();
    } catch (error) {
      console.error("답글 수정 실패:", error);
      Alert.alert("오류", "답글을 수정하는 중 문제가 발생했습니다.");
    }
  };
  // 대댓글 삭제 함수
  const handleDeleteReply = (replyId: number) => {
    // 삭제 확인 다이얼로그 표시
    Alert.alert("답글 삭제", "정말 이 답글을 삭제하시겠습니까?", [
      {
        text: "취소",
        style: "cancel",
      },
      {
        text: "삭제",
        style: "destructive",
        onPress: async () => {
          try {
            // 대댓글 삭제 API 호출
            await BoardAPI.deleteComment(replyId);

            // 로컬 상태에서 삭제된 대댓글 제거
            setLoadedReplies((prevReplies) =>
              prevReplies.filter((reply) => reply.commentId !== replyId)
            );

            // 댓글 목록 갱신 (부모 컴포넌트에 알림)
            onCommentChange();
          } catch (error) {
            console.error("답글 삭제 실패:", error);
            Alert.alert("오류", "답글을 삭제하는 중 문제가 발생했습니다.");
          }
        },
      },
    ]);
  };

  // 댓글용 좋아요 버튼 props 생성
  const commentLikeProps = useLikeButton(
    comment.commentId,
    "POST_COMMENT",
    comment.isLiked || false,
    comment.likeCount || 0,
    (newState) => handleLikeChange(comment.commentId, newState, true)
  );

  // 대댓글 렌더링 시에는 함수화하여 중복 제거
  const getReplyLikeProps = (reply: Reply) => {
    return useLikeButton(
      reply.commentId,
      "POST_COMMENT",
      reply.isLiked || false,
      reply.likeCount || 0,
      (newState) => handleLikeChange(reply.commentId, newState)
    );
  };

  // 좋아요 상태 변경 핸들러
  const handleLikeChange = (
    commentId: number,
    newState: { isLiked: boolean; likeCount: number },
    isParentComment: boolean = false
  ) => {
    if (isParentComment) {
      // 부모 컴포넌트에 변경 사항 알림 (전체 목록 새로고침)
      onCommentChange();
    } else {
      // 대댓글의 경우 로컬 상태만 업데이트
      setLoadedReplies((prevReplies) =>
        prevReplies.map((reply) =>
          reply.commentId === commentId
            ? {
                ...reply,
                isLiked: newState.isLiked,
                likeCount: newState.likeCount,
              }
            : reply
        )
      );
    }
  };

  return (
    <>
      {/* 댓글 컨테이너 */}
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
                <PersonalityTag
                  personality={comment.userType}
                  nickname={comment.nickname}
                />
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
                    <Text weight="medium">취소</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleSavePress}
                    style={[styles.button, styles.saveButton]}
                  >
                    <Text weight="medium" style={styles.saveButtonText}>저장</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View style={styles.contentRow}>
                <Text weight="medium" style={styles.contentText}>{comment.content}</Text>
                {/* 좋아요 버튼 - 내용 안에 배치 */}
                <View style={styles.replyLikeContainer}>
                  <LikeButton
                    {...commentLikeProps}
                    size="small"
                    isVertical={false}
                  />
                </View>
              </View>
            )}
          </View>
        </View>

        {/* 2. 하단 푸터 영역 (시간/답글 + 수정/삭제) */}
        <View style={styles.footerContainer}>
          {/* 2-1. 왼쪽 그룹 (시간 + 답글 달기) */}
          <View style={styles.leftFooterGroup}>
            <Text weight="medium" style={styles.time}>{getTimeAgo(comment.createdAt)}</Text>
            {/* 답글 달기 버튼 */}
            {!isEditing && ( // 수정 중 아닐 때만 표시
              <TouchableOpacity onPress={handleReplyPress}>
                <Text weight="medium" style={styles.replyButtonText}>답글 달기</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* 2-2. 오른쪽 그룹 (수정/삭제 버튼) */}
          {isAuthor && !isEditing && (
            <View style={styles.authorButtons}>
              <TouchableOpacity onPress={handleEditPress}>
                <Text weight="medium" style={styles.actionText}>수정</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleDeletePress}>
                <Text weight="medium" style={styles.actionText}>삭제</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* 답글 입력창 (isReplying 상태에 따라 표시) */}
        {isReplying && (
          <View style={styles.replyInputArea}>
            <TextInput
              style={styles.replyInput}
              value={replyText}
              onChangeText={setReplyText}
              placeholder={`${comment.nickname}에게 답글 달기...`}
              autoFocus={true}
              multiline={true}
            />
            <View style={styles.replyButtonContainer}>
              <TouchableOpacity
                onPress={handleCancelReply}
                style={styles.button}
              >
                <Text weight="medium">취소</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSubmitReply}
                style={[styles.button, styles.saveButton]}
              >
                <Text weight="medium" style={styles.saveButtonText}>등록</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      {/* 대댓글들을 별도의 독립 컨테이너로 렌더링 */}
      {loadedReplies &&
        loadedReplies.length > 0 &&
        loadedReplies.map((reply) => (
          <View key={reply.commentId} style={styles.replyItemContainer}>
            {/* 사용자 정보 */}
            <View style={styles.userInfoContainer}>
              <ProfileImage imageUrl={reply.profileUrl} variant="small" />
              <View style={styles.userInfoText}>
                <Text style={styles.nickname}>{reply.nickname}</Text>
                <PersonalityTag
                  personality={reply.userType}
                  nickname={reply.nickname}
                />
              </View>
            </View>

            {/* 대댓글 내용 - 수정 중이면 수정 UI 표시 */}
            {editingReplyId === reply.commentId ? (
              // 대댓글 수정 모드 UI
              <View style={styles.editContainer}>
                <TextInput
                  style={styles.textInput}
                  value={editedReplyContent}
                  onChangeText={setEditedReplyContent}
                  autoFocus={true}
                  multiline={true}
                />
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    onPress={handleCancelEditReply}
                    style={styles.button}
                  >
                    <Text weight="medium">취소</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleSaveReply(reply.commentId)}
                    style={[styles.button, styles.saveButton]}
                  >
                    <Text weight="medium" style={styles.saveButtonText}>저장</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              // 대댓글 일반 모드 UI
              <Fragment>
                <View style={styles.replyContentRow}>
                  <Text weight="medium" style={styles.contentText}>{reply.content}</Text>
                  <View style={styles.replyLikeContainer}>
                    <LikeButton
                      {...getReplyLikeProps(reply)}
                      size="small"
                      isVertical={false}
                    />
                  </View>
                </View>
              </Fragment>
            )}

            {/* 푸터는 수정 중이 아닐 때만 표시 */}
            {editingReplyId !== reply.commentId && (
              <View style={styles.replyFooterContainer}>
                <Text weight="medium" style={styles.time}>{getTimeAgo(reply.createdAt)}</Text>

                {user?.nickname === reply.nickname && (
                  <View style={styles.authorButtons}>
                    <TouchableOpacity onPress={() => handleEditReply(reply)}>
                      <Text weight="medium" style={styles.actionText}>수정</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleDeleteReply(reply.commentId)}
                    >
                      <Text weight="medium" style={styles.actionText}>삭제</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            )}
          </View>
        ))}

      {/* 더보기 버튼 */}
      {hasMoreReplies && (
        <TouchableOpacity
          style={styles.loadMoreButton}
          onPress={handleLoadMoreReplies}
          disabled={replyLoading}
        >
          {replyLoading ? (
            <ActivityIndicator size="small" color="#0000ff" />
          ) : (
            <Text weight="medium" style={styles.loadMoreText}>
              답글 {comment.replyCount - loadedReplies.length}개 더보기
            </Text>
          )}
        </TouchableOpacity>
      )}
    </>
  );
}

// --- 스타일 정의 (수정) ---
const styles = StyleSheet.create({
  container: {
    // 전체 댓글 아이템 컨테이너
    paddingVertical: 12,
    paddingHorizontal: 10,
    // backgroundColor: "#fafafa", // 배경색 통일
    // marginBottom: 8, // 댓글 간 간격 추가
    // borderRadius: 8, // 모서리 둥글게
    // borderWidth: 1, // 테두리 추가
    // borderColor: "#eeeeee", // 테두리 색상
  },
  replyItemContainer: {
    // 대댓글 컨테이너 (독립적 컨테이너)
    paddingVertical: 12,
    paddingHorizontal: 16,
    // backgroundColor: "#fafafa", // 댓글과 같은 배경색
    marginBottom: 2, // 간격 추가
    // borderRadius: 8, // 모서리 둥글게
    // borderWidth: 1, // 테두리 추가
    // borderColor: "#eeeeee", // 테두리 색상
    marginLeft: 30, // 들여쓰기
    // borderLeftWidth: 3, // 왼쪽 경계선
    // borderLeftColor: "#e0e0e0", // 경계선 색상
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
  },
  userInfoText: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 8,
  },
  nickname: {
     marginRight: 6
   },
  contentText: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 2, // 사용자 정보 바로 아래부터 시작
  },
  editContainer: { marginVertical: 4 },
  textInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 8,
    minHeight: 80,
    marginBottom: 8,
    backgroundColor: "#fff", // 입력창 배경색 유지
  },
  buttonContainer: { flexDirection: "row", justifyContent: "flex-end" },
  button: {
    padding: 8,
    marginLeft: 8,
  },
  saveButton: {
    backgroundColor: colors.yesDark,
    borderRadius: 6,
  },
  saveButtonText: {
    color: "white",
  },
  likeButton: {
    padding: 4,
  },
  footerContainer: {
    // 하단 푸터 영역
    flexDirection: "row",
    justifyContent: "space-between", // 왼쪽 그룹과 오른쪽 그룹을 양 끝으로
    alignItems: "center",
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
  replyContentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 4,
    marginLeft: 2

  },
  replyFooterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },
  loadMoreButton: {
    padding: 8,
    alignItems: "center",
    marginBottom: 6, // 간격 추가
    marginLeft: 24, // 들여쓰기 적용
  },
  loadMoreText: {
    color: "#666",
    fontSize: 14,
  },
  replyInputArea: {
    marginTop: 12, // 간격 증가
    backgroundColor: "#f8f8f8", // 입력창 영역 배경색
    padding: 8, // 패딩 추가
    borderRadius: 8, // 모서리 둥글게
  },
  replyInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 8,
    minHeight: 80,
    marginBottom: 8,
    backgroundColor: "#fff", // 입력창 배경색 유지 (흰색)
  },
  replyButtonContainer: { flexDirection: "row", justifyContent: "flex-end" },
  replyLikeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 8,
  },
  contentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 4,
    marginLeft: 2
  },
});
