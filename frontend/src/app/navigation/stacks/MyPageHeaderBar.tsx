import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Icons } from '../../../../assets/icons/Icons';

// 환경설정 탭으로 네비게이션 사용 시
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

import NevTestPage1 from '../../../pages/StackSampleScreen/NevTestPage1';
import NevTestPage2 from '../../../pages/StackSampleScreen/NevTestPage2';

// 스택 네비게이터
const Stack = createNativeStackNavigator();

// 이동할 페이지 스택 타입
type StackParamList = {
    NevTestPage1: undefined;
    NevTestPage2: undefined;
};

// 마이 페이지 상단 탭
export default function HeaderBar() {
    return (
        <Stack.Navigator>
            {/* 마이 페이지 */}
            <Stack.Screen
                name="NevTestPage1"
                component={NevTestPage1}
                options={({ navigation }) => ({
                    title: '마이 페이지',
                    headerBackButtonDisplayMode: 'minimal',
                    headerRight: () => (
                        <View style={styles.headerRightItems}>
                            <TouchableOpacity onPress={() => {
                                console.log("환경 설정으로 이동")
                                navigation.navigate('NevTestPage2');
                            }}>
                                <Icons.settings/>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => console.log("로그아웃")}>
                                <Icons.logout/>
                            </TouchableOpacity>
                        </View>
                    ),
                })}
            />
            {/* 환경 설정 */}
            <Stack.Screen
                name="NevTestPage2"
                component={NevTestPage2}
                options={{
                    title: '환경 설정',
                    headerBackButtonDisplayMode: 'minimal',
                }}
            />
        </Stack.Navigator>
    );
}

const styles = StyleSheet.create({
    headerRightItems: {
        flexDirection: 'row',
        gap: 12,
    },
});
