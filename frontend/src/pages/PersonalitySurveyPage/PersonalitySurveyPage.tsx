import type React from "react"
import { StyleSheet, Text, SafeAreaView, ScrollView, View } from "react-native"
import Question from "./Components/Question"
import {Button} from '../../components'
import { SurveyProvider } from "./SurveyContext"

// Sample questions and options
const questions = [
  {
    id: 0,
    question: "나는 새로운 사람들을 만나는 것을 즐긴다.",
    options: ["매우 반대", "반대", "약간 반대", "약간 동의", "동의", "매우 동의"],
  },
  {
    id: 1,
    question: "나는 계획을 세우는 것을 좋아한다.",
    options: ["매우 반대", "반대", "약간 반대", "약간 동의", "동의", "매우 동의"],
  },
  {
    id: 2,
    question: "나는 혼자 있는 시간이 필요하다.",
    options: ["매우 반대", "반대", "약간 반대", "약간 동의", "동의", "매우 동의"],
  },
  {
    id: 3,
    question: "나는 새로운 사람들을 만나는 것을 즐긴다.",
    options: ["매우 반대", "반대", "약간 반대", "약간 동의", "동의", "매우 동의"],
  },
  {
    id: 4,
    question: "나는 계획을 세우는 것을 좋아한다.",
    options: ["매우 반대", "반대", "약간 반대", "약간 동의", "동의", "매우 동의"],
  },
  {
    id: 5,
    question: "나는 혼자 있는 시간이 필요하다.",
    options: ["매우 반대", "반대", "약간 반대", "약간 동의", "동의", "매우 동의"],
  },
]

const PersonalitySurveyPage: React.FC = () => {
  return (
    <SurveyProvider>
      <SafeAreaView style={styles.container}>
        <ScrollView>
          {/* <Text style={styles.title}>성격 유형 설문조사</Text> */}

          {questions.map((q) => (
            <Question key={q.id} id={q.id} question={q.question} options={q.options} />
          ))}
            <View style={styles.buttonContainer}>
                <Button label="확인" />
            </View>
        </ScrollView>
      </SafeAreaView>
    </SurveyProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
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
    alignItems: "center",  // 가로 중앙 정렬
    justifyContent: "center",
    marginTop: 10,
  }
})

export default PersonalitySurveyPage

