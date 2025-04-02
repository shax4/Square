import React from 'react';
import { View } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import DebateCardList from './Components/DebateCardList';

export default function DebateCardsScreen() {
    //const isFocused = useIsFocused();
    return (
        <View>
            {/*isFocused && <DebateCardList />*/}
            { < DebateCardList /> }
        </View>
    );
}
