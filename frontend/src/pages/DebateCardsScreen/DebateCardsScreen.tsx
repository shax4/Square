import React, { useCallback, useEffect, useLayoutEffect, useRef } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useFocusEffect, useIsFocused, useNavigation } from '@react-navigation/native';
import DebateCardList from './Components/DebateCardList';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { DebateStackParamList } from '../../shared/page-stack/DebatePageStack';
import { useAdminMode } from '../../shared/hooks/useAdminMode';
import { Icons } from '../../../assets/icons/Icons';
import { useDebateTabRefreshStore } from '../../shared/stores/debateTabRefreshStore';

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
    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <View style={styles.headerRightItems}>
                    <TouchableOpacity onPress={() => { navigation.navigate('ProposalListScreen') }}>
                        <Icons.add />
                    </TouchableOpacity>
                </View>
            ),
        });
    }, [isAdminMode]);

    return (
        <View>
            <DebateCardList ref={listRef} />
        </View>
    );
}

const styles = StyleSheet.create({
    headerRightItems: {
        flexDirection: 'row',
        gap: 12,
    },
});
