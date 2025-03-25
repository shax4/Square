import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView,
  Alert
} from 'react-native';
import { BoardAPI } from './Api/BoardApi';

export default function BoardWriteScreen({ route, navigation }) {
  // 게시글 ID (수정 모드일 경우 존재)
  const postId = route.params?.postId;
  // 수정 모드인지 여부 확인
  const isEditMode = !!postId;
  
  // 제목과 내용 상태 관리
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  // 로딩 상태 관리
  const [loading, setLoading] = useState(false);

  // 수정 모드일 때 기존 데이터 로드
  useEffect(() => {
    if (isEditMode) {
      fetchPostData();
    }
  }, [postId]);

  // 게시글 데이터 가져오기 (수정 모드)
  const fetchPostData = async () => {
    try {
      setLoading(true);
      const response = await BoardAPI.getPostDetail(postId);
      const post = response.data;
      setTitle(post.title);
      setContent(post.content);
    } catch (error) {
      console.error('게시글 정보를 불러오는 데 실패했습니다:', error);
      Alert.alert('오류', '게시글 정보를 불러오는 데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 게시글 저장 (생성 또는 수정)
  const handleSave = async () => {
    // 유효성 검사
    if (!title.trim()) {
      Alert.alert('입력 오류', '제목을 입력해주세요.');
      return;
    }
    
    if (!content.trim()) {
      Alert.alert('입력 오류', '내용을 입력해주세요.');
      return;
    }
    
    try {
      setLoading(true);
      const postData = { title, content };
      
      if (isEditMode) {
        // 게시글 수정
        await BoardAPI.updatePost(postId, postData);
        Alert.alert('완료', '게시글이 수정되었습니다.', [
          { text: '확인', onPress: () => navigation.goBack() }
        ]);
      } else {
        // 새 게시글 작성
        await BoardAPI.createPost(postData);
        Alert.alert('완료', '게시글이 작성되었습니다.', [
          { text: '확인', onPress: () => navigation.goBack() }
        ]);
      }
    } catch (error) {
      console.error('게시글 저장에 실패했습니다:', error);
      Alert.alert('오류', '게시글을 저장하는 중 문제가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={100}
    >
      <ScrollView style={styles.scrollView}>
        {/* 제목 입력 영역 */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>제목</Text>
          <TextInput
            style={styles.titleInput}
            placeholder="제목을 입력하세요"
            value={title}
            onChangeText={setTitle}
            maxLength={100} // 제목 최대 길이 제한
          />
        </View>
        
        {/* 내용 입력 영역 */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>내용</Text>
          <TextInput
            style={styles.contentInput}
            placeholder="내용을 입력하세요"
            value={content}
            onChangeText={setContent}
            multiline
            textAlignVertical="top" // 안드로이드에서 텍스트가 상단부터 시작하도록 설정
          />
        </View>
      </ScrollView>
      
      {/* 버튼 영역 */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={() => navigation.goBack()}
          disabled={loading}
        >
          <Text style={styles.cancelButtonText}>취소</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.button, styles.saveButton, loading && styles.disabledButton]}
          onPress={handleSave}
          disabled={loading}
        >
          <Text style={styles.saveButtonText}>
            {loading ? '저장 중...' : (isEditMode ? '수정' : '등록')}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  titleInput: {
    borderWidth: 1,
    borderColor: '#e1e1e1',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  contentInput: {
    borderWidth: 1,
    borderColor: '#e1e1e1',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    minHeight: 200, // 내용 입력 필드 최소 높이
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e1e1e1',
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f2f2f2',
    marginRight: 8,
  },
  saveButton: {
    backgroundColor: '#007BFF',
    marginLeft: 8,
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
  cancelButtonText: {
    color: '#333',
    fontWeight: 'bold',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
