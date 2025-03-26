import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View, TouchableOpacity, StyleSheet } from "react-native";

import { Icons } from "../../../../assets/icons/Icons";

import BoardListScreen from "../../../pages/BoardScreen/BoardListScreen";
import BoardDetailScreen from "../../../pages/BoardScreen/BoardDetailScreen";
import BoardWriteScreen from "../../../pages/BoardScreen/BoardWriteScreen";
import UiTestScreen from "../../../pages/ui-test-screen/UiTestScreen";

// 네비게이션 파라미터 타입 정의
type BoardStackParamList = {
  BoardList: undefined;
  BoardDetail: { boardId: number };
  BoardWrite: { postId?: number };
  UiTestScreen: { postId?: number };
};

// 스택 네비게이터
const Stack = createNativeStackNavigator<BoardStackParamList>();

// 테스트용 예시 사용자 정보(전역 상태관리로 받아오도록 수정 필요)
const currentUser = {
  nickname: "반짝이는하마",
};
// 테스트용 예시 게시물 정보(api에서 받아오도록 수정 필요)
const post = {
  nickname: "반짝이는하마1",
};

// 게시판 상단 탭
export default function BoardHeaderBar() {
  return (
    <Stack.Navigator>
      {/* 게시판 목록 */}
      <Stack.Screen
        name="BoardList"
        component={BoardListScreen}
        options={{
          title: "게시판 목록",
          headerBackButtonDisplayMode: "minimal",
        }}
      />
      {/* 게시판 상세 */}
      <Stack.Screen
        name="BoardDetail"
        component={BoardDetailScreen}
        options={({ route }) => {
          // 현재 사용자와 작성자 비교해 우측 아이콘 및 기능 변경
          const isAuthor = currentUser.nickname === post.nickname;

          return {
            title: "게시판 상세",
            headerBackButtonDisplayMode: "minimal",
            headerRight: () => <HeaderRightIcons isAuthor={isAuthor} />,
          };
        }}
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
      {/* UiTestScreen 추가 */}
      <Stack.Screen
        name="UiTestScreen"
        component={UiTestScreen}
        options={{
          title: "UI 테스트 화면",
          headerBackButtonDisplayMode: "minimal",
        }}
      />
    </Stack.Navigator>
  );
}

// 상단 바 우측 아이콘 컴포넌트: 현재 사용자와 글 작성자 여부 확인
function HeaderRightIcons({ isAuthor }: { isAuthor: boolean }) {
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
