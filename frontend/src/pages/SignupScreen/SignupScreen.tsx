import { useState, useRef } from "react"
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
  Modal,
  FlatList,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import TextField from "../../components/TextField"
import Button from "../../components/Button"
import SelectField from "../../components/SelectField/SelectField"
import ProgressBar from "../../components/ProgressBar/ProgressBar"
import ProfileImage from "../../components/ProfileImage"
import { useAuth } from "../../shared/hooks"
import { userDetails } from "../../shared/types/user"
import { signUp } from "./api/signUpAPI"
import { SignUpResponse } from "./type/signUpTypes"

// Define steps for the sign-up process
enum SignUpStep {
  Nickname = 1,
  Birthdate = 2,
  Region = 3,
  Gender = 4,
  Religion = 5,
  ConfirmSignIn = 6,
}

// Options for dropdowns
const genderOptions = ["남성", "여성", "알리지 않음"]
const regionOptions = [
  "서울특별시",
  "경기도",
  "인천광역시",
  "부산광역시",
  "대구광역시",
  "대전광역시",
  "광주광역시",
  "울산광역시",
  "세종특별자치시",
  "충청북도",
  "충청남도",
  "전라남도",
  "전북특별자치도",
  "경상북도",
  "경상남도",
  "강원특별자치도",
  "제주특별자치도"
]
const religionOptions = [
  "없음",
  "기독교",
  "불교",
  "천주교",
  "기타"
]

const SignUpScreen = ({ onCancel }: { onCancel?: () => void }) => {
  // State for form fields
  const [currentStep, setCurrentStep] = useState<SignUpStep>(SignUpStep.Nickname)
  const [nickname, setNickname] = useState("")
  const [birthdate, setBirthdate] = useState("")
  const [region, setRegion] = useState("")
  const [gender, setGender] = useState("")
  const [religion, setReligion] = useState("")
  const [profileImageUrl, setProfileImageUrl] = useState("https://example.com/profile.jpg")

  // State for modal
  const [modalVisible, setModalVisible] = useState(false)
  const [modalOptions, setModalOptions] = useState<string[]>([])
  const [modalTitle, setModalTitle] = useState("")
  const [modalSetter, setModalSetter] = useState<(value: string) => void>(() => () => {})

  // Validation states
  const [nicknameError, setNicknameError] = useState("")
  const [birthdateError, setBirthdateError] = useState("")

  const {setUser, user} = useAuth();


  // Scroll ref for content
  const scrollViewRef = useRef<ScrollView>(null)

  // Handle next button press
  const handleNext = () => {
    // Validate current step
    if (!validateCurrentStep()) {
      return
    }

    // Move to next step
    if (currentStep < SignUpStep.ConfirmSignIn) {
      setCurrentStep(currentStep + 1)
      // Scroll to top when changing steps
      scrollViewRef.current?.scrollTo({ y: 0, animated: true })
    }
  }

  // Handle back button press
  const handleBack = () => {
    if (currentStep > SignUpStep.Nickname) {
      setCurrentStep(currentStep - 1)
      // Scroll to top when changing steps
      scrollViewRef.current?.scrollTo({ y: 0, animated: true })
    } else {
      // navigation.goBack()
      if (onCancel) {
        onCancel()
      }
    }
  }

  // Handle complete button press
  const handleComplete = async () => {
    const useremail = user?.email;
    const usersocialType = user?.socialType;
    const birth = parseInt(birthdate.slice(0, 4), 10);
    // const profileData = {
    //   useremail,
    //   usersocialType,
    //   nickname,
    //   region, 
    //   gender, 
    //   birth, 
    //   religion
    // };
  
    // Alert.alert("입력 정보 확인", JSON.stringify(profileData, null, 2));

    try{
      const data : SignUpResponse = await signUp(useremail!, "GOOGLE", nickname, "profile/0c643827-c958-465b-875d-918c8a22fe01.png", region, gender, birth, religion)

      const userDetails : userDetails = {
        nickname : nickname,
        userType: data.userType,
        email: useremail!,
        socialType: data.socialType,
        state: "ACTIVE",
        isMember : true,
        accessToken : data.accessToken,
        refreshToken : data.refreshToken,
      } // 실제 데이터로 변경.

      // Alert.alert("회원가입 결과", JSON.stringify(userDetails, null, 2));
  
      setUser(userDetails)
  
      // Navigate to main app or show success message

      // Alert.alert("회원가입 완료", "회원가입이 성공적으로 완료되었습니다.", [
      //   {
      //     text: "확인",
      //     // onPress: () => navigation.navigate("Profile"),
      //   },
      // ]);
    } catch (error: any) {
      const errorCode = error?.response?.data?.code;
      const errorMessage = error?.response?.data?.message ?? error?.message ?? JSON.stringify(error, null, 2);
    
      Alert.alert("회원가입 실패", `(${errorCode}) ${errorMessage}`);
    }
  }

  // Validate current step
  const validateCurrentStep = () => {
    switch (currentStep) {
      case SignUpStep.Nickname:
        if (!nickname.trim()) {
          setNicknameError("닉네임을 입력해 주세요.")
          return false
        }
        if (nickname.length < 2 || nickname.length > 10) {
          setNicknameError("닉네임은 2~10자 이내로 설정해 주세요.")
          return false
        }
        setNicknameError("")
        return true

      case SignUpStep.Birthdate:
        if (!birthdate.trim()) {
          setBirthdateError("생년월일을 입력해 주세요.")
          return false
        }
        // Simple validation for YYYY.MM.DD format
        const birthdateRegex = /^\d{4}\.\d{2}\.\d{2}$/
        if (!birthdateRegex.test(birthdate)) {
          setBirthdateError("생년월일을 YYYY.MM.DD 형식으로 입력해 주세요.")
          return false
        }
        setBirthdateError("")
        return true

      case SignUpStep.Region:
        return !!region.trim()

      case SignUpStep.Gender:
        return !!gender.trim()

      case SignUpStep.Religion:
        return !!religion.trim()

      case SignUpStep.ConfirmSignIn:
        return true

      default:
        return true
    }
  }

  // Open modal with options
  const openModal = (title: string, options: string[], setter: (value: string) => void) => {
    setModalTitle(title)
    setModalOptions(options)
    setModalSetter(() => setter)
    setModalVisible(true)
  }

  // Handle profile image change
  const handleProfileImageChange = () => {
    console.log("Change profile image")
    // Here you would implement image picker functionality
  }

  // Render step content
  const renderStepContent = () => {
    switch (currentStep) {
      case SignUpStep.Nickname:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>닉네임을 입력해 주세요</Text>
            <TextField
              label=""
              value={nickname}
              onChangeText={(text: string) => {
                console.log(text)
                setNickname(text)
                if (nicknameError && text.trim()) {
                  setNicknameError("")
                }
              }}
              placeholder="닉네임"
              error={nicknameError}
            />
            <Text style={styles.helperText}>빈칸없이, 특수문자를 제외한 10자 이내로 설정하세요.</Text>
          </View>
        )

      case SignUpStep.Birthdate:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>생년월일을 입력해 주세요</Text>
            <TextField
              label=""
              value={birthdate}
              onChangeText={(text: string) => {
                console.log(text)
                setBirthdate(text)
                if (birthdateError && text.trim()) {
                  setBirthdateError("")
                }
              }}
              placeholder="생년월일"
              error={birthdateError}
              keyboardType="numeric"
            />
            <Text style={styles.helperText}>8자리 숫자로 입력해주세요.</Text>

            {/* Show previously entered information */}
            <View style={styles.previousInfoContainer}>
              <View style={styles.infoItem}>
                <Text style={styles.infoText}>{nickname}</Text>
              </View>
            </View>
          </View>
        )

      case SignUpStep.Region:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>출신 지역을 선택해 주세요</Text>
            <SelectField
              label=""
              value={region}
              placeholder="지역"
              onPress={() => openModal("지역 선택", regionOptions, setRegion)}
            />

            {/* Show previously entered information */}
            <View style={styles.previousInfoContainer}>
              <View style={styles.infoItem}>
                <Text style={styles.infoText}>{birthdate}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoText}>{nickname}</Text>
              </View>
            </View>
          </View>
        )

      case SignUpStep.Gender:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>성별을 선택해 주세요</Text>
            <SelectField
              label=""
              value={gender}
              placeholder="성별"
              onPress={() => openModal("성별 선택", genderOptions, setGender)}
            />

            {/* Show previously entered information */}
            <View style={styles.previousInfoContainer}>
              <View style={styles.infoItem}>
                <Text style={styles.infoText}>{region}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoText}>{birthdate}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoText}>{nickname}</Text>
              </View>
            </View>
          </View>
        )

      case SignUpStep.Religion:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>종교를 선택해 주세요</Text>
            <SelectField
              label=""
              value={religion}
              placeholder="종교"
              onPress={() => openModal("종교 선택", religionOptions, setReligion)}
            />

            {/* Show previously entered information */}
            <View style={styles.previousInfoContainer}>
              <View style={styles.infoItem}>
                <Text style={styles.infoText}>{gender}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoText}>{region}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoText}>{birthdate}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoText}>{nickname}</Text>
              </View>
            </View>
          </View>
        )

      case SignUpStep.ConfirmSignIn:
        return (
          <View style={styles.stepContainer}>
          <Text style={styles.welcomeTitle}>사각에 오신 걸 환영합니다!</Text>
          <Text style={styles.welcomeSubtitle}>
            즐거운 커뮤니티 이용을 위해서{"\n"}
            성향 테스트가 필요해요!
          </Text>
          <Text style={styles.helperText}>약 5~10분 정도 소요돼요</Text>
        </View>
        )

      default:
        return null
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with back button and progress bar */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="chevron-back" size={24} color={"black"} />
        </TouchableOpacity>
      </View>

      <ProgressBar steps={6} currentStep={currentStep} />

      <ScrollView ref={scrollViewRef} contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {renderStepContent()}
      </ScrollView>

      {/* Next/Complete Button */}
      <View style={styles.buttonContainer}>
        {currentStep < SignUpStep.ConfirmSignIn ? (
          <Button label="다음" onPress={handleNext} />
        ) : (
          <>
            <Button label="테스트 하기" onPress={() => {}} />
            <TouchableOpacity onPress={handleComplete}>
              <Text style={styles.nextButton}>다음에</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* Selection Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{modalTitle}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalCloseButton}>
                <Ionicons name="close" size={24} color={"black"} />
              </TouchableOpacity>
            </View>

            <FlatList
              data={modalOptions}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalOption}
                  onPress={() => {
                    modalSetter(item)
                    setModalVisible(false)
                  }}
                >
                  <Text style={styles.modalOptionText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  welcomeTitle: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  welcomeSubtitle: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 10,
    lineHeight: 26,
  },
  nextButton: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 4,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  stepContainer: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 24,
    color: "black",
  },
  helperText: {
    fontSize: 12,
    color: "#888888",
    marginTop: 8,
    textAlign: "center",
  },
  previousInfoContainer: {
    marginTop: 24,
  },
  infoItem: {
    backgroundColor: "#F5F5F5",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: "black",
  },
  buttonContainer: {
    padding: 20,
  },
  profileImageContainer: {
    alignItems: "center",
    marginVertical: 24,
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
    borderColor: "white",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: "70%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "black",
  },
  modalCloseButton: {
    padding: 4,
  },
  modalOption: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  modalOptionText: {
    fontSize: 16,
    color: "black",
  },
})

export default SignUpScreen

