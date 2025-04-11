import { SafeAreaView, ScrollView, View, Alert, StyleSheet } from "react-native"
import { useEffect, useState } from "react"
import { Button } from "../../../components"
import Question from "./Question"
import { useSurvey } from "../SurveyContext"
import { getSurveyQuestions, submitSurveyAnswers } from "../Api/surveyApi"
import {SurveyAnswer, SurveyQuestion, SurveyQuestionsResponse} from "../Api/surveyApi.types"

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

import {StackParamList} from '../../../shared/page-stack/MyPageStack'
import { useAuth } from "../../../shared/hooks"

// Create a wrapper component to use the context
const SurveyContent = () => {
    const { selectedOptions } = useSurvey()
    const [questions, setQuestions] = useState<SurveyQuestion[]>([]);
    const {setUser, user} = useAuth();

    const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>();

    useEffect(() => {
    const getQuestions = async () => {
        try{
            const result : SurveyQuestionsResponse = await getSurveyQuestions();
            
            setQuestions(result.questions);
        }catch(error){
            console.error("설문조사 질문 가져오기 실패:", error);
            Alert.alert(
              "설문조사 에러",
              "설문조사 질문들을 가져오는 데 에러가 발생했습니다.",
              [
                {
                  text: "확인",
                  onPress: () => {navigation.goBack()}
                },
              ]
            );
        }
    }
    getQuestions();
    }, []);

    const convertToSurveyAnswers = (selectedOptions: { [key: number]: number}): SurveyAnswer[] => {
      return Object.entries(selectedOptions).map(([questionId, answer]) => ({
        questionId: Number(questionId), // string → number 변환
        answer: answer + 1,
      }));
    };
  
    const onPressConfirm = async () => {
      console.log("확인 버튼을 눌렀습니다! 설문조사 결과를 전송합니다!")
  
      // Check if all questions are answered
      const unansweredQuestions = questions.filter((q) => selectedOptions[q.questionId] === undefined)
  
      if (unansweredQuestions.length > 0) {
        Alert.alert(
          "미완성된 설문",
          `${unansweredQuestions.length}개의 질문에 답변하지 않았습니다.`,
          [
            {
              text: "확인",
            },
          ]
        );
      } else {
        submitResponses();
      }      
    }
  
    const submitResponses = async () => {
      try {
        const convertedAnswers = convertToSurveyAnswers(selectedOptions);
        console.log("전송한 답변 : ", convertedAnswers);
        const result = await submitSurveyAnswers(convertedAnswers);

        // Handle success
        console.log("Survey submitted successfully:", result)
        //Alert.alert("제출이 완료", JSON.stringify(result, null, 2), [{ text: "확인" }]);
        Alert.alert("제출이 완료", "성향 정보가 반영되었습니다.", [{ text: "확인" }]);

        setUser({...user!, userType : result.userType})
  
        navigation.replace('PersonalityResultScreen', { isAfterSurvey : true, givenNickname : result.nickname, typeResult : result})
      } catch (error) {
        // Handle error
        console.error("Failed to submit survey:", error)
        Alert.alert("제출 실패", "설문조사 제출 중 오류가 발생했습니다. 다시 시도해주세요.", [{ text: "확인" }])
      }
    }
  
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView>
          {/* <Text style={styles.title}>성격 유형 설문조사</Text> */}
  
          {questions.map((q) => (
            <Question key={q.questionId} id={q.questionId} question={q.content} options={["매우 동의", "동의", "약간 동의", "약간 반대", "반대", "매우 반대"]} />
          ))}
          <View style={styles.buttonContainer}>
            <Button label="확인" onPress={onPressConfirm} />
          </View>
        </ScrollView>
      </SafeAreaView>
    )
  }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
  },
  buttonContainer: {
    alignItems: "center", // 가로 중앙 정렬
    justifyContent: "center",
    margin: 30,
  },
})

export default SurveyContent;