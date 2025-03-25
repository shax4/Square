"use client"

import { useState } from "react"
import { StyleSheet, Text, View, ScrollView, SafeAreaView } from "react-native"
import {ProfileImage, PersonalityTag} from "../../components"
import SectionToggle from "./Components/SectionToggle"
import TabBar from "./Components/TabBar"
import MypageButton from "./Components/MypageButton"
import MypageContent from "./Components/MypageContent"

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

type StackParamList = {
    NevTestPage1: undefined;
    NevTestPage2: undefined;
    NevTestPage3: undefined;
    UiTestScreen: undefined;
    PersonalityResultScreen: undefined;
    ProfileUpdateScreen: undefined;
};

const MypageScreen = () => {
    const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>();

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

  return (
    <SafeAreaView style={styles.container}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.profileInfo}>
            <ProfileImage variant="large" />
            <View style={styles.profileDetails}>
              <PersonalityTag personality={userProfile.personality} onPress={() => navigation.navigate('PersonalityResultScreen')} />
              <Text style={styles.nickname}>{userProfile.nickname}</Text>
            </View>
          </View>

          <View style={styles.profileActions}>
            <MypageButton
              title="프로필 수정"
              onPress={() => navigation.navigate('ProfileUpdateScreen')}
              variant="secondary"
              style={styles.actionButton}
            />
            <MypageButton
              title="내 가치관 정보"
              onPress={() => navigation.navigate('PersonalityResultScreen')}
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
        <MypageContent activeTab={activeTab} activePostSection={activePostSection} activeVoteSection={activeVoteSection}/>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingBottom: 40,
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
    paddingVertical: 8,
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

