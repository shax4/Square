import { useState } from "react"
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, ScrollView } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import {ProfileImage, TextField, Button} from "../../components"
import {ButtonVariant} from '../../components/Button'
import colors from "../../../assets/colors"

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

import {StackParamList} from '../../shared/page-stack/MyPageStack'

const ProfileUpdateScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>();

  // State for form fields
  const [nickname, setNickname] = useState("반짝이는하마")
  const [region, setRegion] = useState("서울특별시")
  const [religion, setReligion] = useState("기독교")

  // State for profile image
  const [profileImageUrl, setProfileImageUrl] = useState("https://example.com/profile.jpg")

  // State for validation errors
  const [nicknameError, setNicknameError] = useState("")

  // Handle profile image change
  const handleProfileImageChange = () => {
    console.log("Change profile image")
    // Here you would implement image picker functionality
  }

  // Handle nickname duplicate check
  const handleNicknameCheck = () => {
    console.log("중복 확인 버튼 클릭")
    // Here you would implement API call to check nickname availability
    if (nickname === "이미사용중") {
      setNicknameError("이미 사용 중인 닉네임입니다.")
    } else {
      setNicknameError("")
    }
  }

  // Handle save button press
  const handleSave = () => {
    console.log("저장 버튼 클릭")
    navigation.goBack();
  }

  // Handle account deletion
  const handleDeleteAccount = () => {
    console.log("탈퇴하기 클릭")
    // Here you would implement account deletion flow
    navigation.navigate('DeleteAccountScreen')
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Profile Image Section */}
        <View style={styles.profileImageContainer}>
          <View style={styles.profileImageWrapper}>
            <ProfileImage variant="extralarge" />
            {/* <ProfileImage imageUrl={profileImageUrl} variant="large" /> */}
            <TouchableOpacity style={styles.cameraButton} onPress={handleProfileImageChange}>
              <View style={styles.cameraIconBackground}>
                <Ionicons name="camera" size={24} color={colors.black} />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Form Fields */}
        <View style={styles.formContainer}>
          {/* Nickname Field */}
          <View style={styles.nicknameContainer}>
            <View style={styles.nicknameInputRow}>
              <View style={styles.nicknameInputContainer}>
                <TextField
                  label="닉네임"
                  value={nickname}
                  onChangeText={(text: string) => {
                    console.log(text)
                    setNickname(text)
                  }}
                  placeholder="닉네임을 입력하세요"
                  error={nicknameError}
                />
              </View>
              <View style={styles.checkButtonContainer}>
                <Button label="중복 확인" variant={ButtonVariant.Check} onPress={handleNicknameCheck} />
              </View>
            </View>
          </View>

          {/* Region Field */}
          <View style={styles.fieldContainer}>
            <TextField
              label="지역"
              value={region}
              onChangeText={(text: string) => {
                console.log(text)
                setRegion(text)
              }}
              placeholder="지역을 입력하세요"
            />
          </View>

          {/* Religion Field */}
          <View style={styles.fieldContainer}>
            <TextField
              label="종교"
              value={religion}
              onChangeText={(text: string) => {
                console.log(text)
                setReligion(text)
              }}
              placeholder="종교를 입력하세요"
            />
          </View>
        </View>

        {/* Save Button */}
        <View style={styles.saveButtonContainer}>
          <Button label="저장" onPress={handleSave} />
        </View>

        {/* Delete Account */}
        <TouchableOpacity style={styles.deleteAccountContainer} onPress={handleDeleteAccount}>
          <Text style={styles.deleteAccountText}>탈퇴하기</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.black,
  },
  headerRight: {
    width: 32, // To balance the header
  },
  content: {
    padding: 20,
  },
  profileImageContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  profileImageWrapper: {
    position: "relative",
    width: 120,
    height: 120,
  },
  cameraButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    zIndex: 1,
  },
  cameraIconBackground: {
    backgroundColor: "#E0E0E0",
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: colors.white,
  },
  formContainer: {
    marginBottom: 32,

  },
  nicknameContainer: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
    color: colors.black,
  },
  nicknameInputRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  nicknameInputContainer: {
    flex: 1,
    marginRight: 8,
  },
  nicknameInput: {
    flex: 1,
  },
  checkButtonContainer: {
    marginTop: 24, // Align with the input field
  },
  fieldContainer: {
    marginBottom: 16,
  },
  saveButtonContainer: {
    marginBottom: 16,
    alignItems: "center",
    alignSelf: "stretch", // 너비를 최대로 설정
  },
  saveButton: {
    width: "100%",
  },
  deleteAccountContainer: {
    alignItems: "center",
    alignSelf: "stretch", // 너비를 최대로 설정
    padding: 4,
  },
  deleteAccountText: {
    fontSize: 12,
    color: colors.warnRed,
  },
})

export default ProfileUpdateScreen

