import React, { useCallback, useLayoutEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import DebateCardList from './Components/DebateCardList';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { DebateStackParamList } from '../../shared/page-stack/DebatePageStack';
import { useAdminMode } from '../../shared/hooks/useAdminMode';
import { Icons } from '../../../assets/icons/Icons';

export default function DebateCardsScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<DebateStackParamList>>();
    const { isAdminMode } = useAdminMode();

    const [renderKey, setRenderKey] = useState(0); // 리렌더링을 위한 키

    // 포커스될 때마다 키 갱신 → DebateCardList 강제 리렌더링
    useFocusEffect(
        useCallback(() => {
            setRenderKey(prev => prev + 1);
        }, [])
    );

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
            <DebateCardList key={renderKey} />
            {/* <DebateCardList key={renderKey} /> */}
        </View>
    );
}

const styles = StyleSheet.create({
    headerRightItems: {
        flexDirection: 'row',
        gap: 12,
    },
});
