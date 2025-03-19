import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

type StackParamList = {
    NevTestPage1: undefined;
    NevTestPage2: undefined;
    NevTestPage3: undefined;
    UiTestScreen: undefined;
};

export default function NevTestPage1() {
    const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>();

    return (
        <View>
            <Text>Page 1</Text>
            <TouchableOpacity onPress={() => navigation.navigate('NevTestPage2')}>
                <Text>Go to Page 2</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('UiTestScreen')}>
                <Text>Go to UI Test Page</Text>
            </TouchableOpacity>
        </View>
    );
}
