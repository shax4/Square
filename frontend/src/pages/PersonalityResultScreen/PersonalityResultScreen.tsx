import type React from "react"
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from "react-native"
import PersonalityInfoButton from "./Components/PersonalityInfoButton"
import PersonalityGraph from "./Components/PersonalityGraph"
import {Button} from "../../components"

interface PersonalityResultScreenProps {
  nickname?: string
  personalityType?: string
  values?: number // -3 to -1 or 1 to 3
  social?: number // -3 to -1 or 1 to 3
  future?: number // -3 to -1 or 1 to 3
  achievement?: number // -3 to -1 or 1 to 3
  onInfoPress?: () => void
  onRetakePress?: () => void
  onSharePress?: () => void
  navigation?: any
}

const PersonalityResultScreen: React.FC<PersonalityResultScreenProps> = ({
  nickname = "반짝이는코알라",
  personalityType = "PNTB",
  values = 1,
  social = 2,
  future = 3,
  achievement = 1,
  onInfoPress = () => console.log("Info button pressed"),
  onRetakePress = () => console.log("Retake button pressed"),
  onSharePress = () => console.log("Share button pressed"),
  navigation,
}) => {
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
        <Text style={styles.nicknameText}>{nickname}님의 성향은</Text>

        <View style={styles.personalityTypeContainer}>
          <Text style={styles.personalityType}>{personalityType}</Text>
          <PersonalityInfoButton onPress={onInfoPress} />
        </View>

        <View style={styles.graphsContainer}>
          <PersonalityGraph
            title="가치관"
            leftLabel="P 현실"
            rightLabel="이상 I"
            value={values}
            color={colors.values}
          />

          <PersonalityGraph
            title="사회관"
            leftLabel="N 개인"
            rightLabel="공동체 C"
            value={social}
            color={colors.social}
          />

          <PersonalityGraph
            title="미래관"
            leftLabel="T 기술"
            rightLabel="환경 S"
            value={future}
            color={colors.future}
          />

          <PersonalityGraph
            title="성취관"
            leftLabel="B 안정"
            rightLabel="도전 R"
            value={achievement}
            color={colors.achievement}
          />
        </View>

        <View style={styles.buttonsContainer}>
            <View style={styles.buttonContainer}>
                <Button label="성향 테스트 다시하기" onPress={onRetakePress}/>
            </View>
            <View style={styles.buttonContainer}>
                <Button label="공유하기" onPress={onSharePress} />
            </View>
        </View>
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

