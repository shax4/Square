import React, { useRef } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View, TouchableOpacity, StyleSheet, Alert } from "react-native";
import {
  useNavigation,
  NavigationProp,
  useFocusEffect,
} from "@react-navigation/native";
import { CustomBack } from "../components/CustomBack";

import { Icons } from "../../../../assets/icons/Icons";
import { BoardAPI } from "../../../pages/BoardScreen/Api/boardApi";
import { mockPosts } from "../../../pages/BoardScreen/mocks/boardData";

import BoardListScreen from "../../../pages/BoardScreen/BoardListScreen";
import BoardDetailScreen from "../../../pages/BoardScreen/BoardDetailScreen";
import BoardWriteScreen from "../../../pages/BoardScreen/BoardWriteScreen";
import { BoardStackParamList } from "../../../shared/page-stack/BoardPageStack";
import Text from '../../../components/Common/Text';

// 스택 네비게이터
const Stack = createNativeStackNavigator<BoardStackParamList>();

// 테스트용 예시 사용자 정보(전역 상태관리로 받아오도록 수정 필요)
const currentUser = {
  nickname: "반짝이는하마",
};
// 게시물 정보는 BoardDetailScreen에서 route.params.boardId를 통해 가져옵니다

// 게시판 상단 탭
export default function BoardHeaderBar() {
  // useRef로 상태 관리 (리렌더링 방지)
  const isNavigatingRef = useRef(false);

  // 화면이 포커스를 받을 때마다 useRef 값 재설정
  useFocusEffect(
    React.useCallback(() => {
      // 화면에 포커스가 올 때 실행
      isNavigatingRef.current = false;
      return () => {};
    }, [])
  );

  return (
    <Stack.Navigator>
      {/* 게시판 목록 */}
      <Stack.Screen
        name="BoardList"
        component={BoardListScreen}
        options={{
          headerTitle: () => <Text style={styles.headerTitle}>자유 게시판</Text>,
          headerBackButtonDisplayMode: "minimal",
        }}
      />
      {/* 게시판 상세 */}
      <Stack.Screen
        name="BoardDetail"
        component={BoardDetailScreen}
        options={({ route }) => {
          const boardId = route.params.boardId;

          // 현재 게시글 데이터를 가져와서 작성자 확인
          const post = mockFetchPost(boardId);
          const isAuthor = currentUser.nickname === post?.nickname;

          return {
            headerTitle: () => <Text style={styles.headerTitle}>게시판 상세</Text>,
            headerBackButtonDisplayMode: "minimal",
            headerRight: () => (
              <HeaderRightIcons isAuthor={isAuthor} boardId={boardId} />
            ),
          };
        }}
      />
      {/* 글쓰기 화면 */}
      <Stack.Screen
        name="BoardWrite"
        component={BoardWriteScreen}
        options={({ route }) => ({
          headerTitle: () => <Text style={styles.headerTitle}>게시글 작성</Text>,
          headerBackButtonDisplayMode: "minimal",
          headerLeft: () => (
            <CustomBack
              showConfirm={true}
              isEditMode={!!route.params?.postId}
              postId={route.params?.postId}
            />
          ),
        })}
      />
    </Stack.Navigator>
  );
}

// Mock함수 (실제 API 호출로 대체 필요)
function mockFetchPost(boardId: number) {
  return mockPosts.find((post) => post.postId === boardId);
}

// 상단 바 우측 아이콘 컴포넌트: 현재 사용자와 글 작성자 여부 확인
function HeaderRightIcons({
  isAuthor,
  boardId,
}: {
  isAuthor: boolean;
  boardId: number;
}) {
  // 게시글 데이터를 가져오기 위한 로직
  // const post = mockFetchPost(boardId); // 실제 API 호출로 대체 필요
  const navigation = useNavigation<NavigationProp<BoardStackParamList>>();

  // 게시글 수정 기능
  const handleEdit = () => {
    // BoardWrite 화면으로 이동하면서 postId 전달
    navigation.navigate("BoardWrite", { postId: boardId });
  };

  // 게시글 삭제 기능
  const handleDelete = () => {
    Alert.alert("게시글 삭제", "정말 이 게시글을 삭제하시겠습니까?", [
      { text: "취소", style: "cancel" },
      {
        text: "삭제",
        onPress: async () => {
          try {
            // API를 호출하여 게시글 삭제
            await BoardAPI.deletePost(boardId);
            Alert.alert("삭제 완료", "게시글이 삭제되었습니다.", [
              {
                text: "확인",
                onPress: () =>
                  navigation.navigate("BoardList", { refresh: true }),
              },
            ]);
          } catch (error) {
            console.error("게시글 삭제 중 오류 발생:", error);
            Alert.alert("오류", "게시글 삭제 중 문제가 발생했습니다.");
          }
        },
        style: "destructive",
      },
    ]);
  };
  return (
    <View style={styles.headerRightItems}>
      {isAuthor ? (
        <>
          <TouchableOpacity onPress={handleEdit}>
            <Icons.edit />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDelete}>
            <Icons.delete />
          </TouchableOpacity>
        </>
      ) : (
        <>
          <TouchableOpacity onPress={() => console.log("북마크")}>
            <Icons.bookmark />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => console.log("신고")}>
            <Icons.report />
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  headerRightItems: {
    flexDirection: "row",
    gap: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
  },
});
