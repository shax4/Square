import React from "react"
import { View, StyleSheet } from "react-native"
import QuestionText from "./QuestionText"
import Options from "./Options"

interface QuestionProps {
  id: number
  question: string
  options: string[]
}

const Question: React.FC<QuestionProps> = React.memo(({ id, question, options }) => {
  return (
    <View style={styles.questionContainer}>
      <QuestionText text={question} />
      <View style={styles.optionsContainer}>
        <Options options={options} questionId={id} />
      </View>
    </View>
  )
})

const styles = StyleSheet.create({
  questionContainer: {
    flex: 1,
    marginTop: 15,
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  optionsContainer: {
    flex: 1,
  },
})

export default Question

