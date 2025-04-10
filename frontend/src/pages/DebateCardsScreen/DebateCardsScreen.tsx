import React, { useCallback, useEffect, useLayoutEffect, useRef } from 'react';
import { StyleSheet, TouchableOpacity, View, Pressable, Platform  } from 'react-native';
import { useFocusEffect, useIsFocused, useNavigation } from '@react-navigation/native';
import DebateCardList from './Components/DebateCardList';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { DebateStackParamList } from '../../shared/page-stack/DebatePageStack';
import { useAdminMode } from '../../shared/hooks/useAdminMode';
import { Icons } from '../../../assets/icons/Icons';
import { useDebateTabRefreshStore } from '../../shared/stores/debateTabRefreshStore';
import colors from '../../../assets/colors';

export default function DebateCardsScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<DebateStackParamList>>();
    const { isAdminMode } = useAdminMode();
    const isFocused = useIsFocused();
    const listRef = useRef<{ onRefresh: () => void }>(null);
    const refreshKey = useDebateTabRefreshStore((state) => state.refreshKey);

    // 포커스될 때마다 DebateCardList 컴포넌트의 onRefresh 실행
    useEffect(() => {
        if (isFocused) {
            listRef.current?.onRefresh();
        }
    }, [isFocused, refreshKey]);

    // 헤더 버튼 설정
    // useLayoutEffect(() => {
    //     navigation.setOptions({
    //         headerRight: () => (
    //             <View style={styles.headerRightItems}>
    //                 <Pressable onPress={() => { navigation.navigate('ProposalListScreen') } } hitSlop={20}>
    //                     <Icons.add />
    //                 </Pressable>
    //             </View>
    //         ),
    //     });
    // }, [isAdminMode]);

    return (
        <View>
            <DebateCardList ref={listRef} />
            <TouchableOpacity
                style={styles.writeButton}
                onPress={() =>
                navigation.navigate("ProposalListScreen")
                }
            >
                <Icons.addwhite />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    headerRightItems: {
        flexDirection: 'row',
        gap: 12,
    },
    writeButton: {
        position: "absolute",
        right: 20,
        bottom: Platform.OS === "ios" ? 100 : 90, // 하단 네비게이션 바 위에 배치
        backgroundColor: colors.yesDark,
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: "center",
        alignItems: "center",
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        zIndex: 1, // 네비게이션 바보다 위에 표시되도록 설정
      },
});
