"use client"

import { useState } from "react"
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, ScrollView, Alert } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import {ProfileImage, Button, Checkbox} from "../../components"
import { ButtonVariant } from "../../components/Button/Button.types"
import { deleteAccount } from "./api/deleteAccountAPI"

const DeleteAccountScreen = ({ navigation, route }: any) => {
  // Get profile image URL from route params or use default
  const profileImageUrl = route.params?.profileImageUrl || "https://example.com/profile.jpg"

  // State for agreement checkbox
  const [isAgreed, setIsAgreed] = useState(false)

  // Handle account deletion
  const handleDeleteAccount = async () => {
    console.log("회원 탈퇴 버튼 클릭")

    try{
      const response = await deleteAccount();
    }catch(error){
      Alert.alert("탈퇴 실패", "탈퇴에 실패했습니다.");
    }
    // Here you would implement the actual account deletion logic
    // After successful deletion, navigate to login or welcome screen
    // navigation.navigate('Welcome');
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Profile Image */}
        <View style={styles.profileImageContainer}>
          {/* <ProfileImage imageUrl={profileImageUrl} variant="extralarge" /> */}
          <ProfileImage variant="extralarge" />
        </View>

        {/* Warning Title */}
        <Text style={styles.warningTitle}>탈퇴 전 꼭 확인하세요!</Text>

        {/* Warning Box */}
        <View style={styles.warningBox}>
          <View style={styles.warningItem}>
            <Text style={styles.bulletPoint}>•</Text>
            <Text style={styles.warningText}>본인이 작성한 모든 내용은 삭제됩니다.</Text>
          </View>
        </View>

        {/* Agreement Checkbox */}
        <View style={styles.agreementContainer}>
          <Checkbox
            label="안내사항을 모두 확인하였으며, 이에 동의합니다."
            checked={isAgreed}
            onToggle={() => setIsAgreed(!isAgreed)}
          />
        </View>

        {/* Delete Button */}
        <View style={styles.deleteButtonContainer}>
          <Button
            label="탈퇴하기"
            variant={ButtonVariant.DeleteId}
            onPress={handleDeleteAccount}
            disabled={!isAgreed}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "black",
  },
  headerRight: {
    width: 32, // To balance the header
  },
  content: {
    padding: 20,
    alignItems: "center",
  },
  profileImageContainer: {
    marginVertical: 24,
  },
  warningTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "black",
    marginBottom: 20,
    textAlign: "center",
  },
  warningBox: {
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    padding: 16,
    width: "100%",
    marginBottom: 24,
  },
  warningItem: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  bulletPoint: {
    fontSize: 16,
    marginRight: 8,
    color: "black",
  },
  warningText: {
    fontSize: 14,
    color: "black",
    flex: 1,
    lineHeight: 20,
    fontWeight: "bold",
  },
  agreementContainer: {
    width: "100%",
    marginBottom: 24,
    alignItems: 'center',
  },
  deleteButtonContainer: {
    width: "100%",
    alignItems: 'center',
  },
})

export default DeleteAccountScreen

