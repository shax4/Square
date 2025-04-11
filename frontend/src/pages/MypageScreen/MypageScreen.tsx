"use client"

import { useState, useEffect } from "react"
import { StyleSheet, View, ScrollView, SafeAreaView } from "react-native"
import {ProfileImage, PersonalityTag} from "../../components"
import SectionToggle from "./Components/SectionToggle"
import TabBar from "./Components/TabBar"
import MypageButton from "./Components/MypageButton"
import MypageContent from "./Components/MypageContent"

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

import {StackParamList} from '../../shared/page-stack/MyPageStack'

import { getProfileInfos } from "./Api/userAPI"

import { useAuth } from "../../shared/hooks"
import { UserInfo } from "../../shared/types/user"
import Text from '../../components/Common/Text';
import { useAdminMode } from "../../shared/hooks/useAdminMode"

const MypageScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>();
  const { user} = useAuth();

  const [userInfo, setUserInfo] = useState<UserInfo>();

  // Main tab toggle (Posts vs Votes)
  const [activeTab, setActiveTab] = useState("게시글")

  // Sub-sections for Posts
  const [activePostSection, setActivePostSection] = useState("작성글")

  // Sub-sections for Votes
  const [activeVoteSection, setActiveVoteSection] = useState("내가 한 투표")

  const { isAdminMode, setAdminMode, isAdminState, setAdminState } = useAdminMode();

  useEffect(() => {
    const getUserInfo = async () => {
      try{
        const userInfo : UserInfo = await getProfileInfos();

        setUserInfo(userInfo);

        if( userInfo.userState == "ADMIN") {
          setAdminState(true);
          //setAdminMode(true);
        }
      }catch(error : any){
        console.error("getUserInfo 에러 발생 : ", error);
      }
    }

    getUserInfo();
  },[])

  return (
    <SafeAreaView style={styles.container}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.profileInfo}>
            <ProfileImage variant="large" imageUrl={userInfo?.profileUrl}/>
            <View style={styles.profileDetails}>
              <PersonalityTag personality={user?.userType!} nickname={user?.nickname!} />
              <Text style={styles.nickname}>{user?.nickname}</Text>
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
              onPress={() => navigation.navigate('PersonalityResultScreen', { isAfterSurvey : false, givenNickname : user?.nickname!, typeResult : null})}
              variant="secondary"
              style={styles.actionButton}
            />
            <MypageButton
              title="더보기"
              onPress={() => navigation.navigate('MypageFeatureTestScreen')}
              variant="secondary"
              style={styles.actionButton}
            />
            {/* <MypageButton
              title="API 테스트"
              onPress={() => navigation.navigate('SignupTestScreen')}
              variant="secondary"
              style={styles.actionButton}
            />
            <MypageButton
              title="ModalTestScreen"
              onPress={() => navigation.navigate('ModalTestScreen')}
              variant="secondary"
              style={styles.actionButton}
            /> */}
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

