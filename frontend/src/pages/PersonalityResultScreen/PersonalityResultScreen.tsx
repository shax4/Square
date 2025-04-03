import type React from "react"
import { View, Text, StyleSheet, SafeAreaView } from "react-native"
import PersonalityInfoButton from "./Components/PersonalityInfoButton"
import PersonalityGraph from "./Components/PersonalityGraph"
import { Button } from "../../components"
import { TypeResult } from "../../shared/types/typeResult"
import { useEffect, useState } from "react"
import { useRoute, RouteProp } from '@react-navigation/native';
import { useAuth } from "../../shared/hooks"

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

import {StackParamList} from '../../shared/page-stack/MyPageStack'

import { getMyPersonalityResult, getOthersPersonalityResult } from "./Api/PersonalityResultAPI"

// Axios 연결 필요
// 임시 데이터로 태스트
const mockResult: TypeResult = {
  nickname: "DEBUG",
  userType: "TEST",
  score1: 3,
  score2: 3,
  score3: 3,
  score4: 3,
};

const PersonalityResultScreen = () => {
  // isAfterSurvey - 설문조사 이후 나오는 성향 결과 페이지인가? givenNickname - API 호출 시 사용되는 닉네임 정보, typeResult - isAfterSurvey가 true일 때 넘겨지는 유저 성향 데이터. 
  const route = useRoute<RouteProp<Record<string, { isAfterSurvey : boolean, givenNickname : string, typeResult : TypeResult}>, string>>();
  const { isAfterSurvey, typeResult, givenNickname } = route.params;

  const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>();

  // Zustand 로그인 사용자 데이터
  const { user} = useAuth();
  const myNickname = user?.nickname;

  const [userTypeResult, setUserTypeResult] = useState<TypeResult>(mockResult);

  // 내 정보 조회인지, 다른 사용자 정보 조회인지 판단
  const [isMyType, setIsMyType] = useState(false)

  // 초기 사용자 타입 설정
  useEffect(() => {
    const getTypeResult = async (isMyTypeBool : boolean) => {
      try{
        if(isMyTypeBool){
          const resultData : TypeResult = await getMyPersonalityResult()
          setUserTypeResult(resultData);
        }else{
          const resultData : TypeResult = await getOthersPersonalityResult(givenNickname)
          setUserTypeResult(resultData);          
        }
      }catch(error){
        console.error("성향 결과 데이터 가져오기 에러 발생!", error);
      }
    }

    if(isAfterSurvey){
      // 성향 테스트 페이지에서 바로 넘어오는 경우.
      setUserTypeResult(typeResult);
      setIsMyType(true);
    }else{
      const isMyTypeState : boolean = givenNickname === myNickname;
      setIsMyType(isMyTypeState);
      getTypeResult(isMyTypeState);
    }
  }, [givenNickname, myNickname]);

  // 성향 설명 띄우기
  const onInfoPress = () => {
    console.log("성향 설명");
  }

  // 공유하기
  const onSharePress = () => {
    console.log("공유하기");
  }

  // Colors for each graph
  const colors = {
    values: "#FF5E00",
    social: "#6541F2",
    future: "#CB59FF",
    achievement: "#F553DA",
  }


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.nicknameText}>{userTypeResult.nickname}님의 성향은</Text>

        <View style={styles.personalityTypeContainer}>
          <Text style={styles.personalityType}>{userTypeResult.userType}</Text>
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

        {isMyType &&
          <View style={styles.buttonsContainer}>
            <View style={styles.buttonContainer}>
              <Button label="공유하기" onPress={onSharePress} />
            </View>
          </View>
        }
      </View>
    </SafeAreaView>
  )
}

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
    fontWeight: 'bold',
    marginBottom: 8,
  },
  personalityTypeContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 0,
  },
  personalityType: {
    fontSize: 40,
    fontWeight: "bold",
  },
  graphsContainer: {
    marginBottom: 0,
  },
  buttonsContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  buttonContainer: {
    paddingVertical: 5,
  },
})

export default PersonalityResultScreen

