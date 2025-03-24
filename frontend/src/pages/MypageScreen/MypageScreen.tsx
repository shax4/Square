import * as React from 'react';
import {View, Text, StyleSheet,TouchableOpacity} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import {ProfileImage, PersonalityTag, LikeButton} from '../../components';

type StackParamList = {
    NevTestPage1: undefined;
    NevTestPage2: undefined;
    NevTestPage3: undefined;
    UiTestScreen: undefined;
    PersonalitySurveyPage: undefined;
    PersonalityResultScreen: undefined;
};

export default function MypageScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>();
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
            <PersonalityTag personality='PNTB' onPress={() => navigation.navigate('PersonalityResultScreen')}/>
            <LikeButton initialCount={100}/>
            <TouchableOpacity onPress={() => navigation.navigate('PersonalitySurveyPage')}>
                <Text>Go to PersonalitySurveyPage</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('PersonalityResultScreen')}>
                <Text>Go to PersonalityResultScreen</Text>
            </TouchableOpacity>
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