import * as React from 'react';
import {useState} from 'react'
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {DebateResultModal} from '../index'

export default function ModalTestScreen() {
    const [isModalVisible, setIsModalVisible] = useState(false)
    
        // 예시 데이터
        const resultData = {
            leftResult: {
              gender: [
                { value: 60, label: "남성" },
                { value: 20, label: "여성" },
                { value: 20, label: "기타" },
              ],
              age: [
                { value: 50, label: "10대" },
                { value: 25, label: "20대" },
                { value: 20, label: "30대" },
                { value: 4, label: "40대" },
                { value: 1, label: "50대" },
              ],
              type: [
                { value: 40, label: "PNTB" },
                { value: 25, label: "ABCD" },
                { value: 20, label: "PNTR" },
                { value: 10, label: "PNTR" },
                { value: 3, label: "ICTR" },
                { value: 2, label: "ASDF" },
              ],
              region: [
                { value: 60, label: "서울특별시" },
                { value: 20, label: "인천광역시" },
                { value: 15, label: "경기도" },
                { value: 10, label: "부산광역시" },
                { value: 5, label: "대전광역시" },
              ],
              religion: [
                { value: 50, label: "없음" },
                { value: 25, label: "기독교" },
                { value: 15, label: "불교" },
                { value: 10, label: "천주교" },
                { value: 4, label: "개신교" },
                { value: 1, label: "기타" },
              ],
              userInfo: {
                ageGroup: "20대",
                religionGroup : "없음",
              },
            },
          
            rightResult: {
              gender: [
                { value: 55, label: "남성" },
                { value: 25, label: "여성" },
                { value: 20, label: "기타" },
              ],
              age: [
                { value: 40, label: "10대" },
                { value: 30, label: "20대" },
                { value: 20, label: "30대" },
                { value: 5, label: "40대" },
                { value: 5, label: "50대" },
              ],
              type: [
                { value: 40, label: "PNTB" },
                { value: 25, label: "ABCD" },
                { value: 20, label: "PNTR" },
                { value: 10, label: "PNTR" },
                { value: 3, label: "ICTR" },
                { value: 2, label: "ASDF" },
              ],
              region: [
                { value: 60, label: "서울특별시" },
                { value: 20, label: "인천광역시" },
                { value: 15, label: "경기도" },
              ],
              religion: [
                { value: 45, label: "없음" },
                { value: 30, label: "기독교" },
                { value: 10, label: "불교" },
                { value: 10, label: "천주교" },
                { value: 4, label: "개신교" },
                { value: 1, label: "기타" },
              ],
              userInfo: {
                ageGroup: "30대",
                religionGroup : "없음",
              },
            },
          };

          const showMoreOpinions = () => {
            console.log('의견 더 보기를 클릭했습니다!')
          }

    return (
        <View style={styles.container}>
            <Text>This Is ModalTestScreen.</Text>
            <View style={styles.content}>
                <Text style={styles.title}>토론 결과 확인하기</Text>
                <Text style={styles.description}>토론에 참여한 사용자들의 인구통계학적 정보를 확인해보세요.</Text>
                <TouchableOpacity style={styles.button} onPress={() => setIsModalVisible(true)}>
                <Text style={styles.buttonText}>결과 리포트 보기</Text>
                </TouchableOpacity>

                <DebateResultModal visible={isModalVisible} onClose={() => setIsModalVisible(false)} onPressMoreOpinion={showMoreOpinions} data={resultData} leftOption={'있다!'} rightOption={'없다!'}/>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 24,
      },
      title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 16,
        textAlign: "center",
      },
      description: {
        fontSize: 16,
        textAlign: "center",
        marginBottom: 32,
        color: "#666",
      },
      button: {
        backgroundColor: "#00A3FF",
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
      },
      buttonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "500",
      },
});