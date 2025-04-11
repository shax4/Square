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

export default PersonalitySurveyPage

