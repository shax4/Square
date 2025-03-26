import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View, TouchableOpacity, StyleSheet } from "react-native";

import { Icons } from "../../../../assets/icons/Icons";

import BoardListScreen from "../../../pages/BoardScreen/BoardListScreen";
import BoardDetailScreen from "../../../pages/BoardScreen/BoardDetailScreen";
import BoardWriteScreen from "../../../pages/BoardScreen/BoardWriteScreen";

// 네비게이션 파라미터 타입 정의
type BoardStackParamList = {
  BoardList: undefined;
  BoardDetail: { boardId: number };
  BoardWrite: { postId?: number };
};

// 스택 네비게이터
const Stack = createNativeStackNavigator<BoardStackParamList>();

// 테스트용 예시 사용자 정보(전역 상태관리로 받아오도록 수정 필요)
const currentUser = {
  nickname: "반짝이는하마",
};
// 게시물 정보는 BoardDetailScreen에서 route.params.boardId를 통해 가져옵니다

// 게시판 상단 탭
export default function BoardHeaderBar() {
  return (
    <Stack.Navigator>
      {/* 게시판 목록 */}
      <Stack.Screen
        name="BoardList"
        component={BoardListScreen}
        options={{
          title: "자유 게시판",
          headerBackButtonDisplayMode: "minimal",
        }}
      />
      {/* 게시판 상세 */}
      <Stack.Screen
        name="BoardDetail"
        component={BoardDetailScreen}
        options={({ route }) => ({
          title: "게시판 상세",
          headerBackButtonDisplayMode: "minimal",
          headerRight: () => (
            <HeaderRightIcons boardId={route.params.boardId} />
          ),
        })}
      />
      {/* 글쓰기 화면 */}
      <Stack.Screen
        name="BoardWrite"
        component={BoardWriteScreen}
        options={{
          title: "게시글 작성",
          headerBackButtonDisplayMode: "minimal",
        }}
      />

    </Stack.Navigator>
  );
}

// Mock함수 (실제 API 호출로 대체 필요)
function mockFetchPost(boardId: number) {
  const mockPosts = [
    { postId: 1, nickname: "반짝이는하마" },
    { postId: 2, nickname: "즐거운팬더" },
    { postId: 3, nickname: "행복한기린" },
  ];
  return mockPosts.find((post) => post.postId === boardId);
}

// 상단 바 우측 아이콘 컴포넌트: 현재 사용자와 글 작성자 여부 확인
function HeaderRightIcons({ boardId }: { boardId: number }) {
  // 게시글 데이터를 가져오기 위한 로직
  const post = mockFetchPost(boardId); // 실제 API 호출로 대체 필요
  const isAuthor = currentUser.nickname === post?.nickname;
  return (
    <View style={styles.headerRightItems}>
      {isAuthor ? (
        <>
          <TouchableOpacity onPress={() => console.log("수정")}>
            <Icons.edit />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => console.log("삭제")}>
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
});
