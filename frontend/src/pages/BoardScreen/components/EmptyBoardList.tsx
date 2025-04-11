import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

interface EmptyBoardListProps {
  onPressWrite?: () => void;
}

/**
 * 게시글이 없을 때 표시되는 빈 상태 컴포넌트
 * @param onPressWrite 글쓰기 버튼 클릭 시 실행될 함수
 */
export default function EmptyBoardList({ onPressWrite }: EmptyBoardListProps) {
  return (
    <View style={styles.container}>
      <Image 
        source={require('../../../../assets/images/empty-posts.png')} 
        style={styles.image}
        // 이미지가 없다면 아래 코드로 대체 가능
        // defaultSource={require('../../../../assets/images/placeholder.png')}
      />
      
      <Text style={styles.title}>게시글이 없습니다</Text>
      <Text style={styles.subtitle}>첫 번째 게시글을 작성해보세요!</Text>
      
      {onPressWrite && (
        <TouchableOpacity 
          style={styles.writeButton}
          onPress={onPressWrite}
        >
          <Text style={styles.writeButtonText}>글쓰기</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    minHeight: 300, // 최소 높이 설정
  },
  image: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
  },
  writeButton: {
    backgroundColor: '#007BFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  writeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
