import type React from "react"
import { useState } from "react"
import { View, Text, Modal, TouchableOpacity, ScrollView, SafeAreaView, Dimensions } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { GenderChart, BlueBarChart, BubbleChart } from "./components"
import { styles } from './DebateResultModal.styles'
import { DebateResultModalProps } from './DebateResultModal.types'

const DebateResultModal: React.FC<DebateResultModalProps> = ({ visible, onClose, onPressMoreOpinion, data, leftOption, rightOption }) => {
  const [activeTab, setActiveTab] = useState<"left" | "right">("left")

  // 현재 활성화된 탭에 따라 데이터 선택
  const activeData = activeTab === "left" ? data.leftResult : data.rightResult

  const userAgeGroupIndex = activeData.age.findIndex((item) => item.label === activeData.userInfo.ageGroup)
  const userReligionGroupIndex = activeData.religion.findIndex((item) => item.label === activeData.userInfo.religionGroup)

  console.log(userReligionGroupIndex);

  const screenWidth = Dimensions.get("window").width * 0.9

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalContent}>
          {/* 헤더 */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>결과 리포트</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          {/* 탭 */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tabButton, activeTab === "left" && styles.activeTabButton]}
              onPress={() => setActiveTab("left")}
            >
              <Text style={[styles.tabText, activeTab === "left" && styles.activeTabText]}>🙋‍♂️ {leftOption}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tabButton, activeTab === "right" && styles.activeTabButton]}
              onPress={() => setActiveTab("right")}
            >
              <Text style={[styles.tabText, activeTab === "right" && styles.activeTabText]}>🙅‍♂️ {rightOption}</Text>
            </TouchableOpacity>
          </View>

          {/* 내용 */}
          <ScrollView style={styles.scrollContent}>
            <View style={styles.contentContainer}>
              {/* 성별 */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>성별</Text>
                <GenderChart data={activeData.gender} />
              </View>

              {/* 연령대 */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>연령대</Text>
                <View style={styles.chartContainer}>
                  <BlueBarChart data={activeData.age} highlightIdx={userAgeGroupIndex} />
                </View>
              </View>

              {/* 유형 */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>유형</Text>
                <BubbleChart data={activeData.type} height={200} width={screenWidth} />
              </View>

              {/* 지역 */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>지역</Text>
                <BubbleChart data={activeData.region} height={200} width={screenWidth} />
              </View>

              {/* 종교 */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>종교</Text>
                <View style={styles.chartContainer}>
                  <BlueBarChart data={activeData.religion} highlightIdx={userReligionGroupIndex} />
                </View>
              </View>
            </View>
          </ScrollView>

          {/* 하단 버튼 */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.footerButton} onPress={onPressMoreOpinion}>
              <Text style={styles.footerButtonText}>의견 더 보기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  )
}

export default DebateResultModal
