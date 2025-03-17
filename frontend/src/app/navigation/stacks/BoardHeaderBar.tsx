import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import NevTestPage1 from '../../../pages/StackSampleScreen/NevTestPage1';
import NevTestPage2 from '../../../pages/StackSampleScreen/NevTestPage2';

const Stack = createNativeStackNavigator();

export default function HeaderBar() {
    /* 스택에 추가한 스크린은 자동으로 네이티브 상단 바가 생성됨 */
    /* options={{ headerShown: false }} 을 통해 상단 바 숨김 처리 가능 */
    return (
        <Stack.Navigator>
            {/* 게시판 목록 */}
            <Stack.Screen
                options={{
                    title: "게시판 목록",
                    headerBackButtonDisplayMode: "minimal"
                }}
                name="게시판 목록"
                component={NevTestPage1}
            />

            {/* 내가 쓴 게시판 글 */}
            <Stack.Screen
                options={{
                    title: "게시판 상세",
                    headerBackButtonDisplayMode: "minimal",
                    headerRight: () => {
                        return (
                            <View style={styles.headerRightItems}>
                                <TouchableOpacity onPress={() => console.log("수정")}>
                                    <Ionicons name='pencil' size={24} />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => console.log("삭제")}>
                                    <Ionicons name='trash' size={24} />
                                </TouchableOpacity>
                            </View>
                        )
                    }
                }}
                name="NevTestPage2"
                component={NevTestPage2}
            />

            {/* 내가 쓰지 않은 게시판 글 */}
            <Stack.Screen
                options={{
                    title: "게시판 상세",
                    headerBackButtonDisplayMode: "minimal",
                    headerRight: () => {
                        return (
                            <View style={styles.headerRightItems}>
                                <TouchableOpacity onPress={() => console.log("북마크")}>
                                    <Ionicons name='bookmark' size={24} />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => console.log("삭제")}>
                                    <MaterialCommunityIcons name='alarm-light' size={24} />
                                </TouchableOpacity>
                            </View>
                        )
                    }
                }}
                name="NevTestPage2"
                component={NevTestPage2}
            />
        </Stack.Navigator>
    )
}

const styles = StyleSheet.create({
    headerRightItems: {
        flexDirection: 'row',
        gap: 12,
    },

});
