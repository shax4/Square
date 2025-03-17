import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import NevTestPage1 from '../../pages/nev-test-page/NevTestPage1';
import NevTestPage2 from '../../pages/nev-test-page/NevTestPage2';

const Stack = createNativeStackNavigator();

export default function HeaderBar() {
    /* 스택에 추가한 스크린은 자동으로 네이티브 상단 바가 생성됨 */
    /* options={{ headerShown: false }} 을 통해 상단 바 숨김 처리 가능 */
    return (
        <Stack.Navigator>
            <Stack.Screen
                options={{
                    headerBackButtonDisplayMode: "minimal",
                    headerRight: () => {
                        return (
                            <View style={styles.headerRightItems}>
                                <TouchableOpacity onPress={() => console.log("상단 탭 우측 아이콘 메서드")}>
                                    <Ionicons name='person-add' size={24} />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => console.log("상단 탭 우측 아이콘 메서드")}>
                                    <Ionicons name='person-add' size={24} />
                                </TouchableOpacity>
                            </View>

                        )
                    }
                }}
                name="NevTestPage1"
                component={NevTestPage1}
            />
            <Stack.Screen
                options={{
                    headerBackButtonDisplayMode: "minimal",
                    headerRight: () => {
                        return (
                            <View style={styles.headerRightItems}>
                                <TouchableOpacity onPress={() => console.log("상단 탭 우측 아이콘 메서드")}>
                                    <Ionicons name='person-add' size={24} />
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
