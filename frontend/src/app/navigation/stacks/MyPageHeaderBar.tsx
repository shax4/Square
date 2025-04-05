import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Icons } from '../../../../assets/icons/Icons';

// 환경설정 탭으로 네비게이션 사용 시
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

import MypageScreen from '../../../pages/MypageScreen/MypageScreen';
import NevTestPage2 from '../../../pages/StackSampleScreen/NevTestPage2';
import PersonalitySurveyPage from '../../../pages/PersonalitySurveyPage/PersonalitySurveyPage';
import PersonalityResultScreen from '../../../pages/PersonalityResultScreen/PersonalityResultScreen';
import ProfileUpdateScreen from '../../../pages/ProfileUpdateScreen/ProfileUpdateScreen';
import DeleteAccountScreen from '../../../pages/DeleteAccountScreen/DeleteAccountScreen';
import UseAuthTestScreen from '../../../pages/UseAuthTestScreen/UseAuthTestScreen';
import SignupTestScreen from '../../../pages/SignupTestScreen/SignupTestScreen';
import MypageFeatureTestScreen from '../../../pages/MypageFeatureTestScreen/MypageFeatureTestScreen';
import LandingScreen from '../../../pages/LandingScreen/LandingScreen';
import { ModalTestScreen } from '../../../pages';


// 스택 네비게이터
const Stack = createNativeStackNavigator();

// 마이 페이지 상단 탭
export default function HeaderBar() {
    return (
        <Stack.Navigator>
            {/* 마이 페이지 */}
            <Stack.Screen
                name="MypageScreen"
                component={MypageScreen}
                options={({ navigation }) => ({
                    title: '마이 페이지',
                    headerBackButtonDisplayMode: 'minimal',
                    headerRight: () => (
                        <View style={styles.headerRightItems}>
                            <TouchableOpacity onPress={() => {
                                console.log("환경 설정으로 이동")
                                navigation.navigate('PersonalitySurveyPage');
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
            <Stack.Screen
                name="PersonalitySurveyPage"
                component={PersonalitySurveyPage}
                options={{
                    title: '설문 조사',
                    headerBackButtonDisplayMode: 'minimal',
                }}
            />
            <Stack.Screen
                name="PersonalityResultScreen"
                component={PersonalityResultScreen}
                options={{
                    title: '성향 테스트 확인',
                    headerBackButtonDisplayMode: 'minimal',
                }}
            />
            <Stack.Screen
                name="ProfileUpdateScreen"
                component={ProfileUpdateScreen}
                options={{
                    title: '프로필 수정',
                    headerBackButtonDisplayMode: 'minimal',
                }}
            />
            <Stack.Screen
                name="DeleteAccountScreen"
                component={DeleteAccountScreen}
                options={{
                    title: '탈퇴하기',
                    headerBackButtonDisplayMode: 'minimal',
                }}
            />
            <Stack.Screen
                name="UseAuthTestScreen"
                component={UseAuthTestScreen}
                options={{
                    title: '임시 로그인',
                    headerBackButtonDisplayMode: 'minimal',
                }}
            />
            <Stack.Screen
                name="SignupTestScreen"
                component={SignupTestScreen}
                options={{
                    title: 'SignupTestScreen',
                    headerBackButtonDisplayMode: 'minimal',
                }}
            />
            <Stack.Screen
                name="ModalTestScreen"
                component={ModalTestScreen}
                options={{
                    title: 'ModalTestScreen',
                    headerBackButtonDisplayMode: 'minimal',
                }}
            />
            <Stack.Screen
                name="MypageFeatureTestScreen"
                component={MypageFeatureTestScreen}
                options={{
                    title: 'MypageFeatureTestScreen',
                    headerBackButtonDisplayMode: 'minimal',
                }}
            />
            <Stack.Screen
                name="LandingScreen"
                component={LandingScreen}
                options={{
                    title: 'LandingScreen',
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
