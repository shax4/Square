"use client"

import type React from "react"
import { useState } from "react"
import { View, Text, Modal, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView, Dimensions } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import {GenderChart, BlueBarChart, BubbleChart} from "../../components"

interface DebateResultModalProps {
  visible: boolean
  onClose: () => void
  data: {
    gender: { value: number; label: string }[]
    age: { value: number; label: string }[]
    type: { value: number; label: string }[]
    region: { value: number; label: string }[]
    religion: { value: number; label: string }[]
    userInfo: {
      ageGroup: string
    }
  }
}

const DebateResultModal: React.FC<DebateResultModalProps> = ({ visible, onClose, data }) => {
  const [activeTab, setActiveTab] = useState<"yes" | "no">("yes")

  // 사용자의 연령대에 해당하는 인덱스 찾기
  const userAgeGroupIndex = data.age.findIndex((item) => item.label === data.userInfo.ageGroup)

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
              style={[styles.tabButton, activeTab === "yes" && styles.activeTabButton]}
              onPress={() => setActiveTab("yes")}
            >
              <Text style={[styles.tabText, activeTab === "yes" && styles.activeTabText]}>🙋‍♂️ 있다</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tabButton, activeTab === "no" && styles.activeTabButton]}
              onPress={() => setActiveTab("no")}
            >
              <Text style={[styles.tabText, activeTab === "no" && styles.activeTabText]}>🙅‍♂️ 없다</Text>
            </TouchableOpacity>
          </View>

          {/* 내용 */}
          <ScrollView style={styles.scrollContent}>
            <View style={styles.contentContainer}>
              {/* 성별 */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>성별</Text>
                <GenderChart data={data.gender} />
              </View>

              {/* 연령대 */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>연령대</Text>
                <View style={styles.chartContainer}>
                  <BlueBarChart data={data.age} highlightIdx={userAgeGroupIndex} />
                </View>
              </View>

              {/* 유형 */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>유형</Text>
                <BubbleChart data={data.type} height={200} />
              </View>

              {/* 지역 */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>지역</Text>
                <BubbleChart data={data.region} height={200} />
              </View>

              {/* 종교 */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>종교</Text>
                <View style={styles.chartContainer}>
                  <BlueBarChart data={data.religion} highlightIdx={-1} />
                </View>
              </View>
            </View>
          </ScrollView>

          {/* 하단 버튼 */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.footerButton}>
              <Text style={styles.footerButtonText}>의견 더 보기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  )
}

const { width } = Dimensions.get("window")

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    width: width * 0.9,
    maxWidth: 400,
    borderRadius: 12,
    overflow: "hidden",
    maxHeight: "90%",
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  closeButton: {
    padding: 4,
  },
  tabContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
  },
  activeTabButton: {
    borderBottomWidth: 2,
    borderBottomColor: "black",
  },
  tabText: {
    fontSize: 16,
    color: "#666",
  },
  activeTabText: {
    color: "black",
    fontWeight: "bold",
  },
  scrollContent: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 16,
  },
  chartContainer: {
    height: 160,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  footerButton: {
    backgroundColor: "#00A3FF",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  footerButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
})

export default DebateResultModal

