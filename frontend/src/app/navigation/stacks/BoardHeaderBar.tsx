import React, { useRef, useState, useEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View, TouchableOpacity, StyleSheet, Alert } from "react-native";
import {
  useNavigation,
  NavigationProp,
  useFocusEffect,
} from "@react-navigation/native";
import { CustomBack } from "../components/CustomBack";

import { Icons } from "../../../../assets/icons/Icons";
// 사용 중지된 BoardAPI 대신 PostService 사용
import { PostService } from "../../../shared/services/postService";

import BoardListScreen from "../../../pages/BoardScreen/BoardListScreen";
import BoardDetailScreen from "../../../pages/BoardScreen/BoardDetailScreen";
import BoardWriteScreen from "../../../pages/BoardScreen/BoardWriteScreen";
import { BoardStackParamList } from "../../../shared/page-stack/BoardPageStack";
import Text from "../../../components/Common/Text";
import { useAuthStore } from "../../../shared/stores/auth";

// 스택 네비게이터
const Stack = createNativeStackNavigator<BoardStackParamList>();

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
          headerTitle: () => (
            <Text style={styles.headerTitle}>자유 게시판</Text>
          ),
          headerBackButtonDisplayMode: "minimal",
        }}
      />
      {/* 게시판 상세 */}
      <Stack.Screen
        name="BoardDetail"
        component={BoardDetailScreen}
        options={({ route }) => {
          const boardId = route.params.boardId;

          return {
            headerTitle: () => (
              <Text style={styles.headerTitle}>게시판 상세</Text>
            ),
            headerBackButtonDisplayMode: "minimal",
            headerRight: () => <HeaderRightIcons boardId={boardId} />,
          };
        }}
      />
      {/* 글쓰기 화면 */}
      <Stack.Screen
        name="BoardWrite"
        component={BoardWriteScreen}
        options={({ route }) => ({
          headerTitle: () => (
            <Text style={styles.headerTitle}>게시글 작성</Text>
          ),
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

/**
 * 상단 바 우측 아이콘 컴포넌트
 * 게시글 작성자 여부에 따라 다른 아이콘을 표시합니다.
 * 작성자: 수정/삭제 아이콘
 * 비작성자: 스크랩/신고 아이콘
 *
 * @param boardId 게시글 ID
 */
export function HeaderRightIcons({ boardId }: { boardId: number }) {
  const navigation = useNavigation<NavigationProp<BoardStackParamList>>();

  // 로그인 사용자 정보 가져오기 (전역 상태)
  const loggedInUser = useAuthStore((state) => state.user);

  // 게시글 데이터와 로딩 상태 관리
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthor, setIsAuthor] = useState(false);

  // 게시글 데이터 가져오기
  useEffect(() => {
    const fetchPostData = async () => {
      setLoading(true);
      try {
        // PostService를 사용하여 서버에서 게시글 데이터 가져오기
        const postData = await PostService.getPostDetail(boardId);

        if (postData) {
          setPost(postData);

          // 로그인한 사용자와 게시글 작성자 비교
          if (loggedInUser && postData.nickname === loggedInUser.nickname) {
            setIsAuthor(true);
          } else {
            setIsAuthor(false);
          }
        }
      } catch (error) {
        console.error("게시글 데이터 가져오기 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPostData();
  }, [boardId, loggedInUser]);

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
            // BoardAPI 대신 PostService 사용
            await PostService.deletePost(boardId);
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

  // 북마크(스크랩) 기능
  const handleBookmark = () => {
    // TODO: 북마크 기능 구현
    console.log("북마크 기능");
  };

  // 신고 기능
  const handleReport = () => {
    // TODO: 신고 기능 구현
    console.log("신고 기능");
  };

  // 로딩 중에는 빈 UI 반환
  if (loading) {
    return <View style={styles.headerRightItems} />;
  }

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
          <TouchableOpacity onPress={handleBookmark}>
            <Icons.bookmark />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleReport}>
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
