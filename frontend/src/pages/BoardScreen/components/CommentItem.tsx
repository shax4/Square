import React, {
  useState,
  useCallback,
  Fragment,
  useRef,
  useEffect,
  forwardRef,
} from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  FlatList,
  LayoutChangeEvent,
} from "react-native";
import ProfileImage from "../../../components/ProfileImage/ProfileImage";
import PersonalityTag from "../../../components/PersonalityTag/PersonalityTag";
import LikeButton from "../../../components/LikeButton";
import { Comment, Reply } from "../board.types";
import { Icons } from "../../../../assets/icons/Icons";
import { useAuthStore } from "../../../shared/stores/auth";
import { getTimeAgo } from "../../../shared/utils/timeAge/timeAge";
import Text from "../../../components/Common/Text";
import colors from "../../../../assets/colors";
import { useComment } from "../../../shared/hooks";
import ReplyItem from "./ReplyItem";
import { useRoute } from "@react-navigation/native";
import { StackScreenProps } from "@react-navigation/stack";
import { BoardStackParamList } from "../../../shared/page-stack/BoardPageStack";
import { TargetType } from "../../../components/LikeButton/LikeButton.types";

interface CommentItemProps {
  postId: number; // 게시글 ID
  comment: Comment; // 댓글 타입 (대댓글은 재귀 호출 시 prop 이름 변경 고려)
  onCommentChange: () => void; // 부모 컴포넌트에 변경사항 알림 콜백
  onHideRepliesScrollRequest?: (yPosition: number) => void; // *** Prop 타입 추가 ***
  commentRef?: React.RefObject<View>; // 추가된 prop
}

const CommentItem: React.FC<CommentItemProps> = ({
  postId,
  comment,
  onCommentChange,
  onHideRepliesScrollRequest, // *** Prop 받기 ***
  commentRef, // 추가된 prop
}: CommentItemProps) => {
  const route =
    useRoute<StackScreenProps<BoardStackParamList, "BoardDetail">["route"]>();
  const [showReplies, setShowReplies] = useState(false);
  const containerRef = useRef<View>(null);
  const [isFocused, setIsFocused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * 댓글 포커싱 효과를 처리하는 useEffect
   * - 라우트 파라미터에서 포커싱할 댓글 ID를 확인하고 매칭되면 강조 표시
   * - 1초 후에 강조 효과 자동 제거
   */
  useEffect(() => {
    // 기존 타이머가 있으면 제거 (중복 실행 방지)
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    const focusCommentId = route.params?.focusCommentId;

    // 현재 댓글이 포커싱 대상인 경우
    if (focusCommentId && focusCommentId === comment.commentId) {
      console.log(`댓글 ${comment.commentId} 포커싱 적용`);
      setIsFocused(true);

      // 1.5초 후 포커싱 효과 제거
      timerRef.current = setTimeout(() => {
        console.log(`댓글 ${comment.commentId} 포커싱 제거`);
        setIsFocused(false);
        timerRef.current = null;
      }, 1500);
    }

    // 컴포넌트 언마운트 또는 의존성 배열 값 변경 시 타이머 정리
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [route.params?.focusCommentId, comment.commentId]);

  // *** 실제 로그인 사용자 정보 가져오기 ***
  const loggedInUser = useAuthStore((state) => state.user);

  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);

  // comment.replies는 초기 로드된 대댓글 목록
  const initialReplies = comment.replies || []; // API 응답의 초기 답글 목록
  const [displayedReplies, setDisplayedReplies] = useState<Reply[]>(() => {
    return initialReplies.slice(0, 3);
  });
  const [nextReplyCursor, setNextReplyCursor] = useState<number | null>(() => {
    if (comment.replyCount > 3 && initialReplies.length === 3) {
      return initialReplies[2].replyId;
    }
    return null;
  });
  const [isLoadingMore, setIsLoadingMore] = useState(false); // 더보기 로딩
  const [isReplying, setIsReplying] = useState(false); // 답글 입력창 표시 상태
  const [replyText, setReplyText] = useState(""); // 답글 내용 상태

  // *** 내용 펼치기/접기 상태 추가 ***
  const [isExpanded, setIsExpanded] = useState(false);

  // *** 모든 답글 표시 여부 상태 추가 ***
  const [isAllRepliesVisible, setIsAllRepliesVisible] = useState(
    () => comment.replyCount <= 3
  );

  // *** 레이아웃 Y 위치 상태 추가 ***
  const [commentLayoutY, setCommentLayoutY] = useState<number>(0);

  // *** 이전 답글 개수 추적 ref 추가 ***
  const prevReplyCountRef = useRef<number | undefined>(comment.replyCount);

  // *** 새 답글 추가 시 자동으로 모든 답글 로드를 위한 플래그 ref 추가 ***
  const shouldLoadAllRepliesRef = useRef(false);

  // *** 레이아웃 이벤트 핸들러 ***
  const handleLayout = (event: LayoutChangeEvent) => {
    const { y } = event.nativeEvent.layout;
    setCommentLayoutY(y);
  };

  // *** isAuthor 로직 수정: 로그인 사용자와 댓글 작성자 비교 ***
  const isAuthor = loggedInUser?.nickname === comment.nickname;

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

  // --- 댓글 내용 처리 ---
  const isLongContent = comment.content.length > 110;
  const displayedContent =
    isLongContent && !isExpanded
      ? `${comment.content.substring(0, 110)}...`
      : comment.content;

  // *** 더보기/접기 토글 함수 ***
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  // *** useEffect 로직 수정: 답글 개수 변경 시 플래그 설정 ***
  useEffect(() => {
    const newInitialReplies = comment.replies || [];
    const prevReplyCount = prevReplyCountRef.current; // 이전 답글 개수 가져오기
    const currentReplyCount = comment.replyCount; // 현재 답글 개수

    const isNewReplyAdded =
      typeof prevReplyCount === "number" && currentReplyCount > prevReplyCount;

    if (isNewReplyAdded) {
      // 새 답글이 추가되었을 때는 자동 로드 플래그만 설정
      shouldLoadAllRepliesRef.current = true;
      // UI 상태는 미리 변경 (사용자에게 로딩 중임을 표시)
      setIsAllRepliesVisible(true);
    } else if (prevReplyCount === undefined) {
      // 초기 마운트 시 또는 이전 상태가 없을 때 (기본 로직)
      const slicedReplies = newInitialReplies.slice(0, 3);
      setDisplayedReplies(slicedReplies);
      let newCursor = null;
      if (currentReplyCount > 3 && newInitialReplies.length >= 3) {
        newCursor = newInitialReplies[2].replyId;
      }
      setNextReplyCursor(newCursor);
      setIsAllRepliesVisible(currentReplyCount <= 3);
    } else {
      // 답글 개수 변화 없을 때 (예: 좋아요 변경 등 다른 prop 변경)
      // 상태를 유지 (기존 displayedReplies 유지됨)
    }

    // 현재 답글 개수를 ref에 저장하여 다음 실행 시 비교
    prevReplyCountRef.current = currentReplyCount;
  }, [comment.replies, comment.replyCount]); // 의존성 배열 유지

  // *** 새로운 useEffect: 모든 답글 자동 로드 효과 ***
  useEffect(() => {
    // 플래그가 설정된 경우에만 자동 로드 실행
    if (shouldLoadAllRepliesRef.current && comment.replyCount > 3) {
      // 모든 답글 자동 로드 함수
      const loadAllReplies = async () => {
        // 플래그 초기화 (중복 실행 방지)
        shouldLoadAllRepliesRef.current = false;

        // 현재 표시된 답글의 마지막 ID가 커서가 됨
        let cursor =
          initialReplies.length >= 3 ? initialReplies[2].replyId : null;

        if (cursor) {
          setIsLoadingMore(true);
          try {
            // 재귀적으로 모든 답글 가져오기
            const allReplies = await loadAllRepliesRecursively(
              comment.commentId,
              cursor
            );

            // 초기 답글과 새로 로드한 모든 답글 합치기
            if (allReplies.length > 0) {
              setDisplayedReplies([...initialReplies, ...allReplies]);
            }

            // 모든 답글을 로드했으므로 커서를 null로 설정
            setNextReplyCursor(null);
            // 모든 답글 표시 상태로 변경
            setIsAllRepliesVisible(true);
          } catch (error) {
            console.error("자동 답글 로드 오류:", error);
            // 오류 시에도 모든 답글 표시 상태 유지 (최소한 버튼은 일관성 있게)
            setIsAllRepliesVisible(true);
          } finally {
            setIsLoadingMore(false);
          }
        } else {
          // 커서가 없는 경우 (3개 미만의 답글)
          // 이미 모든 답글이 표시되어 있으므로 상태만 업데이트
          setIsAllRepliesVisible(true);
        }
      };

      // 자동 로드 함수 실행
      loadAllReplies();
    }
  }, [comment.commentId, comment.replyCount, initialReplies, loadReplies]);

  // *** 재귀적으로 모든 답글을 가져오는 함수 추가 ***
  const loadAllRepliesRecursively = useCallback(
    async (commentId: number, cursor: number): Promise<Reply[]> => {
      try {
        const response = await loadReplies(commentId, cursor);
        if (!response || !response.replies || response.replies.length === 0) {
          return []; // 답글이 없으면 빈 배열 반환
        }

        // 응답으로 받은 답글을 Reply 타입으로 변환
        const convertToReply = (apiReply: any): Reply => ({
          replyId: apiReply.replyId,
          parentId: apiReply.parentId,
          nickname: apiReply.nickname,
          profileUrl: apiReply.profileUrl,
          userType: apiReply.userType || "",
          createdAt: apiReply.createdAt,
          content: apiReply.content,
          likeCount: apiReply.likeCount,
          isLiked: apiReply.isLiked,
        });

        const currentPageReplies = response.replies.map(convertToReply);

        // 다음 커서가 있으면 재귀적으로 더 많은 답글 로드
        if (response.nextCursorId) {
          const nextPageReplies = await loadAllRepliesRecursively(
            commentId,
            response.nextCursorId
          );
          // 현재 페이지 답글과 다음 페이지 답글 합치기
          return [...currentPageReplies, ...nextPageReplies];
        }

        // 더 이상 로드할 답글이 없으면 현재 페이지 답글만 반환
        return currentPageReplies;
      } catch (error) {
        console.error("답글 재귀 로드 중 오류:", error);
        return []; // 오류 발생 시 빈 배열 반환
      }
    },
    [loadReplies]
  );

  // *** 답글 로컬 상태 업데이트 함수 ***
  const handleReplyUpdate = useCallback((updatedReply: Reply) => {
    setDisplayedReplies((prevReplies) =>
      prevReplies.map((reply) =>
        reply.replyId === updatedReply.replyId ? updatedReply : reply
      )
    );
  }, []);

  const handleReplyDelete = useCallback(
    (deletedReplyId: number) => {
      setDisplayedReplies((prevReplies) =>
        prevReplies.filter((reply) => reply.replyId !== deletedReplyId)
      );
      onCommentChange();
    },
    [onCommentChange]
  );

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
    if (editedContent.trim() === "" || editedContent === comment.content) {
      setIsEditing(false);
      return;
    }
    try {
      const success = await updateComment(comment.commentId, editedContent);
      if (success) {
        setIsEditing(false);
        onCommentChange();
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
    Alert.alert("댓글 삭제", "정말 이 댓글을 삭제하시겠습니까?", [
      { text: "취소", style: "cancel" },
      {
        text: "삭제",
        style: "destructive",
        onPress: async () => {
          try {
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
    setCommentText("");
  };
  // 대댓글 생성 취소 함수
  const handleCancelReply = () => {
    setIsReplying(false);
    setCommentText("");
  };
  // 대댓글 생성 저장 함수
  const handleSubmitReply = async () => {
    try {
      const success = await createComment(postId, comment.commentId);
      if (success) {
        setIsReplying(false);
        onCommentChange(); // Triggers refresh -> useEffect
      }
    } catch (error) {
      console.error("답글 작성 핸들러 오류:", error);
      Alert.alert(
        "오류",
        "답글을 등록하는 중 예기치 못한 문제가 발생했습니다."
      );
    }
  };
  // *** handleLoadMoreReplies 함수 정의 ***
  const handleLoadMoreReplies = useCallback(async () => {
    if (isLoadingMore || nextReplyCursor === null) {
      return;
    }
    setIsLoadingMore(true);
    try {
      const response = await loadReplies(comment.commentId, nextReplyCursor);
      if (response && response.replies && response.replies.length > 0) {
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
        const newReplies = response.replies.map(convertToReply);
        setDisplayedReplies((prevReplies) => [...prevReplies, ...newReplies]);
        const nextCursor = response.nextCursorId ?? null;
        setNextReplyCursor(nextCursor);
        if (nextCursor === null) {
          setIsAllRepliesVisible(true);
        }
      } else {
        setNextReplyCursor(null);
        setIsAllRepliesVisible(true);
      }
    } catch (error) {
      console.error("❌ 답글 더보기 처리 중 오류:", error);
      Alert.alert("오류", "답글을 불러오는 중 오류가 발생했습니다.");
    } finally {
      setIsLoadingMore(false);
    }
  }, [comment.commentId, isLoadingMore, nextReplyCursor, loadReplies]);

  // *** handleHideReplies 함수 정의 ***
  const handleHideReplies = useCallback(() => {
    const currentInitialReplies = comment.replies || [];
    setDisplayedReplies(currentInitialReplies.slice(0, 3));
    setNextReplyCursor(() => {
      if (comment.replyCount > 3 && currentInitialReplies.length >= 3) {
        return currentInitialReplies[2].replyId;
      }
      return null;
    });
    setIsAllRepliesVisible(false);
    onHideRepliesScrollRequest?.(commentLayoutY);
  }, [
    comment.replies,
    comment.replyCount,
    onHideRepliesScrollRequest,
    commentLayoutY,
  ]);

  // 더보기/숨기기 버튼 표시 로직
  const canLoadMore = comment.replyCount > displayedReplies.length;

  return (
    <View
      ref={commentRef}
      style={[styles.container, isFocused && styles.focusedContainer]}
      onLayout={handleLayout}
    >
      <View style={styles.header}>
        <ProfileImage imageUrl={comment.profileUrl} variant="small" />
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
        <View style={styles.contentContainer}>
          <Text style={styles.content}>{displayedContent}</Text>
          {isLongContent && (
            <TouchableOpacity
              onPress={toggleExpand}
              style={styles.expandButton}
            >
              <Text style={styles.expandButtonText}>
                {isExpanded ? "접기" : "펼치기"}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
      <View style={styles.footer}>
        <LikeButton
          targetId={comment.commentId}
          targetType="POST_COMMENT"
          initialLiked={comment.isLiked ?? false} // 스토어 초기값 제공
          initialCount={comment.likeCount ?? 0} // 스토어 초기값 제공
          size="small"
          isVertical={false}
        />
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
            style={[
              styles.replySubmitButton,
              (submitting || !commentText.trim()) && styles.disabledButton,
            ]}
          >
            <Text style={styles.buttonText}>등록</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleCancelReply}
            style={styles.replyCancelButton}
          >
            <Text style={styles.buttonText}>취소</Text>
          </TouchableOpacity>
        </View>
      )}
      {/* *** 답글 목록 렌더링 *** */}
      {displayedReplies.length > 0 && (
        <View style={styles.repliesContainer}>
          {displayedReplies.map((reply) => (
            <ReplyItem
              key={reply.replyId}
              postId={postId}
              reply={reply}
              onCommentChange={onCommentChange}
              onReplyUpdate={handleReplyUpdate}
              onReplyDelete={handleReplyDelete}
            />
          ))}
        </View>
      )}
      {/* *** 로딩 인디케이터 추가 *** */}
      {isLoadingMore && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#888" />
        </View>
      )}
      {/* *** 더보기/숨기기 버튼 렌더링 로직 수정 *** */}
      {isAllRepliesVisible && comment.replyCount > 3 ? (
        // 모든 답글 보이는 상태이고, 답글이 3개 초과면 '숨기기' 버튼
        <TouchableOpacity
          style={styles.loadMoreButton}
          onPress={handleHideReplies}
          disabled={isLoadingMore} // 로딩 중엔 비활성화
        >
          <Text style={styles.loadMoreText}>답글 숨기기</Text>
        </TouchableOpacity>
      ) : !isAllRepliesVisible && canLoadMore ? (
        // 숨겨진 상태이고, 더 로드할 답글 있으면 '더보기' 버튼
        <TouchableOpacity
          style={styles.loadMoreButton}
          onPress={handleLoadMoreReplies}
          disabled={isLoadingMore}
        >
          <Text style={styles.loadMoreText}>
            답글 {comment.replyCount - displayedReplies.length}개 더보기
          </Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

// --- 스타일 정의 (수정) ---
const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  focusedContainer: {
    backgroundColor: "#fffee0", // 포커싱된 댓글 배경색 변경
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ffd700", // 금색 테두리
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 2,
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
  // *** 내용 컨테이너 스타일 추가 ***
  contentContainer: {
    // marginLeft: 40, // 들여쓰기
    marginBottom: 8,
  },
  content: {
    fontSize: 14,
    lineHeight: 20,
    color: "#333",
  },
  // *** 더보기/접기 버튼 스타일 추가 ***
  expandButton: {
    alignSelf: "flex-start", // 버튼 크기를 텍스트에 맞춤
    marginTop: 4,
    paddingVertical: 2,
  },
  expandButtonText: {
    fontSize: 12,
    color: "#007bff",
    fontWeight: "bold",
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
    backgroundColor: "#007bff", // 활성 버튼 색상
  },
  replyCancelButton: {
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 4,
    backgroundColor: "#ccc", // 취소 버튼 색상
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
  // *** 로딩 컨테이너 스타일 추가 ***
  loadingContainer: {
    marginLeft: 40,
    marginTop: 8,
    marginBottom: 8,
    alignSelf: "flex-start",
  },
  // *** 비활성화 버튼 스타일 추가 ***
  disabledButton: {
    backgroundColor: "#aaa", // 비활성 버튼 색상
  },
  // *** 버튼 텍스트 스타일 추가 ***
  buttonText: {
    color: "#fff", // 버튼 텍스트 색상
    fontWeight: "bold",
    fontSize: 13,
  },
});

export default CommentItem;
