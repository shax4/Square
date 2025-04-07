/**
 * API 연결 테스트를 위한 예제 컴포넌트
 * 게시판, 댓글 등 API 연결 기능을 테스트합니다.
 */

import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import PostListTest from "./PostListTest";

/**
 * API 테스트 컴포넌트의 테스트 유형
 */
type TestType = "posts" | "detail" | "comment" | "create";

/**
 * API 테스트 예제 컴포넌트
 * @returns JSX.Element
 */
const ApiTestExample: React.FC = () => {
  // 현재 테스트 유형 상태
  const [testType, setTestType] = useState<TestType>("posts");

  // 테스트 유형 변경 핸들러
  const handleChangeTestType = (type: TestType) => {
    setTestType(type);
  };

  // 현재 테스트 유형에 따라 테스트 컴포넌트 렌더링
  const renderTestComponent = () => {
    switch (testType) {
      case "posts":
        return <PostListTest />;

      case "detail":
        // TODO: 게시글 상세 테스트 컴포넌트
        return (
          <View style={styles.placeholder}>
            <Text>게시글 상세 테스트 (구현 예정)</Text>
          </View>
        );

      case "comment":
        // TODO: 댓글 테스트 컴포넌트
        return (
          <View style={styles.placeholder}>
            <Text>댓글 테스트 (구현 예정)</Text>
          </View>
        );

      case "create":
        // TODO: 게시글 생성 테스트 컴포넌트
        return (
          <View style={styles.placeholder}>
            <Text>게시글 생성 테스트 (구현 예정)</Text>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 테스트 유형 선택 버튼 */}
      <View style={styles.tabButtons}>
        <TouchableOpacity
          style={[styles.tabButton, testType === "posts" && styles.activeTab]}
          onPress={() => handleChangeTestType("posts")}
        >
          <Text style={styles.tabButtonText}>게시글 목록</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, testType === "detail" && styles.activeTab]}
          onPress={() => handleChangeTestType("detail")}
        >
          <Text style={styles.tabButtonText}>게시글 상세</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, testType === "comment" && styles.activeTab]}
          onPress={() => handleChangeTestType("comment")}
        >
          <Text style={styles.tabButtonText}>댓글</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, testType === "create" && styles.activeTab]}
          onPress={() => handleChangeTestType("create")}
        >
          <Text style={styles.tabButtonText}>게시글 작성</Text>
        </TouchableOpacity>
      </View>

      {/* 테스트 컴포넌트 렌더링 */}
      <View style={styles.testContainer}>{renderTestComponent()}</View>
    </SafeAreaView>
  );
};

// 스타일 정의
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  tabButtons: {
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#007bff",
  },
  tabButtonText: {
    fontSize: 14,
    fontWeight: "500",
  },
  testContainer: {
    flex: 1,
  },
  placeholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
});

export default ApiTestExample;
