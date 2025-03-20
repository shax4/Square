import React from 'react';
import { View } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import DebateCardList from '../../components/DebateCard/DebateCardList';


type StackParamList = {
    DebateCardsScreen: undefined;
    NevTestPage2: undefined;
    NevTestPage3: undefined;
};

export default function DebateCardsScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>();

    return (
        <View>
            <DebateCardList />
        </View>
    );
}
