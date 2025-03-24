"use client"

import React, { useCallback } from "react"
import { View, Text, StyleSheet } from "react-native"
import OptionCircle from "./OptionCircle"
import { useSurvey } from "../SurveyContext"

interface OptionsProps {
  options: string[]
  questionId: number
}

const Options: React.FC<OptionsProps> = React.memo(({ options, questionId }) => {
  const { selectedOptions, handleSelect } = useSurvey()
  const selectedOption = selectedOptions[questionId]

  const handlePress = useCallback(
    (index: number) => {
      handleSelect(questionId, index)
    },
    [questionId, handleSelect],
  )

  return (
    <View style={styles.container}>
      <View style={styles.optionsContainer}>
        {options.map((option, index) => {
          const isEdge = index === 0 || index === options.length - 1

          return (
            <View key={index} style={styles.optionItem}>
              <OptionCircle isSelected={selectedOption === index} isEdge={isEdge} onPress={() => handlePress(index)} />
              <Text style={styles.optionText}>{option}</Text>
            </View>
          )
        })}
      </View>
    </View>
  )
})

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    position: "relative",
  },
  optionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    zIndex: 2,
  },
  optionItem: {
    alignItems: "center",
  },
  optionText: {
    fontSize: 12,
    marginTop: 5,
    textAlign: "center",
  },
  connectingLine: {
    position: "absolute",
    height: 2,
    backgroundColor: "#aaa",
    left: 30,
    right: 30,
    top: 18,
    zIndex: 1,
  },
})

export default Options

