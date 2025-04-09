import React, { useState, useEffect } from "react";
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

// 사용 중지된 BoardAPI 대신 PostService 사용
import { PostService } from "../../../shared/services/postService";
import { mockPosts } from "../../../pages/BoardScreen/mocks/boardData";
import { BoardStackParamList } from "../../../shared/page-stack/BoardPageStack";
import Text from "../../../components/Common/Text";

import OpinionListScreen from "../../../pages/OpinionListScreen/OpinionListScreen";
import OpinionDetailScreen from "../../../pages/OpinionDetailScreen/OpinionDetailScreen";
import SettingScreen from "../../../pages/SettingScreen/SettingScreen";
import { useAuthStore } from "../../../shared/stores/auth";

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
          headerTitle: () => (
            <Text style={styles.headerTitle}>마이 페이지</Text>
          ),
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
          headerTitle: () => (
            <Text style={styles.headerTitle}>성향 테스트 확인</Text>
          ),
          headerBackButtonDisplayMode: "minimal",
        }}
      />
      <Stack.Screen
        name="ProfileUpdateScreen"
        component={ProfileUpdateScreen}
        options={{
          headerTitle: () => (
            <Text style={styles.headerTitle}>프로필 수정</Text>
          ),
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
          headerTitle: () => (
            <Text style={styles.headerTitle}>임시 로그인</Text>
          ),
          headerBackButtonDisplayMode: "minimal",
        }}
      />
      <Stack.Screen
        name="SignupTestScreen"
        component={SignupTestScreen}
        options={{
          headerTitle: () => (
            <Text style={styles.headerTitle}>SignupTestScreen</Text>
          ),
          headerBackButtonDisplayMode: "minimal",
        }}
      />
      <Stack.Screen
        name="ModalTestScreen"
        component={ModalTestScreen}
        options={{
          headerTitle: () => (
            <Text style={styles.headerTitle}>ModalTestScreen</Text>
          ),
          headerBackButtonDisplayMode: "minimal",
        }}
      />
      <Stack.Screen
        name="MypageFeatureTestScreen"
        component={MypageFeatureTestScreen}
        options={{
          headerTitle: () => (
            <Text style={styles.headerTitle}>MypageFeatureTestScreen</Text>
          ),
          headerBackButtonDisplayMode: "minimal",
        }}
      />
      <Stack.Screen
        name="LandingScreen"
        component={LandingScreen}
        options={{
          headerTitle: () => (
            <Text style={styles.headerTitle}>LandingScreen</Text>
          ),
          headerBackButtonDisplayMode: "minimal",
        }}
      />
      <Stack.Screen
        name="SignupScreen"
        component={SignUpScreen}
        options={{
          headerTitle: () => (
            <Text style={styles.headerTitle}>SignupScreen</Text>
          ),
          headerBackButtonDisplayMode: "minimal",
        }}
      />
      <Stack.Screen
        name="LikeButtonApiTestExample"
        component={LikeButtonApiTestExample}
        options={{
          headerTitle: () => (
            <Text style={styles.headerTitle}>좋아요 api 테스트</Text>
          ),
          headerBackButtonDisplayMode: "minimal",
        }}
      />
      <Stack.Screen
        name="BoardDetail"
        component={BoardDetailScreen}
        options={({ route }) => {
          const boardId = route.params?.boardId as number;

          return {
            headerTitle: () => (
              <Text style={styles.headerTitle}>게시판 상세</Text>
            ),
            headerBackButtonDisplayMode: "minimal",
            headerRight: () =>
              boardId ? (
                <HeaderRightIcons boardId={boardId} navigationSource="mypage" />
              ) : null,
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

// 상단 바 우측 아이콘 컴포넌트: 실제 API를 통해 현재 사용자와 글 작성자 여부 확인
import { HeaderRightIcons } from "./BoardHeaderBar";

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
