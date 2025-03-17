import * as React from 'react';
import {View, Text, StyleSheet} from 'react-native';

import {ProfileImage} from '../../components';

export default function MypageScreen() {
    return (
        <View style={styles.container}>
            <Text>This Is Mypage Screen.</Text>
            <ProfileImage variant='small'/>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
});