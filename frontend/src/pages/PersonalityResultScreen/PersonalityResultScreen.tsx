import type React from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import PersonalityInfoButton from "./Components/PersonalityInfoButton";
import PersonalityGraph from "./Components/PersonalityGraph";
import { Button } from "../../components";
import { TypeResult } from "../../shared/types/typeResult";
import { useEffect, useRef, useState } from "react";
import { useRoute, RouteProp } from "@react-navigation/native";
import { useAuth } from "../../shared/hooks";

import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";

import { StackParamList } from "../../shared/page-stack/MyPageStack";

import {
  getMyPersonalityResult,
  getOthersPersonalityResult,
  getUserTypeImagePresignedUrl,
} from "./Api/PersonalityResultAPI";
import Text from "../../components/Common/Text";
import UserTypeInfoModal from "./Components/UserTypeInfoModal";

import { captureRef } from "react-native-view-shot";

const PersonalityResultScreen = () => {
  const route = useRoute<
    RouteProp<
      Record<
        string,
        {
          isAfterSurvey: boolean;
          givenNickname: string;
          typeResult: TypeResult;
        }
      >,
      string
    >
  >();
  const { isAfterSurvey, typeResult, givenNickname } = route.params;

  const navigation =
    useNavigation<NativeStackNavigationProp<StackParamList>>();
  const { user } = useAuth();
  const myNickname = user?.nickname;

  const [userTypeResult, setUserTypeResult] =
    useState<TypeResult>();
  const [isMyType, setIsMyType] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const captureViewRef = useRef<View>(null);

  useEffect(() => {
    const getTypeResult = async (isMyTypeBool: boolean) => {
      try {
        if (isMyTypeBool) {
          const resultData: TypeResult =
            await getMyPersonalityResult();
          setUserTypeResult(resultData);
        } else {
          const resultData: TypeResult =
            await getOthersPersonalityResult(givenNickname);
          setUserTypeResult(resultData);
        }
      } catch (error) {
        console.error("성향 결과 데이터 가져오기 에러 발생!", error);
      }
    };

    if (isAfterSurvey) {
      setUserTypeResult(typeResult);
      setIsMyType(true);
    } else {
      const isMyTypeState = givenNickname === myNickname;
      setIsMyType(isMyTypeState);
      getTypeResult(isMyTypeState);
    }
  }, [givenNickname, myNickname]);

  const onInfoPress = () => {
    setModalVisible(true);
  };

  const onPressCloseModal = () => {
    setModalVisible(false);
  };

  const onSharePress = async () => {
    try {
      if (!captureViewRef.current) return;

      const fileName = `user-type-${Date.now()}.png`;
      const contentType = "image/png";
      const folder = "user-type-images";

      // 1. View 캡처
      const uri = await captureRef(captureViewRef, {
        format: "png",
        quality: 1,
      });

      // 2. presigned URL 요청
      const { presignedPutUrl, s3Key } =
        await getUserTypeImagePresignedUrl(
          fileName,
          contentType,
          folder
        );

      // 3. 이미지 업로드
      const file = await fetch(uri).then((res) => res.blob());

      await fetch(presignedPutUrl, {
        method: "PUT",
        headers: {
          "Content-Type": contentType,
        },
        body: file,
      });
      console.log(presignedPutUrl, s3Key)
      // 4. 최종 접근 가능한 S3 URL
      const baseUrl = "https://shax3-square.s3.ap-northeast-1.amazonaws.com";
      const imageUrl = `${baseUrl}/${s3Key}`;
      console.log("공유 이미지 업로드 성공:", imageUrl);
    } catch (err) {
      console.error("공유 이미지 업로드 실패:", err);
    }
  };

  const onPressUserTypeSurvey = () => {
    navigation.navigate("PersonalitySurveyPage");
  };

  const colors = {
    values: "#FF5E00",
    social: "#6541F2",
    future: "#CB59FF",
    achievement: "#F553DA",
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content} ref={captureViewRef} collapsable={false}>
      {userTypeResult ? (
        <>
        <Text style={styles.nicknameText}>
          {userTypeResult.nickname}님의 성향은
        </Text>

        <View style={styles.personalityTypeContainer}>
          <Text style={styles.personalityType}>
            {userTypeResult.userType}
          </Text>
          <PersonalityInfoButton onPress={onInfoPress} />
        </View>

        <View style={styles.graphsContainer}>
          <PersonalityGraph
            title="가치관"
            leftLabel="P 현실"
            rightLabel="이상 I"
            value={userTypeResult.score1}
            color={colors.values}
          />
          <PersonalityGraph
            title="사회관"
            leftLabel="N 개인"
            rightLabel="공동체 C"
            value={userTypeResult.score2}
            color={colors.social}
          />
          <PersonalityGraph
            title="미래관"
            leftLabel="T 기술"
            rightLabel="환경 S"
            value={userTypeResult.score3}
            color={colors.future}
          />
          <PersonalityGraph
            title="성취관"
            leftLabel="B 안정"
            rightLabel="도전 R"
            value={userTypeResult.score4}
            color={colors.achievement}
          />
        </View>

        {isMyType && (
          <View style={styles.buttonsContainer}>
            <View style={styles.buttonContainer}>
              <Button label="공유하기" onPress={onSharePress} />
            </View>
          </View>
        )}
        </>
      ):(
        <View style={styles.noPersonalityContainer}>
          <Text style={styles.noPersonalityText}>성향이 없습니다</Text>
        </View>
      )}

      {isMyType &&
        <View style={styles.buttonsContainer}>
          <View style={styles.buttonContainer}>
            <Button
              label={
                user?.userType == null
                  ? "성향 테스트 해보기"
                  : "성향 테스트 다시하기"
              }
              onPress={onPressUserTypeSurvey}
            />
          </View>
        </View>
      }
      </View>

      <UserTypeInfoModal
        onClose={onPressCloseModal}
        visible={modalVisible}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  backButton: {
    width: 30,
    height: 30,
    justifyContent: "center",
  },
  backButtonText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  nicknameText: {
    fontSize: 16,
    color: "#171719",
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 10,
  },
  personalityTypeContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 5,
  },
  personalityType: {
    fontSize: 40,
  },
  graphsContainer: {
    marginBottom: 5,
    marginHorizontal: 10,
  },
  buttonsContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
  },
  buttonContainer: {
    paddingVertical: 5,
  },
  noPersonalityContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 30,
  },
  noPersonalityText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#171719",
  },

});

export default PersonalityResultScreen;
