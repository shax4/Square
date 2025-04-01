import { SafeAreaView, ScrollView, View, Alert, StyleSheet } from "react-native"
import { useEffect, useState } from "react"
import { Button } from "../../../components"
import Question from "./Question"
import { useSurvey } from "../SurveyContext"
import { getSurveyQuestions, submitSurveyAnswers } from "../Api/surveyApi"
import {SurveyAnswer, SurveyResponse, SurveyQuestion, SurveyQuestionsResponse} from "../Api/surveyApi.types"

// Create a wrapper component to use the context
const SurveyContent = () => {
    const { selectedOptions } = useSurvey()
    const [questions, setQuestions] = useState<SurveyQuestion[]>([]);

    useEffect(() => {
    const getQuestions = async () => {
        try{
            const result : SurveyQuestionsResponse = await getSurveyQuestions();
            
            setQuestions(result.questions);
        }catch(error){
            console.error("설문조사 질문 가져오기 실패:", error);
        }
    }
    getQuestions();
    }, []);
  
    const onPressConfirm = async () => {
      console.log("확인 버튼을 눌렀습니다! 설문조사 결과를 전송합니다!")
      console.log("Selected options:", selectedOptions)
  
      // Check if all questions are answered
      const unansweredQuestions = questions.filter((q) => selectedOptions[q.questionId] === undefined)
  
      if (unansweredQuestions.length > 0) {
        Alert.alert(
          "미완성된 설문",
          `${unansweredQuestions.length}개의 질문에 답변하지 않았습니다. 계속 진행하시겠습니까?`,
          [
            {
              text: "취소",
              style: "cancel",
            },
            {
              text: "계속",
              onPress: () => submitResponses(),
            },
          ],
        )
      } else {
        submitResponses()
      }
    }
  
    const submitResponses = async () => {
      try {
        // Show loading indicator if needed
  
        // Submit the responses
        // const result = await submitSurveyAnswers(null);
        const result = {}

        // Handle success
        console.log("Survey submitted successfully:", result)
        Alert.alert("제출 완료", "설문조사가 성공적으로 제출되었습니다.", [{ text: "확인" }])
  
        // You can navigate to another screen here if needed
        // navigation.navigate('ThankYou');
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
            <Question key={q.questionId} id={q.questionId} question={q.content} options={["매우 반대", "반대", "약간 반대", "약간 동의", "동의", "매우 동의"]} />
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
    paddingBottom: 100,
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
    marginTop: 10,
  },
})

export default SurveyContent;