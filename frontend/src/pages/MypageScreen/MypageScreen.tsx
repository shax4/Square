"use client"

import { useState } from "react"
import { StyleSheet, Text, View, ScrollView, SafeAreaView } from "react-native"
import {ProfileImage, PersonalityTag} from "../../components"
import SectionToggle from "./Components/SectionToggle"
import TabBar from "./Components/TabBar"
import Button from "./Components/MypageButton"

const MypageScreen = () => {
  // Main tab toggle (Posts vs Votes)
  const [activeTab, setActiveTab] = useState("게시글")

  // Sub-sections for Posts
  const [activePostSection, setActivePostSection] = useState("작성글")

  // Sub-sections for Votes
  const [activeVoteSection, setActiveVoteSection] = useState("내가 한 투표")

  // Mock data
  const userProfile = {
    nickname: "사용자닉네임",
    personality: "PNTB",
    imageUrl: "https://example.com/profile.jpg",
  }

  // Render content based on active section and tab
  const renderContent = () => {
    if (activeTab === "게시글") {
      switch (activePostSection) {
        case "작성글":
          return (
            <View style={styles.contentContainer}>
              <Text style={styles.placeholderText}>작성글 내용이 여기에 표시됩니다.</Text>
            </View>
          )
        case "댓글":
          return (
            <View style={styles.contentContainer}>
              <Text style={styles.placeholderText}>댓글 내용이 여기에 표시됩니다.</Text>
            </View>
          )
        case "스크랩":
          return (
            <View style={styles.contentContainer}>
              <Text style={styles.placeholderText}>스크랩 내용이 여기에 표시됩니다.</Text>
            </View>
          )
        case "좋아요":
          return (
            <View style={styles.contentContainer}>
              <Text style={styles.placeholderText}>좋아요 내용이 여기에 표시됩니다.</Text>
            </View>
          )
        default:
          return null
      }
    } else {
      switch (activeVoteSection) {
        case "내가 한 투표":
          return (
            <View style={styles.contentContainer}>
              <Text style={styles.placeholderText}>내가 한 투표 내용이 여기에 표시됩니다.</Text>
            </View>
          )
        case "의견":
          return (
            <View style={styles.contentContainer}>
              <Text style={styles.placeholderText}>의견 내용이 여기에 표시됩니다.</Text>
            </View>
          )
        case "스크랩":
          return (
            <View style={styles.contentContainer}>
              <Text style={styles.placeholderText}>투표 스크랩 내용이 여기에 표시됩니다.</Text>
            </View>
          )
        default:
          return null
      }
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.profileInfo}>
            <ProfileImage variant="large" />
            <View style={styles.profileDetails}>
              <PersonalityTag personality={userProfile.personality} onPress={() => console.log("PNTB clicked")} />
              <Text style={styles.nickname}>{userProfile.nickname}</Text>
            </View>
          </View>

          <View style={styles.profileActions}>
            <Button
              title="프로필 수정"
              onPress={() => console.log("Edit profile")}
              variant="secondary"
              style={styles.actionButton}
            />
            <Button
              title="내 가치관 정보"
              onPress={() => console.log("My values info")}
              variant="secondary"
              style={styles.actionButton}
            />
          </View>
        </View>

        {/* Main Section Toggle */}
        <View style={styles.tabContainer}>
            <TabBar
                tabs={["게시글", "투표"]}
                activeTab={activeTab}
                onTabChange={setActiveTab}
            />
        </View>

        {/* Sub-section Tabs */}
        <View style={styles.sectionToggleContainer}>
        {activeTab === "게시글" ? (
          <SectionToggle
                sections={["작성글", "댓글", "스크랩", "좋아요"]}
                activeSection={activePostSection}
                onSectionChange={setActivePostSection}
            />
        ) : (
          <SectionToggle
                sections={["내가 한 투표", "의견", "스크랩"]}
                activeSection={activeVoteSection}
                onSectionChange={setActiveVoteSection}
            />
        )}
        </View>

        {/* Content Area */}
        {renderContent()}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  profileHeader: {
    padding: 16,
  },
  profileInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  profileDetails: {
    marginLeft: 16,
  },
  nickname: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 8,
  },
  profileActions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  tabContainer: {

  },
  sectionToggleContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  contentContainer: {
    padding: 16,
    minHeight: 300,
  },
  placeholderText: {
    textAlign: "center",
    color: "#888888",
    marginTop: 40,
  },
})

export default MypageScreen

