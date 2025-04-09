import React from "react"
import { StyleSheet } from "react-native"
import Text from '../../../components/Common/Text';

interface QuestionTextProps {
  text: string
}

const QuestionText: React.FC<QuestionTextProps> = React.memo(({ text }) => {
  return <Text style={styles.questionText}>{text}</Text>
})

const styles = StyleSheet.create({
  questionText: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
})

export default QuestionText

