import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { Icons } from '../../../../assets/icons/Icons';

import DebateCardsScreen from '../../../pages/DebateCardsScreen/DebateCardsScreen';
import OpinionListScreen from '../../../pages/OpinionListScreen/OpinionListScreen';
import ProposalListScreen from '../../../pages/ProposalListScreen/ProposalListScreen';
import ProposalCreateScreen from '../../../pages/ProposalCreateScreen/ProposalCreateScreen';
import OpinionDetailScreen from '../../../pages/OpinionDetailScreen/OpinionDetailScreen';
import OpinionEditScreen from '../../../pages/OpinionEditScreen/OpinionEditScreen';
import PersonalityResultScreen from '../../../pages/PersonalityResultScreen/PersonalityResultScreen';

import { StackParamList } from '../../../shared/page-stack/DebatePageStack';
import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
const Stack = createNativeStackNavigator<StackParamList>();

// 테스트용 예시 사용자 정보(전역 상태관리로 받아오도록 수정 필요)
const currentUser = {
    nickname: '반짝이는하마',
};

// 테스트용 논쟁 정보
const debate = {
    debateId: 1,
}

// 테스트용 논쟁 의견 작성자자 정보(api에서 받아오도록 수정 필요)
const opinion = {
    nickname: '반짝이는하마',
}

// 토론카드 홈 상단 탭
export default function HeaderBar() {
    return (
        <Stack.Navigator>
            {/* 토론 카드 목록 */}
            <Stack.Screen
                name="DebateCardsScreen"
                component={DebateCardsScreen}
                options={{
                    title: '오늘의 주제',
                    headerBackButtonDisplayMode: 'minimal',
                    //headerRight: () => DebateCardsScreenHeaderRightIcons() // 일반 함수 형태: Hook 사용 불가
                    headerRight: () => <DebateCardsScreenHeaderRightIcons /> // React 컴포넌트 JSX 형태: Hook 사용 가능

                }}
            />
            {/* 토론 카드 상세(의견 목록) */}
            <Stack.Screen
                name="OpinionListScreen"
                component={OpinionListScreen}
                options={({ route }) => ({
                    title: `Number ${route.params.debateId}`,
                    headerBackButtonDisplayMode: 'minimal',
                    headerRight: () => (
                        <View style={styles.headerRightItems}>
                            <TouchableOpacity onPress={() => console.log('공유')}>
                                <Icons.share />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => console.log('북마크')}>
                                <Icons.bookmark />
                            </TouchableOpacity>
                        </View>
                    ),
                })}
            />
            {/* 의견 상세 */}
            <Stack.Screen
                name="OpinionDetailScreen"
                component={OpinionDetailScreen}
                options={() => {
                    return {
                        title: '의견 상세',
                        headerBackButtonDisplayMode: 'minimal',
                    };
                }}
            />
            {/* 의견 수정 */}
            <Stack.Screen
                name="OpinionEditScreen"
                component={OpinionEditScreen}
                options={() => {
                    // 현재 사용자와 작성자 비교해 우측 아이콘 및 기능 변경
                    const isAuthor = currentUser.nickname === opinion.nickname;

                    return {
                        title: '의견 수정',
                        headerBackButtonDisplayMode: 'minimal',
                        // headerRight: () => <EditOpinionHeaderRightIcon />,
                    };
                }}
            />

            {/* 청원 리스트 */}
            <Stack.Screen
                name="ProposalListScreen"
                component={ProposalListScreen}
                options={() => {
                    return {
                        title: '새로운 주제 신청 리스트',
                        headerBackButtonDisplayMode: 'minimal',
                    };
                }}
            />
            {/* 청원 작성 */}
            <Stack.Screen
                name="ProposalCreateScreen"
                component={ProposalCreateScreen}
                options={() => {
                    return {
                        title: '새로운 주제 작성하기',
                        headerBackButtonDisplayMode: 'minimal',
                    };
                }}
            />
            {/* 성향 타입 그래프 페이지 */}
            <Stack.Screen
                name="PersonalityResultScreen"
                component={PersonalityResultScreen}
                options={{
                    title: '성향 테스트 확인',
                    headerBackButtonDisplayMode: 'minimal',
                }}
            />
        </Stack.Navigator>
    );
}


function DebateCardsScreenHeaderRightIcons() {
    const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>();
    return (
        <View style={styles.headerRightItems}>
            <TouchableOpacity onPress={() => { navigation.navigate('ProposalListScreen') }}>
                <Icons.add />
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    headerRightItems: {
        flexDirection: 'row',
        gap: 12,
    },
});
