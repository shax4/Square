import React, { useLayoutEffect } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import DebateCardList from './Components/DebateCardList';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { DebateStackParamList } from '../../shared/page-stack/DebatePageStack';
import { useAdminMode } from '../../shared/hooks/useAdminMode';
import { Icons } from '../../../assets/icons/Icons';

export default function DebateCardsScreen() {
    const isFocused = useIsFocused();
    const navigation = useNavigation<NativeStackNavigationProp<DebateStackParamList>>();
    const { isAdminMode } = useAdminMode();

    // 헤더에 수정 버튼 설정 (최초 마운트 시 한 번만)
    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <View style={styles.headerRightItems}>
                    <TouchableOpacity onPress={() => { navigation.navigate('ProposalListScreen') }}>
                        <Icons.add />
                    </TouchableOpacity>
                    {isAdminMode && (
                        <TouchableOpacity>
                            <Icons.settings />
                        </TouchableOpacity >
                    )}
                </View>
            ),
        });
    }, [isAdminMode]);

    return (
        <View>
            {isFocused && <DebateCardList />}
            { /*< DebateCardList />*/}
        </View>
    );
}


const styles = StyleSheet.create({
    headerRightItems: {
        flexDirection: 'row',
        gap: 12,
    },
});