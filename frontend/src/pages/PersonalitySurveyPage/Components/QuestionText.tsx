import React from "react"
import { Text, StyleSheet } from "react-native"

interface QuestionTextProps {
  text: string
}

const QuestionText: React.FC<QuestionTextProps> = React.memo(({ text }) => {
  return <Text style={styles.questionText}>{text}</Text>
})

const styles = StyleSheet.create({
  questionText: {
    fontSize: 24,
    marginBottom: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
})

export default QuestionText

