import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

type StackParamList = {
    NevTestPage1: undefined;
    NevTestPage2: undefined;
    NevTestPage3: undefined;
};

export default function NevTestPage2() {
    const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>();

    return (
        <View>
            <Text>Page 2</Text>
            <TouchableOpacity onPress={() => navigation.navigate('NevTestPage3')}>
                <Text>Go to Page 3</Text>
            </TouchableOpacity>
        </View>
    );
}
