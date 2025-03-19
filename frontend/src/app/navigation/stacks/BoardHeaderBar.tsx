import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import NevTestPage1 from '../../../pages/StackSampleScreen/NevTestPage1';
import NevTestPage2 from '../../../pages/StackSampleScreen/NevTestPage2';

// 스택 네비게이터
const Stack = createNativeStackNavigator();

// 테스트용 예시 사용자 정보(전역 상태관리로 받아오도록 수정 필요)
const currentUser = {
    nickname: '반짝이는하마',
};
// 테스트용 예시 게시물 정보(api에서 받아오도록 수정 필요)
const post = {
    nickname: '반짝이는하마',
}

// 게시판 상단 탭
export default function HeaderBar() {
    return (
        <Stack.Navigator>
            {/* 게시판 목록 */}
            <Stack.Screen
                name="NevTestPage1"
                component={NevTestPage1}
                options={{
                    title: '게시판 목록',
                    headerBackButtonDisplayMode: 'minimal',
                }}
            />
            {/* 게시판 상세 */}
            <Stack.Screen
                name="NevTestPage2"
                component={NevTestPage2}
                options={() => {
                    // 현재 사용자와 작성자 비교해 우측 아이콘 및 기능 변경
                    const isAuthor = currentUser.nickname === post.nickname;

                    return {
                        title: '게시판 상세',
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
                        <Ionicons name="pencil" size={24} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => console.log('삭제')}>
                        <Ionicons name="trash" size={24} />
                    </TouchableOpacity>
                </>
            ) : (
                <>
                    <TouchableOpacity onPress={() => console.log('북마크')}>
                        <Ionicons name="bookmark" size={24} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => console.log('신고')}>
                        <MaterialCommunityIcons name="alarm-light" size={24} />
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
