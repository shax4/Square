import * as React from 'react';
import {View, Text, StyleSheet} from 'react-native';

import {ProfileImage, PersonalityTag, LikeButton} from '../../components';

export default function MypageScreen() {
    const onPressType = () => {
        alert("You Pressed PersonalityType!");
    }
    return (
        <View style={styles.container}>
            <Text>This Is Mypage Screen.</Text>
            <ProfileImage variant='small'/>
            <PersonalityTag personality='PNTB' onPress={onPressType}/>
            <LikeButton initialCount={100}/>
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