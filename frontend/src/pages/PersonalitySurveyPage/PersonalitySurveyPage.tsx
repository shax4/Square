import type React from "react"
import { StyleSheet, SafeAreaView, ScrollView, View, Alert } from "react-native"
import Question from "./Components/Question"
import { Button } from "../../components"
import { SurveyProvider, useSurvey } from "./SurveyContext"
import { useEffect } from "react"
import SurveyContent from "./Components/SurveyContent"

const PersonalitySurveyPage = () => {
  return (
    <SurveyProvider>
      <SurveyContent />
    </SurveyProvider>
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

export default PersonalitySurveyPage

