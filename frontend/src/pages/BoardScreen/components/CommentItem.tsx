import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import ProfileImage from '../../../components/ProfileImage/ProfileImage';
import { BoardAPI } from '../Api/boardApi';
import { Icons } from '../../../../assets/icons/Icons';

// 현재 로그인한 사용자 정보 (실제로는 상태 관리나 컨텍스트에서 가져옴)
const currentUser = {
  nickname: '반짝이는하마', // 예시 ID
};
// 댓글 인터페이스
interface Comment {
  commentId: number; // 댓글 ID
  nickname: string; // 작성자 닉네임
  profileUrl?: string; // 작성자 프로필 이미지 URL
  userType: string; // 작성자 유형
  createdAt: string; // 작성 시간
  content: string; // 댓글 내용
  likeCount: number; // 좋아요 개수
  isLiked: boolean; // 사용자가 좋아요를 눌렀는지 여부
}

interface CommentItemProps {
  comment: Comment; // 댓글 데이터 객체
  onDelete?: () => void; // 삭제 후 실행될 콜백 함수 (선택적)
}

export default function CommentItem({ comment, onDelete }: CommentItemProps) {
  // 현재 사용자가 댓글 작성자인지 확인
  const isAuthor = comment.nickname === currentUser.nickname;

  // 댓글 삭제 함수
  const handleDelete = () => {
    // 삭제 확인 다이얼로그 표시
    Alert.alert(
      "댓글 삭제",
      "정말 이 댓글을 삭제하시겠습니까?",
      [
        {
          text: "취소",
          style: "cancel"
        },
        { 
          text: "삭제", 
          onPress: async () => {
            try {
              await BoardAPI.deleteComment(comment.commentId);
              if (onDelete) onDelete(); // 댓글 목록 새로고침
            } catch (error) {
              console.error('댓글 삭제에 실패했습니다:', error);
              Alert.alert("오류", "댓글 삭제 중 오류가 발생했습니다.");
            }
          },
          style: "destructive"
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* 프로필 이미지 */}
      <ProfileImage 
        imageUrl={comment.profileUrl} 
        variant='medium' 
      />
      
      <View style={styles.commentContent}>
        <View style={styles.commentHeader}>
          {/* 작성자 이름 */}
          <Text style={styles.authorName}>{comment.nickname}</Text>
          {/* 작성 시간 */}
          <Text style={styles.commentDate}>{comment.createdAt}</Text>
          
          {/* 작성자인 경우에만 삭제 버튼 표시 */}
          {isAuthor && (
            <TouchableOpacity 
              style={styles.deleteButton}
              onPress={handleDelete}
            >
              <Icons.delete size={16} />
            </TouchableOpacity>
          )}
        </View>
        
        {/* 댓글 내용 */}
        <Text style={styles.commentText}>{comment.content}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e1e1',
  },
  commentContent: {
    flex: 1,
    marginLeft: 10,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  authorName: {
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 8,
  },
  commentDate: {
    fontSize: 12,
    color: '#666',
    flex: 1,
  },
  commentText: {
    fontSize: 14,
    lineHeight: 20,
  },
  deleteButton: {
    padding: 4,
  },
});
