import * as React from 'react';
import {View, Text, StyleSheet} from 'react-native';

import {ProfileImage, PersonalityTag, LikeButton, BlueBarChart} from '../../components';

export default function MypageScreen() {
    const onPressType = () => {
        alert("You Pressed PersonalityType!");
    }
    const chartData = [
        { value: 50, label: "10대" },
        { value: 25, label: "20대" },
        { value: 20, label: "30대" },
        { value: 4, label: "40대" },
        { value: 1, label: "50대" },
      ];
    return (
        <View style={styles.container}>
            <Text>This Is Mypage Screen.</Text>
            <ProfileImage variant='small'/>
            <PersonalityTag personality='PNTB' onPress={onPressType}/>
            <LikeButton initialCount={100}/>
            <BlueBarChart data={chartData} highlightIdx={1}/>
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