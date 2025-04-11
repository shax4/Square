import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View,  TouchableOpacity, StyleSheet } from "react-native";
import Text from '../../../components/Common/Text';

import NevTestPage1 from '../../../pages/StackSampleScreen/NevTestPage1';
import NotificationScreen from '../../../pages/NotificationScreen/NotificationScreen'

// 스택 네비게이터
const Stack = createNativeStackNavigator();

// 메인 홈 상단 탭
export default function HeaderBar() {
    return (
        <Stack.Navigator>
            {/* 토론 카드 목록 */}
            <Stack.Screen
                name="NotificationScreen"
                component={NotificationScreen}
                options={{
                    headerTitle: () => <Text style={styles.headerTitle}>알림</Text>,
                    headerBackButtonDisplayMode: 'minimal',
                    headerRight: () => {
                        return (
                            <View style={styles.headerRightItems}>
                                <TouchableOpacity onPress={() => console.log("주제 청원으로 이동 메서드")}>
                                    <Text weight="medium" >전체 삭제</Text>
                                </TouchableOpacity>
                            </View>

                        )
                    }
                }}
            />
            {/* 알림 버튼 클릭으로 게시물, 의견 등으로 이동 시, 네비게이션 스택 처리 필요 */}
        </Stack.Navigator>
    );
}

const styles = StyleSheet.create({
  headerRightItems: {
    flexDirection: "row",
    gap: 12,
    
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
  },
});
