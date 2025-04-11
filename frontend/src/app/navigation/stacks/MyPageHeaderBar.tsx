import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Icons } from "../../../../assets/icons/Icons";

// 환경설정 탭으로 네비게이션 사용 시
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { NavigationProp, useNavigation } from "@react-navigation/native";

import MypageScreen from "../../../pages/MypageScreen/MypageScreen";
import NevTestPage2 from "../../../pages/StackSampleScreen/NevTestPage2";
import PersonalitySurveyPage from "../../../pages/PersonalitySurveyPage/PersonalitySurveyPage";
import PersonalityResultScreen from "../../../pages/PersonalityResultScreen/PersonalityResultScreen";
import ProfileUpdateScreen from "../../../pages/ProfileUpdateScreen/ProfileUpdateScreen";
import DeleteAccountScreen from "../../../pages/DeleteAccountScreen/DeleteAccountScreen";
import UseAuthTestScreen from "../../../pages/UseAuthTestScreen/UseAuthTestScreen";
import SignupTestScreen from "../../../pages/SignupTestScreen/SignupTestScreen";
import MypageFeatureTestScreen from "../../../pages/MypageFeatureTestScreen/MypageFeatureTestScreen";
import SignUpScreen from "../../../pages/SignupScreen/SignupScreen";
import LandingScreen from "../../../pages/LandingScreen/LandingScreen";
import LikeButtonApiTestExample from "../../../components/LikeButton/examples/ApiTestExample";

import BoardDetailScreen from "../../../pages/BoardScreen/BoardDetailScreen";
import { ModalTestScreen } from "../../../pages";

import { BoardAPI } from "../../../pages/BoardScreen/Api/boardApi";
import { mockPosts } from "../../../pages/BoardScreen/mocks/boardData";
import { BoardStackParamList } from "../../../shared/page-stack/BoardPageStack";
import Text from '../../../components/Common/Text';

import OpinionListScreen from "../../../pages/OpinionListScreen/OpinionListScreen";
import OpinionDetailScreen from "../../../pages/OpinionDetailScreen/OpinionDetailScreen";
import SettingScreen from "../../../pages/SettingScreen/SettingScreen";
// 스택 네비게이터
const Stack = createNativeStackNavigator();

const currentUser = {
  nickname: "반짝이는하마",
};

// 마이 페이지 상단 탭
export default function HeaderBar() {
  return (
    <Stack.Navigator>
      {/* 마이 페이지 */}
      <Stack.Screen
        name="MypageScreen"
        component={MypageScreen}
        options={({ navigation }) => ({
          headerTitle: () => <Text style={styles.headerTitle}>마이 페이지</Text>,
          headerBackButtonDisplayMode: "minimal",
          headerRight: () => (
            <View style={styles.headerRightItems}>
              <TouchableOpacity
                onPress={() => {
                  console.log("환경 설정으로 이동");
                  navigation.navigate("SettingScreen");
                }}
              >
                <Icons.settings />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => console.log("로그아웃")}>
                <Icons.logout />
              </TouchableOpacity>
            </View>
          ),
        })}
      />
      {/* 환경 설정 */}
      <Stack.Screen
        name="NevTestPage2"
        component={NevTestPage2}
        options={{
          headerTitle: () => <Text style={styles.headerTitle}>환경 설정</Text>,
          headerBackButtonDisplayMode: "minimal",
        }}
      />
      <Stack.Screen
        name="PersonalitySurveyPage"
        component={PersonalitySurveyPage}
        options={{
          headerTitle: () => <Text style={styles.headerTitle}>설문 조사</Text>,
          headerBackButtonDisplayMode: "minimal",
        }}
      />
      <Stack.Screen
        name="PersonalityResultScreen"
        component={PersonalityResultScreen}
        options={{
          headerTitle: () => <Text style={styles.headerTitle}>성향 테스트 확인</Text>,
          headerBackButtonDisplayMode: "minimal",
        }}
      />
      <Stack.Screen
        name="ProfileUpdateScreen"
        component={ProfileUpdateScreen}
        options={{
          headerTitle: () => <Text style={styles.headerTitle}>프로필 수정</Text>,
          headerBackButtonDisplayMode: "minimal",
        }}
      />
      <Stack.Screen
        name="DeleteAccountScreen"
        component={DeleteAccountScreen}
        options={{
          headerTitle: () => <Text style={styles.headerTitle}>탈퇴하기</Text>,
          headerBackButtonDisplayMode: "minimal",
        }}
      />
      <Stack.Screen
        name="UseAuthTestScreen"
        component={UseAuthTestScreen}
        options={{
          headerTitle: () => <Text style={styles.headerTitle}>임시 로그인</Text>,
          headerBackButtonDisplayMode: "minimal",
        }}
      />
      <Stack.Screen
        name="SignupTestScreen"
        component={SignupTestScreen}
        options={{
          headerTitle: () => <Text style={styles.headerTitle}>SignupTestScreen</Text>,
          headerBackButtonDisplayMode: "minimal",
        }}
      />
      <Stack.Screen
        name="ModalTestScreen"
        component={ModalTestScreen}
        options={{
          headerTitle: () => <Text style={styles.headerTitle}>ModalTestScreen</Text>,
          headerBackButtonDisplayMode: "minimal",
        }}
      />
      <Stack.Screen
        name="MypageFeatureTestScreen"
        component={MypageFeatureTestScreen}
        options={{
          headerTitle: () => <Text style={styles.headerTitle}>MypageFeatureTestScreen</Text>,
          headerBackButtonDisplayMode: "minimal",
        }}
      />
      <Stack.Screen
        name="LandingScreen"
        component={LandingScreen}
        options={{
          headerTitle: () => <Text style={styles.headerTitle}>LandingScreen</Text>,
          headerBackButtonDisplayMode: "minimal",
        }}
      />
      <Stack.Screen
        name="SignupScreen"
        component={SignUpScreen}
        options={{
          headerTitle: () => <Text style={styles.headerTitle}>SignupScreen</Text>,
          headerBackButtonDisplayMode: "minimal",
        }}
      />
      <Stack.Screen
        name="LikeButtonApiTestExample"
        component={LikeButtonApiTestExample}
        options={{
          headerTitle: () => <Text style={styles.headerTitle}>좋아요 api 테스트</Text>,
          headerBackButtonDisplayMode: "minimal",
        }}
      />
      <Stack.Screen
        name="BoardDetail"
        component={BoardDetailScreen}
        options={({ route }) => {
          const boardId = route.params.boardId;

          // 현재 게시글 데이터를 가져와서 작성자 확인
          const post = mockFetchPost(boardId);
          const isAuthor = currentUser.nickname === post?.nickname;

          return {
            title: "게시판 상세",
            headerBackButtonDisplayMode: "minimal",
            headerRight: () => (
              <HeaderRightIcons isAuthor={isAuthor} boardId={boardId} />
            ),
          };
        }}
      />
      <Stack.Screen
        name="OpinionListScreen"
        component={OpinionListScreen}
        options={({ route }) => ({
          title: `Number ${route.params.debateId}`,
          headerBackButtonDisplayMode: "minimal",
        })}
      />
      <Stack.Screen
        name="OpinionDetailScreen"
        component={OpinionDetailScreen}
        options={() => {
          return {
            title: "의견 상세",
            headerBackButtonDisplayMode: "minimal",
          };
        }}
      />
      <Stack.Screen
        name="SettingScreen"
        component={SettingScreen}
        options={() => {
          return {
            title: "환경설정",
            headerBackButtonDisplayMode: "minimal",
          };
        }}
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
