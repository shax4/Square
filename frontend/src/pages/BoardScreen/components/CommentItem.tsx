import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import ProfileImage from '../../../components/ProfileImage/ProfileImage';
import PersonalityTag from '../../../components/PersonalityTag/PersonalityTag';
import LikeButton from '../../../components/LikeButton';
import { BoardAPI } from '../Api/boardApi';
import { Comment } from './CommentItem.types';
import { Icons } from '../../../../assets/icons/Icons';
import { useAuth } from '../../../shared/hooks/useAuth';

interface CommentItemProps {
  comment: Comment; // 댓글 타입
  onDelete?: () => void; // 부모 컴포넌트에서 전달된 콜백
}

export default function CommentItem({ comment, onDelete }: CommentItemProps) {
  const { user } = useAuth(); // 현재 사용자
  // 현재 사용자가 댓글 작성자인지 확인
  const isAuthor = user?.nickname === comment.nickname;

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
              if (onDelete) onDelete(); // 상위 컴포넌트에서 전달된 콜백 함수 호출
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
