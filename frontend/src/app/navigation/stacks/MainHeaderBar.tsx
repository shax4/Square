import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Icons } from '../../../../assets/icons/Icons';
import { RouteProp } from '@react-navigation/native';

import NevTestPage3 from '../../../pages/StackSampleScreen/NevTestPage3';

import DebateCardsScreen from '../../../pages/DebateCardsScreen/DebateCardsScreen';
import OpinionListScreen from '../../../pages/OpinionListScreen/OpinionListScreen';

import { StackParamList } from '../../../shared/page-stack/DebatePageStack';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

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
    nickname: '반짝이는하마1',
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
                    headerRight: () => {
                        return (
                            <View style={styles.headerRightItems}>
                                <TouchableOpacity onPress={() => console.log("주제 청원으로 이동 메서드")}>
                                    <Icons.add />
                                </TouchableOpacity>
                            </View>

                        )
                    }
                }}
            />
            {/* 토론 카드 상세(의견 목록) */}
            <Stack.Screen
                name="OpinionListScreen"
                component={OpinionListScreen}
                options={({ route }) => ({
                    title: `number ${route.params.debateId}`,
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
                component={NevTestPage3}
                options={() => {
                    // 현재 사용자와 작성자 비교해 우측 아이콘 및 기능 변경
                    const isAuthor = currentUser.nickname === opinion.nickname;

                    return {
                        title: '의견 상세',
                        headerBackButtonDisplayMode: 'minimal',
                        headerRight: () => <HeaderRightIcons isAuthor={isAuthor} />,
                    };
                }}
            />
        </Stack.Navigator>
    );
}

// 상단 바 우측 아이콘 컴포넌트: 현재 사용자와 글 작성자 여부 확인
function HeaderRightIcons({ isAuthor }: { isAuthor: boolean }) {
    return (
        <View style={styles.headerRightItems}>
            {isAuthor ? (
                <>
                    <TouchableOpacity onPress={() => console.log('수정')}>
                        <Icons.edit />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => console.log('삭제')}>
                        <Icons.delete />
                    </TouchableOpacity>
                </>
            ) : (
                <>
                    <TouchableOpacity onPress={() => console.log('신고')}>
                        <Icons.report />
                    </TouchableOpacity>
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    headerRightItems: {
        flexDirection: 'row',
        gap: 12,
    },
});
